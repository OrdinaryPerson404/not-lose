import React from 'react';
import { Popup, Picker } from 'vant';
import { CAMPUS_LOCATIONS, CampusLocation } from '../types';
import './LocationPicker.css';

interface LocationPickerProps {
  visible: boolean;
  value: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  visible,
  value,
  onConfirm,
  onCancel
}) => {
  const columns = CAMPUS_LOCATIONS.map(loc => ({ text: loc, value: loc }));

  return (
    <Popup
      show={visible}
      position="bottom"
      round
      onClick-overlay={onCancel}
    >
      <Picker
        columns={columns}
        defaultValue={value as CampusLocation}
        onConfirm={(selectedValue: string) => onConfirm(selectedValue)}
        onCancel={onCancel}
      />
    </Popup>
  );
};

export default LocationPicker;
