export interface VideoPageData {
  wechatChannel: {
    name: string
    description: string
    qrCodeUrl: string
  }
  downloads: {
    label: string
    url: string
    platform: string
  }[]
}

export const videoPageData: VideoPageData = {
  wechatChannel: {
    name: '暗夜星空乐队 Lightsdark Band',
    description: '关注微信视频号，观看暗夜星空乐队最新演出视频、排练花絮和原创音乐MV。定期更新演出预告与幕后故事。',
    qrCodeUrl: 'https://edgeoneimg.cdn.sn/i/6a124e89b6a6f_1779584649.webp',
  },
  downloads: [
    {
      label: '《Wake me up when September ends》闭幕式',
      url: 'https://1813747553.share.123pan.cn/123pan/ZOalVv-vBSud',
      platform: '123网盘',
    },
    {
      label: '《回不去的夏天》个人风采大赛',
      url: 'https://1813747553.share.123pan.cn/123pan/ZOalVv-vBSud',
      platform: '123网盘',
    },
    {
      label: '《想去海边》闭幕式',
      url: 'https://1813747553.share.123pan.cn/123pan/ZOalVv-vBSud',
      platform: '123网盘',
    },
    {
      label: '《Wake me up when September ends》印刷集团基地',
      url: 'https://1813747553.share.123pan.cn/123pan/ZOalVv-vBSud',
      platform: '123网盘',
    },
  ],
}