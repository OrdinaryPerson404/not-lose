import { Router } from 'express';
import { getUserByStudentId, getUserById, updateUserPassword } from '../database.js';

const router = Router();

router.post('/login', (req, res) => {
  const { studentId, password } = req.body;
  
  if (!studentId || !password) {
    return res.status(400).json({ success: false, message: '请输入学号和密码' });
  }
  
  const user = getUserByStudentId(studentId);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: '学号或密码错误' });
  }
  
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      studentId: user.student_id,
      displayId: user.display_id,
      createdAt: user.created_at
    }
  });
});

router.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: '请先登录' });
  }
  
  const token = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString();
  const userId = parseInt(token.split(':')[0]);
  
  const user = getUserById(userId);
  
  if (!user) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }
  
  res.json({
    success: true,
    user: {
      id: user.id,
      studentId: user.student_id,
      displayId: user.display_id,
      createdAt: user.created_at
    }
  });
});

router.put('/password', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: '请先登录' });
  }
  
  const token = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString();
  const userId = parseInt(token.split(':')[0]);
  const { oldPassword, newPassword } = req.body;
  
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: '请输入旧密码和新密码' });
  }
  
  const user = getUserById(userId);
  
  if (!user || user.password !== oldPassword) {
    return res.status(401).json({ success: false, message: '旧密码错误' });
  }
  
  updateUserPassword(userId, newPassword);
  
  res.json({ success: true, message: '密码修改成功' });
});

export default router;
