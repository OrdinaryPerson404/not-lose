declare module 'vant' {
  import { Component } from 'react';

  interface PopupProps {
    show?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    round?: boolean;
    onClickOverlay?: () => void;
    children?: React.ReactNode;
  }

  interface PickerProps {
    columns?: Array<{ text: string; value: string }>;
    defaultValue?: string;
    onConfirm?: (value: string) => void;
    onCancel?: () => void;
    children?: React.ReactNode;
  }

  export const Popup: React.FC<PopupProps>;
  export const Picker: React.FC<PickerProps>;
  export const showToast: (message: string | { message: string; duration?: number }) => void;
  export const showDialog: (options: {
    title?: string;
    message?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }) => Promise<void>;
}
