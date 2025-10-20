'use client';

import { useState, useEffect } from 'react';
import { getLectures, getLecturesByGrade, getLecturesBySubject, getLecturesByGradeAndSubject } from '@/lib/lectures';
import type { Lecture } from '@/types/database';

export default function Lectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterLectures = async () => {
      try {
        setLoading(true);
        let data: Lecture[];

        if (selectedGrade && selectedSubject) {
          data = await getLecturesByGradeAndSubject(selectedGrade, selectedSubject);
        } else if (selectedGrade) {
          data = await getLecturesByGrade(selectedGrade);
        } else if (selectedSubject) {
          data = await getLecturesBySubject(selectedSubject);
        } else {
          data = await getLectures();
        }

        setLectures(data);
      } catch (error) {
        console.error('Failed to filter lectures:', error);
      } finally {
        setLoading(false);
      }
    };

    filterLectures();
  }, [selectedGrade, selectedSubject]);

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          강의 영상
        </h1>
        <p className="text-center text-gray-600 mb-8">
          체계적인 강의 영상으로 언제든지 복습하세요
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                학년별 필터
              </label>
              <select
                id="grade"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체 학년</option>
                <option value="중1">중학교 1학년</option>
                <option value="중2">중학교 2학년</option>
                <option value="중3">중학교 3학년</option>
                <option value="고1">고등학교 1학년</option>
                <option value="고2">고등학교 2학년</option>
                <option value="고3">고등학교 3학년</option>
              </select>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                주제별 필터
              </label>
              <select
                id="subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체 주제</option>
                <option value="대수">대수</option>
                <option value="함수">함수</option>
                <option value="기하">기하</option>
                <option value="확률과 통계">확률과 통계</option>
                <option value="미적분">미적분</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">강의 영상을 불러오는 중...</p>
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
                      <p className="text-xs text-gray-500">
                        {new Date(lecture.created_at).toLocaleDateString('ko-KR')}
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
          </>
        )}
      </div>
    </div>
  );
}