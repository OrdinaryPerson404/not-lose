export interface User {
  id: number;
  studentId: string;
  displayId: string;
  createdAt: string;
}

export interface Post {
  id: number;
  type: 'clue' | 'search';
  userId: string;
  itemName?: string;
  description?: string;
  image?: string;
  location: string;
  locationDetail?: string;
  timeDescription?: string;
  spaceDescription?: string;
  thankOffer?: string;
  customThankOffer?: string;
  contactQQ?: string;
  contactWechat?: string;
  contactPhone?: string;
  remark?: string;
  status: PostStatus;
  createdAt: string;
  matchedAt?: string;
  returnedAt?: string;
}

export enum PostStatus {
  PENDING = 0,
  MATCHED = 1,
  RETURNED = 2
}

export interface MatchResult {
  matchedPostId: number;
  matchedUserId: string;
  thankOffer?: string;
  score: number;
}

export interface Match {
  id: number;
  score: number;
  status: 'pending' | 'confirmed';
  createdAt: string;
  confirmedAt?: string;
  clue: {
    location: string;
    description: string;
    userId: string;
  };
  search: {
    itemName: string;
    location: string;
    thankOffer: string;
    userId: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  studentId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreatePostRequest {
  type: 'clue' | 'search';
  itemName?: string;
  description?: string;
  image?: string;
  location: string;
  locationDetail?: string;
  timeDescription?: string;
  spaceDescription?: string;
  thankOffer?: string;
  customThankOffer?: string;
  contactQQ?: string;
  contactWechat?: string;
  contactPhone?: string;
  remark?: string;
}

export interface CreatePostResponse {
  post: Post;
  matchResult?: MatchResult;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export const CAMPUS_LOCATION_CATEGORIES = [
  {
    label: '🍽️ 食堂餐饮',
    icon: '🍽️',
    locations: [
      '一食堂',
      '二食堂',
      '三食堂',
      '星际食堂（国教餐厅）',
      '上海路食堂'
    ]
  },
  {
    label: '🏠 宿舍区域',
    icon: '🏠',
    locations: [
      '1-6栋学生公寓',
      '7-12栋学生公寓',
      '13-18栋学生公寓',
      '19-24栋学生公寓',
      '25-28栋学生公寓',
      '研究生公寓',
      '上海路学生公寓'
    ]
  },
  {
    label: '📚 教学楼',
    icon: '📚',
    locations: [
      'A栋教学楼',
      'B栋教学楼',
      'C栋教学楼',
      'D栋教学楼',
      'E栋教学楼',
      'F栋教学楼',
      'G栋教学楼',
      '国际教育学院楼',
      '上海路教学楼'
    ]
  },
  {
    label: '📖 图书馆办公',
    icon: '📖',
    locations: [
      '图书馆',
      '上海路图书馆',
      '行政楼',
      '各学院办公楼'
    ]
  },
  {
    label: '⚽ 运动场所',
    icon: '⚽',
    locations: [
      '田径场（大操场）',
      '上海路田径场',
      '体育馆',
      '上海路体育馆',
      '游泳馆',
      '篮球场',
      '网球场',
      '足球场'
    ]
  },
  {
    label: '🎯 校园地标',
    icon: '🎯',
    locations: [
      '大学生活动中心（大活）',
      '商业街',
      '校医院',
      '后山',
      '卧龙湖/天一湖',
      '北门',
      '东门',
      '南门',
      '上海路北门',
      '上海路南门'
    ]
  },
  {
    label: '📦 生活服务',
    icon: '📦',
    locations: [
      '快递点（菜鸟驿站）',
      '汉口银行/ATM区'
    ]
  },
  {
    label: '❓ 其他区域',
    icon: '❓',
    locations: [
      '路上（未注意具体位置）',
      '校车上',
      '教学楼某教室'
    ]
  }
] as const;

export const CAMPUS_LOCATIONS = CAMPUS_LOCATION_CATEGORIES.flatMap(cat => cat.locations) as readonly string[];

export type CampusLocation = typeof CAMPUS_LOCATIONS[number];

export const THANK_OFFERS = [
  { icon: '🧋', label: '一杯奶茶', value: 'bubble_tea' },
  { icon: '🍱', label: '一份食堂小炒', value: 'meal' },
  { icon: '☕', label: '一杯咖啡', value: 'coffee' },
  { icon: '🎵', label: '教你弹一首曲子', value: 'song' },
  { icon: '🤝', label: '帮你占一次座', value: 'seat' },
  { icon: '✨', label: '自定义我的心意', value: 'custom' }
] as const;

export type ThankOfferValue = typeof THANK_OFFERS[number]['value'];

export function getThankOfferLabel(value: string, customValue?: string): string {
  if (value === 'custom' && customValue) {
    return `✨ ${customValue}`;
  }
  const offer = THANK_OFFERS.find(o => o.value === value);
  return offer ? `${offer.icon} ${offer.label}` : value;
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export function getStatusLabel(status: PostStatus): string {
  switch (status) {
    case PostStatus.PENDING:
      return '寻主人';
    case PostStatus.MATCHED:
      return '匹配中';
    case PostStatus.RETURNED:
      return '已回家';
    default:
      return '未知';
  }
}

export function getStatusTagClass(status: PostStatus): string {
  switch (status) {
    case PostStatus.PENDING:
      return 'tag-pending';
    case PostStatus.MATCHED:
      return 'tag-matched';
    case PostStatus.RETURNED:
      return 'tag-returned';
    default:
      return '';
  }
}
