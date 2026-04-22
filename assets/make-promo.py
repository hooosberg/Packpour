#!/usr/bin/env python3
"""Generate the Chrome Web Store 1280x800 promo image for Packpour.

Composition:
  Left  — brand + tagline + supporting line
  Right — a compact "App Store Connect page being filled by Packpour" scene
  Bottom — four feature pills

Run: python3 github/assets/make-promo.py
Output: github/assets/store/promo-1280x800.png
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ── Canvas ──────────────────────────────────────────────────────────────────
W, H = 1280, 800
OUT = Path(__file__).resolve().parent / "store" / "promo-1280x800.png"
OUT.parent.mkdir(parents=True, exist_ok=True)

# Palette matches landing page
BG          = (250, 249, 245)
INK         = (17, 17, 17)
INK_SOFT    = (74, 74, 74)
MUTED       = (134, 134, 139)
LINE        = (230, 227, 220)
ACCENT      = (91, 76, 245)
ACCENT_DARK = (74, 61, 224)
ACCENT_TINT = (237, 233, 255)
OK          = (13, 139, 95)
OK_BG       = (237, 250, 245)
OK_LINE     = (163, 230, 204)
PANEL       = (255, 255, 255)
APPLE_BLUE  = (0, 122, 255)

FONT_PATHS = [
    "/System/Library/Fonts/HelveticaNeue.ttc",
    "/System/Library/Fonts/Helvetica.ttc",
    "/Library/Fonts/Arial.ttf",
]

def font(size, weight="regular"):
    """Return a Pillow font at the requested size. Tries several faces for weight."""
    idx_map = {"regular": 0, "medium": 2, "bold": 3, "heavy": 8}
    idx = idx_map.get(weight, 0)
    for path in FONT_PATHS:
        try:
            return ImageFont.truetype(path, size, index=idx)
        except Exception:
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

def rounded_rect(draw, xy, radius, fill=None, outline=None, width=1):
    """Compatibility wrapper — Pillow has rounded_rectangle since 8.2."""
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def gradient_square(size, colors, radius):
    """Return an RGBA square with a 145° linear gradient between two colors."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    grad = Image.new("RGBA", (size, size), colors[0])
    top, bot = colors
    base = Image.new("RGBA", (size, size))
    for y in range(size):
        t = y / max(size - 1, 1)
        r = int(top[0] * (1 - t) + bot[0] * t)
        g = int(top[1] * (1 - t) + bot[1] * t)
        b = int(top[2] * (1 - t) + bot[2] * t)
        for x in range(size):
            base.putpixel((x, y), (r, g, b, 255))
    # apply rounded mask
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    img.paste(base, (0, 0), mask)
    return img

def soft_blur_circle(canvas, cx, cy, r, color_rgba, blur=120):
    """Paint a blurred circle onto canvas."""
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color_rgba)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(layer)

# ── Background ──────────────────────────────────────────────────────────────
canvas = Image.new("RGBA", (W, H), BG + (255,))
soft_blur_circle(canvas, 250, -150, 500, (*ACCENT, 50))
soft_blur_circle(canvas, 1300, 200, 400, (255, 200, 160, 60))
soft_blur_circle(canvas, 1100, 900, 500, (*ACCENT, 30))
d = ImageDraw.Draw(canvas)

# ── Logo (top-left) ─────────────────────────────────────────────────────────
LOGO_X, LOGO_Y, LOGO_SIZE = 80, 80, 96
logo = gradient_square(LOGO_SIZE, ((91, 76, 245), (139, 117, 255)), 22)
# soft shadow
shadow = Image.new("RGBA", (LOGO_SIZE + 40, LOGO_SIZE + 40), (0, 0, 0, 0))
sh_d = ImageDraw.Draw(shadow)
sh_d.rounded_rectangle((20, 24, 20 + LOGO_SIZE, 24 + LOGO_SIZE), radius=22, fill=(91, 76, 245, 90))
shadow = shadow.filter(ImageFilter.GaussianBlur(20))
canvas.alpha_composite(shadow, (LOGO_X - 20, LOGO_Y - 20))
canvas.alpha_composite(logo, (LOGO_X, LOGO_Y))

# SVG-like glyph inside the logo (3 horizontal lines representing pack content)
d2 = ImageDraw.Draw(canvas)
cx_ = LOGO_X + LOGO_SIZE // 2
bar_w = LOGO_SIZE - 32
bar_x = LOGO_X + 16
for i, (y_off, w_ratio, alpha) in enumerate([
    (22, 0.55, 255),
    (40, 0.9, 140),
    (58, 1.0, 140),
    (76, 0.75, 140),
]):
    y1 = LOGO_Y + y_off
    w = int(bar_w * w_ratio)
    d2.rounded_rectangle((bar_x, y1, bar_x + w, y1 + 8), radius=4, fill=(255, 255, 255, alpha))

# Wordmark right of logo
TXT_X = LOGO_X + LOGO_SIZE + 22
d.text((TXT_X, LOGO_Y + 4),  "Packpour",                  font=font(48, "heavy"),   fill=INK)
d.text((TXT_X, LOGO_Y + 60), "for App Store Connect",     font=font(18, "medium"),  fill=MUTED)

# ── Tagline ─────────────────────────────────────────────────────────────────
# Keep each line within ~600px so it doesn't collide with the right-side mock.
TAG_X, TAG_Y = 80, 260
TAG_PT = 54
LH = 64
d.text((TAG_X, TAG_Y),          "One locale pack,",          font=font(TAG_PT, "heavy"), fill=INK)
d.text((TAG_X, TAG_Y + LH),     "every App Store Connect",   font=font(TAG_PT, "heavy"), fill=ACCENT)
d.text((TAG_X, TAG_Y + LH * 2), "field filled.",             font=font(TAG_PT, "heavy"), fill=ACCENT)

# Lede
LEDE_Y = TAG_Y + LH * 2 + 78
d.text((TAG_X, LEDE_Y),
       "One click pours a multilingual TXT or Markdown pack",
       font=font(21, "medium"), fill=INK_SOFT)
d.text((TAG_X, LEDE_Y + 28),
       "into the active App Store Connect locale page.",
       font=font(21, "medium"), fill=INK_SOFT)

# ── Feature pills (bottom row) ──────────────────────────────────────────────
PILL_Y = 700
pill_text = [
    ("🗂  TXT / Markdown",     None),
    ("🌐  10 languages",       None),
    ("🔒  Local-first",        None),
    ("🚫  Never auto-submits", None),
]
# Pillow's default font doesn't render emoji; strip them
plain = ["TXT · Markdown", "10 languages", "Local-first", "Never auto-submits"]
pill_font = font(18, "bold")
px = 80
PILL_H = 36
for label in plain:
    bbox = d.textbbox((0, 0), label, font=pill_font)
    tw = bbox[2] - bbox[0]
    pw = tw + 28
    d.rounded_rectangle((px, PILL_Y, px + pw, PILL_Y + PILL_H),
                        radius=PILL_H // 2, fill=PANEL, outline=LINE, width=1)
    d.text((px + 14, PILL_Y + 7), label, font=pill_font, fill=INK_SOFT)
    px += pw + 12

# ── Right scene: ASC page + Packpour side panel ─────────────────────────────
SC_X, SC_Y = 700, 175
SC_W, SC_H = 510, 480

# Window container
d.rounded_rectangle((SC_X, SC_Y, SC_X + SC_W, SC_Y + SC_H),
                    radius=18, fill=PANEL, outline=LINE, width=1)
# drop shadow
sh2 = Image.new("RGBA", (SC_W + 80, SC_H + 80), (0, 0, 0, 0))
sh2_d = ImageDraw.Draw(sh2)
sh2_d.rounded_rectangle((40, 50, 40 + SC_W, 50 + SC_H), radius=18, fill=(20, 25, 40, 90))
sh2 = sh2.filter(ImageFilter.GaussianBlur(25))
shadowed = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
shadowed.alpha_composite(sh2, (SC_X - 40, SC_Y - 40))
canvas.alpha_composite(shadowed)
# redraw the white panel on top of the blur
d = ImageDraw.Draw(canvas)
d.rounded_rectangle((SC_X, SC_Y, SC_X + SC_W, SC_Y + SC_H),
                    radius=18, fill=PANEL, outline=LINE, width=1)

# Browser bar
BAR_H = 32
d.rounded_rectangle((SC_X, SC_Y, SC_X + SC_W, SC_Y + BAR_H),
                    radius=18, fill=(241, 239, 233))
# square off bottom
d.rectangle((SC_X, SC_Y + BAR_H - 18, SC_X + SC_W, SC_Y + BAR_H), fill=(241, 239, 233))
d.line((SC_X, SC_Y + BAR_H, SC_X + SC_W, SC_Y + BAR_H), fill=LINE, width=1)

# traffic lights
for i, col in enumerate([(237, 107, 94), (244, 192, 78), (98, 198, 86)]):
    cx = SC_X + 18 + i * 18
    d.ellipse((cx, SC_Y + 11, cx + 10, SC_Y + 21), fill=col)
# URL pill
url_w = 220
url_x = SC_X + (SC_W - url_w) // 2
d.rounded_rectangle((url_x, SC_Y + 7, url_x + url_w, SC_Y + 25), radius=9, fill=PANEL, outline=LINE, width=1)
d.text((url_x + 12, SC_Y + 11), "appstoreconnect.apple.com",
       font=font(11, "medium"), fill=MUTED)

# Split: left main pane + right side panel
INNER_TOP = SC_Y + BAR_H + 1
INNER_BOT = SC_Y + SC_H - 1
SIDE_W = 158
MAIN_X2 = SC_X + SC_W - SIDE_W
d.line((MAIN_X2, INNER_TOP, MAIN_X2, INNER_BOT), fill=LINE, width=1)

# ── ASC main: topbar, heading, fields ──────────────────────────────────────
pad = 18
asc_x = SC_X + pad
asc_y = INNER_TOP + 14

# App selector pill
sel_w, sel_h = 180, 22
d.rounded_rectangle((asc_x, asc_y, asc_x + sel_w, asc_y + sel_h), radius=6, fill=(245, 245, 247))
# mini icon inside selector
d.rounded_rectangle((asc_x + 4, asc_y + 3, asc_x + 20, asc_y + 19), radius=4, fill=ACCENT)
d.rounded_rectangle((asc_x + 7, asc_y + 7, asc_x + 17, asc_y + 9), radius=1, fill=(255, 255, 255, 255))
d.rounded_rectangle((asc_x + 7, asc_y + 11, asc_x + 17, asc_y + 13), radius=1, fill=(255, 255, 255, 220))
d.rounded_rectangle((asc_x + 7, asc_y + 15, asc_x + 14, asc_y + 17), radius=1, fill=(255, 255, 255, 220))
d.text((asc_x + 26, asc_y + 4), "My App: Metadata filler", font=font(11, "bold"), fill=INK)
# caret
d.polygon([(asc_x + sel_w - 12, asc_y + 8),
           (asc_x + sel_w - 5, asc_y + 8),
           (asc_x + sel_w - 8.5, asc_y + 13)], fill=MUTED)

# Tabs row (distribution underlined blue)
tabs_y = asc_y + sel_h + 12
tabs = [("Distribution", True), ("Analytics", False), ("TestFlight", False), ("Xcode Cloud", False)]
tx = asc_x
for name, active in tabs:
    ff = font(12, "bold" if active else "medium")
    col = APPLE_BLUE if active else MUTED
    d.text((tx, tabs_y), name, font=ff, fill=col)
    bbox = d.textbbox((tx, tabs_y), name, font=ff)
    if active:
        d.rectangle((bbox[0], bbox[3] + 2, bbox[2], bbox[3] + 4), fill=APPLE_BLUE)
    tx = bbox[2] + 18
# separator under tabs
sep_y = tabs_y + 26
d.line((asc_x - 2, sep_y, MAIN_X2 - 8, sep_y), fill=(229, 229, 229), width=1)

# Page heading
head_y = sep_y + 14
d.text((asc_x, head_y), "macOS App Version 0.1.0", font=font(16, "heavy"), fill=INK)
# Save button (disabled)
save_w = 52
save_x = MAIN_X2 - pad - save_w
d.rounded_rectangle((save_x, head_y + 2, save_x + save_w, head_y + 22),
                    radius=5, fill=(245, 245, 247), outline=(210, 210, 215), width=1)
d.text((save_x + 15, head_y + 6), "Save", font=font(11, "bold"), fill=(161, 161, 166))

# Sub row
sub_y = head_y + 32
d.text((asc_x, sub_y),
       "The assets below appear on your app's product page.",
       font=font(10, "medium"), fill=MUTED)
d.text((MAIN_X2 - pad - 104, sub_y),
       "English (U.S.) ▾",
       font=font(11, "medium"), fill=APPLE_BLUE)

sub_sep_y = sub_y + 18
d.line((asc_x, sub_sep_y, MAIN_X2 - 8, sub_sep_y), fill=(239, 238, 235), width=1)

# Fields
def draw_field(y, label, value, count_txt, filled=True, multi=False):
    d.text((asc_x, y), label, font=font(11, "medium"), fill=INK)
    # help circle
    hx = asc_x + d.textlength(label, font=font(11, "medium")) + 4
    d.ellipse((hx, y + 2, hx + 11, y + 13), fill=(210, 210, 215))
    d.text((hx + 3, y + 2), "?", font=font(9, "heavy"), fill=(255, 255, 255))
    # input
    input_y = y + 18
    input_h = 36 if multi else 22
    bor = ACCENT if filled else (210, 210, 215)
    width_ = 2 if filled else 1
    d.rounded_rectangle((asc_x, input_y, MAIN_X2 - pad - 4, input_y + input_h),
                        radius=5, fill=PANEL, outline=(210, 210, 215), width=1)
    if filled:
        # left indigo rail
        d.rectangle((asc_x, input_y, asc_x + 3, input_y + input_h), fill=ACCENT)
    # value text
    d.text((asc_x + 10, input_y + 5), value, font=font(10, "regular"), fill=INK)
    if multi:
        # second line hint (truncated)
        d.text((asc_x + 10, input_y + 19), "… fills App Store Connect locale fields.",
               font=font(10, "regular"), fill=INK)
    # counter foot
    foot_y = input_y + input_h + 4
    tw = d.textlength(count_txt, font=font(10, "regular"))
    d.text((MAIN_X2 - pad - 4 - tw, foot_y), count_txt, font=font(10, "regular"), fill=MUTED)
    return foot_y + 14

fy = sub_sep_y + 12
fy = draw_field(fy, "Promotional Text",
                "A Chrome side panel that pours locale packs…", "66")
d.line((asc_x, fy, MAIN_X2 - 8, fy), fill=(239, 238, 235), width=1)
fy = draw_field(fy + 10, "Description",
                "Packpour imports multilingual metadata packs", "148", multi=True)
d.line((asc_x, fy, MAIN_X2 - 8, fy), fill=(239, 238, 235), width=1)
fy = draw_field(fy + 10, "Keywords",
                "localization, ASO, metadata, Packpour", "54 / 100")

# ── Right side panel: Packpour ─────────────────────────────────────────────
side_x = MAIN_X2 + 1
side_y = INNER_TOP
# Side panel background
d.rectangle((side_x, side_y, SC_X + SC_W, INNER_BOT), fill=(247, 246, 242))
# Head card
HC_X = side_x + 8
HC_Y = side_y + 10
HC_W = SIDE_W - 16
HC_H = 34
d.rounded_rectangle((HC_X, HC_Y, HC_X + HC_W, HC_Y + HC_H),
                    radius=7, fill=PANEL, outline=LINE, width=1)
# mini logo
lm = gradient_square(20, ((91, 76, 245), (139, 117, 255)), 5)
canvas.alpha_composite(lm, (HC_X + 7, HC_Y + 7))
d = ImageDraw.Draw(canvas)
d.text((HC_X + 34, HC_Y + 10), "Packpour", font=font(11, "heavy"), fill=INK)
d.rounded_rectangle((HC_X + HC_W - 36, HC_Y + 9, HC_X + HC_W - 8, HC_Y + 23),
                    radius=7, fill=(246, 245, 241), outline=LINE, width=1)
d.text((HC_X + HC_W - 34, HC_Y + 11), "v0.1.0", font=font(9, "bold"), fill=MUTED)

# Body card
BC_X = HC_X
BC_Y = HC_Y + HC_H + 8
BC_W = HC_W
BC_H = INNER_BOT - BC_Y - 10
d.rounded_rectangle((BC_X, BC_Y, BC_X + BC_W, BC_Y + BC_H),
                    radius=7, fill=PANEL, outline=LINE, width=1)

# Section label
d.text((BC_X + 10, BC_Y + 10), "LOCALE PACK",
       font=font(9, "heavy"), fill=MUTED)
# Current pack pill
cp_x, cp_y, cp_h = BC_X + 8, BC_Y + 28, 26
d.rounded_rectangle((cp_x, cp_y, cp_x + BC_W - 16, cp_y + cp_h),
                    radius=6, fill=ACCENT_TINT)
d.ellipse((cp_x + 9, cp_y + 10, cp_x + 15, cp_y + 16), fill=ACCENT)
d.text((cp_x + 22, cp_y + 6), "en-US", font=font(10, "heavy"), fill=ACCENT_DARK)
d.text((cp_x + 64, cp_y + 7), "English", font=font(10, "medium"), fill=ACCENT_DARK)
# caret
d.polygon([(cp_x + BC_W - 28, cp_y + 10),
           (cp_x + BC_W - 22, cp_y + 10),
           (cp_x + BC_W - 25, cp_y + 15)], fill=ACCENT)

# Fill button
btn_y = cp_y + cp_h + 10
d.rounded_rectangle((cp_x, btn_y, cp_x + BC_W - 16, btn_y + 26),
                    radius=6, fill=ACCENT)
btn_text = "Fill App Store Connect page"
tw = d.textlength(btn_text, font=font(10, "heavy"))
d.text((cp_x + (BC_W - 16 - tw) / 2, btn_y + 7), btn_text, font=font(10, "heavy"), fill=(255, 255, 255))

# Status
st_y = btn_y + 34
d.rounded_rectangle((cp_x, st_y, cp_x + BC_W - 16, st_y + 22),
                    radius=5, fill=OK_BG, outline=OK_LINE, width=1)
d.text((cp_x + 8, st_y + 5), "✓ Poured into 6 fields",
       font=font(10, "heavy"), fill=OK)

# Divider
dv_y = st_y + 32
d.line((cp_x, dv_y, cp_x + BC_W - 16, dv_y), fill=LINE, width=1)

# 10-language grid
lg_y = dv_y + 10
d.text((cp_x, lg_y), "10 PACKS LOADED", font=font(9, "heavy"), fill=MUTED)
langs = ["en", "zh-CN", "zh-TW", "ja", "ko", "fr", "de", "es", "pt", "it"]
chip_w = (BC_W - 16 - 8) // 3
chip_h = 20
for i, code in enumerate(langs):
    row, col = divmod(i, 3)
    chip_x = cp_x + col * (chip_w + 4)
    chip_y = lg_y + 16 + row * (chip_h + 4)
    active = (code == "en")
    fill_ = ACCENT_TINT if active else (246, 245, 241)
    outline_ = (ACCENT[0], ACCENT[1], ACCENT[2]) if active else LINE
    d.rounded_rectangle((chip_x, chip_y, chip_x + chip_w, chip_y + chip_h),
                        radius=4, fill=fill_, outline=outline_, width=1)
    text_col = ACCENT_DARK if active else INK_SOFT
    f_ = font(9, "heavy") if active else font(9, "bold")
    tw = d.textlength(code, font=f_)
    d.text((chip_x + (chip_w - tw) / 2, chip_y + 5), code, font=f_, fill=text_col)

# ── Save ────────────────────────────────────────────────────────────────────
canvas.convert("RGB").save(OUT, "PNG", optimize=True)
print(f"✓ wrote {OUT} ({OUT.stat().st_size // 1024} KB)")
