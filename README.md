# 暗夜星空乐队官方网站

暗夜星空乐队（Lightsdark Band）官方网站，基于 React + TypeScript + Vite 构建，支持明暗主题切换。

## 目录结构

```
乐队官网/
├── public/
│   ├── content/
│   │   └── band-info.md          # 乐队介绍 Markdown 内容
│   └── favicon.svg               # 网站图标
├── src/
│   ├── assets/                   # 静态资源
│   ├── components/               # 公共组件
│   │   ├── Layout.tsx            # 页面布局框架（导航栏 + 内容区 + 页脚）
│   │   ├── MarkdownRenderer.tsx  # Markdown 内容渲染器
│   │   ├── Navbar.tsx            # 顶部导航栏
│   │   ├── PhotoGrid.tsx         # 照片网格组件（未使用）
│   │   ├── PhotoViewer.tsx       # 照片大图查看器（弹窗）
│   │   └── ThemeToggle.tsx       # 主题切换按钮
│   ├── data/                     # 数据配置文件
│   │   ├── photos.ts             # 照片数据
│   │   ├── site.ts               # 网站全局配置
│   │   ├── songs.ts              # 歌曲与歌词数据
│   │   └── videos.ts             # 视频页数据
│   ├── lib/
│   │   └── utils.ts              # 工具函数
│   ├── pages/                    # 页面组件
│   │   ├── AboutPage.tsx         # 乐队信息页
│   │   ├── GalleryPage.tsx       # 照片展示页
│   │   ├── HomePage.tsx          # 首页
│   │   └── VideosPage.tsx        # 表演视频页
│   ├── store/
│   │   └── themeStore.ts         # 主题状态管理（Zustand）
│   ├── App.tsx                   # 路由配置入口
│   ├── index.css                 # 全局样式与主题变量
│   ├── main.tsx                  # 应用入口
│   └── vite-env.d.ts             # Vite 类型声明
├── index.html                    # HTML 模板
├── package.json                  # 项目依赖与脚本
├── tailwind.config.js            # Tailwind CSS 配置
├── tsconfig.json                 # TypeScript 配置
└── vite.config.ts                # Vite 构建配置
```

## 快速开始

```bash
# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint

# 类型检查
npm run check
```

## 内容修改指南

### 1. 乐队基本信息

**文件路径**：`public/content/band-info.md`

乐队介绍页的内容通过 Markdown 文件渲染。编辑此文件即可更新乐队信息页面的所有文字内容。

支持的 Markdown 语法：标题、列表、粗体、引用、链接、表格、分隔线等。

**示例**：
```markdown
## 乐队成员

- **主唱**：小辰 — 嗓音深邃有力
- **吉他**：杰森 — 技术精湛
```

### 2. 网站全局配置

**文件路径**：`src/data/site.ts`

```typescript
export const siteConfig = {
  bandName: '暗夜星空乐队',        // 乐队中文名（显示在导航栏和首页）
  bandNameEn: 'Lightsdark Band',   // 乐队英文名
  slogan: '在暗夜中闪耀，用音乐点亮星空',  // 首页标语
  nightBackgroundImage: '...',     // 夜间模式背景图 URL
  navItems: [                      // 导航菜单项
    { label: '首页', path: '/' },
    { label: '乐队信息', path: '/about' },
    { label: '照片展示', path: '/gallery' },
    { label: '表演视频', path: '/videos' },
  ],
}
```

### 3. 歌曲与歌词

**文件路径**：`src/data/songs.ts`

首页动态歌词轮播的数据源。每首歌包含 `id`、`title`、`artist` 和 `lyrics`（字符串数组，每个元素为一行歌词）。

```typescript
export const songs: Song[] = [
  {
    id: '1',
    title: '歌曲名称',
    artist: '演唱者',
    lyrics: ['第一行歌词', '第二行歌词', ...],
  },
]
```

**修改方式**：
- 添加新歌：在数组末尾新增一个对象
- 修改歌词：编辑对应歌曲的 `lyrics` 数组
- 删除歌曲：移除对应对象即可

### 4. 照片展示

**文件路径**：`src/data/photos.ts`

照片展示页的数据源。每张照片包含以下字段：

```typescript
export interface Photo {
  id: string                              // 唯一标识
  url: string                             // 图片 URL
  caption?: string                        // 照片说明（悬停显示）
  alt: string                             // 图片替代文本
  orientation: 'landscape' | 'portrait'   // 图片方向
  width: number                           // 图片原始宽度（像素）
  height: number                          // 图片原始高度（像素）
}
```

**修改方式**：
- 添加照片：在数组中新增对象，`orientation` 根据实际图片方向填写
  - 横屏照片：`orientation: 'landscape'`，`width > height`
  - 竖屏照片：`orientation: 'portrait'`，`height > width`
- 删除照片：移除对应对象
- 修改说明：编辑 `caption` 字段

**布局规则**：横屏照片和竖屏照片会自动分组到不同行，横屏行使用宽卡片，竖屏行使用窄高卡片，形成视觉节奏。

### 5. 视频与下载

**文件路径**：`src/data/videos.ts`

表演视频页的数据源，包含微信视频号信息和下载链接列表。

```typescript
export const videoPageData = {
  wechatChannel: {
    name: '视频号名称',           // 视频号名称
    description: '视频号描述',    // 视频号介绍文字
    qrCodeUrl: '...',            // 二维码图片 URL
  },
  downloads: [
    {
      label: '视频标题',          // 下载项显示名称
      url: 'https://...',        // 下载链接
      platform: '123网盘',       // 平台标识
    },
  ],
}
```

**修改方式**：
- 更新视频号信息：编辑 `wechatChannel` 下的字段
- 添加下载链接：在 `downloads` 数组中新增对象
- 修改二维码：替换 `qrCodeUrl` 为新的二维码图片地址

## 页面说明

### 首页 (`/`)

- 全屏布局，星空动画背景（夜间模式）
- 乐队名称与标语居中展示
- 动态歌词轮播（左下角空心描边文字）
- 「换一首」按钮切换歌曲
- 三个导航入口卡片

### 乐队信息页 (`/about`)

- 渲染 `public/content/band-info.md` 的 Markdown 内容
- 卡片式布局，支持滚动揭示动画

### 照片展示页 (`/gallery`)

- 自动滚动的照片流，横屏与竖屏照片分行展示
- 鼠标悬停或触摸可暂停滚动
- 点击照片打开大图查看器，支持左右切换和键盘操作

### 表演视频页 (`/videos`)

- 微信视频号信息与二维码
- 演出视频下载列表

## 主题系统

**文件路径**：`src/index.css`

主题通过 CSS 自定义属性实现，支持明暗两种模式：

- 暗色主题（默认）：深海军蓝底色 + 青色强调
- 亮色主题：暖白底色 + 靛蓝强调

关键 CSS 变量：
- `--color-accent`：强调色
- `--color-bg`：背景色
- `--color-text`：主文字色
- `--color-text-muted`：次要文字色
- `--color-border`：边框色
- `--color-card-bg`：卡片背景色

## 技术栈

- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS + CSS 自定义属性
- **路由**：React Router DOM v7
- **状态管理**：Zustand
- **图标**：Lucide React
- **Markdown 渲染**：react-markdown + remark-gfm
