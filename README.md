# YunSword 技术博客

这是 `littleclock2.github.io` 的 VitePress 源码仓库。网站内容以 Markdown、JSON 和少量 Vue 组件维护；提交到 `main` 分支后，GitHub Actions 会自动构建并发布到：

- 网站：<https://littleclock2.github.io>
- 仓库：<https://github.com/littleclock2/littleclock2.github.io>
- 部署记录：<https://github.com/littleclock2/littleclock2.github.io/actions/workflows/deploy.yml>

> 不要手动上传 `node_modules` 或 `docs/.vitepress/dist`。它们分别是本地依赖和自动生成的构建结果。

## 最常用的三种编辑方式

### 方式一：直接在 GitHub 网页修改一个文件

适合修改一句介绍、项目描述、联系方式或配置值。

1. 打开仓库：<https://github.com/littleclock2/littleclock2.github.io>。
2. 按下键盘上的 `.`，进入 `github.dev` 网页编辑器；也可以打开目标文件后点击铅笔按钮。
3. 修改文件并保存。
4. 在左侧“源代码管理”中填写本次修改说明。
5. 推荐选择新建分支并创建 Pull Request，不要直接覆盖尚未检查的 `main`。
6. 等待 **Verify site** 检查通过。
7. 合并 Pull Request。合并后 **Deploy VitePress** 会自动发布网站。

GitHub 官方说明：[网页编辑文件](https://docs.github.com/repositories/working-with-files/managing-files/editing-files)与 [github.dev 编辑器](https://docs.github.com/codespaces/the-githubdev-web-based-editor)。

### 方式二：用 Actions 自动创建一篇文章

这是发布新文章最简单的方式。

1. 打开 [New blog post](https://github.com/littleclock2/littleclock2.github.io/actions/workflows/new-post.yml)。
2. 点击 **Run workflow**。
3. 填写：
   - `title`：中文文章标题；
   - `slug`：只用小写英文字母、数字和短横线，例如 `stm32-uart-dma`；
   - `description`：一句话摘要；
   - `tags`：用英文逗号分隔，例如 `STM32,DMA,嵌入式`。
4. 工作流会创建 `docs/blog/slug.md`，检查网站构建，并新建一个草稿 Pull Request。
5. 打开草稿 Pull Request，编辑文章正文。
6. 预览和检查通过后，把草稿改为 Ready for review 并合并。

文章列表会从 Markdown 的 frontmatter 自动生成，不需要再修改单独的文章列表文件。

### 方式三：在电脑上完整修改并上传

适合同时修改多个页面、样式、图片或 BGM。

首次使用：

```powershell
git clone https://github.com/littleclock2/littleclock2.github.io.git
cd littleclock2.github.io
npm ci
```

如果已经有本地文件夹，先确认它连接的是 GitHub，而不是旧备份或本地镜像：

```powershell
git remote -v
```

正常情况下应看到：

```text
https://github.com/littleclock2/littleclock2.github.io.git
```

若地址不是 GitHub，再执行：

```powershell
git remote set-url origin https://github.com/littleclock2/littleclock2.github.io.git
```

每次修改前：

```powershell
git switch main
git pull --ff-only origin main
git switch -c site/update-description
npm ci
npm run dev
```

浏览器打开终端显示的本地地址。完成修改后先检查：

```powershell
npm run build
git status
git diff --check
```

确认没有误改或多余文件后上传到新分支：

```powershell
git add .
git commit -m "docs: update website content"
git push -u origin site/update-description
```

然后打开 GitHub 提示的 Pull Request 链接，等待 **Verify site** 通过并合并。推荐使用 Pull Request，因为出现问题时更容易检查和回退。

## 文件位置速查

| 要修改的内容 | 文件或目录 |
| --- | --- |
| 首页标题、副标题、两个主按钮 | `docs/index.md` |
| 首页背景与主视觉 | `docs/.vitepress/theme/components/HeroSection.vue` |
| 首页“项目选集”三项 | `docs/.vitepress/theme/components/Layout.vue` 中的 `featuredProjects` |
| 全部文章 | `docs/blog/*.md` |
| 文章列表生成规则 | `docs/.vitepress/data/blog.data.mjs` |
| 项目页 | `docs/projects/index.md` |
| 关于页结构 | `docs/about.md` 与 `AboutPage.vue` |
| 姓名、简介、技术栈、项目、联系方式 | `docs/public/about-data.json` |
| 头像 | GitHub 个人资料头像 |
| 导航、页脚、搜索、站点标题 | `docs/.vitepress/config.mjs` |
| 多语言文字 | `docs/.vitepress/theme/i18n.js` |
| BGM 开关、曲名、音量、文件路径 | `docs/public/site-config.json` |
| BGM 音频 | `docs/public/bgm.mp3` |
| Logo、图标、图片等静态资源 | `docs/public/` |
| 内容页视觉微调 | `docs/.vitepress/theme/refined.css` |
| 原始主题样式 | `docs/.vitepress/theme/custom.css` |
| 设计规范 | `DESIGN.md` |

## 如何修改网站各个部分

### 1. 修改首页标题和按钮

打开 `docs/index.md`。主要内容位于顶部：

```yaml
hero:
  name: YunSword
  text: 嵌入式开发与硬件探索
  tagline: 记录 MCU、信号处理与硬件设计实践
  actions:
    - theme: brand
      text: 浏览文章
      link: /blog/
```

- `name`：首页主名称；
- `text`：主标题；
- `tagline`：副标题；
- `actions`：首页按钮，`text` 是按钮文字，`link` 是跳转地址。

首页下方“最新文章”会自动读取 `docs/blog/`，不需要手动维护。

### 2. 修改首页项目选集

打开 `docs/.vitepress/theme/components/Layout.vue`，找到：

```js
const featuredProjects = [
  {
    name: 'STM32-Examples',
    description: '项目说明',
    url: 'https://github.com/littleclock2/STM32-Examples'
  }
]
```

每个项目需要真实的 `name`、`description` 和 `url`。这里控制首页精选；完整项目页需要另外修改 `docs/projects/index.md`。

### 3. 新建或修改文章

文章放在 `docs/blog/`。每篇文章开头必须保留 frontmatter：

```markdown
---
title: STM32 UART DMA 实践
description: UART DMA 接收与空闲中断的实现记录。
date: 2026-08-23
tags:
  - STM32
  - DMA
---

# STM32 UART DMA 实践

这里开始写正文。
```

注意：

- 文件名使用小写英文、数字和短横线，例如 `stm32-uart-dma.md`；
- 日期格式固定为 `YYYY-MM-DD`；
- 图片先放到 `docs/public/images/`，文章中写 `/images/文件名.png`；
- 不要同时维护第二份文章列表，构建程序会自动读取 frontmatter。

本地也可以用命令生成文章：

```powershell
npm run new-post -- --title "文章标题" --slug "article-slug" --description "一句话摘要" --tags "STM32,嵌入式"
```

### 4. 修改项目页

打开 `docs/projects/index.md`，复制一个完整的 `<ProjectCard />`：

```vue
<ProjectCard
  title="项目名称"
  description="项目的真实说明"
  :tags="['STM32', 'Embedded']"
  repoUrl="https://github.com/littleclock2/项目仓库"
/>
```

- `title`：项目名称；
- `description`：项目说明；
- `tags`：技术标签；
- `repoUrl`：项目仓库地址。

### 5. 修改关于页

常用信息都在 `docs/public/about-data.json`：

- `profile`：姓名、职位、简介、引言；
- `skills`：技术栈；
- `fields`：关注方向；
- `projects`：代表项目；
- `links`：联系方式。

JSON 有严格格式：每一项之间保留英文逗号，字符串使用英文双引号。修改后务必运行 `npm run build`。

关于页头像同步 `littleclock2` 的 GitHub 头像。在线修改入口：<https://github.com/settings/profile>。更换后不需要修改博客代码。

### 6. 修改导航、站点标题和页脚

打开 `docs/.vitepress/config.mjs`：

- `title`：浏览器标签和站点名称；
- `description`：站点说明；
- `themeConfig.nav`：顶部导航；
- `themeConfig.socialLinks`：GitHub 等外部链接；
- `themeConfig.footer`：页脚。

新增页面时：

1. 在 `docs/` 下新建 Markdown 文件；
2. 在 `themeConfig.nav` 中增加入口；
3. 同步更新 `docs/.vitepress/theme/i18n.js` 中的导航文字；
4. 运行 `npm run build`。

### 7. 更换图片、Logo 和网站图标

静态资源统一放在 `docs/public/`：

- 页面引用 `docs/public/images/demo.png` 时，地址写成 `/images/demo.png`；
- Logo 位于 `docs/public/theme/`；
- 网站图标路径在 `docs/.vitepress/config.mjs` 的 `head` 中设置。

文件名建议只用小写英文、数字和短横线，避免空格和大小写混用。GitHub Pages 运行在 Linux 环境，路径大小写必须完全一致。

### 8. 保留、更换或关闭 BGM

BGM 播放器已在所有页面启用，目前包含 4 首曲目。它默认收起为右下角的音符按钮，音符外圈显示当前歌曲的真实播放进度；点击后展开完整控制栏，可以使用上一首、下一首或曲名下拉框直接选歌。歌曲播放结束后会自动进入下一首，5 秒无交互会自动收起，收起不会暂停音乐。浏览器不会允许网站可靠地强制自动播放，所以仍需要访客主动点击播放按钮。

配置文件是 `docs/public/site-config.json`：

```json
{
  "music": {
    "enabled": true,
    "defaultVolume": 0.3,
    "tracks": [
      {
        "title": "站点 BGM",
        "src": "/bgm.mp3"
      },
      {
        "title": "明天的云",
        "src": "/music/tomorrows-cloud.mp3"
      }
    ]
  }
}
```

- `enabled`：`true` 显示播放器，`false` 关闭；
- `defaultVolume`：默认音量，范围 `0` 到 `1`；
- `tracks`：播放列表，顺序就是播放器的播放顺序；
- `tracks[].title`：播放器显示的真实曲名；
- `tracks[].src`：音频地址，以 `/` 开头，路径从 `docs/public/` 之后开始计算。

增加一首 BGM 的最简单方式：

1. 准备你有权公开使用的 MP3 文件；
2. 将文件名改成小写英文、数字或短横线，例如 `new-song.mp3`；
3. 把文件上传到 `docs/public/music/`；
4. 在 `site-config.json` 的 `tracks` 数组末尾增加一项，例如 `{ "title": "新歌曲名", "src": "/music/new-song.mp3" }`；
5. 注意上一项与新项目之间必须有英文逗号；
6. 本地运行 `npm run dev`，检查直接选歌、上一首、下一首、自动续播、进度和音量；
7. 运行 `npm run build` 后再提交。

当前 4 首歌曲均可通过 GitHub 网页逐个上传。为避免网站仓库和流量增长过快，建议单首歌曲尽量控制在 10 MB 以内，并只保留确实需要公开播放的版本。GitHub 当前规定网页上传单文件不超过 25 MiB；更大的普通 Git 文件应使用命令行，但单文件仍应控制在 100 MiB 以下。详情见 [GitHub 添加文件说明](https://docs.github.com/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)。

若播放器显示“BGM 文件不可用”，依次检查：

1. 文件是否确实位于 `docs/public/` 或 `docs/public/music/`；
2. 文件名大小写是否与 `src` 完全一致；
3. 文件是否能在电脑播放器中正常播放；
4. `site-config.json` 是否为合法 JSON；
5. 浏览器开发者工具的 Network 中对应的 `src` 地址是否返回 `200`。

### 9. 调整颜色和排版

优先修改 `docs/.vitepress/theme/refined.css` 中的语义变量：

```css
:root {
  --ys-canvas: #0b0c0a;
  --ys-signal: #ffb800;
  --ys-text: #f2f2ed;
  --ys-muted: #a5a69d;
  --ys-border: #30312a;
}
```

如果调整了长期使用的颜色、字体、圆角或组件规则，也要同步更新 `DESIGN.md`。不要只用 `overflow: hidden` 掩盖手机端溢出。

## 本地预览和检查

启动开发预览：

```powershell
npm ci
npm run dev
```

正式构建检查：

```powershell
npm run build
```

构建通过后，生成结果位于 `docs/.vitepress/dist`，但该目录由 GitHub Actions 自动生成，不需要提交。

## GitHub Pages 发布设置

仓库已经包含 `.github/workflows/deploy.yml`。它在 `main` 更新后自动执行：

1. 安装依赖；
2. 构建 VitePress；
3. 上传 Pages 构建产物；
4. 发布网站。

首次配置或部署失败时，检查：

1. 打开仓库 **Settings → Pages**；
2. `Build and deployment` 的 `Source` 选择 **GitHub Actions**；
3. 打开 **Actions → Deploy VitePress**；
4. 先看 `build`，再看 `deploy` 的红色错误；
5. 修复后在失败记录中选择 **Re-run failed jobs**，或提交一个新的修复。

GitHub 官方说明：[使用自定义工作流部署 Pages](https://docs.github.com/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 出现问题时如何安全回退

不要用 `git reset --hard` 覆盖未保存的工作。推荐回退单次提交：

```powershell
git log --oneline -10
git revert 提交编号
git push
```

也可以在 GitHub 的 Pull Request 或提交页面点击 **Revert**，再等待自动构建和部署。

## 发布前检查清单

- [ ] 只修改了预期文件；
- [ ] 图片、链接和文件名大小写正确；
- [ ] JSON 和 Markdown frontmatter 格式正确；
- [ ] BGM 能加载、播放、暂停和调节音量；
- [ ] `npm run build` 通过；
- [ ] `git diff --check` 没有错误；
- [ ] Pull Request 的 **Verify site** 通过；
- [ ] 合并后 **Deploy VitePress** 的 `build` 和 `deploy` 都成功；
- [ ] 打开线上网站并强制刷新，实际检查修改结果。
