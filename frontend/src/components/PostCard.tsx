import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../types';
import { getStatusLabel, getStatusTagClass, formatTimeAgo, getThankOfferLabel } from '../types';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/post/${post.id}`);
    }
  };

  return (
    <div className="post-card" onClick={handleClick}>
      <div className="post-card-left">
        {post.image ? (
          <div className="post-card-thumb">
            <img src={post.image} alt="物品缩略图" />
          </div>
        ) : (
          <div className="post-card-thumb-placeholder">
            <span className="placeholder-icon">{post.type === 'clue' ? '🔍' : '🔎'}</span>
          </div>
        )}
      </div>
      
      <div className="post-card-right">
        <div className="post-card-header">
          <div className={`tag ${getStatusTagClass(post.status)}`}>
            {getStatusLabel(post.status)}
          </div>
          <div className="post-card-location">
            <span className="location-icon">📍</span>
            {post.location}
          </div>
        </div>
        
        <div className="post-card-title">
          {post.type === 'clue' ? post.description : post.itemName}
        </div>
        
        <div className="post-card-footer">
          <span className="post-card-user">{post.userId}</span>
          <span className="post-card-time">{formatTimeAgo(post.createdAt)}</span>
        </div>
        
        {post.thankOffer && (
          <div className="post-card-thank">
            <span className="thank-value">{getThankOfferLabel(post.thankOffer, post.customThankOffer)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;