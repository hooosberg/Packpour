const FIELD_ALIASES = {
  name: ["name", "app name", "product name", "title"],
  title: ["title", "name", "product title"],
  "app name": ["app name", "name", "product name"],
  subtitle: ["subtitle", "sub title"],
  tagline: ["tagline", "tag line", "slogan"],
  "short description": ["short description", "summary", "excerpt"],
  "promotional text": ["promotional text", "promo text", "promotion text"],
  description: ["description", "full description", "body", "content"],
  "what's new in this version": ["what's new in this version", "what's new", "release notes"],
  "release notes": ["release notes", "what's new", "changelog"],
  keywords: ["keywords", "keyword", "tags"],
  "support url": ["support url", "support", "support link"],
  "marketing url": ["marketing url", "marketing", "website"],
  "privacy policy url": ["privacy policy url", "privacy policy", "privacy url"],
  website: ["website", "site", "homepage", "home page"],
  "product url": ["product url", "url", "link"],
};

const SENSITIVE_PATTERN =
  /\b(password|passcode|passwd|secret|token|api\s*key|private\s*key|credit\s*card|card\s*number|cvv|cvc|ssn|social\s*security|bank|iban|routing)\b/i;

let lastFocusedEditable = null;

document.addEventListener(
  "focusin",
  (event) => {
    const editable = getEditableTarget(event.target);
    if (editable && !isSensitiveEditable(editable)) {
      lastFocusedEditable = editable;
    }
  },
  true,
);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message?.type) {
    return false;
  }

  if (
    message.type === "LAUNCHPASTE_FILL_VISIBLE_FIELDS" ||
    message.type === "ASC_FILL_VISIBLE_FIELDS"
  ) {
    const response = fillVisibleFields(message.payload || {});
    sendResponse(response);
    return true;
  }

  if (
    message.type === "LAUNCHPASTE_FILL_FOCUSED_FIELD" ||
    message.type === "ASC_FILL_FOCUSED_FIELD"
  ) {
    const editable = getEditableTarget(lastFocusedEditable || document.activeElement);
    if (!editable) {
      sendResponse({
        ok: false,
        messageKey: "clickVisibleEditableFieldFirst",
      });
      return true;
    }

    if (isSensitiveEditable(editable)) {
      sendResponse({
        ok: false,
        messageKey: "skippedSensitiveField",
      });
      return true;
    }

    fillEditable(editable, message.value || "");
    flashElement(editable);
    sendResponse({ ok: true });
    return true;
  }

  return false;
});

function fillVisibleFields(fields) {
  const filled = [];
  const missing = [];
  const skipped = [];
  const usedEditables = new Set();

  for (const [fieldName, value] of Object.entries(fields)) {
    if (!value) {
      continue;
    }

    const match = findFieldEditable(fieldName, usedEditables);
    if (match?.skippedSensitive) {
      skipped.push(fieldName);
      continue;
    }

    if (!match?.editable) {
      missing.push(fieldName);
      continue;
    }

    fillEditable(match.editable, value);
    flashElement(match.editable);
    usedEditables.add(match.editable);
    filled.push(fieldName);
  }

  return { filled, missing, skipped };
}

function findFieldEditable(fieldName, usedEditables) {
  const aliases = buildAliases(fieldName);
  if (!aliases.length) {
    return null;
  }

  const directMatch = findByAccessibleAttributes(aliases, usedEditables);
  if (directMatch) {
    return { editable: directMatch };
  }

  const labelAnchors = collectLabelAnchors(aliases);
  const candidates = labelAnchors
    .map((anchor) => {
      const editable = findEditableNearAnchor(anchor);
      if (!editable || usedEditables.has(editable)) {
        return null;
      }
      return {
        editable,
        score: scoreEditableForAnchor(editable, anchor, aliases),
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score);

  const best = candidates[0]?.editable || null;
  if (!best) {
    return null;
  }

  if (isSensitiveEditable(best)) {
    return { skippedSensitive: true };
  }

  return { editable: best };
}

function buildAliases(fieldName) {
  const normalized = normalizeText(fieldName);
  const withoutPunctuation = normalized.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const splitAliases = normalized
    .split(/\s*[|/]\s*/)
    .map((part) => normalizeText(part))
    .filter(Boolean);
  const base = FIELD_ALIASES[withoutPunctuation] || FIELD_ALIASES[normalized] || [];

  return Array.from(new Set([normalized, withoutPunctuation, ...splitAliases, ...base].filter(Boolean)));
}

function findByAccessibleAttributes(aliases, usedEditables) {
  const editables = getVisibleEditables();
  let bestMatch = null;

  for (const editable of editables) {
    if (usedEditables.has(editable) || isSensitiveEditable(editable)) {
      continue;
    }

    const haystack = normalizeText(
      [
        editable.getAttribute("aria-label"),
        editable.getAttribute("placeholder"),
        editable.getAttribute("name"),
        editable.getAttribute("id"),
        editable.getAttribute("data-testid"),
        editable.getAttribute("autocomplete"),
      ]
        .filter(Boolean)
        .join(" "),
    );

    if (!haystack) {
      continue;
    }

    for (const alias of aliases) {
      const match = aliasMatchesHaystack(alias, haystack);
      if (!match) {
        continue;
      }
      // Exact whole-haystack match wins over word-boundary token match,
      // which in turn wins over loose substring match. Substring is only
      // allowed for aliases >= 6 chars to avoid short tokens like "name"
      // / "title" colliding with composites like "appname" / "subtitle".
      const baseScore = match.exact ? 200 : match.tokenMatch ? 140 : 80;
      const score = baseScore + alias.length;
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { editable, score };
      }
    }
  }

  return bestMatch?.editable || null;
}

// Match `alias` against `haystack` using word-boundary semantics so short
// tokens do not accidentally match unrelated composite words. Returns null
// when no match is found, or { exact, tokenMatch } describing match quality.
function aliasMatchesHaystack(alias, haystack) {
  if (!alias || !haystack) {
    return null;
  }
  if (haystack === alias) {
    return { exact: true, tokenMatch: true };
  }
  // After normalizeText, both haystack and alias are lowercase, with words
  // separated by single spaces. Treat any non-alphanumeric character as a
  // boundary so identifiers like "app-name" / "app_name" / "appName"
  // (post-normalize: "app name" via [^a-z0-9\s] sweep happens upstream for
  // FIELD_CANONICAL but here we keep the haystack as joined attributes —
  // do an explicit boundary check instead).
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const wordBoundary = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`);
  if (wordBoundary.test(haystack)) {
    return { exact: false, tokenMatch: true };
  }
  // Fallback substring match — but only for aliases of 6+ characters.
  // Aliases like "name" (4) or "title" (5) cannot rely on substring,
  // because subtitle.includes(title) and similar collisions misfire.
  if (alias.length >= 6 && haystack.includes(alias)) {
    return { exact: false, tokenMatch: false };
  }
  return null;
}

function collectLabelAnchors(aliases) {
  const selector = "label, span, div, p, legend, h1, h2, h3, h4, th";
  const nodes = Array.from(document.querySelectorAll(selector));
  const matches = [];

  for (const node of nodes) {
    if (!isVisible(node)) {
      continue;
    }

    const text = normalizeText(node.textContent || "");
    if (!text || text.length > 120) {
      continue;
    }

    for (const alias of aliases) {
      // Use the same word-boundary matcher as findByAccessibleAttributes so
      // short tokens like "title" do not match composite labels like
      // "subtitle" / "page title bar".
      if (aliasMatchesHaystack(alias, text)) {
        matches.push(node);
        break;
      }
    }
  }

  return matches;
}

function findEditableNearAnchor(anchor) {
  const explicit = resolveExplicitLabelTarget(anchor);
  if (explicit) {
    return explicit;
  }

  const local = findEditableInNode(anchor);
  if (local) {
    return local;
  }

  let current = anchor;
  for (let depth = 0; depth < 5 && current; depth += 1) {
    const siblingEditable = findEditableInNode(current.nextElementSibling);
    if (siblingEditable) {
      return siblingEditable;
    }

    const parent = current.parentElement;
    const parentEditable = findEditableInNode(parent);
    if (parentEditable) {
      return parentEditable;
    }

    current = parent;
  }

  return null;
}

function resolveExplicitLabelTarget(anchor) {
  if (anchor.tagName?.toLowerCase() === "label") {
    const forId = anchor.getAttribute("for");
    if (forId) {
      const target = document.getElementById(forId);
      if (isEditable(target) && isVisible(target)) {
        return target;
      }
    }
  }
  return null;
}

function findEditableInNode(node) {
  if (!node) {
    return null;
  }

  if (isEditable(node) && isVisible(node)) {
    return node;
  }

  const descendant = node.querySelector?.(
    'textarea, input:not([type="hidden"]), [contenteditable="true"], [role="textbox"]',
  );

  return isEditable(descendant) && isVisible(descendant) ? descendant : null;
}

function scoreEditableForAnchor(editable, anchor, aliases) {
  const editableRect = editable.getBoundingClientRect();
  const anchorRect = anchor.getBoundingClientRect();
  const distance =
    Math.abs(editableRect.top - anchorRect.top) + Math.abs(editableRect.left - anchorRect.left);
  const text = normalizeText(anchor.textContent || "");
  // Heavy bonus for exact label match, smaller bonus for word-boundary
  // token match. No substring fallback here — anchor labels should be
  // precise to avoid grabbing the wrong nearby field.
  const aliasBonus = aliases.reduce((max, alias) => {
    const match = aliasMatchesHaystack(alias, text);
    if (!match) return max;
    const bonus = (match.exact ? alias.length * 4 : alias.length * 2);
    return Math.max(max, bonus);
  }, 0);
  return 220 - Math.min(distance, 200) + aliasBonus;
}

function getVisibleEditables() {
  return Array.from(
    document.querySelectorAll(
      'textarea, input:not([type="hidden"]), [contenteditable="true"], [role="textbox"]',
    ),
  ).filter((node) => isEditable(node) && isVisible(node));
}

function getEditableTarget(target) {
  if (!target) {
    return null;
  }

  if (isEditable(target)) {
    return target;
  }

  return target.closest?.(
    'textarea, input:not([type="hidden"]), [contenteditable="true"], [role="textbox"]',
  ) || null;
}

function isEditable(node) {
  if (!node || !(node instanceof Element)) {
    return false;
  }

  const tagName = node.tagName.toLowerCase();
  if (tagName === "textarea") {
    return true;
  }

  if (tagName === "input") {
    const type = (node.getAttribute("type") || "text").toLowerCase();
    return ![
      "hidden",
      "button",
      "submit",
      "checkbox",
      "radio",
      "file",
      "password",
      "reset",
      "image",
    ].includes(type);
  }

  return node.getAttribute("contenteditable") === "true" || node.getAttribute("role") === "textbox";
}

function isSensitiveEditable(node) {
  if (!node || !(node instanceof Element)) {
    return true;
  }

  if (node.tagName.toLowerCase() === "input") {
    const type = (node.getAttribute("type") || "text").toLowerCase();
    if (["password", "file"].includes(type)) {
      return true;
    }
  }

  const haystack = [
    node.getAttribute("aria-label"),
    node.getAttribute("placeholder"),
    node.getAttribute("name"),
    node.getAttribute("id"),
    node.getAttribute("autocomplete"),
    node.closest("label")?.textContent,
  ]
    .filter(Boolean)
    .join(" ");

  return SENSITIVE_PATTERN.test(haystack);
}

function isVisible(node) {
  if (!node || !(node instanceof Element)) {
    return false;
  }

  const style = window.getComputedStyle(node);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0"
  ) {
    return false;
  }

  const rect = node.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function fillEditable(editable, value) {
  editable.focus();

  if (editable.tagName.toLowerCase() === "textarea") {
    setNativeValue(editable, value, window.HTMLTextAreaElement.prototype);
    return;
  }

  if (editable.tagName.toLowerCase() === "input") {
    setNativeValue(editable, value, window.HTMLInputElement.prototype);
    return;
  }

  editable.textContent = value;
  dispatchInputEvents(editable);
}

function setNativeValue(element, value, prototype) {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  descriptor?.set?.call(element, value);
  dispatchInputEvents(element);
}

function dispatchInputEvents(element) {
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.dispatchEvent(new Event("blur", { bubbles: true }));
}

function flashElement(element) {
  const previousOutline = element.style.outline;
  const previousOffset = element.style.outlineOffset;
  element.style.outline = "2px solid #0b63ce";
  element.style.outlineOffset = "2px";
  window.setTimeout(() => {
    element.style.outline = previousOutline;
    element.style.outlineOffset = previousOffset;
  }, 1200);
}

function normalizeText(value) {
  return (value || "")
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
