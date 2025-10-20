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
import { useState, useEffect } from "react";
import { getAnnouncements } from "@/lib/materials";
import type { Material } from "@/types/database";

export default function Home() {
  const [announcements, setAnnouncements] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements(5);
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
    <div className="min-h-screen bg-slate-800">
      {/* Hero Section */}
      <section className=" bg-slate-800 text-white mx-auto h-[80vh]">
          <div className="flex items-center h-full">
            {/* Left Content */}
            <div className="flex-1 space-y-4 pl-[10%]">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  수학의 실력을 넘어,<br />
                  사고력을 키우는 곳
                </h1>
                <h2 className="text-6xl lg:text-7xl font-bold text-white">
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
      </section>

      {/* Service Cards Section */}
      <section className="w-full bg-white pb-30 px-4 relative z-10 ">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-[70px]">
            {/* Card 1 */}
            <div className="bg-[#026674] mt-[-50px] text-white w-[350px] rounded-lg flex flex-col items-center justify-center space-y-4 shadow-lg">
               <SlCalender size={50}/>
                <h3 className="text-xl font-bold">첫 방문 상담예약</h3>
               
                <p className="text-l opacity-90">
                  상담시간 : 평일 AM 10:00 ~ PM 22:00
                </p>
                <Link href="/consultation" className="mt-[45px] block bg-[#E8D7A2] text-black py-2 px-6 rounded-md text-[16px]">
                  상담 신청
                </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-[#026674] mt-[-50px] text-white w-[350px] rounded-lg flex flex-col items-center justify-center space-y-4 shadow-lg">
               <LuTvMinimalPlay size={50}/>
                <h3 className="text-xl font-bold">마더수학 원장 직강!</h3>
                <p className="text-l opacity-90">
                  수업영상, 개념정리 영상 주기적 업로드
                </p>
                <Link href="/about" className="mt-[45px] block bg-[#E8D7A2] text-black py-2 px-6 rounded-md text-[16px]">
                  강의 보기
                </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-[#026674] mt-[-50px] h-[350px] text-white w-[350px] rounded-lg flex flex-col items-center justify-center space-y-4 shadow-lg">
               <BsGraphUpArrow size={50}/>
                <h3 className="text-xl font-bold">원생들 성적 향상 시례</h3>
                <p className="text-l opacity-90 text-center">
                  마더수학 원생들의 수상소식,<br/> 공부습관, 변화사례 공유
                </p>
                <Link href="/materials" className="mt-[45px] block bg-[#E8D7A2] text-black py-2 px-6 rounded-md text-[16px]">
                  사례 보기
                </Link>
              </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-30 px-[10%]">
          <h2 className="text-3xl font-bold text-gray-900 mb-22 ">
            마더수학의 강점
          </h2>
          
          <div className="grid md:grid-cols-2 gap-15">
            {/* Feature 1 */}
            <div className="flex items-start space-x-4">
                <LiaUserCheckSolid size={50} className="text-[#026674]"/>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1:1 맞춤 지도 시스템</h3>
                <p className="text-sm text-gray-600">
                  학생 개개인의 학습 수준과 성향에 맞춘 맞춤형 개별 지도
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start space-x-4">
             <MdOutlineLibraryBooks size={50} className="text-[#026674]"/>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">개념 중심</h3>
                <p className="text-sm text-gray-600">
                  기초 개념부터 심화 응용까지 단계별 체계적 학습 시스템
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start space-x-4">
           <BsFileText size={50} className="text-[#026674]"/>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">입학 실력 테스트</h3>
                <p className="text-sm text-gray-600">
                  시험 대비 자료, 학년별/단원별 PDF 제공
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start space-x-4">
             <IoStatsChartOutline size={50} className="text-[#026674]"/>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">오랜 지도 전문가 데이터 기반 체계적 관리</h3>
                <p className="text-sm text-gray-600">
                  학습 데이터 분석을 통한 개인별 성취도 관리 및 성적 향상 전략
                </p>
              </div>
            </div>
          </div>
      </section>

      {/* Announcements & Reviews Section */}
      <section className="bg-white pt-30 pb-40 px-[10%] mx-auto grid lg:grid-cols-2 gap-12">
            {/* Announcements */}
            <div>
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
                      <p className='text-[12px]'>더보기</p>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">후기</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {/* Review 1 */}
                  <div className="bg-gray-50 p-6 rounded-lg min-w-[300px] flex-shrink-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium">김민수 학부모</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      <span className="text-yellow-400">★★★★★</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      선생님의 꼼꼼한 지도 덕분에<br />
                      아이가 수학에 자신감을 갖게 되었어요.<br />
                      정말 감사합니다!
                    </p>
                  </div>

                  {/* Review 2 */}
                  <div className="bg-gray-50 p-6 rounded-lg min-w-[300px] flex-shrink-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium">이서영 학부모</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      <span className="text-yellow-400">★★★★★</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      개념부터 차근차근 설명해주시니<br />
                      성적이 많이 향상되었습니다.<br />
                      추천합니다!
                    </p>
                  </div>

                  {/* Review 3 */}
                  <div className="bg-gray-50 p-6 rounded-lg min-w-[300px] flex-shrink-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium">박준호 학부모</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      <span className="text-yellow-400">★★★★★</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      아이가 수학을 좋아하게 되었어요.<br />
                      선생님의 열정적인 수업에<br />
                      정말 만족합니다.
                    </p>
                  </div>

                  {/* Review 4 */}
                  <div className="bg-gray-50 p-6 rounded-lg min-w-[300px] flex-shrink-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium">최수진 학부모</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      <span className="text-yellow-400">★★★★★</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      1:1 맞춤 지도로<br />
                      아이의 약점을 정확히 파악하고<br />
                      보완해주셔서 감사해요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
      </section>

   
    </div>
  );
}
