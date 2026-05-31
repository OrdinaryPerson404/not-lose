import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showToast, showDialog } from 'vant';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';
import { PostStatus, formatTimeAgo, getThankOfferLabel, getStatusLabel, getStatusTagClass } from '../../types';
import './index.css';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, updatePostStatus } = usePosts();
  const { user } = useAuth();
  const [isConfirming, setIsConfirming] = useState(false);

  const post = posts.find(p => p.id === parseInt(id || '0'));

  const handleClaim = async () => {
    if (!post) return;
    
    showDialog({
      title: '认领物品',
      message: '请简单描述物品特征以确认这是您的物品（如：品牌、颜色、特殊标记等）',
      confirmButtonText: '确认认领',
      cancelButtonText: '取消'
    }).then(() => {
      if (post.status === PostStatus.PENDING) {
        updatePostStatus(post.id, PostStatus.MATCHED);
        showToast('认领成功！请联系对方交接物品');
      }
    }).catch(() => {
      showToast('已取消认领');
    });
  };

  const handleConfirmReturn = async () => {
    if (!post) return;
    
    setIsConfirming(true);
    try {
      await updatePostStatus(post.id, PostStatus.RETURNED);
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
      <div className="detail-page">
        <header className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1 className="page-title">物品详情</h1>
          <div className="placeholder"></div>
        </header>
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>未找到物品信息</p>
        </div>
      </div>
    );
  }

  const isMyPost = post.userId === user?.displayId;
  const canClaim = post.status === PostStatus.PENDING && post.type === 'clue' && !isMyPost;
  const canConfirmReturn = post.status === PostStatus.MATCHED && isMyPost && post.type === 'search';

  return (
    <div className="detail-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1 className="page-title">物品详情</h1>
        <div className="placeholder"></div>
      </header>

      <div className="detail-content">
        {post.image && (
          <div className="detail-image">
            <img src={post.image} alt="物品图片" />
          </div>
        )}

        <div className="detail-card">
          <div className={`status-tag ${getStatusTagClass(post.status)}`}>
            {post.type === 'clue' ? '🔍' : '🔎'} {getStatusLabel(post.status)}
          </div>

          <div className="detail-info">
            <div className="info-row">
              <span className="info-label">物品</span>
              <span className="info-value">{post.itemName || post.description || '未知物品'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">地点</span>
              <span className="info-value">📍 {post.location}</span>
            </div>

            {post.description && (
              <div className="info-row">
                <span className="info-label">描述</span>
                <span className="info-value desc">{post.description}</span>
              </div>
            )}

            {post.timeDescription && (
              <div className="info-row">
                <span className="info-label">丢失时间</span>
                <span className="info-value">🕐 {post.timeDescription}</span>
              </div>
            )}

            {post.spaceDescription && (
              <div className="info-row">
                <span className="info-label">丢失地点</span>
                <span className="info-value">📍 {post.spaceDescription}</span>
              </div>
            )}

            {post.remark && (
              <div className="info-row">
                <span className="info-label">备注</span>
                <span className="info-value desc">{post.remark}</span>
              </div>
            )}

            {post.thankOffer && (
              <div className="info-row">
                <span className="info-label">感谢承诺</span>
                <span className="info-value thank">{getThankOfferLabel(post.thankOffer, post.customThankOffer)}</span>
              </div>
            )}

            <div className="info-row">
              <span className="info-label">发布者</span>
              <span className="info-value user">{post.userId}</span>
            </div>

            <div className="info-row">
              <span className="info-label">时间</span>
              <span className="info-value">{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>

          {canConfirmReturn && (
            <div className="contact-section">
              <div className="contact-title">💡 联系方式</div>
              <div className="contact-info">
                <p>对方学号：<strong>{post.userId}</strong></p>
                {post.contactQQ && (
                  <p>QQ：<strong>{post.contactQQ}</strong></p>
                )}
                {post.contactWechat && (
                  <p>微信：<strong>{post.contactWechat}</strong></p>
                )}
                {post.contactPhone && (
                  <p>手机：<strong>{post.contactPhone}</strong></p>
                )}
                {post.remark && (
                  <p>备注：<strong>{post.remark}</strong></p>
                )}
                <p className="contact-tip">请通过以上联系方式与对方约定交接时间和地点</p>
              </div>
            </div>
          )}

          {canConfirmReturn && (
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
              </div>
            </div>
          )}

          <div className="action-buttons">
            {post.status === PostStatus.PENDING && post.type === 'clue' && isMyPost && (
              <div className="status-hint">
                <span className="hint-icon">⏳</span>
                <span className="hint-text">等待失主认领，请保持联系方式畅通</span>
              </div>
            )}

            {post.status === PostStatus.MATCHED && post.type === 'clue' && isMyPost && (
              <div className="status-hint">
                <span className="hint-icon">🤝</span>
                <span className="hint-text">失主已认领，等待交接完成</span>
              </div>
            )}

            {post.status === PostStatus.MATCHED && post.type === 'clue' && !isMyPost && (
              <div className="status-hint">
                <span className="hint-icon">📞</span>
                <span className="hint-text">您已认领此物品，请联系对方交接</span>
              </div>
            )}

            {canClaim && (
              <button className="action-btn claim-btn" onClick={handleClaim}>
                这是我的！
              </button>
            )}

            {canConfirmReturn && (
              <button 
                className="action-btn confirm-btn" 
                onClick={handleConfirmReturn}
                disabled={isConfirming}
              >
                {isConfirming ? '确认中...' : '确认归还'}
              </button>
            )}

            {post.status === PostStatus.RETURNED && (
              <div className="returned-badge">
                ✅ 此物品已成功归还
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;