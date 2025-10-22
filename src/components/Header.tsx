'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: '학원소개', href: '/about', icon: '' },
    { name: '상담예약', href: '/consultation', icon: '' },
    { name: '강의영상', href: '/lectures', icon: '' },
    { name: '교육칼럼', href: '/materials', icon: '' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="flex justify-center bg-slate-800 text-white fixed top-0 z-50 h-[70px] w-full px-[5%] lg:px-[10%]">
        <div className="flex justify-between items-center h-full w-full lg:w-[1280px]">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 text-3xl font-bold text-white hover:text-gray-200" onClick={closeMobileMenu}>
              <Image src="/logo.png" alt="마더수학 로고" width={40} height={40} className="object-contain" />
              마더수학
            </Link>
          </div>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-m font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-[#52a9ff]'
                    : 'text-white hover:text-[#52a9ff]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md "
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? (
              // X 아이콘
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // 햄버거 아이콘
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0   z-40 md:hidden"
            onClick={closeMobileMenu}
          />

          {/* 모바일 메뉴 패널 */}
          <nav className="fixed top-[70px] right-0 w-64 h-[calc(100vh-70px)] bg-slate-800 z-40 md:hidden shadow-lg transform transition-transform duration-300">
            <div className="flex flex-col py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`px-6 py-4 text-lg font-medium transition-colors border-b border-slate-700 ${
                    pathname === item.href
                      ? 'text-[#52a9ff] bg-slate-700'
                      : 'text-white hover:text-[#52a9ff] hover:bg-slate-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default Header;