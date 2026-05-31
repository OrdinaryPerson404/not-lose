import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from 'vant';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';
import { PostStatus, getThankOfferLabel } from '../../types';
import './index.css';

const MatchResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, updatePostStatus } = usePosts();
  const { user } = useAuth();
  const [isConfirming, setIsConfirming] = useState(false);

  const post = posts.find(p => p.id === parseInt(id || '0'));

  const isMyPost = user && post && post.userId === user.displayId;
  const canConfirm = post && post.status === PostStatus.MATCHED && isMyPost;

  const handleConfirm = async () => {
    if (!post || !canConfirm) {
      showToast('您没有权限确认归还');
      return;
    }
    
    setIsConfirming(true);
    try {
      await updatePostStatus(post.id, PostStatus.RETURNED);
      
      const matchedClue = posts.find(
        p => p.type === 'clue' && 
        p.status === PostStatus.MATCHED &&
        p.location === post.location &&
        Math.abs(new Date(p.createdAt).getTime() - new Date(post.createdAt).getTime()) < 24 * 60 * 60 * 1000
      );
      if (matchedClue) {
        await updatePostStatus(matchedClue.id, PostStatus.RETURNED);
      }
      
      showToast('太棒了！又一份善意回家了');
      navigate('/home-wall');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '确认失败');
    } finally {
      setIsConfirming(false);
    }
  };

  if (!post) {
    return (
      <div className="match-page">
        <header className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1 className="page-title">匹配结果</h1>
          <div className="placeholder"></div>
        </header>
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>未找到匹配信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className="match-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1 className="page-title">匹配结果</h1>
        <div className="placeholder"></div>
      </header>

      <div className="match-content">
        <div className="match-card">
          <div className="match-badge">🎉 可能找到了！</div>
          
          {post.image && (
            <div className="match-image">
              <img src={post.image} alt="物品图片" />
            </div>
          )}
          
          <div className="match-info">
            <div className="info-item">
              <span className="info-label">物品</span>
              <span className="info-value">{post.itemName || post.description}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">地点</span>
              <span className="info-value">{post.location}</span>
            </div>
            
            {post.thankOffer && (
              <div className="info-item">
                <span className="info-label">感谢承诺</span>
                <span className="info-value thank-value">
                  {getThankOfferLabel(post.thankOffer, post.customThankOffer)}
                </span>
              </div>
            )}
            
            <div className="info-item">
              <span className="info-label">对方</span>
              <span className="info-value">{post.userId}</span>
            </div>

            {(post.contactQQ || post.contactWechat || post.contactPhone) && (
              <>
                <div className="info-divider"></div>
                <div className="contact-info-match">
                  <div className="contact-label">📞 对方联系方式</div>
                  {post.contactQQ && (
                    <div className="contact-row">
                      <span className="contact-type">QQ</span>
                      <span className="contact-detail">{post.contactQQ}</span>
                    </div>
                  )}
                  {post.contactWechat && (
                    <div className="contact-row">
                      <span className="contact-type">微信</span>
                      <span className="contact-detail">{post.contactWechat}</span>
                    </div>
                  )}
                  {post.contactPhone && (
                    <div className="contact-row">
                      <span className="contact-type">手机</span>
                      <span className="contact-detail">{post.contactPhone}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="match-tips">
            <p>💡 请联系对方确认物品细节，完成交接后点击下方按钮</p>
          </div>

          <div className="safety-section">
            <div className="safety-header">
              <span className="safety-icon">🛡️</span>
              <span className="safety-title">安全交接提示</span>
            </div>
            <div className="safety-list">
              <div className="safety-item">
                <span className="safety-icon-small">📍</span>
                <span>选择人流较多的公共场所</span>
              </div>
              <div className="safety-item">
                <span className="safety-icon-small">👥</span>
                <span>建议结伴而行，互相照应</span>
              </div>
              <div className="safety-item">
                <span className="safety-icon-small">☀️</span>
                <span>白天交接，注意人身安全</span>
              </div>
              <div className="safety-item">
                <span className="safety-icon-small">🔔</span>
                <span>如遇异常，及时联系学校保卫处</span>
              </div>
            </div>
          </div>

          {!isMyPost ? (
            <div className="permission-error">
              <span className="error-icon">⚠️</span>
              <span className="error-text">这是其他用户的寻物启事，您无法确认归还</span>
            </div>
          ) : !canConfirm ? (
            <div className="status-info">
              <span className="info-icon">ℹ️</span>
              <span className="info-text">请等待对方确认物品细节后再确认归还</span>
            </div>
          ) : (
            <button className="confirm-btn" onClick={handleConfirm} disabled={isConfirming}>
              {isConfirming ? '确认中...' : '确认归还，传递温暖'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchResult;
