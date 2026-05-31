import React from 'react';
import { CAMPUS_LOCATIONS } from '../types';
import './FilterBar.css';

interface FilterBarProps {
  activeStatus: number | undefined;
  activeLocation: string;
  onStatusChange: (status: number | undefined) => void;
  onLocationChange: (location: string) => void;
}

const statusOptions = [
  { text: '全部', value: undefined },
  { text: '待匹配', value: 0 },
  { text: '匹配中', value: 1 },
  { text: '已回家', value: 2 }
];

const FilterBar: React.FC<FilterBarProps> = ({
  activeStatus,
  activeLocation,
  onStatusChange,
  onLocationChange
}) => {
  const [showLocationPicker, setShowLocationPicker] = React.useState(false);

  return (
    <div className="filter-bar">
      <div className="filter-status">
        {statusOptions.map(option => (
          <button
            key={String(option.value)}
            className={`filter-status-btn ${activeStatus === option.value ? 'active' : ''}`}
            onClick={() => onStatusChange(option.value)}
          >
            {option.text}
          </button>
        ))}
      </div>
      
      <button 
        className="filter-location-btn"
        onClick={() => setShowLocationPicker(true)}
      >
        <span>{activeLocation || '全部地点'}</span>
        <span className="arrow">▼</span>
      </button>
      
      {showLocationPicker && (
        <div className="location-overlay" onClick={() => setShowLocationPicker(false)}>
          <div className="location-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">选择地点</span>
              <button className="modal-close" onClick={() => setShowLocationPicker(false)}>×</button>
            </div>
            <div className="location-list">
              <button
                className={`location-option ${!activeLocation ? 'selected' : ''}`}
                onClick={() => {
                  onLocationChange('');
                  setShowLocationPicker(false);
                }}
              >
                全部地点
              </button>
              {CAMPUS_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  className={`location-option ${activeLocation === loc ? 'selected' : ''}`}
                  onClick={() => {
                    onLocationChange(loc);
                    setShowLocationPicker(false);
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
