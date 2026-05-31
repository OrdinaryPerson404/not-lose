import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { PostStatus, formatTimeAgo, getThankOfferLabel } from '../../types';
import './index.css';

const HomeWall: React.FC = () => {
  const navigate = useNavigate();
  const { posts } = usePosts();

  const returnedPosts = posts.filter(p => p.status === PostStatus.RETURNED);
  const returnRate = Math.round(returnedPosts.length / Math.max(posts.length, 1) * 100);

  return (
    <div className="home-wall-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1 className="page-title">已回家墙</h1>
        <div className="placeholder"></div>
      </header>

      <div className="wall-header">
        <div className="wall-hero">
          <div className="wall-icon-wrapper">
            <span className="wall-icon">🏆</span>
            <div className="icon-glow"></div>
          </div>
          <div className="wall-title-group">
            <h2 className="wall-title">善意的勋章墙</h2>
            <p className="wall-subtitle">每一份善意都值得被看见</p>
          </div>
        </div>
      </div>

      <div className="wall-stats">
        <div className="stat-card stat-primary">
          <div className="stat-badge">
            <span className="badge-icon">✨</span>
          </div>
          <span className="stat-value">{returnedPosts.length}</span>
          <span className="stat-label">件物品回家</span>
        </div>
        
        <div className="stat-card">
          <div className="stat-badge">
            <span className="badge-icon">📦</span>
          </div>
          <span className="stat-value">{posts.length}</span>
          <span className="stat-label">总发布</span>
        </div>
        
        <div className="stat-card stat-accent">
          <div className="stat-badge">
            <span className="badge-icon">💚</span>
          </div>
          <span className="stat-value">{returnRate}%</span>
          <span className="stat-label">归还率</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${returnRate}%` }}></div>
          </div>
        </div>
      </div>

      <div className="section-title">
        <span className="title-icon">🎖️</span>
        <span>温暖故事</span>
      </div>

      <div className="posts-container">
        {returnedPosts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🌱</span>
            <p>还没有成功归还的案例</p>
            <p className="empty-hint">成为第一个让物品回家的人吧！</p>
            <button className="empty-btn" onClick={() => navigate('/publish/clue')}>
              发布线索
            </button>
          </div>
        ) : (
          returnedPosts.map((post, index) => (
            <div key={post.id} className="returned-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card-medal">
                <span className="medal-icon">🏅</span>
              </div>
              <div className="card-body">
                <div className="card-header">
                  <span className="card-title">{post.itemName || post.description}</span>
                  <span className="card-badge">已归还</span>
                </div>
                <div className="card-journey">
                  <div className="journey-point">
                    <span className="point-icon">📍</span>
                    <span className="point-text">{post.location}</span>
                  </div>
                  <div className="journey-line">
                    <span className="line-icon">→</span>
                  </div>
                  <div className="journey-point">
                    <span className="point-icon">🏠</span>
                    <span className="point-text">{post.userId}</span>
                  </div>
                </div>
                {post.thankOffer && (
                  <div className="card-thank">
                    <span className="thank-icon">💝</span>
                    <span className="thank-value">{getThankOfferLabel(post.thankOffer)}</span>
                  </div>
                )}
                <div className="card-footer">
                  <span className="footer-time">{formatTimeAgo(post.returnedAt || post.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-text">首页</span>
        </button>
        <button className="nav-item active" onClick={() => navigate('/home-wall')}>
          <span className="nav-icon">🏆</span>
          <span className="nav-text">已回家</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/profile')}>
          <span className="nav-icon">👤</span>
          <span className="nav-text">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default HomeWall;