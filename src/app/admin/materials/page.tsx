'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '@/lib/materials';
import type { Material } from '@/types/database';
import 'react-quill-new/dist/quill.snow.css';

// React Quill을 dynamic import로 불러오기 (SSR 방지)
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    contents: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Failed to load materials:', error);
      alert('자료 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, formData);
        alert('자료가 수정되었습니다.');
      } else {
        await createMaterial(formData);
        alert('새 자료가 추가되었습니다.');
      }
      
      await loadMaterials(); // 목록 새로고침
      closeModal();
    } catch (error) {
      console.error('Failed to save material:', error);
      alert('자료 저장에 실패했습니다.');
    }
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      contents: material.contents || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 자료를 삭제하시겠습니까?')) {
      try {
        await deleteMaterial(id);
        alert('자료가 삭제되었습니다.');
        await loadMaterials(); // 목록 새로고침
      } catch (error) {
        console.error('Failed to delete material:', error);
        alert('자료 삭제에 실패했습니다.');
      }
    }
  };

  const openAddModal = () => {
    setEditingMaterial(null);
    setFormData({ title: '', contents: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMaterial(null);
    setFormData({ title: '', contents: '' });
  };

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
      (_match, attributes) => {
        // width, height 속성 제거
        const newAttributes = attributes
          .replace(/\s*width="[^"]*"/gi, '')
          .replace(/\s*height="[^"]*"/gi, '')
          .replace(/\s*style="[^"]*"/gi, '');

        // 반응형 스타일 추가
        return `<img${newAttributes} style="max-width: 100%; height: auto; display: block; margin: 0 auto;">`;
      }
    );
  };

  // Quill 모듈 설정 (이미지 업로드 핸들러 포함)
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  // 이미지 업로드 핸들러
  function imageHandler(this: { quill: { getSelection: (focus?: boolean) => { index: number; length: number }; insertEmbed: (index: number, type: string, value: string) => void; setSelection: (index: number) => void } }) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();

        // Quill 에디터에 이미지 삽입
        const quill = this.quill;
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', result.url);
        quill.setSelection(range.index + 1);
      } catch (error) {
        console.error('Upload error:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    };
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-35 pb-20 md:py-38">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">교육칼럼 관리</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            새 자료 추가
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">자료 목록을 불러오는 중...</p>
          </div>
        ) : (
          <>
          <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
            {/* 헤더 */}
            <div className="bg-gray-50 grid grid-cols-[minmax(100px,1fr)_100px_100px] md:grid-cols-[60px_1fr_120px_120px_120px] border-b border-gray-300 h-15 items-center text-[14px] text-black font-medium overflow-x-auto">
              <div className="hidden md:block px-6 py-3 text-left">No</div>
              <div className="pl-4 pr-2 md:px-6 py-3 text-left md:text-center">제목</div>
              <div className="hidden md:block px-6 py-3 text-left">작성자</div>
              <div className="pl-2 pr-4 md:px-6 py-3 text-right md:text-left">날짜</div>
              <div className="pl-2 pr-4 md:px-6 py-3 text-left">관리</div>
            </div>

            {/* 본문 */}
            <div className="divide-y divide-gray-200 overflow-x-auto">
              {currentMaterials.map((material, index) => {
                const isExpanded = expandedItem === material.id;
                return (
                  <div key={material.id} id={`material-${material.id}`}>
                    {/* 행 */}
                    <div className="grid grid-cols-[minmax(100px,1fr)_100px_100px] md:grid-cols-[60px_1fr_120px_120px_120px] hover:bg-gray-50 transition-colors items-center">
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
                      <div className="pl-2 pr-4 md:px-6 py-4 text-sm font-medium flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(material)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(material.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          삭제
                        </button>
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

            {materials.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">등록된 자료가 없습니다.</p>
              </div>
            )}
          </div>

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

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border shadow-lg rounded-md bg-white w-[70%]">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingMaterial ? '자료 수정' : '새 자료 추가'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    내용
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={formData.contents}
                    onChange={(content) => setFormData({ ...formData, contents: content })}
                    modules={modules}
                    formats={formats}
                    className="bg-white"
                    style={{ height: '400px', marginBottom: '50px' }}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    {editingMaterial ? '수정' : '추가'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}