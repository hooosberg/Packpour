# App Store Connect Locale Filler Launch Roadmap

更新日期：2026-04-22

## 0. 本轮已完成

这份路线图落地之后，当前仓库已经推进了这些基础项：

- 已新增 `.gitignore`
- 已初始化当前目录为 git 仓库
- 已拆成两个顶层工作区：`github/` 和 `local/`
- 已把公开 README、GitHub Pages 页面、素材和发布文档收进 `github/`
- 已把插件源码、`_locales`、icons、build script 和 dist 收进 `local/`
- 已新增 `github/site/` 落地页、隐私页、支持页骨架
- 已新增 `local/scripts/build-release.mjs`，可以输出 `local/dist/` ZIP
- 已新增 `github/docs/release-checklist.md`
- 已新增 `github/docs/chrome-web-store-listing.md`
- 已新增 `github/assets/store/README.md` 和图标源文件 `icon-source.svg`
- 已生成 `local/icons/icon-16.png`、`icon-32.png`、`icon-48.png`、`icon-128.png`
- 已在 `local/manifest.json` 里接入 `icons` 和 `action.default_icon`
- 已生成 `github/assets/store/small-promo-tile-440x280.png` 和 `github/assets/store/marquee-1400x560.png`
- 已把插件设置页补上 Homepage / GitHub / Support / Privacy 外链位

当前仍然缺的最关键阻塞项：

- 真实 GitHub 仓库与 GitHub Pages 发布
- 商店截图资产
- 最终上架文案和隐私问卷答案确认

这份文档的目标，是把当前这个“核心功能已完成，但发布周边还没补齐”的插件，推进到下面这个状态：

- 可以放到 GitHub 公开展示
- 有可访问的落地页、支持页、隐私页
- 有稳定的版本号和 ZIP 打包流程
- 能按 Chrome Web Store 的要求准备上架素材和隐私说明
- 多语种支持不再是“代码里有一部分”，而是产品、商店、文档三层都成体系

## 1. 当前现状判断

结合当前仓库和你给的 `cowork_local` 参考项目，现状可以概括成：

- 核心产品功能已经成型：MV3 side panel、TXT/Markdown 导入、字段解析、App Store Connect 页面填充、帮助页、设置页、本地存储都已经具备。
- 现在的主要问题不是“功能不会用”，而是“还没有进入可发布、可持续维护的产品状态”。

我在当前仓库里确认到的几个关键缺口：

- 当前目录本身还不是 git 仓库，发布流程还没有版本化和协作边界。
- `manifest.json` 里还没有 `icons` 配置，仓库里也没有找到商店必备图标资源。
- README 和设置页里都有 GitHub 占位信息，但还没有真正对应的公开仓库、落地页、支持页、隐私页。
- 还没有 ZIP 打包脚本、版本同步脚本、Release 资产目录，也没有明确的发版步骤。
- `_locales/` 目前只有 `en` 和 `zh_CN`，主要覆盖 manifest 名称和简介；而 popup 里的界面文案是直接写在 `popup.js` 的 `TRANSLATIONS` 里，国际化结构还没统一。
- 没有 Chrome Web Store 上架所需的素材包：截图、小宣传图、可选 marquee 图、长描述、多语种 listing 文案、权限说明、测试说明。
- 设置页虽然已经有雏形，但“产品介绍 / 支持入口 / 隐私入口 / 版本信息 / 项目主页”还没有形成完整闭环。

## 2. 参考项目该怎么“临摹”

`cowork_local` 里最值得照搬的，不是具体代码，而是它的“发布工作流拆层”思路：

- 把插件源码和公开展示内容分开管理。
- 把发布脚本、文档、宣传素材单独收纳。
- 让 GitHub README、官网、Release 下载资产三者保持一致。
- 对“公开内容”和“私有开发内容”设置边界，避免误推送。

但是对你这个项目，我不建议第一步就完全照搬成复杂工作树，因为当前仓库还不是 git 仓库，项目体量也不大。更推荐分两段走：

### 当前结构

当前已经切换成你要的双层结构：

- `github/`：公开 README、GitHub Pages 站点、公开素材、发布文档
- `local/`：插件源码、语言包、icons、构建脚本、本地 release 输出

这一阶段的目标，是让公开发布面和本地产品开发彻底分开。

### 为什么这样更合适

- 公开内容和插件源代码不会互相打扰
- GitHub README 和 GitHub Pages 可以单独迭代
- 本地开发阶段不需要把插件源码暴露到公开文件夹里
- 后续如果要再做 worktree 或公开分支，也更容易迁移

## 3. 分阶段执行计划

### Phase 0：仓库基础设施

目标：先把项目变成“可管理”的项目。

本阶段交付物：

- 初始化 git 仓库或迁入已有仓库
- 新建 `.gitignore`
- 明确版本号来源，以 `manifest.json` 为主
- 新建 `docs/`、`site/`、`assets/store/`、`scripts/`
- 补一个内部发版总文档和检查清单

完成标准：

- 仓库可以正常提交版本
- 目录结构不再混乱
- 每次发布知道应该改哪几个文件

### Phase 1：公开落地页与对外信息闭环

目标：先把外部可见面做出来。

本阶段交付物：

- GitHub 仓库
- GitHub README 完整版
- GitHub Pages 落地页
- `site/privacy.html` 或同等隐私页
- `site/support.html` 或同等支持页
- 设置页里的 GitHub、隐私、支持链接都改成真实地址

完成标准：

- 外部用户能看懂这个插件做什么
- 商店审核人员能找到主页、支持页、隐私页
- 插件内和 GitHub 上的信息保持一致

### Phase 2：Chrome Web Store 上架就绪

目标：把“能用”变成“能过审、能上架”。

本阶段交付物：

- `manifest.json` 增加 `icons`
- 补齐 128x128 插件图标
- 至少 1 张 1280x800 的商店截图，最好准备满 5 张
- Small promo tile：440x280
- Marquee：1400x560，可选但建议准备
- Chrome Web Store Store Listing 长描述初稿
- Privacy tab 单一用途说明
- 每个权限的 justification 文案
- 测试说明文案

完成标准：

- 可以打出一个可上传的 ZIP
- 商店 listing 不再是占位信息
- 权限解释和实际代码行为能对上

补充说明：

- 我查了官方文档，图标、小宣传图、截图是明确必备项。
- 关于 promo video，官方旧文档存在表述差异，我这里把它按“推荐项”处理，不把它列为当前阻塞项。这是基于官方文档差异做的推断。

### Phase 3：多语种体系补齐

目标：把“代码里部分支持多语种”升级成“产品和商店都支持多语种”。

本阶段交付物：

- 统一国际化策略，避免一部分在 `_locales/`，一部分硬编码在 `popup.js`
- 第一批保证 `en`、`zh_CN`
- 第二批按你的目标市场扩到 `ja`、`ko`、`fr`、`de`、`es`
- 多语种 README 或独立文档
- Chrome Web Store 多语种长描述
- 如有需要，补多语种截图

完成标准：

- 插件界面语言和商店语言不再脱节
- 至少有 2 个高质量语言版本是完整闭环
- 扩语种时只需要补文案文件，不需要反复改业务逻辑

建议顺序：

- 先把 `en` 和 `zh_CN` 做到完整
- 再扩 `ja`、`ko`
- 欧洲语种最后补

### Phase 4：产品表面打磨

目标：补齐那些“不影响核心功能，但决定专业感和转化率”的地方。

本阶段交付物：

- 设置页介绍文案完善
- 关于页信息完整化
- 帮助页加入更明确的导入格式说明
- 提供示例 TXT pack
- 空状态、错误提示、首次使用路径优化
- README 里补 FAQ、权限解释、隐私边界

完成标准：

- 新用户第一次打开，不需要你在旁边解释
- 商店审核人员能快速理解安全边界
- README、设置页、帮助页说的是同一套话

### Phase 5：发布自动化与长期维护

目标：把这件事从“一次性补文档”变成“可以长期推进”。

本阶段交付物：

- 版本同步脚本
- ZIP 打包脚本
- 发布前检查脚本
- 发布 checklist
- 周期性回顾节奏

完成标准：

- 发布动作不依赖临时记忆
- 每次发版不会忘记改 README、官网和商店素材
- 新需求能继续沿着同一套路推进

## 4. 推荐优先级

如果我们按最省力、最能快速出结果的顺序推进，建议这样排：

1. 先补图标、`icons`、版本和打包流程。
2. 再做 GitHub 仓库、README、落地页、隐私页、支持页。
3. 再准备 Chrome Web Store 上架素材和文案。
4. 再统一多语种体系。
5. 最后做设置页和帮助页的表面打磨。

原因很简单：

- 没有图标和打包流程，连“可上传版本”都没有。
- 没有隐私页和支持页，商店审核信息不完整。
- 多语种是加分项，但不是第一阻塞项。
- 表面打磨最好放在信息架构稳定之后做。

## 5. 未来两周的实际推进节奏

如果按“长期自动推进”的思路，我建议用下面这个节奏：

### 第 1 周

- 完成 Phase 0
- 完成 Phase 1 的基础版
- 产出第一版站点和隐私页

### 第 2 周

- 完成 Phase 2 的基础版
- 准备商店图标、截图、small promo tile
- 写好 Privacy、Store Listing、Test Instructions 的首版文案

### 第 3 周

- 开始 Phase 3
- 至少打通 `en` 和 `zh_CN`
- 确认后续优先扩展语种

### 第 4 周

- 完成 Phase 4 的主要内容
- 做一次完整的发布演练
- 如果没问题，再准备正式上架

## 6. 建议的长期自动跟进方式

后续自动推进，建议不要用“大而全”的一次性任务，而是每次只推进一个最重要的块：

- 周期性检查：看这份文档里最靠前的未完成项
- 单次动作：只做一个阶段里的一个交付物
- 每次结束时：更新完成状态、阻塞项、下一步

这个节奏非常适合做成线程 heartbeat 自动化，因为它不依赖很重的上下文切换。

建议自动化提示词的目标是：

- 读取这份 `docs/launch-roadmap.md`
- 找到当前最高优先级未完成项
- 在当前仓库里推进该项
- 输出已完成内容、遗留阻塞、下一步建议

## 7. 现在最值得立刻做的三件事

如果下一步直接开始落地，而不是继续讨论，我建议马上做这三件：

1. 补 `icons` 和图标资源，并建立版本与 ZIP 打包脚本。
2. 新建 `site/`，把主页、隐私页、支持页做出来。
3. 产出一套 Chrome Web Store 上架文案和素材目录。

## 8. 官方规则参考

下面这些官方文档，是这份规划的重要依据。我在 2026-04-21 做了核对：

- Chrome Web Store 发布流程：<https://developer.chrome.com/docs/webstore/publish/>
- Store Listing 信息：<https://developer.chrome.com/docs/webstore/cws-dashboard-listing/>
- Privacy 字段填写：<https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/>
- Listing requirements：<https://developer.chrome.com/docs/webstore/program-policies/listing-requirements/>
- Quality guidelines：<https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines/>
- 图片与尺寸要求：<https://developer.chrome.com/docs/webstore/images/>
- 国际化与 `_locales`：<https://developer.chrome.com/docs/extensions/reference/api/i18n>
