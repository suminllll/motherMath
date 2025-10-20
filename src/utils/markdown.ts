// 간단한 마크다운 파서
export function parseMarkdown(text: string): string {
  if (!text) return '';
  
  console.log('Parsing markdown:', text); // 디버깅용
  
  const result = text
    // 이미지 ![alt](url) -> <img>
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
      console.log('Found image:', { alt, url }); // 디버깅용
      return `<img src="${url}" alt="${alt}" class="max-w-full h-auto my-4 rounded-lg shadow-md" loading="lazy">`;
    })
    // 굵은 글씨 **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 기울임 *text* -> <em>text</em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 제목 # text -> <h1>text</h1>
    .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-2">$1</h1>')
    // 소제목 ## text -> <h2>text</h2>
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mb-2">$1</h2>')
    // 소소제목 ### text -> <h3>text</h3>
    .replace(/^### (.*$)/gm, '<h3 class="text-md font-medium mb-1">$1</h3>')
    // 목록 - text -> <li>text</li>
    .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
    // 구분선 --- -> <hr>
    .replace(/^---$/gm, '<hr class="my-4 border-gray-300">')
    // 줄바꿈을 <br>로 변환
    .replace(/\n/g, '<br>')
    // 연속된 <br>을 <p>로 변환
    .replace(/(<br>){2,}/g, '</p><p class="mb-2">')
    // 시작과 끝에 <p> 태그 추가
    .replace(/^/, '<p class="mb-2">')
    .replace(/$/, '</p>');
    
  console.log('Parsed result:', result); // 디버깅용
  return result;
}