'use client'

import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative h-96 mb-20">
        <Image
          src="/images/about/lectureRoom.png"
          alt="마더수학 강의실"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0000008a] bg-opacity-40 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center">
            학원 소개
          </h1>
        </div>
      </div>
      
      <div className="pt-30 pb-50 w-full px-[20%]">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
               학원 비전과 목표
              </h2>
                <p className="text-gray-600 leading-relaxed mb-19 text-[18px]">
                마더수학은 단순히 문제를 푸는 기술만 가르치는 곳이 아닙니다. <br/> 아이들이 수학을 즐기고 스스로 이해하며 자신감을 키울 수 있는 공간을 만드는 것을 최우선으로 생각합니다.
              </p>
              <div className="flex flex-col gap-10">
                 <div className="flex gap-6">
                <p className='text-[60px] text-[#52a9ff]'>01</p>
                <div className="">
                  <h3 className="text-2xl  font-semibold text-gray-800 mb-2">아이 중심의 맞춤형 학습</h3>
                  <p className="text-gray-600 text-[18px]">
                    각 아이의 학습 수준과 성향에 맞춘 개별 맞춤 지도로, 학습에 대한 부담은 줄이고 흥미와 성취감은 높입니다.<br/> 기초가 부족한 아이는 탄탄하게, 실력을 확장하고 싶은 아이는 도전할 수 있도록 세심하게 지도합니다.
                  </p>
                </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-6">
                <p className='text-[60px] text-[#52a9ff]'>02</p>
                <div>
                  <h3 className="text-2xl  font-semibold text-gray-800 mb-2">체계적인 커리큘럼과 전문 강사진</h3>
                  <p className="text-gray-600 text-[18px]">
                   오랜 경험을 가진 전문 강사진이 아이들의 이해도를 세심하게 관찰하며, 단계별로 실력을 쌓아가는 체계적인 커리큘럼을 제공합니다. 단순 암기가 아닌 논리적 사고와 문제 해결력을 함께 키워, 학교 시험은 물론 수학적 사고 능력까지 확장됩니다.
                  </p>
                </div></div></div>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-6">
                <p className='text-[60px] text-[#52a9ff]'>03</p>
                <div className="">
                  <h3 className="text-2xl  font-semibold text-gray-800 mb-2">즐겁게 배우는 학습 환경</h3>
                  <p className="text-gray-600 text-[18px]">
                    마더수학은 편안하고 따뜻한 학습 분위기 속에서 아이들이 마음껏 질문하고, 함께 토론하며 배우는 곳입니다. <br/>학부모님께서는 아이가 학원에서 돌아올 때마다 수학이 즐거워졌다는 이야기를 듣게 되실 거예요.
                  </p>
                </div></div></div>
                      <div className="flex flex-col gap-6">
                  <div className="flex gap-6">
                <p className='text-[60px] text-[#52a9ff]'>04</p>
                <div className="">
                  <h3 className="text-2xl  font-semibold text-gray-800 mb-2">
학부모와 함께하는 소통</h3>
                  <p className="text-gray-600 text-[18px]">
                    아이의 학습 과정과 성취를 정기적으로 공유하고, 필요에 따라 맞춤형 학습 상담을 제공합니다.<br/> 학부모님과 함께 아이의 성장을 지켜보는 동반자가 되는 것이 저희의 목표입니다.
                  </p>
                </div></div></div>
                <p className='text-black my-10 text-[18px] font-bold'>
                  마더수학에서 아이의 수학 자신감과 잠재력을 최대치로 끌어올리세요.<br/> 
지금 바로 상담 예약을 통해 우리 아이에게 맞는 학습 계획을 만나보실 수 있습니다.
                </p>
              </div>
            </section>

            <section className="mt-40 mb-20">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
               마더수학 내부 시설
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { src: '/images/about/inside1.jpeg', alt: '마더수학 내부 시설 1' },
                  { src: '/images/about/inside2.jpeg', alt: '마더수학 내부 시설 2' },
                  { src: '/images/about/inside3.jpeg', alt: '마더수학 내부 시설 3' },
                  { src: '/images/about/inside4.jpeg', alt: '마더수학 내부 시설 4' },
                  { src: '/images/about/inside5.jpeg', alt: '마더수학 내부 시설 5' },
                  { src: '/images/about/inside6.jpeg', alt: '마더수학 내부 시설 6' },
                  { src: '/images/about/inside7.jpeg', alt: '마더수학 내부 시설 7' }
                ].map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-lg shadow-md">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={400}
                      height={256}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
              </section>

              <section className="mt-60 mb-60">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
               수업 정보
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">운영 시간</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>평일: 14:00 - 22:00</li>
                      <li>토요일: 10:00 - 18:00</li>
                      <li>일요일: 휴무</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">대상</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>초등학교 1학년 ~ 고등학교 1학년</li>
                      <li>수학 기초가 부족한 학생</li>
                      <li>심화 학습을 원하는 학생</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-40 mb-20">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                학원 위치
              </h2>
              <div className="bg-gray-100 p-8 rounded-lg mb-10">
                  <div className="w-full h-130 rounded-lg overflow-hidden mb-10">
                <iframe
                  src="https://kko.kakao.com/35y8sS3cwR"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="마더수학 학원 위치"
                />
              </div>
                <p className="text-gray-700 mb-2">
                  <strong>주소:</strong> 서울 강서구 강서로50길 72 4층
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>전화:</strong> 02-3662-0747
                </p>
                <p className="text-gray-600 text-sm">
                  - 우장산 힐스테이트 정문 방향 130동 맞은편 원통형건물 4층 <br/>
- 5번 버스 롯데2차 정류장 하차 후 신세계 아파트 상가 4층 
                </p>
              </div>
            
            </section>
          </div>
      </div>
    </div>
  );
}