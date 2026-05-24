export interface SiteConfig {
  bandName: string
  bandNameEn: string
  slogan: string
  backgroundImage: string
  nightBackgroundImage: string
  navItems: { label: string; path: string }[]
}

export const siteConfig: SiteConfig = {
  bandName: '暗夜星空乐队',
  bandNameEn: 'Lightsdark Band',
  slogan: '在暗夜中闪耀，用音乐点亮星空',
  backgroundImage: '',
  nightBackgroundImage: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=1920&q=80',
  navItems: [
    { label: '首页', path: '/' },
    { label: '乐队信息', path: '/about' },
    { label: '照片展示', path: '/gallery' },
    { label: '表演视频', path: '/videos' },
  ],
}