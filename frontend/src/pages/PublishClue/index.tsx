import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from 'vant';
import { usePosts } from '../../hooks/usePosts';
import { CAMPUS_LOCATION_CATEGORIES } from '../../types';
import './index.css';

const PublishClue: React.FC = () => {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const [image, setImage] = useState<string>('');
  const [location, setLocation] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [timeDescription, setTimeDescription] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleCategory = (categoryLabel: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryLabel) 
        ? prev.filter(c => c !== categoryLabel)
        : [...prev, categoryLabel]
    );
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      showToast('请选择捡到地点');
      return;
    }

    setIsLoading(true);
    try {
      await createPost({
        type: 'clue',
        location,
        timeDescription: timeDescription.trim() || undefined,
        description,
        image: image || undefined
      });
      showToast('你的线索已发布，谢谢你的善意');
      navigate('/');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '发布失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="publish-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1 className="page-title">发布线索</h1>
        <div className="placeholder"></div>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="file-input"
        onChange={handleFileChange}
      />

      <div className="form-content">
        <div className="form-section">
          <label className="section-title">拍照上传</label>
          <div 
            className="image-upload-area" 
            onClick={handleImageUpload}
          >
            {image ? (
              <div className="image-preview-wrapper">
                <img src={image} alt="预览" className="preview-image" />
                <button className="remove-image-btn" onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}>×</button>
              </div>
            ) : (
              <div className="upload-hint">
                <span className="upload-icon">📸</span>
                <span className="upload-text">点击拍照或上传</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <label className="section-title">捡到地点</label>
          <div className="location-category-container">
            {CAMPUS_LOCATION_CATEGORIES.map((category) => (
              <div key={category.label} className="location-category">
                <button
                  className={`category-header ${expandedCategories.includes(category.label) ? 'expanded' : ''}`}
                  onClick={() => toggleCategory(category.label)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-label">{category.label}</span>
                  <span className="category-arrow">{expandedCategories.includes(category.label) ? '▼' : '▶'}</span>
                </button>
                {expandedCategories.includes(category.label) && (
                  <div className="location-grid">
                    {category.locations.map((loc) => (
                      <button
                        key={loc}
                        className={`location-item ${location === loc ? 'selected' : ''}`}
                        onClick={() => setLocation(loc)}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="section-title">捡到时间（选填）</label>
          <input
            type="text"
            className="form-input"
            placeholder="例如：今天中午12点左右、昨天傍晚6点左右"
            value={timeDescription}
            onChange={(e) => setTimeDescription(e.target.value)}
            maxLength={100}
          />
          <p className="field-tip">提供大致时间有助于缩小寻找范围</p>
        </div>

        <div className="form-section">
          <label className="section-title">补充说明（选填）</label>
          <textarea
            className="description-input"
            placeholder="如：在一楼靠窗的座位上发现的、旁边还有一个蓝色的水杯"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            rows={3}
          />
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? '发布中...' : '发布线索，谢谢你'}
      </button>
    </div>
  );
};

export default PublishClue;
