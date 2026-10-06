# Release Checklist

更新日期：2026-04-21

## 1. 版本准备

- 确认本次发布目标版本号
- 在仓库根目录执行 `node local/scripts/build-release.mjs <version>`
- 打开 `local/manifest.json`，确认版本号已同步
- 检查 `local/dist/` 下是否生成目录和 ZIP

## 2. 产品核查

- 本地加载扩展正常
- Side panel 可以打开
- TXT / Markdown 导入正常
- Fill current page 正常
- Help 页面复制提示词正常
- Settings 页面外链都可访问

## 3. 对外页面

- `github/site/index.html` 内容与 `github/README.md` 一致
- `github/site/privacy.html` 反映当前真实数据行为
- `github/site/support.html` 提供明确支持路径
- GitHub README、站点、扩展设置页链接一致

## 4. 商店素材

- 图标资源齐全
- 至少 1 张商店截图
- Small promo tile 已准备
- Listing 文案已更新
- Privacy 问卷答案和代码行为一致

## 5. 发布动作

- 上传 ZIP 到 GitHub Release
- 如已准备上架，上传到 Chrome Web Store
- 记录本次版本的变更说明
- 更新路线图中已完成项和下一步
