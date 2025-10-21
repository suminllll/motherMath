'use client';

import { useState, useEffect } from 'react';
import { getLectures, createLecture, updateLecture, deleteLecture } from '@/lib/lectures';
import { DEFAULT_GRADE_OPTIONS, getGradeLabel } from '@/lib/categories';
import type { Lecture } from '@/types/database';

export default function AdminLectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtube_url: '',
    grade: [] as string[]
  });

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    try {
      setLoading(true);
      const data = await getLectures();
      setLectures(data);
    } catch (error) {
      console.error('Failed to load lectures:', error);
      alert('강의 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // youtu.be/VIDEO_ID 또는 youtube.com/watch?v=VIDEO_ID 형식에서 비디오 ID 추출
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    const videoId = match ? match[1] : null;

    // embed URL로 변환
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    try {
      if (editingLecture) {
        const result = await updateLecture(editingLecture.id, formData);
        console.log('Update result:', result);
        alert('강의 영상이 수정되었습니다.');
      } else {
        const result = await createLecture(formData);
        console.log('Create result:', result);
        alert('새 강의 영상이 추가되었습니다.');
      }

      await loadLectures();
      closeModal();
    } catch (error) {
      console.error('Failed to save lecture:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      alert(`강의 영상 저장에 실패했습니다.\n${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const handleEdit = (lecture: Lecture) => {
    setEditingLecture(lecture);

    setFormData({
      title: lecture.title,
      description: lecture.description || '',
      youtube_url: lecture.youtube_url,
      grade: lecture.grade
    });

    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 강의 영상을 삭제하시겠습니까?')) {
      try {
        console.log('Deleting lecture with ID:', id);
        await deleteLecture(id);
        console.log('Delete successful');
        await loadLectures(); // 목록 새로고침
        alert('강의 영상이 삭제되었습니다.');
      } catch (error) {
        console.error('Failed to delete lecture:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        }
        alert(`강의 영상 삭제에 실패했습니다.\n${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      }
    }
  };

  const openAddModal = () => {
    setEditingLecture(null);
    setFormData({ title: '', description: '', youtube_url: '', grade: [] });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLecture(null);
    setFormData({ title: '', description: '', youtube_url: '', grade: [] });
  };

  const handleGradeChange = (value: string, checked: boolean) => {
    let newGrades = [...formData.grade];
    if (checked) {
      if (!newGrades.includes(value)) {
        newGrades.push(value);
      }
    } else {
      newGrades = newGrades.filter(g => g !== value);
    }
    setFormData({ ...formData, grade: newGrades });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">강의 영상 관리</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            새 영상 추가
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">강의 목록을 불러오는 중...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.map((lecture) => {
                return (
                  <div key={lecture.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={getYouTubeEmbedUrl(lecture.youtube_url)}
                        title={lecture.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
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
                      <p className="text-xs text-gray-500 mb-3">
                        {new Date(lecture.created_at).toLocaleDateString('ko-KR')}
                      </p>
                      <div className="flex justify-between">
                        <button
                          onClick={() => handleEdit(lecture)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors cursor-pointer"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(lecture.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {lectures.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  등록된 강의 영상이 없습니다.
                </p>
              </div>
            )}
          </>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingLecture ? '강의 영상 수정' : '새 강의 영상 추가'}
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
                    설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    유튜브 URL
                  </label>
                  <input
                    type="url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학년 (복수 선택 가능)
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-60 overflow-y-auto">
                    {DEFAULT_GRADE_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-center mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.grade.includes(option.value)}
                          onChange={(e) => handleGradeChange(option.value, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
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
                    {editingLecture ? '수정' : '추가'}
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