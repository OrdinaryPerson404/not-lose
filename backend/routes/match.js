import { Router } from 'express';
import { getMatches, confirmMatch, updatePostStatus } from '../database.js';

const router = Router();

router.get('/', (req, res) => {
  const matches = getMatches();
  
  res.json({
    success: true,
    matches: matches.map(m => ({
      id: m.id,
      score: m.score,
      status: m.status,
      createdAt: m.created_at,
      confirmedAt: m.confirmed_at
    }))
  });
});

router.post('/confirm', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: '请先登录' });
  }
  
  const { matchId } = req.body;
  
  if (!matchId) {
    return res.status(400).json({ success: false, message: '请提供匹配ID' });
  }
  
  const matches = getMatches();
  const match = matches.find(m => m.id === matchId);
  
  if (!match) {
    return res.status(404).json({ success: false, message: '匹配不存在' });
  }
  
  confirmMatch(matchId);
  
  updatePostStatus(match.clue_post_id, 2);
  updatePostStatus(match.search_post_id, 2);
  
  res.json({
    success: true,
    message: '太棒了！又一份善意回家了'
  });
});

export default router;
