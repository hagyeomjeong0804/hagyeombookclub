import React, { useState, useEffect } from 'react';

export default function App() {
  // 상태 관리
  const [activeTab, setActiveTab] = useState('bookshelf'); // 'home', 'bookshelf', 'audio', 'club', 'my'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'reading', 'completed', 'wish'
  const [viewMode, setViewMode] = useState('shelf'); // 'shelf', 'grid', 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [shelfTheme, setShelfTheme] = useState('wood'); // 'wood', 'acrylic', 'minimal'
  
  // 샘플 책 데이터
  const [books, setBooks] = useState([
    {
      id: 1,
      title: '모던 자바스크립트 Deep Dive',
      author: '이웅모',
      cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300',
      progress: 65,
      status: 'reading',
      category: '개발/기술',
      rating: 5,
      notes: '클로저와 프로토타입 파트 재정독 필요.'
    },
    {
      id: 2,
      title: '트렌드 코리아 2026',
      author: '김난도 외',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300',
      progress: 100,
      status: 'completed',
      category: '경제/경영',
      rating: 4,
      notes: 'AI 일상화에 따른 소비 패턴 변화 주목.'
    },
    {
      id: 3,
      title: '불편한 편의점',
      author: '김호연',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300',
      progress: 15,
      status: 'wish',
      category: '소설/에세이',
      rating: 0,
      notes: '힐링 소설 추천 도서.'
    },
    {
      id: 4,
      title: '클린 코드 (Clean Code)',
      author: '로버트 C. 마틴',
      cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300',
      progress: 40,
      status: 'reading',
      category: '개발/기술',
      rating: 5,
      notes: '함수 작성 규칙 명심하기.'
    }
  ]);

  // 모달 상태
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('개발/기술');

  // 책 추가 핸들러
  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newBookObj = {
      id: Date.now(),
      title: newTitle,
      author: newAuthor || '미상',
      cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300',
      progress: 0,
      status: 'wish',
      category: newCategory,
      rating: 0,
      notes: ''
    };
    setBooks([newBookObj, ...books]);
    setNewTitle('');
    setNewAuthor('');
    setIsAddModalOpen(false);
  };

  // 진행률 업데이트 핸들러
  const handleUpdateProgress = (id, newProgress) => {
    setBooks(books.map(b => {
      if (b.id === id) {
        const status = newProgress === 100 ? 'completed' : newProgress > 0 ? 'reading' : 'wish';
        return { ...b, progress: Number(newProgress), status };
      }
      return b;
    }));
  };

  // 책 삭제 핸들러
  const handleDeleteBook = (id) => {
    setBooks(books.filter(b => b.id !== id));
    setSelectedBook(null);
  };

  // 필터링된 책 목록
  const filteredBooks = books.filter(b => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-neutral-800 pb-20 select-none flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
      
      {/* 1. 상단 헤더 */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-neutral-200 sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-black text-indigo-600">📚 루미북클럽</span>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow hover:bg-indigo-700 transition"
          >
            + 책 추가
          </button>
        </div>
      </header>

      {/* 2. 스트릭 및 목표 위젯 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 m-4 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium opacity-90">🔥 연속 12일 독서 중</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">목표 달성율 75%</span>
        </div>
        <div className="text-lg font-bold">"오늘도 30분 독서 도전하기"</div>
        <div className="w-full bg-black/20 h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-yellow-400 h-full rounded-full" style={{ width: '75%' }}></div>
        </div>
      </div>

      {/* 3. 상태 탭 (전체 / 읽는 중 / 완독 / 위시) */}
      <div className="px-4 flex space-x-2 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: 'all', label: `전체 (${books.length})` },
          { id: 'reading', label: `읽는 중 (${books.filter(b=>b.status==='reading').length})` },
          { id: 'completed', label: `완독 (${books.filter(b=>b.status==='completed').length})` },
          { id: 'wish', label: `위시 (${books.filter(b=>b.status==='wish').length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              filterStatus === tab.id 
                ? 'bg-neutral-900 text-white shadow' 
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. 검색 및 뷰 스타일 컨트롤 */}
      <div className="px-4 py-2 flex items-center justify-between gap-2">
        <input 
          type="text" 
          placeholder="책 제목 또는 저자 검색..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex bg-white border border-neutral-200 rounded-xl p-0.5">
          <button 
            onClick={() => setViewMode('shelf')}
            className={`px-2.5 py-1 text-xs rounded-lg transition ${viewMode === 'shelf' ? 'bg-indigo-600 text-white' : 'text-neutral-600'}`}
          >
            선반
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 text-xs rounded-lg transition ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-neutral-600'}`}
          >
            그리드
          </button>
        </div>
      </div>

      {/* 5. 메인 콘텐츠 영역 (책장 / 그리드) */}
      <main className="flex-1 px-4 py-2 overflow-y-auto">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 text-sm">
            등록된 도서가 없습니다. 상단의 '+ 책 추가' 버튼을 눌러보세요!
          </div>
        ) : viewMode === 'shelf' ? (
          /* 3D 선반 뷰 */
          <div className="space-y-6">
            <div className="relative">
              <div className="grid grid-cols-3 gap-3 pb-4">
                {filteredBooks.map(book => (
                  <div 
                    key={book.id} 
                    onClick={() => setSelectedBook(book)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className="w-24 h-36 bg-neutral-200 rounded-md shadow-lg overflow-hidden relative transform group-hover:-translate-y-1 transition duration-200">
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                        {book.progress}%
                      </div>
                    </div>
                    <div className="text-xs font-bold mt-1.5 text-center truncate w-full">{book.title}</div>
                    <div className="text-[10px] text-neutral-500 truncate w-full text-center">{book.author}</div>
                  </div>
                ))}
              </div>
              {/* 원목 선반 판 디자인 */}
              <div className="h-4 bg-amber-800 rounded shadow-md border-t-2 border-amber-900"></div>
            </div>
          </div>
        ) : (
          /* 그리드 뷰 */
          <div className="grid grid-cols-2 gap-3">
            {filteredBooks.map(book => (
              <div 
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-200 flex flex-col justify-between cursor-pointer hover:shadow-md transition"
              >
                <div className="flex space-x-3">
                  <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-medium">{book.category}</span>
                    <h3 className="text-xs font-bold mt-1 truncate">{book.title}</h3>
                    <p className="text-[11px] text-neutral-500 truncate">{book.author}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                    <span>독서 진행률</span>
                    <span>{book.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${book.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 6. 책 상세 정보 및 관리 모달 */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-semibold">{selectedBook.category}</span>
                <h2 className="text-lg font-bold mt-2">{selectedBook.title}</h2>
                <p className="text-xs text-neutral-500">{selectedBook.author}</p>
              </div>
              <button 
                onClick={() => setSelectedBook(null)}
                className="bg-neutral-100 text-neutral-500 w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-neutral-200"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-4 my-4">
              <img src={selectedBook.cover} alt={selectedBook.title} className="w-24 h-36 object-cover rounded-xl shadow-md" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">진행률 조절 ({selectedBook.progress}%)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={selectedBook.progress}
                    onChange={(e) => handleUpdateProgress(selectedBook.id, e.target.value)}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateProgress(selectedBook.id, 100)}
                    className="flex-1 bg-green-50 text-green-700 text-xs py-2 rounded-xl font-bold border border-green-200 hover:bg-green-100"
                  >
                    완독 처리
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-neutral-700 block mb-1">독서 노트 / 메모</label>
              <div className="bg-neutral-50 p-3 rounded-xl text-xs text-neutral-600 border border-neutral-200 min-h-[60px]">
                {selectedBook.notes || '작성된 메모가 없습니다.'}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => handleDeleteBook(selectedBook.id)}
                className="flex-1 bg-red-50 text-red-600 text-xs py-3 rounded-xl font-bold hover:bg-red-100 transition"
              >
                서재에서 삭제
              </button>
              <button 
                onClick={() => setSelectedBook(null)}
                className="flex-1 bg-neutral-900 text-white text-xs py-3 rounded-xl font-bold hover:bg-neutral-800 transition"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. 새 책 추가 모달 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold mb-4">새 책 등록하기</h3>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">책 제목</label>
                <input 
                  type="text" 
                  required
                  placeholder="예: 클린 코드"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">저자</label>
                <input 
                  type="text" 
                  placeholder="예: 로버트 C. 마틴"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">카테고리</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="개발/기술">개발/기술</option>
                  <option value="경제/경영">경제/경영</option>
                  <option value="소설/에세이">소설/에세이</option>
                  <option value="인문/교양">인문/교양</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-neutral-100 text-neutral-600 text-xs py-2.5 rounded-xl font-bold"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white text-xs py-2.5 rounded-xl font-bold shadow hover:bg-indigo-700"
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. 하단 네비게이션 탭바 */}
      <nav className="bg-white border-t border-neutral-200 fixed bottom-0 inset-x-0 max-w-md mx-auto flex justify-around py-2 px-4 z-40">
        {[
          { id: 'home', label: '홈', icon: '🏠' },
          { id: 'bookshelf', label: '책장', icon: '📚' },
          { id: 'audio', label: '오디오', icon: '🎧' },
          { id: 'club', label: '독서모임', icon: '💬' },
          { id: 'my', label: 'My', icon: '👤' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              activeTab === tab.id ? 'text-indigo-600 font-bold' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}