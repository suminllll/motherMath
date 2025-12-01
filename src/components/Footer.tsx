const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-8 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-sm text-gray-300 mb-1">
              서울특별시 강서구 서울 강서구 강서로50길 72 4층
                          </p>
            <p className="text-sm text-gray-300">
              연락처 : 02-3662-0747
            </p>
          </div>
          <a
            href="http://pf.kakao.com/_xojspn"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e8d7a2] text-black px-8 py-3 rounded-md font-medium  transition-colors inline-flex items-center"
          >
            카카오톡 상담
          </a>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700 ">
          <p className="text-gray-400 text-xs">
            © 2020 마더수학. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;