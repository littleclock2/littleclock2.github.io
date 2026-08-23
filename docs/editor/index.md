---
title: 发布文章
description: YunSword 博客的文章发布说明。
---

# 发布文章

公开网站不再提供浏览器内编辑器或前端密码框。文章通过草稿 Pull Request 发布，正文和列表只维护一份 Markdown 文件。

## 推荐：网页创建草稿

1. 打开 [New blog post 工作流](https://github.com/littleclock2/littleclock2.github.io/actions/workflows/new-post.yml)。
2. 选择 **Run workflow**，填写标题、英文短链接、摘要和标签。
3. 工作流会生成文章、完成构建检查，并创建一个草稿 Pull Request。
4. 在草稿中补充正文并预览，确认后合并即可发布。

## 本地创建草稿

```powershell
npm run new-post -- --title "文章标题" --slug "article-slug" --description "一句话摘要" --tags "STM32,嵌入式"
```

生成的文件位于 `docs/blog/article-slug.md`。完成正文后运行 `npm run build` 检查即可。

## 在线设置头像

“关于”页会同步 `littleclock2` 的 GitHub 公开头像。登录 GitHub 后打开[个人资料设置](https://github.com/settings/profile)，更换头像即可；博客无需修改文件，也不会保存账户密码。

## 完整网站编辑教程

首页、文章、项目、关于页、图片、导航、BGM、本地上传和 GitHub Pages 部署的完整步骤见[仓库 README](https://github.com/littleclock2/littleclock2.github.io#readme)。
