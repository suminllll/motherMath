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

  return (
    <div className="min-h-screen bg-gray-50 py-50">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-18">
          교육 칼럼
        </h1>
       

        <div className="flex justify-end mb-5">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-80">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-3 py-2 border-none outline-none  text-gray-700 cursor-pointer text-sm"
              >
                <option value="title">제목</option>
                <option value="content">내용</option>
              </select>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 text-black px-3 py-2 border-none outline-none placeholder-gray-500 text-sm"
                placeholder="검색어를 입력하세요"
              />
              <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors">
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
              <table className="w-full">
                <thead className="bg-gray-50 h-15 text-[14px] text-black">
                  <tr>
                    <th className="px-6 py-3 text-left  tracking-wider w-16">
                      No
                    </th>
                    <th className="px-6 py-3 text-center tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-3 text-left  tracking-wider w-32">
                      작성자
                    </th>
                    <th className="px-6 py-3 text-left  tracking-wider w-32">
                      날짜
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentMaterials.map((material, index) => {
                    const isExpanded = expandedItem === material.id;
                    return (
                      <React.Fragment key={material.id}>
                        <tr id={`material-${material.id}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-black text-[14px]">
                            <button
                              onClick={() => toggleExpanded(material.id)}
                              className="hover:text-slate-800 transition-colors"
                            >
                              {material.title}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            마더수학
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(material.created_at).toLocaleDateString('ko-KR')}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={4} className="py-4 bg-gray-50">
                              <div className="pl-[calc(4rem+1.5rem)] pr-6">
                                {material.contents && (
                                  <div className="max-h-[70vh] overflow-y-auto">
                                    <div 
                                      className="text-sm text-gray-700 prose prose-sm max-w-none"
                                      dangerouslySetInnerHTML={{ 
                                        __html: material.contents 
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
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
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
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
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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