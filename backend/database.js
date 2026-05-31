let users = [
  { id: 1, student_id: '25201732', password: '25201732', display_id: '25****32', created_at: '2026-05-01 00:00:00' },
  { id: 2, student_id: '25201845', password: '25201845', display_id: '25****45', created_at: '2026-05-01 00:00:00' },
  { id: 3, student_id: '25201901', password: '25201901', display_id: '25****01', created_at: '2026-05-01 00:00:00' },
  { id: 4, student_id: '25202056', password: '25202056', display_id: '25****56', created_at: '2026-05-01 00:00:00' },
  { id: 5, student_id: '25202123', password: '25202123', display_id: '25****23', created_at: '2026-05-01 00:00:00' }
];

let posts = [
  { id: 1, user_id: 1, type: 'search', item_name: '黑色U盘', description: '里面有一个重要的PPT', image: null, location: '图书馆', location_detail: null, time_description: '昨天下午3点左右', space_description: '图书馆三楼自习区靠窗座位', thank_offer: 'bubble_tea', custom_thank_offer: null, contact_qq: '12345678', contact_wechat: null, contact_phone: null, remark: 'U盘是金士顿的，有蓝色外壳', status: 0, created_at: '2026-05-31 09:00:00', matched_at: null, returned_at: null },
  { id: 2, user_id: 2, type: 'clue', item_name: null, description: '在一楼靠窗的座位上发现的', image: null, location: '图书馆', location_detail: null, time_description: null, space_description: null, thank_offer: null, custom_thank_offer: null, contact_qq: null, contact_wechat: null, contact_phone: null, remark: null, status: 0, created_at: '2026-05-31 10:30:00', matched_at: null, returned_at: null },
  { id: 3, user_id: 3, type: 'search', item_name: '红色水杯', description: '带有南航logo的保温杯', image: null, location: '二食堂', location_detail: null, time_description: '今天中午12点左右', space_description: '二楼左侧打饭窗口附近', thank_offer: 'coffee', custom_thank_offer: null, contact_qq: '12345678', contact_wechat: 'nuaa_student', contact_phone: null, remark: null, status: 0, created_at: '2026-05-30 12:00:00', matched_at: null, returned_at: null },
  { id: 4, user_id: 4, type: 'clue', item_name: null, description: '在二楼靠近楼梯的位置', image: null, location: '二食堂', location_detail: null, time_description: null, space_description: null, thank_offer: null, custom_thank_offer: null, contact_qq: null, contact_wechat: null, contact_phone: null, remark: null, status: 0, created_at: '2026-05-30 13:15:00', matched_at: null, returned_at: null },
  { id: 5, user_id: 5, type: 'search', item_name: '宿舍钥匙', description: '一串钥匙，上面有蓝色钥匙扣', image: null, location: 'A栋教学楼', location_detail: null, time_description: '今天上午8:30左右', space_description: null, thank_offer: 'seat', custom_thank_offer: null, contact_qq: null, contact_wechat: null, contact_phone: '13800138000', remark: '钥匙上有个蓝色小挂件，是南航纪念品', status: 0, created_at: '2026-05-29 08:00:00', matched_at: null, returned_at: null },
  { id: 6, user_id: 1, type: 'search', item_name: '校园卡', description: '卡套是透明的', image: null, location: '体育馆', location_detail: null, time_description: '昨天下午4点左右', space_description: null, thank_offer: 'meal', custom_thank_offer: null, contact_qq: null, contact_wechat: null, contact_phone: null, remark: null, status: 0, created_at: '2026-05-28 16:00:00', matched_at: null, returned_at: null },
  { id: 7, user_id: 2, type: 'clue', item_name: null, description: '在器材室门口的长椅上', image: null, location: '体育馆', location_detail: null, time_description: null, space_description: null, thank_offer: null, custom_thank_offer: null, contact_qq: null, contact_wechat: null, contact_phone: null, remark: null, status: 0, created_at: '2026-05-28 17:30:00', matched_at: null, returned_at: null },
  { id: 8, user_id: 3, type: 'search', item_name: '蓝牙耳机', description: '华为FreeBuds，白色', image: null, location: '大学生活动中心（大活）', location_detail: null, time_description: null, space_description: null, thank_offer: 'song', custom_thank_offer: null, contact_qq: null, contact_wechat: null, contact_phone: null, remark: null, status: 2, created_at: '2026-05-27 14:00:00', matched_at: '2026-05-27 15:00:00', returned_at: '2026-05-27 18:00:00' },
  { id: 9, user_id: 4, type: 'clue', item_name: null, description: '在草坪旁边的石凳上', image: null, location: '大学生活动中心（大活）', location_detail: null, time_description: null, space_description: null, thank_offer: null, custom_thank_offer: null, contact_qq: null, contact_wechat: null, contact_phone: null, remark: null, status: 2, created_at: '2026-05-27 15:30:00', matched_at: '2026-05-27 16:00:00', returned_at: '2026-05-27 18:00:00' },
  { id: 10, user_id: 5, type: 'search', item_name: '笔记本电脑', description: 'MacBook Pro 14寸', image: null, location: 'C栋教学楼', location_detail: null, time_description: null, space_description: null, thank_offer: 'custom', custom_thank_offer: '请你喝一周的奶茶', contact_qq: null, contact_wechat: null, contact_phone: null, remark: '电脑外壳有贴纸，是哈利波特的', status: 2, created_at: '2026-05-26 10:00:00', matched_at: '2026-05-26 11:00:00', returned_at: '2026-05-26 14:00:00' },
  { id: 11, user_id: 1, type: 'clue', item_name: null, description: '最后排的座位上', image: null, location: 'C栋教学楼', location_detail: null, time_description: null, space_description: null, thank_offer: null, custom_thank_offer: null, contact_qq: null, contact_wechat: null, contact_phone: null, remark: null, status: 2, created_at: '2026-05-26 11:45:00', matched_at: '2026-05-26 12:00:00', returned_at: '2026-05-26 14:00:00' }
];

let matches = [];

let nextUserId = 6;
let nextPostId = 12;
let nextMatchId = 1;

export const db = {
  users,
  posts,
  matches,
  nextUserId,
  nextPostId,
  nextMatchId
};

export function addUser(student_id, password, display_id) {
  const user = { id: db.nextUserId++, student_id, password, display_id, created_at: new Date().toISOString().replace('T', ' ').substring(0, 19) };
  db.users.push(user);
  return user;
}

export function getUserByStudentId(student_id) {
  return db.users.find(u => u.student_id === student_id);
}

export function getUserById(id) {
  return db.users.find(u => u.id === id);
}

export function updateUserPassword(id, newPassword) {
  const user = getUserById(id);
  if (user) {
    user.password = newPassword;
    return true;
  }
  return false;
}

export function addPost(user_id, type, item_name, description, image, location, location_detail, time_description, space_description, thank_offer, custom_thank_offer, contact_qq, contact_wechat, contact_phone, remark) {
  const post = {
    id: db.nextPostId++,
    user_id,
    type,
    item_name,
    description,
    image,
    location,
    location_detail,
    time_description,
    space_description,
    thank_offer,
    custom_thank_offer,
    contact_qq,
    contact_wechat,
    contact_phone,
    remark,
    status: 0,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    matched_at: null,
    returned_at: null
  };
  db.posts.push(post);
  return post;
}

export function getPosts(filters) {
  let result = [...db.posts];
  
  if (filters.type) {
    result = result.filter(p => p.type === filters.type);
  }
  if (filters.status !== undefined) {
    result = result.filter(p => p.status === filters.status);
  }
  if (filters.location) {
    result = result.filter(p => p.location === filters.location);
  }
  
  result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;
  
  return {
    posts: result.slice(offset, offset + limit),
    total: result.length
  };
}

export function getPostById(id) {
  return db.posts.find(p => p.id === id);
}

export function getPostsByUserId(user_id) {
  return db.posts.filter(p => p.user_id === user_id);
}

export function updatePostStatus(id, status) {
  const post = getPostById(id);
  if (post) {
    post.status = status;
    if (status === 1) {
      post.matched_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
    } else if (status === 2) {
      post.returned_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }
    return true;
  }
  return false;
}

export function addMatch(clue_post_id, search_post_id, score) {
  const match = {
    id: db.nextMatchId++,
    clue_post_id,
    search_post_id,
    score,
    status: 'pending',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    confirmed_at: null
  };
  db.matches.push(match);
  return match;
}

export function getMatches() {
  return [...db.matches];
}

export function confirmMatch(matchId) {
  const match = db.matches.find(m => m.id === matchId);
  if (match) {
    match.status = 'confirmed';
    match.confirmed_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
    return true;
  }
  return false;
}
