'use client';

import { useState } from 'react';

export default function Consultation() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    grade: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.');
    setFormData({ name: '', phone: '', grade: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            상담 예약
          </h1>
          <p className="text-center text-gray-600 mb-8">
            무료 상담을 통해 최적의 학습 방법을 찾아보세요
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                학생 이름 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="학생 이름을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                연락처 *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="010-1234-5678"
              />
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                학년 *
              </label>
              <select
                id="grade"
                name="grade"
                required
                value={formData.grade}
                onChange={handleChange}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">학년을 선택하세요</option>
                <option value="초등3">초등학교 3학년</option>
                <option value="초등4">초등학교 4학년</option>
                <option value="초등5">초등학교 5학년</option>
                <option value="초등6">초등학교 6학년</option>
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
                관심 분야
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="기초수학">기초 수학</option>
                <option value="내신수학">내신 수학</option>
                <option value="수능수학">수능 수학</option>
                <option value="심화수학">심화 수학</option>
                <option value="경시수학">경시 수학</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                상담 내용
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="궁금한 점이나 상담받고 싶은 내용을 자유롭게 작성해주세요"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              상담 신청하기
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              상담 안내
            </h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• 상담 신청 후 24시간 내에 연락드립니다.</li>
              <li>• 무료 상담은 약 30분 정도 소요됩니다.</li>
              <li>• 학생의 현재 수준 진단 및 학습 계획을 제안해드립니다.</li>
              <li>• 상담은 방문 또는 전화로 진행 가능합니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}