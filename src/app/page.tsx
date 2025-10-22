'use client';

import Image from "next/image";
import Link from "next/link";
import { SlCalender } from "react-icons/sl";
import { LuTvMinimalPlay } from "react-icons/lu";
import { BsGraphUpArrow } from "react-icons/bs";
import { LiaUserCheckSolid } from "react-icons/lia";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { IoStatsChartOutline } from "react-icons/io5";
import { BsFileText } from "react-icons/bs";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaYoutube, FaPhone } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getAnnouncements } from "@/lib/materials";
import type { Material } from "@/types/database";
import FadeUp from "@/components/FadeUp";

const reviews = [
  {
    author: "김*수 학부모",
    content: "선생님의 꼼꼼한 지도 덕분에 아이가 수학에 자신감을 갖게 되었어요. 정말 감사합니다!"
  },
  {
    author: "이*영 학부모",
    content: "개념부터 차근차근 설명해주시니 성적이 많이 향상되었습니다. 추천합니다!"
  },
  {
    author: "윤*원",
    content: "와. 정말 저도 이학원에 다니면서 느낀점은 정말 이학원은 학생을 존중해주고 학생을 사람이 되게 하는 학원인거 같아요. 정말 감동적입니다"
  },
  {
    author: "최*진 학부모",
    content: "1:1 맞춤 지도로 아이의 약점을 정확히 파악하고 보완해주셔서 감사해요."
  },
  {
    author: "박*주",
    content: "수학과 사랑에 빠졌습니다ㅎㅎ 어엿한 이기적 궁뎅이가 되어 시험 성적이 많이 올랐어요^^ 앞으로도 더 많은 것을 배우고 싶습니다~"
  }
];

export default function Home() {
  const [announcements, setAnnouncements] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements(3);
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);
  return (
    <div className="min-h-screen bg-slate-800 w-full">
      {/* Floating Buttons */}
      <div className="fixed right-4 md:right-8 bottom-[25vh] md:bottom-[30vh] z-50 flex flex-col gap-3">
        {/* KakaoTalk Button */}
        <a
          href="https://pf.kakao.com/_xlyxkmxj"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#FEE500] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
          aria-label="카카오톡 상담"
        >
          <RiKakaoTalkFill size={28} className="text-[#3C1E1E]" />
        </a>

        {/* YouTube Button */}
        <a
          href="https://www.youtube.com/@마더수학"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#FF0000] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
          aria-label="유튜브 채널"
        >
          <FaYoutube size={28} className="text-white" />
        </a>

        {/* Phone Button */}
        <a
          href="tel:02-1224-5576"
          className="w-14 h-14 bg-[#026674] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
          aria-label="전화 상담"
        >
          <FaPhone size={24} className="text-white" />
        </a>
      </div>

      {/* Hero Section */}
      <section className=" bg-slate-800 text-white mx-auto h-[80vh] md:pl-[5%] lg:pl-[10%]">
          <div className="hidden md:flex items-center h-full">
            {/* Left Content */}
            <div className="flex-1 space-y-6 md:space-y-10 lg:space-y-16 lg:min-w-[500px]">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  수학의 실력을 넘어,<br />
                  사고력을 키우는 곳
                </h1>
                <h2 className="text-54l md:text-5xl lg:text-7xl font-bold text-white">
                  마더수학
                </h2>
                <p className="text-xl text-gray-300">
                  서울 강서구 초 · 중 · 고 전문 수학학원
                </p>
            </div>
            
            {/* Right Content - Student Image Placeholder */}
            <div className="h-full w-[60%] relative">
                <Image 
                  src="/images/heroSection.png" 
                  alt="heroSectionImage" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-800 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-transparent to-transparent pointer-events-none"></div>
            </div>
        </div>

          <div className="md:hidden relative w-full h-full">
            {/* Background Image */}
            <Image
              src="/images/heroSection.png"
              alt="heroSectionImage"
              fill
              className="object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-[#5d5a5a99] z-10"></div>

            {/* Text Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end pb-[19%] space-y-4 px-[10%]">
                <h1 className="text-2xl font-bold leading-tight text-white">
                  수학의 실력을 넘어,<br />
                  사고력을 키우는 곳
                </h1>
                <h2 className="text-5xl font-bold text-white">
                  마더수학
                </h2>
                <p className="text-lg text-gray-300">
                  서울 강서구 초 · 중 · 고 전문 수학학원
                </p>
            </div>
        </div>
      </section>


      {/* Service Cards Section */}
      <section className="w-full bg-white pb-20 md:pb-60 px-8 md:px-4 relative z-10 ">
          <div className="flex flex-col md:flex-row md:justify-evenly gap-10 items-center md:gap-[4%] lg:gap-[8%] lg:max-w-7xl mx-auto  max-sm:pt-20">
            {/* Card 1 */}
            <FadeUp delay={0}>
              <div className="bg-[#026674] md:mt-[-50px] h-[300px] md:h-[350px]  text-white w-[300px] lg:w-[350px] rounded-lg flex flex-col items-center justify-center space-y-4 shadow-lg">
                 <SlCalender size={50}/>
                  <h3 className="text-xl font-bold">첫 방문 상담예약</h3>

                  <p className="text-l opacity-90">
                    상담시간 : 평일 AM 10:00 ~ PM 22:00
                  </p>
                  <Link href="/consultation" className="mt-[45px] block bg-[#E8D7A2] text-black py-2 px-6 rounded-md text-[16px]">
                    상담 신청
                  </Link>
              </div>
            </FadeUp>

            {/* Card 2 */}
            <FadeUp delay={0.1}>
              <div className="bg-[#026674] md:mt-[-50px] h-[300px] md:h-[350px]  text-white  w-[300px] lg:w-[350px] rounded-lg flex flex-col items-center justify-center space-y-4 shadow-lg">
                 <LuTvMinimalPlay size={50}/>
                  <h3 className="text-xl font-bold">마더수학 원장 직강!</h3>
                  <p className="text-l opacity-90">
                    수업영상, 개념정리 영상 주기적 업로드
                  </p>
                  <Link href="/lectures" className="mt-[45px] block bg-[#E8D7A2] text-black py-2 px-6 rounded-md text-[16px]">
                    강의 보기
                  </Link>
              </div>
            </FadeUp>

            {/* Card 3 */}
            <FadeUp delay={0.2}>
              <div className="bg-[#026674] md:mt-[-50px] h-[300px] md:h-[350px] text-white w-[300px] lg:w-[350px] rounded-lg flex flex-col items-center justify-center space-y-4 shadow-lg">
                 <BsGraphUpArrow size={50}/>
                  <h3 className="text-xl font-bold">원생들 성적 향상 시례</h3>
                  <p className="text-l opacity-90 text-center">
                    마더수학 원생들의 수상소식,<br/> 공부습관, 변화사례 공유
                  </p>
                  <Link href="/materials" className="mt-[45px] block bg-[#E8D7A2] text-black py-2 px-6 rounded-md text-[16px]">
                    사례 보기
                  </Link>
                </div>
            </FadeUp>
          </div>
      </section>

      {/* Features Section */}
      <section className="flex flex-col items-center bg-gray-50 py-20 md:py-30 px-[5%] lg:px-[10%] w-full">
          <FadeUp className="w-full lg:w-[1280px]">
            <h2 className="text-3xl text-start  font-bold text-gray-900 mb-22 ">
              마더수학의 강점
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-y-20  lg:gap-x-[40%] lg:w-[1280px]">
            {/* Feature 1 */}
            <FadeUp delay={0.1}>
              <div className="flex items-start space-x-4">
                  <LiaUserCheckSolid size={50} className="text-[#026674]"/>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1:1 맞춤 지도 시스템</h3>
                  <p className="text-sm text-gray-600">
                    학생 개개인의 학습 수준과 성향에 맞춘 맞춤형 개별 지도
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Feature 2 */}
            <FadeUp delay={0.2}>
              <div className="flex items-start space-x-4">
               <MdOutlineLibraryBooks size={50} className="text-[#026674]"/>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">개념 중심</h3>
                  <p className="text-sm text-gray-600">
                    기초 개념부터 심화 응용까지 단계별 체계적 학습 시스템
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Feature 3 */}
            <FadeUp delay={0.3}>
              <div className="flex items-start space-x-4">
             <BsFileText size={50} className="text-[#026674]"/>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">입학 실력 테스트</h3>
                  <p className="text-sm text-gray-600">
                    시험 대비 자료, 학년별/단원별 PDF 제공
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Feature 4 */}
            <FadeUp delay={0.4}>
              <div className="flex items-start space-x-4">
               <IoStatsChartOutline size={50} className="text-[#026674]"/>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">오랜 지도 전문가 데이터 기반 체계적 관리</h3>
                  <p className="text-sm text-gray-600">
                    학습 데이터 분석을 통한 개인별 성취도 관리 및 성적 향상 전략
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
      </section>

      {/* Announcements & Reviews Section */}
      <section className="flex justify-center bg-white pt-30 pb-40 px-[5%] lg:px-[10%] mx-auto  w-full">
            {/* Announcements */}
           <div className="flex flex-col gap-10 lg:flex-row lg:gap-10 overflow-x-hidden w-full lg:w-[1280px]">
            <FadeUp className="w-full lg:w-1/2 mb-5 lg:mb-0">
              <div className="w-full mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-10">교육칼럼</h2>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-gray-500">교육칼럼을 불러오는 중...</div>
                  ) : announcements.length === 0 ? (
                    <div className="text-gray-500">등록된 교육칼럼이 없습니다.</div>
                  ) : (
                    announcements.map((announcement) => (
                      <Link
                        key={announcement.id}
                        href={`/materials?id=${announcement.id}`}
                        className="flex justify-between items-center border-b border-gray-200 pb-4 hover:bg-gray-50 transition-colors rounded px-2 py-1"
                      >
                        <div>
                        <h3 className="font-medium text-gray-900 text-[15px]">{announcement.title}</h3>
                       </div>
                        <p className='text-[12px] text-gray-500'>더보기</p>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </FadeUp>

            {/* Reviews */}
            <FadeUp delay={0.2} className="w-full lg:w-1/2">
              <div className="mx-auto overflow-x-scroll w-full overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">후기</h2>
                  <div className="flex space-x-4 pb-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg w-[200px] md:w-[252px] flex-shrink-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium">{review.author}</span>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          <span className="text-yellow-400">★★★★★</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
              </div>
            </FadeUp>
            </div>
      </section>
   
    </div>
  );
}
