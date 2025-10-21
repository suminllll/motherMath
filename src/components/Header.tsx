'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  const menuItems = [

    { name: '학원소개', href: '/about', icon: '' },
    { name: '상담예약', href: '/consultation', icon: '' },
    { name: '강의영상', href: '/lectures', icon: '' },
    { name: '교육칼럼', href: '/materials', icon: '' },

  ];

  return (
    <header className="flex justify-center bg-slate-800 text-white fixed top-0 z-50 h-[70px] w-full px-[5%] md:px-[10%] ">
        <div className="flex justify-between items-center h-full lg:w-[1280px]">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold text-white hover:text-gray-200">
              마더수학
            </Link>
          </div>
          
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
        </div>
    </header>
  );
};

export default Header;