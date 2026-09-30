import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Bell,
  Plus,
  Grid,
  List,
  Layers,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Heart,
  MoreVertical,
  Star,
  ChevronRight,
  Sun,
  Moon,
  X,
  Bookmark,
  Share2,
  Edit3,
  Trash2,
  SlidersHorizontal,
  Home,
  User,
  Headphones,
  MessageSquare
} from 'lucide-react';

const INITIAL_BOOKS = [
  {
    id: '1',
    title: '데미안',
    author: '헤르만 헤세',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    color: 'from-amber-700 to-amber-900',
    totalPages: 240,
    currentPage: 156,
    status: 'reading', // reading, completed, wishlist
    rating: 4.8,
    category: '고전문학',
    lastRead: '2026-09-29',
    quotesCount: 12,
    memo: '알은 세계이다. 태어나려는 자는 하나의 세계를 파괴해야 한다.'
  },
  {
    id: '2',
    title: '클린 코드',
    author: '로버트 C. 마틴',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=80',
    color: 'from-blue-700 to-indigo-950',
    totalPages: 580,
    currentPage: 580,
    status: 'completed',
    rating: 5.0,
    category: 'IT/개발',
    lastRead: '2026-09-20',
    quotesCount: 8,
    memo: '나중은 결코 오지 않는다. 코드는 깨끗하게 유지해야 한다.'
  },
  {
    id: '3',
    title: '불편한 편의점',
    author: '김호연',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80',
    color: 'from-emerald-700 to-teal-900',
    totalPages: 268,
    currentPage: 90,
    status: 'reading',
    rating: 4.5,
    category: '한국소설',
    lastRead: '2026-09-28',
    quotesCount: 5,
    memo: '결국 삶은 관계였고 관계는 소통이었다.'
  },
  {
    id: '4',
    title: '원씽 (The One Thing)',
    author: '게리 켈러',
    cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=80',
    color: 'from-rose-800 to-red-950',
    totalPages: 280,
    currentPage: 0,
    status: 'wishlist',
    rating: 4.7,
    category: '자기계발',
    lastRead: '-',
    quotesCount: 0,
    memo: '당신의 단 하나는 무엇인가?'
  },
  {
    id: '5',
    title: '사피엔스',
    author: '유발 하라리',
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=80',
    color: 'from-orange-800 to-amber-950',
    totalPages: 640,
    currentPage: 640,
    status: 'completed',
    rating: 4.9,
    category: '인문/역사',
    lastRead: '2026-08-15',
    quotesCount: 15,
    memo: '상상의 질서야말로 인류 발전의 핵심이었다.'
  },
  {
    id: '6',
    title: '아몬드',
    author: '손원평',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=80',
    color: 'from-purple-800 to-slate-900',
    totalPages: 244,
    currentPage: 120,
    status: 'reading',
    rating: 4.6,
    category: '한국소설',
    lastRead: '2026-09-30',
    quotesCount: 4,
    memo: '구원이라는 것은 특별한 것이 아니다.'
  }
];

export default function App() {
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('lumi_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, reading, completed, wishlist
  const [viewMode, setViewMode] = useState('shelf'); // shelf, grid, list
  const [shelfTheme, setShelfTheme] = useState('darkwood'); // darkwood, lightoak, acrylic
  const [sortBy, setSortBy] = useState('recent'); // recent, title, progress
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Modals state
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('lumi_books', JSON.stringify(books));
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Tab filter
        if (activeTab === 'reading') return book.status === 'reading';
        if (activeTab === 'completed') return book.status === 'completed';
        if (activeTab === 'wishlist') return book.status === 'wishlist';
        return true;
      })
      .filter((book) => {
        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title, 'ko');
        if (sortBy === 'progress') {
          const progA = (a.currentPage / a.totalPages) * 100;
          const progB = (b.currentPage / b.totalPages) * 100;
          return progB - progA;
        }
        // recent
        return new Date(b.lastRead) - new Date(a.lastRead);
      });
  }, [books, activeTab, searchQuery, sortBy]);

  const handleUpdateProgress = (bookId, newPage) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const updatedPage = Math.min(newPage, b.totalPages);
          const isFinished = updatedPage >= b.totalPages;
          return {
            ...b,
            currentPage: updatedPage,
            status: isFinished ? 'completed' : b.status === 'wishlist' ? 'reading' : b.status,
            lastRead: new Date().toISOString().split('T')[0]
          };
        }
        return b;
      })
    );
    if (selectedBook && selectedBook.id === bookId) {
      setSelectedBook((prev) => ({
        ...prev,
        currentPage: Math.min(newPage, prev.totalPages),
        status: Math.min(newPage, prev.totalPages) >= prev.totalPages ? 'completed' : prev.status
      }));
    }
  };

  const handleAddBook = (newBook) => {
    const createdBook = {
      ...newBook,
      id: Date.now().toString(),
      lastRead: new Date().toISOString().split('T')[0],
      quotesCount: 0,
      rating: 5.0
    };
    setBooks((prev) => [createdBook, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm('정말로 이 책을 서재에서 삭제하시겠습니까?')) {
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      setSelectedBook(null);
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${darkMode ? 'bg-[#121212] text-gray-100' : 'bg-[#F9F8F6] text-gray-800'}`}>
      <div className="max-w-md mx-auto min-h-screen pb-24 shadow-2xl relative flex flex-col bg-inherit border-x border-black/5 dark:border-white/5">

        {/* Top Header */}
        <header className="sticky top-0 z-30 backdrop-blur-md bg-opacity-90 bg-inherit border-b border-black/5 dark:border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              루미북클럽
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
              </button>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] cursor-pointer ml-1">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Collapsible Search Bar */}
        {isSearchOpen && (
          <div className="px-4 py-2 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50 transition-all animate-fadeIn">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="책 제목, 저자, 카테고리 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {}
        <div className="px-4 pt-3 pb-2">
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/15 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-6 opacity-10 pointer-events-none">
              <Sparkles className="w-32 h-32" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center p-2 rounded-xl bg-white/10 backdrop-blur-md">
                  <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
                </span>
                <div>
                  <div className="text-xs text-indigo-100 font-medium">연속 독서 달성</div>
                  <div className="text-lg font-bold tracking-wide">🔥 14일째 읽는 중</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-indigo-100 font-medium">이번 달 완독</div>
                <div className="text-sm font-bold text-amber-200">
                  {books.filter(b => b.status === 'completed').length}권 <span className="text-xs font-normal text-indigo-200">/ 목표 5권</span>
                </div>
              </div>
            </div>
            {/* Mini Progress Bar */}
            <div className="mt-3 w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-300 to-amber-400 h-full rounded-full w-4/5 transition-all duration-500"></div>
            </div>
          </div>
        </div>

        {}
        <div className="px-4 py-2">
          <div className="flex bg-gray-200/60 dark:bg-gray-800/80 p-1 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300">
            {[
              { id: 'all', label: `전체 (${books.length})` },
              { id: 'reading', label: `읽는 중 (${books.filter(b => b.status === 'reading').length})` },
              { id: 'completed', label: `완독 (${books.filter(b => b.status === 'completed').length})` },
              { id: 'wishlist', label: `위시 (${books.filter(b => b.status === 'wishlist').length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-sm'
                    : 'hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {}
        <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 border-b border-black/5 dark:border-white/5 pb-3">
          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg border border-black/5 dark:border-white/5">
            <button
              onClick={() => setViewMode('shelf')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'shelf' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'hover:text-gray-900'}`}
              title="3D 선반 뷰"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'hover:text-gray-900'}`}
              title="그리드 뷰"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'hover:text-gray-900'}`}
              title="리스트 뷰"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Shelf Theme Picker (Only visible in Shelf View) */}
            {viewMode === 'shelf' && (
              <select
                value={shelfTheme}
                onChange={(e) => setShelfTheme(e.target.value)}
                className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
              >
                <option value="darkwood">다크 우드 선반</option>
                <option value="lightoak">오크 우드 선반</option>
                <option value="acrylic">아크릴 선반</option>
              </select>
            )}

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            >
              <option value="recent">최근 독서순</option>
              <option value="title">제목순</option>
              <option value="progress">진행률순</option>
            </select>
          </div>
        </div>

        {}
        <main className="flex-1 px-4 py-4">
          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">등록된 책이 없습니다.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                + 새 책 추가하기
              </button>
            </div>
          ) : viewMode === 'shelf' ? (
            /* --- 3D WOODEN SHELF VIEW --- */
            <WoodenShelfView
              books={filteredBooks}
              theme={shelfTheme}
              onSelectBook={setSelectedBook}
              onAddBookClick={() => setIsAddModalOpen(true)}
            />
          ) : viewMode === 'grid' ? (
            /* --- GRID VIEW --- */
            <GridView
              books={filteredBooks}
              onSelectBook={setSelectedBook}
              onAddBookClick={() => setIsAddModalOpen(true)}
            />
          ) : (
            /* --- LIST VIEW --- */
            <ListView
              books={filteredBooks}
              onSelectBook={setSelectedBook}
            />
          )}
        </main>

        {}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-black/5 dark:border-white/10 px-6 py-2.5 z-40 flex items-center justify-between">
          <button className="flex flex-col items-center text-indigo-600 dark:text-indigo-400 space-y-0.5">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">내 책장</span>
          </button>

          <button className="flex flex-col items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 space-y-0.5">
            <Headphones className="w-5 h-5" />
            <span className="text-[10px]">오디오북</span>
          </button>

          {/* Floating Add Book Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 -mt-6 ring-4 ring-white dark:ring-gray-900 active:scale-95 transition-transform"
            aria-label="Add Book"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button className="flex flex-col items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 space-y-0.5">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">독서모임</span>
          </button>

          <button className="flex flex-col items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 space-y-0.5">
            <User className="w-5 h-5" />
            <span className="text-[10px]">마이페이지</span>
          </button>
        </div>

        {}
        {selectedBook && (
          <BookDetailModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onUpdateProgress={handleUpdateProgress}
            onDelete={handleDeleteBook}
          />
        )}

        {isAddModalOpen && (
          <AddBookModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddBook}
          />
        )}

      </div>
    </div>
  );
}

function WoodenShelfView({ books, theme, onSelectBook, onAddBookClick }) {
  // Chunk books into rows of 3
  const shelfRows = useMemo(() => {
    const rows = [];
    const items = [...books];
    while (items.length > 0) {
      rows.push(items.splice(0, 3));
    }
    return rows;
  }, [books]);

  // Dynamic Theme Styles
  const themeStyles = {
    darkwood: {
      shelfBg: 'bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950',
      shelfTop: 'bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 border-t border-amber-600/40',
      shelfShadow: 'shadow-[0_12px_20px_rgba(0,0,0,0.4)]',
      wallBg: 'bg-amber-950/5'
    },
    lightoak: {
      shelfBg: 'bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200',
      shelfTop: 'bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 border-t border-amber-300',
      shelfShadow: 'shadow-[0_10px_15px_rgba(180,120,60,0.25)]',
      wallBg: 'bg-amber-100/10'
    },
    acrylic: {
      shelfBg: 'bg-white/30 dark:bg-white/10 backdrop-blur-md border-b border-white/40',
      shelfTop: 'bg-white/50 dark:bg-white/20 border-t border-white/60',
      shelfShadow: 'shadow-[0_8px_25px_rgba(255,255,255,0.2)]',
      wallBg: 'bg-indigo-500/5'
    }
  }[theme];

  return (
    <div className={`space-y-12 py-4 rounded-3xl ${themeStyles.wallBg} transition-all`}>
      {shelfRows.map((row, rowIndex) => (
        <div key={rowIndex} className="relative pt-4">
          {/* Books Row */}
          <div className="flex items-end justify-start px-6 gap-5 min-h-[160px] z-10 relative">
            {row.map((book) => {
              const progressPct = Math.round((book.currentPage / book.totalPages) * 100);
              return (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="group relative cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 active:scale-95 flex-1 max-w-[100px]"
                >
                  {/* Book Spine / Cover 3D Card */}
                  <div className="relative rounded-r-md overflow-hidden shadow-xl aspect-[2/3] bg-gray-800 transition-shadow group-hover:shadow-2xl">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Book Left Spine Curve Gradient Effect */}
                    <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />

                    {/* Badge Status */}
                    {book.status === 'completed' && (
                      <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white p-0.5 rounded-full shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Progress Bar Badge at Bottom */}
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs p-1">
                      <div className="flex justify-between text-[9px] text-white font-medium mb-0.5">
                        <span className="truncate pr-1">{book.title}</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-400 h-full rounded-full transition-all"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* 3D Book Bottom Shadow on Plank */}
                  <div className="absolute -bottom-1 inset-x-1 h-2 bg-black/40 blur-xs rounded-full pointer-events-none group-hover:bg-black/60 transition-all"></div>
                </div>
              );
            })}

            {/* If last row has space, show Add Book placeholder on shelf */}
            {rowIndex === shelfRows.length - 1 && row.length < 3 && (
              <div
                onClick={onAddBookClick}
                className="flex-1 max-w-[90px] aspect-[2/3] rounded-r-md border-2 border-dashed border-gray-400/40 hover:border-indigo-500 flex flex-col items-center justify-center text-gray-400 hover:text-indigo-500 cursor-pointer transition-colors group bg-black/5 dark:bg-white/5"
              >
                <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] mt-1 font-medium">책 추가</span>
              </div>
            )}
          </div>

          {/* 3D WOODEN SHELF PLANK */}
          <div className="relative w-full z-0">
            {/* Top surface of shelf */}
            <div className={`h-3 w-full ${themeStyles.shelfTop} rounded-t-xs opacity-90`} />
            {/* Front facing plank */}
            <div className={`h-5 w-full ${themeStyles.shelfBg} ${themeStyles.shelfShadow} rounded-b-md flex items-center justify-between px-4`}>
              <div className="w-2 h-2 rounded-full bg-black/20" />
              <div className="w-2 h-2 rounded-full bg-black/20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GridView({ books, onSelectBook, onAddBookClick }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {books.map((book) => {
        const progressPct = Math.round((book.currentPage / book.totalPages) * 100);
        return (
          <div
            key={book.id}
            onClick={() => onSelectBook(book)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-gray-100 dark:bg-gray-700">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {book.category}
                </span>
              </div>
              <h3 className="font-bold text-xs line-clamp-1 dark:text-white">{book.title}</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">{book.author}</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                <span>진행률</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{progressPct}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${progressPct}%` }}></div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Card */}
      <div
        onClick={onAddBookClick}
        className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-400 cursor-pointer min-h-[220px] transition-all"
      >
        <Plus className="w-8 h-8 mb-1" />
        <span className="text-xs font-semibold">책 새로 등록하기</span>
      </div>
    </div>
  );
}

function ListView({ books, onSelectBook }) {
  return (
    <div className="space-y-3">
      {books.map((book) => {
        const progressPct = Math.round((book.currentPage / book.totalPages) * 100);
        return (
          <div
            key={book.id}
            onClick={() => onSelectBook(book)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center space-x-3"
          >
            <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-lg shadow-xs flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-md">
                  {book.category}
                </span>
                <span className="text-[10px] text-gray-400">{book.lastRead}</span>
              </div>
              <h3 className="font-bold text-sm truncate dark:text-white mt-1">{book.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{book.author}</p>

              {/* Progress & Rating */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-amber-400 text-[11px]">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{book.rating}</span>
                </div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  {book.currentPage} / {book.totalPages}p ({progressPct}%)
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BookDetailModal({ book, onClose, onUpdateProgress, onDelete }) {
  const [pagesInput, setPagesInput] = useState(book.currentPage);
  const progressPct = Math.round((pagesInput / book.totalPages) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border-t border-white/20 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300">
            {book.category}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDelete(book.id)}
              className="p-1.5 text-gray-400 hover:text-rose-500 rounded-full"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Book Info Header */}
        <div className="flex space-x-4 mb-6">
          <img src={book.cover} alt={book.title} className="w-24 h-36 object-cover rounded-xl shadow-md" />
          <div className="flex-1">
            <h2 className="text-lg font-bold dark:text-white leading-tight">{book.title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{book.author}</p>
            <div className="flex items-center space-x-1 mt-2 text-amber-400 text-xs">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="font-bold text-gray-800 dark:text-gray-200">{book.rating}</span>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              최근 읽은 날짜: <span className="text-gray-800 dark:text-gray-200 font-medium">{book.lastRead}</span>
            </div>
          </div>
        </div>

        {/* Progress Slider Controller */}
        <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl mb-6 border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold dark:text-white">독서 진행률</span>
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
              {pagesInput} / {book.totalPages} 페이지 ({progressPct}%)
            </span>
          </div>

          <input
            type="range"
            min="0"
            max={book.totalPages}
            value={pagesInput}
            onChange={(e) => setPagesInput(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />

          <div className="flex justify-between items-center mt-3">
            <button
              onClick={() => {
                setPagesInput(book.totalPages);
                onUpdateProgress(book.id, book.totalPages);
              }}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>완독 처리</span>
            </button>
            <button
              onClick={() => onUpdateProgress(book.id, pagesInput)}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-indigo-700"
            >
              저장하기
            </button>
          </div>
        </div>

        {/* Highlight Quote Note */}
        {book.memo && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center space-x-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>대표 문장 메모</span>
            </h4>
            <p className="text-xs italic bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/50 dark:border-amber-900/30 text-amber-900 dark:text-amber-200">
              "{book.memo}"
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

function AddBookModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '한국소설',
    totalPages: 300,
    currentPage: 0,
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    memo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onAdd({
      ...formData,
      status: formData.currentPage >= formData.totalPages ? 'completed' : formData.currentPage > 0 ? 'reading' : 'wishlist'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border-t border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-base dark:text-white">📚 새 책 등록하기</h3>
          <button onClick={onClose} className="p-1 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">책 제목</label>
            <input
              type="text"
              required
              placeholder="예: 어린 왕자"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">저자</label>
            <input
              type="text"
              required
              placeholder="예: 생텍쥐페리"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">카테고리</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="한국소설">한국소설</option>
                <option value="고전문학">고전문학</option>
                <option value="IT/개발">IT/개발</option>
                <option value="자기계발">자기계발</option>
                <option value="인문/역사">인문/역사</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">총 페이지</label>
              <input
                type="number"
                value={formData.totalPages}
                onChange={(e) => setFormData({ ...formData, totalPages: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">기억하고 싶은 문장</label>
            <textarea
              rows="2"
              placeholder="독서 노트나 대표 문장을 적어보세요."
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-md hover:opacity-95 transition-opacity mt-2"
          >
            내 책장에 추가하기
          </button>
        </form>
      </div>
    </div>
  );
}