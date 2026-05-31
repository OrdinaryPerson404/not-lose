import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import { PostStatus, getStatusLabel, formatTimeAgo, getStatusTagClass } from '../../types';
import './index.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { posts } = usePosts();

  const myPosts = posts.filter(p => p.userId === user?.displayId);
  
  const STALE_DAYS = 3;
  const staleThreshold = new Date();
  staleThreshold.setDate(staleThreshold.getDate() - STALE_DAYS);
  
  const stalePosts = myPosts.filter(p => 
    p.status === PostStatus.PENDING && 
    new Date(p.createdAt) < staleThreshold
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1 className="page-title">我的</h1>
        <div className="placeholder"></div>
      </header>

      <div className="profile-card">
        <div className="avatar">👤</div>
        <div className="user-info">
          <h2 className="user-name">{user?.displayId}</h2>
          <p className="user-label">南航同学</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>退出登录</button>
      </div>

      <div className="section">
        <div className="section-header">
          <h3 className="section-title">我的发布</h3>
          <span className="section-count">{myPosts.length}</span>
        </div>
        
        {myPosts.length === 0 ? (
          <div className="empty-section">
            <span className="empty-icon">📝</span>
            <p>还没有发布过信息</p>
            <button className="empty-action" onClick={() => navigate('/publish/clue')}>
              发布线索
            </button>
          </div>
        ) : (
          <>
            {stalePosts.length > 0 && (
              <div className="care-section">
                <div className="care-header">
                  <span className="care-icon">💙</span>
                  <span className="care-title">还在努力寻找中</span>
                </div>
                <p className="care-message">
                  别担心，我们一直在帮忙留意。还有 <strong>{stalePosts.length}</strong> 件物品正在寻找主人。
                </p>
                <div className="care-tips">
                  <div className="care-tip">
                    <span className="tip-icon">💡</span>
                    <span className="tip-text">补充更多物品细节会增加找回几率</span>
                  </div>
                  <div className="care-tip">
                    <span className="tip-icon">🤝</span>
                    <span className="tip-text">告诉身边同学，一起帮忙寻找</span>
                  </div>
                  <div className="care-tip">
                    <span className="tip-icon">🔄</span>
                    <span className="tip-text">持续关注，也许好运就在下一秒</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="my-posts">
              {myPosts.map((post) => (
                <div key={post.id} className="my-post-item">
                  <div className="post-content">
                    <span className="post-icon">{post.type === 'clue' ? '🔍' : '🔎'}</span>
                    <span className="post-text">{post.itemName || post.description}</span>
                  </div>
                  <div className="post-meta">
                    <span className={`tag ${getStatusTagClass(post.status)}`}>
                      {getStatusLabel(post.status)}
                    </span>
                    <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <h3 className="section-title">我的归还</h3>
          <span className="section-count">
            {myPosts.filter(p => p.status === PostStatus.RETURNED).length}
          </span>
        </div>
        
        <div className="return-stats">
          <div className="return-item">
            <span className="return-icon">🎁</span>
            <span className="return-text">帮助 {myPosts.filter(p => p.type === 'clue' && p.status === PostStatus.RETURNED).length} 件物品回家</span>
          </div>
          <div className="return-item">
            <span className="return-icon">💝</span>
            <span className="return-text">找回 {myPosts.filter(p => p.type === 'search' && p.status === PostStatus.RETURNED).length} 件物品</span>
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-text">首页</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/home-wall')}>
          <span className="nav-icon">🏆</span>
          <span className="nav-text">已回家</span>
        </button>
        <button className="nav-item active" onClick={() => navigate('/profile')}>
          <span className="nav-icon">👤</span>
          <span className="nav-text">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default Profile;
