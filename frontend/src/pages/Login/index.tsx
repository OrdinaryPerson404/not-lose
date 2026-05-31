import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from 'vant';
import { useAuth } from '../../hooks/useAuth';
import './index.css';

const TEST_ACCOUNTS = [
  { id: '25201732', role: '失主', desc: '丢失了物品', icon: '😢' },
  { id: '25201845', role: '捡到者', desc: '捡到物品', icon: '😊' },
  { id: '25201901', role: '测试用户', desc: '通用账号', icon: '🙂' }
];

const Login: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!studentId.trim()) {
      showToast('请输入学号');
      return;
    }
    if (!password.trim()) {
      showToast('请输入密码');
      return;
    }

    setIsLoading(true);
    try {
      await login(studentId.trim(), password.trim());
      showToast('欢迎回来，南航同学');
      navigate('/');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (account: typeof TEST_ACCOUNTS[0]) => {
    setStudentId(account.id);
    setPassword(account.id);
    showToast(`${account.icon} 已填入${account.role}账号`);
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <div className="logo-wrapper">
          <div className="logo">✈️</div>
          <div className="logo-accent">🏫</div>
        </div>
        <div className="brand-section">
          <h1 className="title">不丢</h1>
          <div className="subtitle">NCHU Lost & Found</div>
        </div>
        <p className="slogan">在南航，没有东西会真的走丢。</p>
        <div className="school-badge">
          <span className="badge-icon">🎓</span>
          <span className="badge-text">南昌航空大学</span>
        </div>
      </div>
      
      <div className="login-form">
        <div className={`form-item ${focusedField === 'studentId' ? 'focused' : ''}`}>
          <label className="form-label">
            <span className="label-icon">📝</span>
            <span>学号</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="请输入学号"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onFocus={() => setFocusedField('studentId')}
            onBlur={() => setFocusedField(null)}
            maxLength={8}
          />
          <div className="input-highlight"></div>
        </div>
        
        <div className={`form-item ${focusedField === 'password' ? 'focused' : ''}`}>
          <label className="form-label">
            <span className="label-icon">🔐</span>
            <span>密码</span>
          </label>
          <input
            type="password"
            className="form-input"
            placeholder="初始密码为学号"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            maxLength={20}
          />
          <div className="input-highlight"></div>
        </div>
        
        <button className="login-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <span className="loading-indicator">
              <span className="spinner"></span>
              <span>登录中...</span>
            </span>
          ) : (
            '登 录'
          )}
        </button>
        
        <div className="quick-login-section">
          <div className="quick-login-header">
            <span className="header-line"></span>
            <span className="header-text">快速体验</span>
            <span className="header-line"></span>
          </div>
          <div className="quick-login-buttons">
            {TEST_ACCOUNTS.map((account) => (
              <button
                key={account.id}
                className="quick-login-btn"
                onClick={() => handleQuickLogin(account)}
              >
                <span className="btn-icon">{account.icon}</span>
                <span className="btn-id">{account.id}</span>
                <span className="btn-role">{account.role}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="test-account">
          <div className="account-label">
            <span className="label-dot"></span>
            <span>提示</span>
          </div>
          <p className="account-hint">初始密码为学号本身，可演示双向互动</p>
        </div>
      </div>
    </div>
  );
};

export default Login;