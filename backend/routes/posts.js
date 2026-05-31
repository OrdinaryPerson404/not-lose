import { Router } from 'express';
import { addPost, getPosts, getPostById, getPostsByUserId, updatePostStatus, addMatch, getUserById } from '../database.js';

const router = Router();

router.get('/', (req, res) => {
  const { type, status, location, page = 1, limit = 20 } = req.query;
  
  const filters = {
    type: type || undefined,
    status: status !== undefined ? parseInt(status) : undefined,
    location: location || undefined,
    page: parseInt(page),
    limit: parseInt(limit)
  };
  
  const result = getPosts(filters);
  
  res.json({
    success: true,
    posts: result.posts.map(p => {
      const user = getUserById(p.user_id);
      return {
        id: p.id,
        type: p.type,
        userId: user?.display_id || 'unknown',
        itemName: p.item_name,
        description: p.description,
        image: p.image,
        location: p.location,
        locationDetail: p.location_detail,
        timeDescription: p.time_description,
        spaceDescription: p.space_description,
        thankOffer: p.thank_offer,
        customThankOffer: p.custom_thank_offer,
        contactQQ: p.contact_qq,
        contactWechat: p.contact_wechat,
        contactPhone: p.contact_phone,
        remark: p.remark,
        status: p.status,
        createdAt: p.created_at,
        matchedAt: p.matched_at,
        returnedAt: p.returned_at
      };
    }),
    total: result.total,
    page: parseInt(page),
    limit: parseInt(limit)
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const post = getPostById(parseInt(id));
  
  if (!post) {
    return res.status(404).json({ success: false, message: '帖子不存在' });
  }
  
  const user = getUserById(post.user_id);
  
  res.json({
    success: true,
    post: {
      id: post.id,
      type: post.type,
      userId: user?.display_id || 'unknown',
      itemName: post.item_name,
      description: post.description,
      image: post.image,
      location: post.location,
      locationDetail: post.location_detail,
      timeDescription: post.time_description,
      spaceDescription: post.space_description,
      thankOffer: post.thank_offer,
      customThankOffer: post.custom_thank_offer,
      contactQQ: post.contact_qq,
      contactWechat: post.contact_wechat,
      contactPhone: post.contact_phone,
      remark: post.remark,
      status: post.status,
      createdAt: post.created_at,
      matchedAt: post.matched_at,
      returnedAt: post.returned_at
    }
  });
});

router.post('/', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: '请先登录' });
  }
  
  const token = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString();
  const userId = parseInt(token.split(':')[0]);
  
  const { type, itemName, description, image, location, locationDetail, timeDescription, spaceDescription, thankOffer, customThankOffer, contactQQ, contactWechat, contactPhone, remark } = req.body;
  
  if (!type || !location) {
    return res.status(400).json({ success: false, message: '请填写必要信息' });
  }
  
  if (type === 'search' && !itemName) {
    return res.status(400).json({ success: false, message: '请填写物品名称' });
  }
  
  const newPost = addPost(userId, type, itemName || null, description || null, image || null, location, locationDetail || null, timeDescription || null, spaceDescription || null, thankOffer || null, customThankOffer || null, contactQQ || null, contactWechat || null, contactPhone || null, remark || null);
  
  const matchResult = checkForMatch(newPost.id, type, itemName, location);
  
  const user = getUserById(userId);
  
  res.json({
    success: true,
    message: matchResult ? '发布成功，可能找到了匹配！' : '发布成功，谢谢你的善意',
    post: {
      id: newPost.id,
      type: newPost.type,
      userId: user?.display_id || 'unknown',
      itemName: newPost.item_name,
      description: newPost.description,
      image: newPost.image,
      location: newPost.location,
      locationDetail: newPost.location_detail,
      timeDescription: newPost.time_description,
      spaceDescription: newPost.space_description,
      thankOffer: newPost.thank_offer,
      customThankOffer: newPost.custom_thank_offer,
      contactQQ: newPost.contact_qq,
      contactWechat: newPost.contact_wechat,
      contactPhone: newPost.contact_phone,
      remark: newPost.remark,
      status: newPost.status,
      createdAt: newPost.created_at
    },
    matchResult
  });
});

router.put('/:id/status', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: '请先登录' });
  }
  
  const { id } = req.params;
  const { status } = req.body;
  
  const post = getPostById(parseInt(id));
  
  if (!post) {
    return res.status(404).json({ success: false, message: '帖子不存在' });
  }
  
  updatePostStatus(parseInt(id), status);
  
  const updatedPost = getPostById(parseInt(id));
  const user = getUserById(updatedPost.user_id);
  
  res.json({
    success: true,
    message: status === 2 ? '太棒了！又一份善意回家了' : '状态已更新',
    post: {
      id: updatedPost.id,
      type: updatedPost.type,
      userId: user?.display_id || 'unknown',
      itemName: updatedPost.item_name,
      description: updatedPost.description,
      image: updatedPost.image,
      location: updatedPost.location,
      locationDetail: updatedPost.location_detail,
      timeDescription: updatedPost.time_description,
      spaceDescription: updatedPost.space_description,
      thankOffer: updatedPost.thank_offer,
      customThankOffer: updatedPost.custom_thank_offer,
      contactQQ: updatedPost.contact_qq,
      contactWechat: updatedPost.contact_wechat,
      contactPhone: updatedPost.contact_phone,
      remark: updatedPost.remark,
      status: updatedPost.status,
      createdAt: updatedPost.created_at,
      matchedAt: updatedPost.matched_at,
      returnedAt: updatedPost.returned_at
    }
  });
});

router.get('/user/my', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: '请先登录' });
  }
  
  const token = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString();
  const userId = parseInt(token.split(':')[0]);
  
  const posts = getPostsByUserId(userId);
  
  res.json({
    success: true,
    posts: posts.map(p => {
      const user = getUserById(p.user_id);
      return {
        id: p.id,
        type: p.type,
        userId: user?.display_id || 'unknown',
        itemName: p.item_name,
        description: p.description,
        image: p.image,
        location: p.location,
        locationDetail: p.location_detail,
        timeDescription: p.time_description,
        spaceDescription: p.space_description,
        thankOffer: p.thank_offer,
        customThankOffer: p.custom_thank_offer,
        contactQQ: p.contact_qq,
        contactWechat: p.contact_wechat,
        contactPhone: p.contact_phone,
        remark: p.remark,
        status: p.status,
        createdAt: p.created_at,
        matchedAt: p.matched_at,
        returnedAt: p.returned_at
      };
    })
  });
});

function checkForMatch(postId, postType, itemName, location) {
  const allPosts = getPosts({}).posts;
  
  if (postType === 'clue') {
    const searchPosts = allPosts.filter(p => p.type === 'search' && p.status === 0 && p.location === location);
    
    for (const searchPost of searchPosts) {
      if (itemName && searchPost.item_name) {
        const matchScore = calculateMatchScore(itemName, searchPost.item_name, location, location);
        if (matchScore >= 60) {
          updatePostStatus(postId, 1);
          updatePostStatus(searchPost.id, 1);
          
          addMatch(postId, searchPost.id, matchScore);
          
          const searchUser = getUserById(searchPost.user_id);
          return {
            matchedPostId: searchPost.id,
            matchedUserId: searchUser?.display_id || 'unknown',
            thankOffer: searchPost.thank_offer,
            score: matchScore
          };
        }
      }
    }
  } else if (postType === 'search' && itemName) {
    const cluePosts = allPosts.filter(p => p.type === 'clue' && p.status === 0 && p.location === location);
    
    for (const cluePost of cluePosts) {
      const matchScore = calculateMatchScore(itemName, cluePost.description || '', location, location);
      if (matchScore >= 60) {
        updatePostStatus(postId, 1);
        updatePostStatus(cluePost.id, 1);
        
        addMatch(cluePost.id, postId, matchScore);
        
        const clueUser = getUserById(cluePost.user_id);
        return {
          matchedPostId: cluePost.id,
          matchedUserId: clueUser?.display_id || 'unknown',
          score: matchScore
        };
      }
    }
  }
  
  return null;
}

function calculateMatchScore(item1, item2, loc1, loc2) {
  let score = 0;
  
  const itemKeywords1 = item1.toLowerCase().split(/[\s,，、]/).filter(Boolean);
  const itemKeywords2 = item2.toLowerCase().split(/[\s,，、]/).filter(Boolean);
  
  let matchCount = 0;
  for (const kw1 of itemKeywords1) {
    for (const kw2 of itemKeywords2) {
      if (kw1.includes(kw2) || kw2.includes(kw1)) {
        matchCount++;
      }
    }
  }
  
  const maxKeywords = Math.max(itemKeywords1.length, itemKeywords2.length);
  if (maxKeywords > 0) {
    score += (matchCount / maxKeywords) * 40;
  }
  
  if (loc1 === loc2) {
    score += 40;
  } else if (loc1.includes(loc2) || loc2.includes(loc1)) {
    score += 20;
  }
  
  score += 20;
  
  return Math.min(100, score);
}

export default router;
