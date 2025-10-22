'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loginAdmin, getAdminSession, clearAdminSession, setAdminSession } from '@/lib/auth';
import { getMaterials} from '@/lib/materials';
import { getLectures } from '@/lib/lectures';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [admin, setAdmin] = useState<{ username: string; name: string } | null>(null);
const [materialCount, setMaterialCount] =useState(0)
const [lectureCount, setLectureCount] = useState(0)

  useEffect(() => {
    // 페이지 로드시 세션 확인
    const savedAdmin = getAdminSession();
    if (savedAdmin) {
      setAdmin(savedAdmin);
      setIsAuthenticated(true);
    }
loadMaterials()
         
        
  }, []);

   const loadMaterials = async () => {
          const materialData = await getMaterials();
            const lectureData = await getLectures();
      setMaterialCount(materialData.length)
setLectureCount(lectureData.length)
   }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = loginAdmin(loginForm);
    
    if (result.success && result.admin) {
      setAdminSession(result.admin);
      setAdmin(result.admin);
      setIsAuthenticated(true);
    } else {
      alert(result.message || '로그인에 실패했습니다.');
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    clearAdminSession();
    setAdmin(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
            관리자 로그인
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                아이디
              </label>
              <input
                type="text"
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full text-black  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 cursor-pointer"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          {/* <p className="text-center text-gray-500 text-sm mt-4">
            데모: admin / admin123
          </p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-38">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="max-sm:mb-5 text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {admin?.name || admin?.username}님 환영합니다
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📚</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">총 칼럼</div>
                <div className="text-2xl font-bold text-gray-900">{materialCount}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">🎬</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">총 영상</div>
                <div className="text-2xl font-bold text-gray-900">{lectureCount}</div>
              </div>
            </div>
          </div>

 

         
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              자료실 관리
            </h2>
            <p className="text-gray-600 mb-4">
              학습 자료를 업로드, 수정, 삭제할 수 있습니다.
            </p>
            <div className="space-y-2">
              <Link
                href="/admin/materials"
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                자료실 관리하기
              </Link>
            
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              강의 영상 관리
            </h2>
            <p className="text-gray-600 mb-4">
              유튜브 강의 영상을 관리할 수 있습니다.
            </p>
            <div className="space-y-2">
              <Link
                href="/admin/lectures"
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                강의 영상 관리하기
              </Link>
        
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}