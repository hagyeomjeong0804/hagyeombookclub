# 📚 Lumi Book Club PWA (루미북클럽 책장)

> 모바일 및 데스크톱 환경에서 완벽하게 작동하는 PWA(Progressive Web App) 기반의 디지털 책장 서비스입니다.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8?logo=pwa)

---

## ✨ 주요 기능 (Key Features)

- 🎨 **3D 입체 선반 & 멀티 뷰**: 원목 선반 뷰, 그리드 뷰, 리스트 뷰 지원
- 📱 **PWA 최적화**: 오프라인 동작 지원 (Service Worker + IndexedDB)
- 👆 **네이티브 제스처**: 롱 프레스, 드래그 앤 드롭, 풀투리프레시(Pull-to-Refresh)
- 📊 **독서 통계**: 진행률%, 연독 스트릭(Streak), 월별 읽은 권수 카운트
- 🌙 **다크 모드 & 테마**: 우드, 아크릴, 미니멀 화이트 스킨 선택 가능

---

## 🛠 기술 스택 (Tech Stack)

- **Frontend**: React / Next.js, Tailwind CSS, Lucide Icons
- **PWA & Offline**: Workbox, IndexedDB (`idb`)
- **State Management**: Zustand / React Query
- **Deployment**: Vercel / GitHub Pages

---

## 🚀 시작하기 (Getting Started)

### 설치 및 실행

```bash
# 클론 코드
git clone [https://github.com/username/lumi-bookclub-pwa.git](https://github.com/username/lumi-bookclub-pwa.git)

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev