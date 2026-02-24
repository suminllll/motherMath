'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getStudentRecordById } from '@/lib/student-records';
import { getGradeLabel } from '@/lib/categories';
import type { StudentRecord } from '@/types/database';
import ImageLightbox from '@/components/ImageLightbox';

export default function StudentRecordDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [record, setRecord] = useState<StudentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadRecord();
  }, [id]);

  const loadRecord = async () => {
    try {
      const data = await getStudentRecordById(id);
      setRecord(data);
    } catch (error) {
      console.error('Failed to load record:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 pt-35 flex items-center justify-center">
        <p className="text-gray-500 text-lg">불러오는 중...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 pt-35 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">기록을 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push('/student-records')}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 pt-28 pb-20">
      <div className="max-w-[95%] md:max-w-[80%] mx-auto px-4">
        {/* 뒤로가기 */}
        <button
          onClick={() => router.push('/student-records')}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors mb-8 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록으로
        </button>

        {/* 제목 & 학년 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {record.grade.map((g) => (
              <span key={g} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {getGradeLabel(g)}
              </span>
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{record.title}</h1>
          <p className="text-sm text-gray-400 mt-2">
            {new Date(record.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* 이미지 세로 스크롤 */}
        {record.images && record.images.length > 0 ? (
          <div className="flex flex-col gap-4">
            {record.images.map((url, idx) => (
              <div
                key={idx}
                className="w-full relative rounded-lg overflow-hidden shadow-md bg-white cursor-zoom-in md:cursor-default"
                onClick={() => { if (window.innerWidth < 768) setSelectedImage(url); }}
              >
                <Image
                  src={url}
                  alt={`${record.title} - 이미지 ${idx + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 768px) 95vw, 80vw"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            등록된 이미지가 없습니다.
          </div>
        )}
      </div>

      {selectedImage && (
        <ImageLightbox
          src={selectedImage}
          alt="확대 이미지"
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
