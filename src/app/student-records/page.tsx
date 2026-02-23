'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getStudentRecords, getStudentRecordsByGrade } from '@/lib/student-records';
import { DEFAULT_GRADE_OPTIONS, getGradeLabel } from '@/lib/categories';
import type { StudentRecord } from '@/types/database';

export default function StudentRecords() {
  const router = useRouter();
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsPerPage = isMobile ? 5 : 9;

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await getStudentRecords();
      setRecords(data);
    } catch (error) {
      console.error('Failed to load student records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterRecords = async () => {
      try {
        setLoading(true);
        const data = selectedGrade
          ? await getStudentRecordsByGrade(selectedGrade)
          : await getStudentRecords();
        setRecords(data);
        setCurrentPage(1);
      } catch (error) {
        console.error('Failed to filter records:', error);
      } finally {
        setLoading(false);
      }
    };
    filterRecords();
  }, [selectedGrade]);

  const totalPages = Math.ceil(records.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecords = records.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 pt-35 pb-20 md:py-50">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
          학생변화기록
        </h1>
        <p className="text-center text-gray-600 mb-18">
          마더수학 학생들의 성장 이야기를 확인하세요
        </p>

        <div className="flex justify-end mb-8">
          <div className="w-full md:w-64">
            <label htmlFor="grade" className="block text-right text-sm font-medium text-gray-700 mb-2">
              학년별 필터
            </label>
            <select
              id="grade"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full text-[14px] text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">전체 학년</option>
              {DEFAULT_GRADE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">불러오는 중...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => router.push(`/student-records/${record.id}`)}
                >
                  <div className="aspect-[4/3] bg-gray-100 relative">
                    {record.images && record.images.length > 0 ? (
                      <Image
                        src={record.images[0]}
                        alt={record.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        이미지 없음
                      </div>
                    )}
                    {record.images && record.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        +{record.images.length - 1}
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
                    <h3 className="text-lg font-semibold text-gray-900">
                      {record.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(record.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {records.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">해당 조건에 맞는 기록이 없습니다.</p>
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
