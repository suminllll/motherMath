'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  getStudentRecords,
  createStudentRecord,
  updateStudentRecord,
  deleteStudentRecord,
} from '@/lib/student-records';
import { DEFAULT_GRADE_OPTIONS, getGradeLabel } from '@/lib/categories';
import type { StudentRecord } from '@/types/database';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function AdminStudentRecords() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<StudentRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    grade: [] as string[],
    images: [] as string[],
  });

    const queryClient = useQueryClient();
  
      const { data: records = [], isLoading , isError} = useQuery({
    queryKey: ['records'],
    queryFn: () => getStudentRecords()
  });
  
    useEffect(() => {
   if(isError){
alert('목록을 불러오는데 실패했습니다.');
   }
  }, [isError]);

    const saveMutation = useMutation({
  mutationFn: () =>
    editingRecord
      ? updateStudentRecord(editingRecord.id, formData)
      : createStudentRecord(formData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['records'] });
    alert(editingRecord ? '수정되었습니다.' : '추가되었습니다.');
    closeModal();
  },
  onError: (error) => {
    alert(`자료 저장에 실패했습니다.\n${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  },
});

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStudentRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      alert('삭제되었습니다.');
    },
    onError: (error) => {
      alert(`삭제 실패\n${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    },
  });

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const ALLOWED_EXTENSIONS = 'JPG, PNG, GIF, WEBP';


  const uploadImages = async (files: FileList): Promise<string[]> => {
    const fileArray = Array.from(files);
    const invalidFiles = fileArray.filter((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalidFiles.length > 0) {
      const names = invalidFiles.map((f) => f.name).join(', ');
      throw new Error(`지원하지 않는 파일 형식입니다: ${names}\n\n허용 형식: ${ALLOWED_EXTENSIONS}\n\n아이폰 사진(HEIC)은 설정 → 카메라 → 포맷 → 호환성 높은 항목을 선택하거나, JPEG로 변환 후 업로드해주세요.`);
    }

    const uploaded: string[] = [];
    for (const file of fileArray) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload-student-records', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '업로드 실패');
      }
      const { url } = await res.json();
      uploaded.push(url);
    }
    return uploaded;
  };

  const uploadMutation = useMutation({
    mutationFn: uploadImages,
    onSuccess: (uploaded) => {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
    },
    onError: (error) => {
      alert(`이미지 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    },
  });

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleGradeChange = (value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      grade: checked
        ? [...prev.grade, value]
        : prev.grade.filter((g) => g !== value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert('이미지를 최소 1장 업로드해주세요.');
      return;
    }
  saveMutation.mutate()
  };


  const handleEdit = (record: StudentRecord) => {
    setEditingRecord(record);
    setFormData({
      title: record.title,
      grade: record.grade,
      images: record.images,
    });
    setIsModalOpen(true);
  };



  const handleDelete = (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    deleteMutation.mutate(id)

  };

  const openAddModal = () => {
    setEditingRecord(null);
    setFormData({ title: '', grade: [], images: [] });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setFormData({ title: '', grade: [], images: [] });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">학생변화기록 관리</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            새 기록 추가
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">목록을 불러오는 중...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((record) => (
                <div key={record.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-100 relative">
                    {record.images && record.images.length > 0 ? (
                      <Image
                        src={record.images[0]}
                        alt={record.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        이미지 없음
                      </div>
                    )}
                    {record.images && record.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        총 {record.images.length}장
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {record.grade.map((g) => (
                        <span key={g} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {getGradeLabel(g)}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{record.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {new Date(record.created_at).toLocaleDateString('ko-KR')}
                    </p>
                    <div className="flex justify-between">
                      <button
                        onClick={() => handleEdit(record)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors cursor-pointer"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {records.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">등록된 기록이 없습니다.</p>
              </div>
            )}
          </>
        )}

        {/* 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-[90%] max-w-2xl shadow-lg rounded-md bg-white mb-10">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRecord ? '기록 수정' : '새 기록 추가'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 제목 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* 학년 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학년 (복수 선택 가능)
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto grid grid-cols-3 gap-1">
                    {DEFAULT_GRADE_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.grade.includes(option.value)}
                          onChange={(e) => handleGradeChange(option.value, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 이미지 업로드 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 ({formData.images.length}장 등록됨)
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && uploadMutation.mutate(e.target.files)}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                    className="w-full border-2 border-dashed border-gray-300 rounded-md py-4 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {uploadMutation.isPending ? '업로드 중...' : '+ 이미지 추가 (여러 장 선택 가능)'}
                  </button>
                  <p className="text-xs text-gray-400 mt-1">
                    허용 형식: JPG, PNG, GIF, WEBP &nbsp;|&nbsp; 최대 10MB
                  </p>

                  {/* 이미지 미리보기 */}
                  {formData.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {formData.images.map((url, idx) => (
                        <div key={idx} className="relative aspect-square group">
                          <Image
                            src={url}
                            alt={`이미지 ${idx + 1}`}
                            fill
                            className="object-cover rounded-md"
                            sizes="200px"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            ×
                          </button>
                          {idx === 0 && (
                            <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] px-1 rounded">
                              대표
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">첫 번째 이미지가 목록 대표 이미지로 표시됩니다.</p>
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
                    disabled={uploadMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                  >
                    {editingRecord ? '수정' : '추가'}
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
