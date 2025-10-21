'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '@/lib/materials';
import type { Material } from '@/types/database';

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    contents: ''
  });
  const editorRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [uploading, setUploading] = useState(false);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
      
      // 이미지 HTML을 에디터에 삽입
      const imageHtml = `<img src="${result.url}" alt="이미지" style="max-width: 100%; height: auto;" />`;
      setFormData(prev => ({
        ...prev,
        contents: prev.contents + imageHtml
      }));
      
      // 에디터 내용 업데이트
      if (editorRef.current) {
        editorRef.current.innerHTML = formData.contents + imageHtml;
      }

      alert('이미지가 업로드되었습니다.');
    } catch (error) {
      console.error('Upload error:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

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
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
            <table className="w-full">
              <thead className="bg-gray-50 h-15 text-[14px] text-black">
                <tr>
                  <th className="px-6 py-3 text-left tracking-wider w-16">
                    No
                  </th>
                  <th className="px-6 py-3 text-center tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left tracking-wider w-32">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left tracking-wider w-32">
                    날짜
                  </th>
                  <th className="px-6 py-3 text-left tracking-wider w-32">
                    관리
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
                            className="hover:text-slate-800 transition-colors text-left cursor-pointer"
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(material)}
                            className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(material.id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="py-4 bg-gray-50">
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
                  <div className="border border-gray-300 rounded-md">
                    {/* 툴바 */}
                    <div className="flex gap-2 p-2 bg-gray-50 border-b border-gray-300 flex-wrap">
                      <button
                        type="button"
                        onClick={() => document.execCommand('bold')}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold cursor-pointer"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('italic')}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 italic cursor-pointer"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('underline')}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 underline cursor-pointer"
                      >
                        U
                      </button>
                      <div className="border-l border-gray-300 mx-1"></div>
                      <button
                        type="button"
                        onClick={() => document.execCommand('insertOrderedList')}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        1.
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('insertUnorderedList')}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        •
                      </button>
                      <div className="border-l border-gray-300 mx-1"></div>
                      <label className="px-3 py-1 text-sm bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600 cursor-pointer">
                        {uploading ? '업로드 중...' : '이미지'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {/* 에디터 */}
                    <div
                      ref={editorRef}
                      contentEditable
                      className="min-h-[200px] p-3 text-black focus:outline-none"
                      dangerouslySetInnerHTML={{ __html: formData.contents }}
                      onInput={(e) => {
                        const target = e.target as HTMLDivElement;
                        setFormData({ ...formData, contents: target.innerHTML });
                      }}
                      onBlur={(e) => {
                        const target = e.target as HTMLDivElement;
                        setFormData({ ...formData, contents: target.innerHTML });
                      }}
                      style={{ minHeight: '200px' }}
                    />
                  </div>
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