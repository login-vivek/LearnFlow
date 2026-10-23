import React from 'react';
import { getInitials } from '../../utils/helpers';

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

export default function Avatar({ name = '', src = '', size = 'md', className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-primary-600 text-white font-semibold flex items-center justify-center flex-shrink-0 select-none ${className}`}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
