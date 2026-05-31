import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack, rightContent }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        {showBack && (
          <button className="header-back-btn" onClick={() => navigate(-1)}>
            ←
          </button>
        )}
      </div>
      <h1 className="header-title">{title || '不丢'}</h1>
      <div className="header-right">
        {rightContent}
      </div>
    </header>
  );
};

export default Header;
