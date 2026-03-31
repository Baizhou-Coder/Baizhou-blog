# VitePress + GitHub Pages 部署问题排查笔记

本文记录了在将 VitePress 博客部署到 GitHub Pages 过程中遇到的问题及其解决方案。

## 问题一：背景图和 Logo 图片无法显示

### 现象

本地开发服务器（`npm run docs:dev`）运行正常，背景图和 logo 都能显示。但部署到 GitHub Pages 后，这些图片全部加载不出来。

### 排查过程

检查构建输出目录 `.vitepress/dist/`，发现 `background.svg` 和 `logo.svg` 都没有被打包进去。

### 根因

VitePress 的静态资源（如图片、字体等）需要放在项目根目录的 `public/` 文件夹下，这样构建时才会被复制到输出目录。而这两个文件被放在了项目根目录，导致构建时被忽略。

```
项目根目录/
├── public/           ← 静态资源放这里，会被打包
│   ├── background.svg
│   └── logo.svg
├── background.svg    ← 放错位置了，不会被打包
├── logo.svg          ← 放错位置了，不会被打包
└── .vitepress/
```

### 解决方案

将图片文件移动到 `public/` 目录：

```bash
mv background.svg public/
mv logo.svg public/
```

同时，`config.mts` 中的 logo 路径需要同步更新：

```ts
// 修改前
logo: './logo.svg'

// 修改后
logo: '/Baizhou-blog/logo.svg'
```

> 注意：`/Baizhou-blog/` 是站点 `base` 配置，路径需要包含它。

---

## 问题二：侧边栏链接路径重复添加 base

### 现象

部署后，侧边栏点击跳转到 `/backend/java/yudao-boot-mini vs ruoyi-vue-pro 后端对比分析.html` 时，浏览器地址栏显示的 URL 是：

```
https://baizhou-coder.github.io/Baizhou-blog/Baizhou-blog/backend/java/yudao-boot-mini%20vs%20ruoyi-vue-pro%20%E5%90%8E%E7%AB%AF%E5%AF%B9%E6%AF%94%E5%88%86%E6%9E%90.html
```

URL 中 `/Baizhou-blog/` 出现了两次，导致页面加载失败。

### 排查过程

检查 `config.mts` 中的 `base` 配置：

```ts
export default defineConfig({
  base: '/Baizhou-blog/',
  // ...
})
```

再查看 `auto-sidebar.ts` 中拼接链接的逻辑，发现代码手动在链接前面加上了 `basePath`：

```ts
const link = path.posix.join(relativeUrlPath, nameWithoutExt);
// 手动拼接 base
const finalLink = link.startsWith('/')
  ? `${basePath.replace(/\/$/, '')}${link}`
  : `${basePath}${link}`;
```

而 `config.mts` 中调用 `setSidebar` 时传入了 `basePath`：

```ts
sidebar: {
  "/backend/java/": setSidebar("backend/java", "/Baizhou-blog/"),
},
```

### 根因

**VitePress 会自动给所有链接加上 `base` 前缀**，所以侧边栏配置中的 key 和链接都不需要手动添加 base。但 `auto-sidebar.ts` 手动拼接了一次，导致 base 被添加了两次：

```
手动拼接:  /Baizhou-blog/  +  /backend/java/yudao...
VitePress: /Baizhou-blog/  +  /Baizhou-blog//backend/java/yudao...
                               ↑ 重复了 ↑
```

### 解决方案

**修改 `auto-sidebar.ts`** — 移除手动拼接 `basePath` 的逻辑：

```ts
// 修改前
const link = path.posix.join(relativeUrlPath, nameWithoutExt);
const finalLink = link.startsWith('/')
  ? `${basePath.replace(/\/$/, '')}${link}`
  : `${basePath}${link}`;
items.push({ text: nameWithoutExt, link: finalLink });

// 修改后
const link = path.posix.join(relativeUrlPath, nameWithoutExt);
items.push({ text: nameWithoutExt, link });
```

**修改 `config.mts`** — 移除多余的 `basePath` 参数：

```ts
sidebar: {
  "/backend/java/": setSidebar("backend/java"),  // 不再传第二个参数
},
```

---

## 关键知识点

### 1. VitePress 静态资源目录

VitePress 中只有 `public/` 目录下的文件会被原样复制到构建输出目录。其他位置的文件（如 `.md` 中引用的图片）不会自动被打包。

### 2. VitePress 的 base 机制

在 `vitepress.config.ts` 中配置的 `base` 路径（如 `/Baizhou-blog/`），VitePress 会在构建时**自动**给所有生成的链接（导航、侧边栏路由等）加上这个前缀。

因此，在 `config.mts` 中定义 nav 和 sidebar 时，链接应该写成相对于站点根路径的形式（以 `/` 开头），**不要**再手动拼接 base。

### 3. Git push 被拒绝的原因

在推送本地提交时，如果远程仓库已经有人先推送了新的提交，Git 会拒绝直接 push，提示：

```
! [rejected] master -> master (fetch first)
```

解决方法是先拉取远程最新代码，再推送：

```bash
git pull --rebase origin master
git push
```

其中 `git pull --rebase` 会将本地的提交"移植"到远程最新提交之后，保持线性历史。

---

## 总结

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 图片不显示 | 静态资源未放在 `public/` 目录 | 移动到 `public/` 目录 |
| 侧边栏链接重复 base | `auto-sidebar.ts` 手动拼接了 base | 移除手动拼接，VitePress 自动处理 |
| Git push 被拒绝 | 远程有新的提交 | `git pull --rebase` 后再 push |
