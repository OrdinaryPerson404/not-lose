import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from 'vant';
import { usePosts } from '../../hooks/usePosts';
import { CAMPUS_LOCATION_CATEGORIES, THANK_OFFERS } from '../../types';
import './index.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

const PublishSearch: React.FC = () => {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [timeDescription, setTimeDescription] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [remark, setRemark] = useState('');
  const [thankOffer, setThankOffer] = useState('');
  const [customThankOffer, setCustomThankOffer] = useState('');
  const [contactQQ, setContactQQ] = useState('');
  const [contactWechat, setContactWechat] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [image, setImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState('');
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

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return '不支持的图片格式，请上传 JPG、PNG、GIF 或 WEBP 格式的图片';
    }
    if (file.size > MAX_FILE_SIZE) {
      return '图片大小不能超过 5MB，请选择更小的图片';
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      setUploadProgress('error');
      showToast(error);
      return;
    }

    setUploadProgress('uploading');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImage(result);
      setUploadProgress('success');
      showToast('图片上传成功');
    };
    reader.onerror = () => {
      setUploadError('图片读取失败，请重试');
      setUploadProgress('error');
      showToast('图片上传失败');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage('');
    setUploadProgress('idle');
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!itemName.trim()) {
      showToast('请输入物品名称');
      return;
    }
    if (!location) {
      showToast('请选择丢失地点');
      return;
    }
    if (!thankOffer) {
      showToast('请选择感谢承诺');
      return;
    }
    if (thankOffer === 'custom' && !customThankOffer.trim()) {
      showToast('请输入您的个性化心意');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createPost({
        type: 'search',
        itemName: itemName.trim(),
        location,
        timeDescription: timeDescription.trim() || undefined,
        spaceDescription: spaceDescription.trim() || undefined,
        remark: remark.trim() || undefined,
        thankOffer,
        customThankOffer: thankOffer === 'custom' ? customThankOffer.trim() : undefined,
        contactQQ: contactQQ.trim() || undefined,
        contactWechat: contactWechat.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        image: image || undefined
      });
      
      if (result.matchResult) {
        showToast('可能找到了！有人正在等你');
        navigate(`/match/${result.post.id}`);
      } else {
        showToast('发布成功，别担心，会找到的');
        navigate('/');
      }
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
        <h1 className="page-title">发布寻物</h1>
        <div className="placeholder"></div>
      </header>

      <div className="form-content">
        <div className="form-section">
          <label className="section-title">物品名称</label>
          <input
            type="text"
            className="form-input"
            placeholder="如：黑色U盘、红色水杯、宿舍钥匙"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        <div className="form-section">
          <label className="section-title">上传物品照片（选填）</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="file-input"
            onChange={handleFileChange}
          />
          <div 
            className={`image-upload-area ${uploadProgress}`}
            onClick={handleImageUpload}
          >
            {image ? (
              <div className="image-preview-wrapper">
                <img src={image} alt="预览" className="preview-image" />
                <button className="remove-image-btn" onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}>×</button>
                {uploadProgress === 'uploading' && (
                  <div className="upload-overlay">
                    <div className="upload-spinner">上传中...</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="upload-hint">
                <span className="upload-icon">📷</span>
                <span className="upload-text">
                  {uploadError || '点击上传清晰照片'}
                </span>
                <span className="upload-tip">支持 JPG、PNG，最大 5MB</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <label className="section-title">丢失地点</label>
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
          <label className="section-title">时间描述（选填）</label>
          <input
            type="text"
            className="form-input"
            placeholder="例如：昨天下午3点左右、今天早上8:30左右"
            value={timeDescription}
            onChange={(e) => setTimeDescription(e.target.value)}
            maxLength={100}
          />
          <p className="field-tip">提供丢失的大致时间有助于缩小寻找范围</p>
        </div>

        <div className="form-section">
          <label className="section-title">空间描述（选填）</label>
          <input
            type="text"
            className="form-input"
            placeholder="例如：图书馆三楼靠窗座位、食堂二楼左侧窗口"
            value={spaceDescription}
            onChange={(e) => setSpaceDescription(e.target.value)}
            maxLength={100}
          />
          <p className="field-tip">提供更具体的位置描述帮助拾获者回忆</p>
        </div>

        <div className="form-section">
          <label className="section-title">备注信息（选填）</label>
          <textarea
            className="form-textarea"
            placeholder="例如：钥匙扣上有蓝色小挂件、U盘里有重要学习资料"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            maxLength={200}
            rows={3}
          />
          <p className="field-tip">详细描述有助于失物认领时核实身份</p>
        </div>

        <div className="form-section">
          <label className="section-title">感谢承诺</label>
          <div className="thank-offer-grid">
            {THANK_OFFERS.map((offer) => (
              <button
                key={offer.value}
                className={`thank-offer-item ${thankOffer === offer.value ? 'selected' : ''}`}
                onClick={() => setThankOffer(offer.value)}
              >
                <span className="offer-icon">{offer.icon}</span>
                <span className="offer-label">{offer.label}</span>
              </button>
            ))}
          </div>
          {thankOffer === 'custom' && (
            <div className="custom-thank-offer-input">
              <label className="custom-label">输入您的心意</label>
              <input
                type="text"
                className="form-input"
                placeholder="例如：帮你取一周的快递、带你逛校园、教你打游戏..."
                value={customThankOffer}
                onChange={(e) => setCustomThankOffer(e.target.value)}
                maxLength={50}
              />
              <span className="char-counter">{customThankOffer.length}/50</span>
            </div>
          )}
        </div>

        <div className="form-section">
          <label className="section-title">联系方式（选填，仅在匹配成功后显示）</label>
          <div className="contact-inputs">
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <input
                type="text"
                className="form-input"
                placeholder="QQ号码"
                value={contactQQ}
                onChange={(e) => setContactQQ(e.target.value)}
                maxLength={20}
              />
            </div>
            <div className="contact-item">
              <span className="contact-icon">💬</span>
              <input
                type="text"
                className="form-input"
                placeholder="微信号码"
                value={contactWechat}
                onChange={(e) => setContactWechat(e.target.value)}
                maxLength={30}
              />
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <input
                type="tel"
                className="form-input"
                placeholder="手机号码"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                maxLength={11}
              />
            </div>
          </div>
          <p className="contact-tip">
            至少填写一种联系方式，方便拾获者快速联系您
          </p>
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? '发布中...' : '发布寻物，别担心'}
      </button>
    </div>
  );
};

export default PublishSearch;
