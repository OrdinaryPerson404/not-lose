import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import FilterBar from '../../components/FilterBar';
import PostCard from '../../components/PostCard';
import './index.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { posts, isLoading, filters, setFilters } = usePosts();
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredPosts = posts.filter(post => {
    if (!searchKeyword.trim()) return true;
    const keyword = searchKeyword.toLowerCase();
    const itemName = (post.itemName || '').toLowerCase();
    const description = (post.description || '').toLowerCase();
    return itemName.includes(keyword) || description.includes(keyword);
  });

  const returnedCount = posts.filter(p => p.status === 2).length;
  const matchedCount = posts.filter(p => p.status === 1).length;

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <div className="logo-container">
            <span className="logo">🏫</span>
            <span className="brand">不丢</span>
          </div>
          <p className="slogan">在南航，没有东西会真的走丢。</p>
        </div>
      </header>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="搜索物品：校园卡、U盘、钥匙..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        {searchKeyword && (
          <button className="search-clear" onClick={() => setSearchKeyword('')}>
            ×
          </button>
        )}
      </div>

      <div className="action-hint">
        <span className="hint-text">
          <span className="hint-icon">✨</span>
          已帮助 {returnedCount} 件物品回家，正在帮助 {matchedCount} 件物品寻找主人
        </span>
      </div>

      <div className="action-buttons">
        <button className="action-btn clue-btn" onClick={() => navigate('/publish/clue')}>
          <span className="btn-icon">🤝</span>
          <span className="btn-text">我捡到了</span>
          <span className="btn-subtext">帮助失主</span>
        </button>
        <button className="action-btn search-btn" onClick={() => navigate('/publish/search')}>
          <span className="btn-icon">🔍</span>
          <span className="btn-text">我丢了</span>
          <span className="btn-subtext">寻找失物</span>
        </button>
      </div>

      <FilterBar
        activeStatus={filters.status}
        activeLocation={filters.location || ''}
        onStatusChange={(status) => setFilters({ status })}
        onLocationChange={(location) => setFilters({ location })}
      />

      <div className="posts-container">
        {isLoading ? (
          <div className="loading">加载中...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>{searchKeyword ? '没有找到相关物品' : '还没有相关信息'}</p>
            {!searchKeyword && (
              <button className="empty-btn" onClick={() => navigate('/publish/clue')}>
                发布第一条线索
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      <nav className="bottom-nav">
        <button className="nav-item active" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-text">首页</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/home-wall')}>
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

export default Home;