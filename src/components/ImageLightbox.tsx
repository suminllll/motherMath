'use client';

import Image from 'next/image';
import { useEffect } from 'react';

interface ImageLightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

const ImageLightbox = ({ src, alt = '확대 이미지', onClose }: ImageLightboxProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-full h-full p-4">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default ImageLightbox;
