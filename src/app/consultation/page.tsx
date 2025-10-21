'use client';

export default function Consultation() {


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-35 pb-10 md:py-50">
      <div className="max-w-2xl w-full">
        {/* 상단 타이틀 */}
        <div className="text-center mb-8">
      
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-20">
            상담예약
          </h1>
         
        </div>

        {/* 카카오톡 카드 */}
        <div className="bg-[#FAE100] rounded-3xl p-8 md:p-12 shadow-2xl text-center">
          {/* 카카오톡 로고 */}
          <div className="flex flex-col items-center mb-8">
      
            <div className="text-4xl  text-gray-900">
              <span className="text-gray-900">Kakao</span>
              <span className="font-bold">Talk</span>
            </div>
          </div>

          {/* 채팅 상담 버튼 */}
         <a href="http://pf.kakao.com/_qaxnen" target="_blank" rel="noopener noreferrer" className="hidden md:block bg-[#3C3035] rounded-full text-[#FAE100] px-10 py-5 mb-5 text-2xl">
            카카오톡채널 채팅상담/문의하기
          </a>
            <a href="http://pf.kakao.com/_qaxnen" target="_blank" rel="noopener noreferrer" className="block md:hidden bg-[#3C3035] rounded-full text-[#FAE100] px-10 py-5 mb-5 text-2xl">
            카카오톡채널 <br/>채팅상담/문의하기
          </a>

          {/* 상담 시간 */}
          <div className="text-center my-8">
            <p className="text-gray-900 font-bold text-lg">
              상담시간 : 평일 14시~22시
            </p>
          </div>

        </div>

        {/* 하단 안내 */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            카카오톡 상담 안내
          </h3>
          <ul className="text-gray-700 text-sm space-y-2">
            <li>• 카카오톡 채널을 통해 실시간으로 상담받으실 수 있습니다.</li>
            <li>• 상담 시간 내에 문의하시면 빠르게 답변드립니다.</li>
            <li>• 상담 시간 외 문의는 익일 순차적으로 답변드립니다.</li>
          </ul>
        </div>

        {/* 전화 상담 */}
        <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            전화 상담
          </h3>
          <a href="tel:+0236620747" className="text-blue-800 text-lg font-bold">  📞 02-3662-0747</a>

          <p className="text-blue-700 text-sm mt-2">
            전화 상담도 가능합니다. (평일 14:00 ~ 22:00)
          </p>
        </div>
      </div>
    </div>
  );
}
