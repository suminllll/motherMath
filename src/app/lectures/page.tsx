'use client';

import { useState, useEffect } from 'react';
import { getLectures, getLecturesByGrade } from '@/lib/lectures';
import { getActiveGradeOptions, getGradeLabel } from '@/lib/categories';
import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Lectures() {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const { data: lectures = [], isLoading: lecturesLoading } = useQuery({
    queryKey: ['lectures', selectedGrade],
    queryFn: () => selectedGrade ? getLecturesByGrade(selectedGrade):getLectures(),
  });
  
    const { data: gradeOptions = [], isLoading: gradeOptionsLoading } = useQuery({
      queryKey: ['gradeOptions'],
      queryFn: () => getActiveGradeOptions(),
    });

      const loading = gradeOptionsLoading || lecturesLoading;

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsPerPage = isMobile ? 5 : 9; // 모바일: 5개, PC: 9개 (3x3 그리드)



  // 페이지네이션 계산
  const totalPages = Math.ceil(lectures.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLectures = lectures.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // youtu.be/VIDEO_ID 또는 youtube.com/watch?v=VIDEO_ID 형식에서 비디오 ID 추출
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    const videoId = match ? match[1] : null;

    // embed URL로 변환
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-35 pb-20 md:py-50">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
          강의 영상
        </h1>
        <p className="text-center text-gray-600 mb-18">
          체계적인 강의 영상으로 언제든지 복습하세요
        </p>

        <div className="flex justify-end mb-8">
          <div className="w-full md:w-64">
            <label htmlFor="grade" className="block text-right text-sm font-medium text-gray-700 mb-2">
              학년별 필터
            </label>
            <select
              id="grade"
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value)
              setCurrentPage(1)
            }}
              className="w-full text-[14px] text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" >전체 학년</option>
              {gradeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="aspect-video" />
                <div className="p-4 space-y-2">
                  <Skeleton width={64} height={16} />
                  <Skeleton width="75%" height={20} />
                  <Skeleton width="90%" height={14} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentLectures.map((lecture) => {
                return (
                  <div key={lecture.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-video bg-gray-200">
                      <iframe
                        width="100%"
                        height="100%"
                        src={getYouTubeEmbedUrl(lecture.youtube_url)}
                        title={lecture.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full"
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <div className="mb-2">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {lecture.grade.map((g) => (
                            <span key={g} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {getGradeLabel(g)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {lecture.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {lecture.description}
                      </p>

                    </div>
                  </div>
                );
              })}
            </div>

            {lectures.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  해당 조건에 맞는 강의 영상이 없습니다.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    이전
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                        currentPage === page
                          ? 'text-white bg-blue-600 border border-blue-600'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    다음
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}