'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getMaterials, searchMaterials } from '@/lib/materials';
import type { Material } from '@/types/database';

function MaterialsContent() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title'); // 'title' or 'content'
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const searchParams = useSearchParams();

  useEffect(() => {
    loadMaterials();
  }, []);

  // URL 파라미터에서 ID 확인하고 해당 아코디언 열기
  useEffect(() => {
    const id = searchParams.get('id');
    if (id && materials.length > 0) {
      const targetMaterial = materials.find(material => material.id === id);
      if (targetMaterial) {
        setExpandedItem(id);
        // 스크롤을 해당 요소로 이동
        setTimeout(() => {
          const element = document.getElementById(`material-${id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [searchParams, materials]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Failed to load materials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterMaterials = async () => {
      try {
        setLoading(true);
        let data: Material[];

        if (searchTerm) {
          data = await searchMaterials(searchTerm, searchType as 'title' | 'content');
        } else {
          data = await getMaterials();
        }

        setMaterials(data);
      } catch (error) {
        console.error('Failed to filter materials:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(filterMaterials, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchType]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(materials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMaterials = materials.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleExpanded = (materialId: string) => {
    if (expandedItem === materialId) {
      setExpandedItem(null);
    } else {
      setExpandedItem(materialId);
    }
  };

  // 이미지 크기 조절을 위한 HTML 처리 함수
  const processHtmlContent = (html: string) => {
    // img 태그의 width와 height 속성 제거하고 style 속성 수정
    return html.replace(
      /<img([^>]*?)>/g,
      (match, attributes) => {
        // width, height 속성 제거
        let newAttributes = attributes
          .replace(/\s*width="[^"]*"/gi, '')
          .replace(/\s*height="[^"]*"/gi, '')
          .replace(/\s*style="[^"]*"/gi, '');

        // 반응형 스타일 추가
        return `<img${newAttributes} style="max-width: 100%; height: auto; display: block; margin: 0 auto;">`;
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-35 pb-20 md:py-50">
      <div className="max-w-6xl mx-auto px-4 md:px-10">
        
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10 md:mb-18">
          교육 칼럼
        </h1>
       

        <div className="flex justify-end mb-5">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full md:w-80">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-3 py-2 border-none outline-none  text-gray-700 cursor-pointer text-sm"
              >
                <option value="title" >제목</option>
                <option value="content">내용</option>
              </select>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 text-black px-3 py-2 border-none outline-none placeholder-gray-500 text-sm"
                placeholder="검색어를 입력하세요"
              />
              <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">자료를 불러오는 중...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
              {/* 헤더 */}
              <div className="bg-gray-50 grid grid-cols-[minmax(100px,1fr)_100px] md:grid-cols-[60px_1fr_120px_120px] border-b border-gray-300 h-15 items-center text-[14px] text-black font-medium overflow-x-auto">
                <div className="hidden md:block px-6 py-3 text-left">No</div>
                <div className="pl-4 pr-2 md:px-6 py-3 text-left md:text-center">제목</div>
                <div className="hidden md:block px-6 py-3 text-left">작성자</div>
                <div className="pl-2 pr-4 md:px-6 py-3 text-right md:text-left">날짜</div>
              </div>

              {/* 본문 */}
              <div className="divide-y divide-gray-200 overflow-x-auto">
                {currentMaterials.map((material, index) => {
                  const isExpanded = expandedItem === material.id;
                  return (
                    <div key={material.id} id={`material-${material.id}`}>
                      {/* 행 */}
                      <div className="grid grid-cols-[minmax(100px,1fr)_100px] md:grid-cols-[60px_1fr_120px_120px] hover:bg-gray-50 transition-colors items-center">
                        <div className="hidden md:block px-6 py-4 text-sm text-gray-900">
                          {startIndex + index + 1}
                        </div>
                        <div className="pl-4 pr-2 md:px-6 py-4 text-black text-[14px] min-w-0 overflow-hidden">
                          <button
                            onClick={() => toggleExpanded(material.id)}
                            className="hover:text-slate-800 transition-colors cursor-pointer text-left w-full block overflow-hidden text-ellipsis whitespace-nowrap"
                          >
                            {material.title}
                          </button>
                        </div>
                        <div className="hidden md:block px-6 py-4 text-sm text-gray-900 flex-shrink-0">
                          마더수학
                        </div>
                        <div className="pl-2 pr-4 md:px-6 py-4 text-sm text-gray-500 text-right md:text-left flex-shrink-0">
                          {new Date(material.created_at).toLocaleDateString('ko-KR', {
                            year: '2-digit',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </div>
                      </div>

                      {/* 확장된 내용 */}
                      {isExpanded && (
                        <div className="bg-gray-50 px-3 py-4 md:px-6">
                          {material.contents && (
                            <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
                              <div
                                className="text-sm text-gray-700 prose prose-sm w-full max-w-full break-words"
                                dangerouslySetInnerHTML={{
                                  __html: processHtmlContent(material.contents)
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {materials.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  검색 조건에 맞는 자료가 없습니다.
                </p>
              </div>
            )}

         
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
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

        <div className="mt-20 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            교육 칼럼 이용 안내
          </h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• 모든 자료는 마더수학 학원에서 직접 제작한 교육 자료입니다.</li>
            <li>• 자료는 개인 학습 목적으로만 사용 가능하며, 무단 배포를 금지합니다.</li>
            <li>• 새로운 자료가 정기적으로 업데이트됩니다.</li>
            <li>• 자료 이용 중 문의사항이 있으시면 언제든 연락 주세요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Materials() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-50 flex items-center justify-center"><p className="text-gray-500 text-lg">로딩 중...</p></div>}>
      <MaterialsContent />
    </Suspense>
  );
}