'use client';

import { useEffect, useRef, useState } from 'react';

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  immediate?: boolean; // 스크롤 감지 없이 즉시 애니메이션 실행
}

export default function FadeUp({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  immediate = false
}: FadeUpProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // immediate 모드면 바로 애니메이션 시작
    if (immediate) {
      // 다음 프레임에서 애니메이션 시작 (transition이 동작하도록)
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return;
    }

    // 스크롤 감지 모드
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [immediate]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
