'use client';

import { useState, useEffect } from 'react';
import { getLectures, createLecture, updateLecture, deleteLecture } from '@/lib/lectures';
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
    grade: '',
    subject: ''
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

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const validateYouTubeUrl = (url: string) => {
    return getYouTubeVideoId(url) !== null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateYouTubeUrl(formData.youtube_url)) {
      alert('올바른 유튜브 URL을 입력해주세요.');
      return;
    }
    
    try {
      if (editingLecture) {
        await updateLecture(editingLecture.id, formData);
        alert('강의 영상이 수정되었습니다.');
      } else {
        await createLecture(formData);
        alert('새 강의 영상이 추가되었습니다.');
      }
      
      await loadLectures(); // 목록 새로고침
      closeModal();
    } catch (error) {
      console.error('Failed to save lecture:', error);
      alert('강의 영상 저장에 실패했습니다.');
    }
  };

  const handleEdit = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setFormData({
      title: lecture.title,
      description: lecture.description || '',
      youtube_url: lecture.youtube_url,
      grade: lecture.grade,
      subject: lecture.subject
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 강의 영상을 삭제하시겠습니까?')) {
      try {
        await deleteLecture(id);
        alert('강의 영상이 삭제되었습니다.');
        await loadLectures(); // 목록 새로고침
      } catch (error) {
        console.error('Failed to delete lecture:', error);
        alert('강의 영상 삭제에 실패했습니다.');
      }
    }
  };

  const openAddModal = () => {
    setEditingLecture(null);
    setFormData({ title: '', description: '', youtube_url: '', grade: '', subject: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLecture(null);
    setFormData({ title: '', description: '', youtube_url: '', grade: '', subject: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">강의 영상 관리</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
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
                const videoId = getYouTubeVideoId(lecture.youtube_url);
                return (
                  <div key={lecture.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-video">
                      {videoId ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={lecture.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">영상을 불러올 수 없습니다</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {lecture.grade}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {lecture.subject}
                        </span>
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
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(lecture.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    학년
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">학년 선택</option>
                    <option value="중1">중학교 1학년</option>
                    <option value="중2">중학교 2학년</option>
                    <option value="중3">중학교 3학년</option>
                    <option value="고1">고등학교 1학년</option>
                    <option value="고2">고등학교 2학년</option>
                    <option value="고3">고등학교 3학년</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    주제
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">주제 선택</option>
                    <option value="대수">대수</option>
                    <option value="함수">함수</option>
                    <option value="기하">기하</option>
                    <option value="확률과 통계">확률과 통계</option>
                    <option value="미적분">미적분</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
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