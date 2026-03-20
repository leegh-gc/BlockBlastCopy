# Sprint 4 계획: PWA 및 사운드/햅틱

**스프린트 번호**: Sprint 4 / 6
**Phase**: Phase 2 - 개선 및 최적화
**기간**: 2026-04-04 ~ 2026-04-17 (2주)
**작성일**: 2026-03-20
**브랜치**: `main_sprint-3` → `main_sprint-4` (신규 브랜치 생성 후 작업)

---

## 스프린트 목표 (Sprint Goal)

> Sprint 3에서 이월된 기술 부채를 해소하고, 오프라인 플레이 가능한 PWA와 사운드/햅틱 피드백을 추가하여 **M3: 품질 개선 릴리스** 마일스톤을 달성한다.

Sprint 3에서 구축한 애니메이션·성능 인프라 위에, 기술 부채 처리(하드코딩 수정, 바운스 애니메이션)를 우선 완료한 뒤 PWA 오프라인 지원·사운드·햅틱·크로스 브라우저 검증을 순차적으로 구현한다. 이 스프린트가 완료되면 게임이 홈 화면에 설치 가능하고 오프라인에서도 동작하는 수준에 도달한다.

---

## Sprint 3 인수 사항 (Input)

Sprint 3 검증 보고서(`docs/sprint/sprint3/verification-report.md`)에서 확인된 Sprint 4 진입 조건:

| 항목 | 상태 | 비고 |
|------|------|------|
| `npm run build` 타입 에러 없음 | ✅ 완료 | |
| `npm test` 42/42 통과 | ✅ 완료 | |
| gzip 번들 105.95KB (목표 500KB 이하) | ✅ 완료 | GameOverModal 청크 분리 포함 |
| `BOARD_SIZE` 단일 진입점 통합 | ✅ 완료 | `src/constants/game.ts` |
| isAnimating 드래그 차단 | ✅ 완료 | |
| LineClearEffect white flash | ✅ 완료 | |
| 게임오버 보드 셰이크 500ms | ✅ 완료 | |
| 드래그 프리뷰 크로스페이드 | ✅ 완료 | |
| React.memo Cell / BlockPreview | ✅ 완료 | |
| GameOverModal lazy 코드 스플리팅 | ✅ 완료 | |
| Lighthouse Performance 90+ | ⬜ 수동 미확인 | Sprint 4에서 측정 후 미달 시 추가 최적화 |
| 바운스 복귀 애니메이션 (DoD #8) | ⬜ 미구현 | 이월 - Sprint 4 Day 1-2 처리 |

---

## Sprint 3 기술 부채 처리 계획

Sprint 4 시작 전 아래 이월 부채를 우선 처리한다.

### [필수] TD1: Board.tsx animatingSet 하드코딩 수정 (Medium)

- **파일**: `src/components/Board/Board.tsx`
- **문제**: `animatingSet` 계산 루프 내 `for (let c = 0; c < 8; c++)` 하드코딩
- **수정**: `BOARD_SIZE` 상수를 `src/constants/game.ts`에서 import하여 `for (let c = 0; c < BOARD_SIZE; c++)`로 교체
- **검증**: `npm run build` 성공, `npm test` 전체 통과
- **예상 소요**: 15분
- **우선순위**: 최우선 (Day 1 시작 시)

### [권장] TD2: 바운스 복귀 애니메이션 구현

- **파일**: `src/components/Block/DraggableBlock.tsx`
- **문제**: 배치 불가 드롭 시 단순 원위치 처리 (바운스 없음)
- **수정**: Framer Motion `spring` transition으로 원위치 복귀 바운스 구현
  - `transition: { type: 'spring', stiffness: 400, damping: 25 }`
  - 드롭 실패 시 블록이 원래 BlockTray 위치로 탄성 있게 복귀
- **검증**: 배치 불가 위치에 드롭 시 바운스 애니메이션 확인
- **예상 소요**: 1시간
- **우선순위**: Day 1 (TD1 완료 직후)

### [검토] TD3: LineClearEffect gap/padding 미보정 (Low)

- **파일**: `src/components/Board/LineClearEffect.tsx`
- **문제**: flash 오버레이 위치 계산이 보드의 `gap-0.5` 및 `p-1` 패딩 미반영
- **수정 방안**: 픽셀 오프셋 보정값 적용 또는 절대 좌표 계산 방식 변경. 시각 효과 목적이므로 ±2px 허용 범위 내면 건너뛸 수 있음
- **판단 기준**: Day 1에 실제 렌더링 확인 후 육안으로 어긋남이 허용 범위 초과 시에만 수정
- **예상 소요**: 30분 (수정 시)
- **우선순위**: 선택적

### [검토] TD4: DraggableBlock Y오프셋 하드코딩 (Low)

- **파일**: `src/components/Block/DraggableBlock.tsx`
- **문제**: `top: y - 75` 하드코딩. `cellSize`(22)와 최대 shape 높이 기반 동적 계산이 더 견고함
- **수정 방안**: `const yOffset = (maxShapeHeight / 2) * cellSize + DRAG_LIFT_MARGIN` 동적 계산으로 교체
- **판단 기준**: 현재 값(75px)이 실용적으로 충분히 동작하므로, TD2 바운스 작업 중 자연스럽게 수정 가능하면 포함
- **예상 소요**: 30분
- **우선순위**: 선택적 (TD2와 같은 파일이므로 동시 처리)

### [검토] TD5: Cell areEqual row/col 누락 (Low)

- **파일**: `src/components/Board/Cell.tsx`
- **문제**: `areEqual` 비교 함수에 `row`, `col` props 누락. `key`로 구분되므로 기능 문제 없음
- **수정 방안**: `areEqual`에 `prevProps.row === nextProps.row && prevProps.col === nextProps.col` 조건 추가
- **판단 기준**: 명시적 완전성 관점. Day 1-2 기술 부채 처리 블록에서 5분 내 처리 가능
- **예상 소요**: 15분
- **우선순위**: 선택적 (Day 1에 일괄 처리 권장)

---

## 구현 범위

### 포함 (In Scope)

- Sprint 3 이월 기술 부채 처리 (TD1 필수, TD2-TD5 권장)
- PWA 구현 (`vite-plugin-pwa`, Service Worker, manifest.json, 앱 아이콘)
- 오프라인 캐싱 전략 (Cache First)
- 홈 화면 설치 프롬프트 UI
- 사운드 효과 (블록 배치, 라인 제거, 콤보, 게임 오버) + on/off 토글
- 햅틱 피드백 (Vibration API) + on/off 토글
- 크로스 브라우저 테스트 (Chrome, Safari iOS, Firefox, Samsung Internet)
- Lighthouse Performance 90+ 확인 (미달 시 추가 최적화)

### 제외 (Out of Scope)

- 다크 모드, 설정 패널 (Sprint 5)
- 타임 어택 모드, 점수 공유 (Sprint 6)
- 배경 음악 (Backlog - Won't Have)
- 리더보드, 일일 챌린지 (Backlog - Won't Have)
- 사운드 파일 자체 제작 (공개 라이선스 파일 활용 또는 Web Audio API 프로그래매틱 생성)

---

## 작업 분해 (Task Breakdown)

### Day 1-2: 기술 부채 처리

#### Task 1: TD1-TD5 기술 부채 일괄 처리
- **담당 파일**:
  - `src/components/Board/Board.tsx` (TD1 - 필수)
  - `src/components/Block/DraggableBlock.tsx` (TD2, TD4)
  - `src/components/Board/LineClearEffect.tsx` (TD3 - 조건부)
  - `src/components/Board/Cell.tsx` (TD5)
- **작업 내용**:
  1. `Board.tsx`: `for (let c = 0; c < 8; c++)` → `for (let c = 0; c < BOARD_SIZE; c++)`로 교체. `BOARD_SIZE` import 추가
  2. `DraggableBlock.tsx`: Framer Motion `spring` transition 적용 (TD2)
     - 드롭 실패 감지: `useDragDrop`에서 반환된 `isDropFailed` 상태 또는 `onDropFailed` 콜백 활용
     - 복귀 타겟 좌표를 BlockTray 내 원래 위치로 계산
     - `transition: { type: 'spring', stiffness: 400, damping: 25 }`
  3. `DraggableBlock.tsx`: Y오프셋 동적 계산 (TD4) - TD2 작업 중 자연스럽게 처리
     - `const maxRows = Math.max(...block.shape.map(row => row.length))` 활용
  4. `LineClearEffect.tsx`: 실제 렌더링 확인 후 보정값 필요 시 수정 (TD3)
  5. `Cell.tsx`: `areEqual`에 `row`, `col` 조건 추가 (TD5)
- **검증**:
  - `npm run build` 성공
  - `npm test` 42/42 전체 통과
  - 배치 불가 드롭 시 바운스 복귀 애니메이션 육안 확인
- **복잡도**: M
- **예상 소요**: 3시간

---

### Day 3-5: PWA 구현

#### Task 2: vite-plugin-pwa 설치 및 기본 설정
- **담당 파일**: `package.json`, `vite.config.ts`, `public/manifest.json`
- **작업 내용**:
  1. `vite-plugin-pwa` 설치: `npm install -D vite-plugin-pwa`
  2. `vite.config.ts`에 플러그인 등록:
     ```typescript
     import { VitePWA } from 'vite-plugin-pwa'
     // plugins: [..., VitePWA({ registerType: 'autoUpdate', ... })]
     ```
  3. manifest 설정 (PRD 섹션 9.3 기반):
     - `name`: "Block Blast"
     - `short_name`: "BlockBlast"
     - `display`: "standalone"
     - `background_color`: "#F2F2F7"
     - `theme_color`: "#007AFF"
     - `start_url`: "/"
     - icons: 192x192, 512x512
  4. `<meta name="theme-color" content="#007AFF">` → `index.html`에 추가
  5. `index.html`에 `<link rel="manifest" href="/manifest.json">` 추가 (vite-plugin-pwa 자동 처리 여부 확인)
- **검증**: `npm run build` 후 `dist/` 내 `sw.js`, `manifest.json` 파일 생성 확인
- **복잡도**: S
- **예상 소요**: 2시간

#### Task 3: 앱 아이콘 생성
- **담당 파일**: `public/icons/` (신규 디렉토리)
- **작업 내용**:
  1. 192x192, 512x512 PNG 아이콘 생성
     - 도구: SVG → PNG 변환 스크립트 또는 온라인 도구 활용
     - 디자인: 블록 퍼즐 테마 (8x8 그리드 + 블록 모티프)
  2. `public/icons/icon-192.png`, `public/icons/icon-512.png` 저장
  3. `manifest.json`의 `icons` 배열에 경로 등록
  4. (선택) `apple-touch-icon` 추가 (iOS 홈 화면 아이콘)
- **검증**: Chrome DevTools Application > Manifest에서 아이콘 미리보기 확인
- **복잡도**: S
- **예상 소요**: 1시간

#### Task 4: Service Worker 오프라인 캐싱 전략
- **담당 파일**: `vite.config.ts` (VitePWA workbox 설정)
- **작업 내용**:
  1. Cache First 전략 적용:
     ```typescript
     VitePWA({
       workbox: {
         globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
         runtimeCaching: [
           {
             urlPattern: /^https:\/\//,
             handler: 'CacheFirst',
             options: { cacheName: 'assets-cache', expiration: { maxEntries: 50 } }
           }
         ]
       }
     })
     ```
  2. `registerType: 'autoUpdate'` - 새 버전 배포 시 자동 업데이트
  3. 개발 환경에서 SW 테스트: `vite-plugin-pwa`의 `devOptions: { enabled: true }` 임시 활성화
- **검증**:
  - `npm run build && npm run preview` 후 DevTools > Application > Service Workers에서 등록 확인
  - Network 탭에서 오프라인 모드 시뮬레이션 → 게임 화면 정상 로드 확인
- **복잡도**: M
- **예상 소요**: 3시간

#### Task 5: 홈 화면 설치 프롬프트 UI
- **담당 파일**: `src/components/UI/InstallPrompt.tsx` (신규), `src/App.tsx`
- **작업 내용**:
  1. `beforeinstallprompt` 이벤트 리스너 등록 (커스텀 훅 `useInstallPrompt.ts`)
  2. 설치 프롬프트 컴포넌트:
     - 화면 하단 슬라이드 업 배너 (Framer Motion)
     - "홈 화면에 추가" 버튼 → `prompt()` 호출
     - "닫기" 버튼 → 배너 숨김 (세션 중 재표시 없음)
  3. iOS Safari 미지원 대응: user-agent 감지 후 수동 안내 배너 표시
     - "Safari > 공유 > 홈 화면에 추가" 안내
  4. 이미 설치된 경우 프롬프트 비표시 (`window.matchMedia('(display-mode: standalone)')`)
- **검증**:
  - Chrome에서 설치 프롬프트 배너 표시 확인
  - 설치 후 standalone 모드로 실행 확인
  - iOS Safari에서 수동 안내 배너 표시 확인
- **복잡도**: M
- **예상 소요**: 3시간

---

### Day 6-8: 사운드 효과

#### Task 6: 사운드 시스템 설계 및 구현
- **담당 파일**: `src/hooks/useSound.ts` (신규), `src/stores/settingsStore.ts` (신규), `public/sounds/` (신규)
- **작업 내용**:
  1. 사운드 파일 준비 (공개 라이선스 WebM/OGG 포맷, 각 50KB 이하):
     - `place.webm`: 블록 배치 "톡" 소리 (50-100ms)
     - `clear.webm`: 라인 제거 클리어 효과음 (300-500ms)
     - `combo.webm`: 콤보 상승 톤 (200-300ms)
     - `gameover.webm`: 게임 오버 사운드 (500-800ms)
     - 대안: Web Audio API로 프로그래매틱 생성 (파일 없이 구현 가능, 번들 크기 0)
  2. `settingsStore.ts` (Zustand) 신규 생성:
     - `isSoundEnabled: boolean` (기본값: `true`)
     - `isHapticEnabled: boolean` (기본값: `true`)
     - `toggleSound()`, `toggleHaptic()` 액션
     - `persist` 미들웨어로 LocalStorage 저장 (키: `block-blast-settings`)
  3. `useSound.ts` 커스텀 훅:
     - 브라우저 autoplay 정책 대응: 첫 번째 사용자 인터랙션 후 AudioContext 초기화
     - 사운드 파일 사용 시: `new Audio(url)` 또는 Howler.js (번들 크기 고려)
     - Web Audio API 사용 시: `AudioContext`로 오실레이터 기반 효과음 생성
     - `isSoundEnabled` 상태 구독 → false면 재생 스킵
     - 반환: `{ playPlace, playClear, playCombo, playGameOver }`
  4. `gameStore.ts` 연동:
     - `placeBlock` 성공 시 `playPlace()` 호출
     - 라인 제거 시 `playClear()` 호출 (콤보 시 `playCombo()` 추가)
     - 게임 오버 시 `playGameOver()` 호출
     - **주의**: store 내부에서 훅 직접 호출 불가 → 이벤트 콜백 또는 컴포넌트 레벨에서 처리
- **기술 결정 사항**:
  - Web Audio API 프로그래매틱 방식 우선 검토 (번들 크기 0, 의존성 없음)
  - 파일 방식 필요 시 `public/sounds/`에 배치 (빌드 번들 미포함, 런타임 로드)
  - Howler.js는 번들 크기 영향(~7KB gzip)으로 번들 목표 500KB 여유 있으나 불필요하면 생략
- **검증**:
  - 블록 배치, 라인 제거, 콤보, 게임 오버 시 각 사운드 재생 확인
  - 페이지 로드 직후 클릭 없이 자동 재생 없음 확인 (autoplay 정책 준수)
- **복잡도**: M
- **예상 소요**: 4시간

#### Task 7: 사운드 토글 UI
- **담당 파일**: `src/components/UI/SoundToggle.tsx` (신규), `src/App.tsx`
- **작업 내용**:
  1. 사운드 토글 버튼 컴포넌트:
     - 위치: 점수 표시 영역 우측 상단 (ScoreDisplay 옆)
     - 아이콘: 스피커 on/off SVG 아이콘 (Tailwind 인라인 SVG)
     - `settingsStore`의 `isSoundEnabled` 구독
     - 클릭 시 `toggleSound()` 호출
     - `aria-label`: "사운드 켜기/끄기"
     - 최소 터치 영역 44x44px 보장
  2. `App.tsx`에 `SoundToggle` 배치
- **검증**: 토글 클릭 시 사운드 on/off, 새로고침 후 설정 유지
- **복잡도**: S
- **예상 소요**: 1시간

---

### Day 9: 햅틱 피드백

#### Task 8: 햅틱 피드백 구현 및 토글 UI
- **담당 파일**: `src/hooks/useHaptic.ts` (신규), `src/components/UI/HapticToggle.tsx` (신규), `src/App.tsx`
- **작업 내용**:
  1. `useHaptic.ts` 커스텀 훅:
     - Vibration API 지원 여부 확인: `'vibrate' in navigator`
     - iOS Safari 미지원 → graceful degradation (함수 호출은 유지, 진동만 생략)
     - `isHapticEnabled` 상태 구독 → false면 진동 스킵
     - 반환:
       - `vibratePlace()`: 50ms (블록 배치)
       - `vibrateClear()`: 100ms (라인 제거)
       - `vibrateGameOver()`: `[100, 50, 100, 50, 200]` 패턴 (게임 오버)
  2. `gameStore.ts` 연동: 사운드와 동일한 컴포넌트 레벨 콜백 방식으로 처리
  3. `HapticToggle.tsx`: 사운드 토글과 동일한 패턴으로 구현
     - 진동 아이콘 SVG (폰 + 진동 표시)
     - Vibration API 미지원 환경에서는 토글 버튼 비표시 또는 비활성화
  4. `App.tsx`에 `HapticToggle` 배치 (SoundToggle 옆)
- **검증**:
  - Android Chrome에서 블록 배치/라인 제거/게임 오버 시 진동 확인
  - iOS Safari에서 오류 없이 정상 동작 확인 (진동 없이)
  - 토글 off 시 진동 없음 확인
- **복잡도**: S
- **예상 소요**: 2시간

---

### Day 10-12: 크로스 브라우저 테스트 및 버그 수정

#### Task 9: Lighthouse 성능 측정 및 미달 시 추가 최적화
- **담당 파일**: 측정 결과에 따라 결정
- **작업 내용**:
  1. `npm run build && npm run preview` 실행
  2. Chrome DevTools Lighthouse 측정 (Performance, PWA 카테고리)
  3. Performance 90 미달 시 추가 최적화:
     - `vite.config.ts` `rollupOptions.output.manualChunks`로 추가 청크 분리 검토
     - 미사용 Framer Motion 기능 트리 셰이킹 확인
     - CSS `contain` 속성 추가 범위 확인
     - `font-display: swap` 적용 (폰트 사용 시)
  4. PWA 점수 확인 (manifest, SW, HTTPS 요구사항)
- **검증**: Lighthouse Performance 90+, PWA 점수 통과
- **복잡도**: M
- **예상 소요**: 3시간

#### Task 10: 크로스 브라우저 테스트 및 버그 수정
- **대상 브라우저**:
  - Chrome/Edge 최신 2개 버전 (데스크톱 + 모바일)
  - Safari iOS 14+ (iPhone 시뮬레이터 또는 실기기)
  - Firefox 최신 2개 버전
  - Samsung Internet (선택적)
- **테스트 시나리오**:
  1. 전체 게임 루프 (블록 드래그→배치→라인 제거→게임 오버→재시작)
  2. LocalStorage 저장/복원
  3. 사운드 재생 (Web Audio API 지원 여부 확인)
  4. 햅틱 피드백 (Vibration API 지원 여부 확인)
  5. PWA 설치 프롬프트 동작
  6. 오프라인 모드 게임 플레이
  7. 반응형 레이아웃 (375px, 768px, 1280px)
- **작업 내용**:
  - 발견된 호환성 이슈 목록화 및 우선순위 분류
  - Critical/High 이슈 당 스프린트 내 수정
  - Low 이슈는 Sprint 5 백로그 이관
- **검증**: 모든 대상 브라우저에서 게임 핵심 기능 정상 동작
- **복잡도**: M
- **예상 소요**: 4시간

---

### Day 13-14: 통합 테스트 및 마무리

#### Task 11: 통합 테스트 및 최종 검증
- **작업 내용**:
  1. 전체 기능 통합 시나리오 수동 테스트:
     - PWA 설치 → 오프라인 게임 플레이 → 점수 저장 확인
     - 사운드 on/off → 게임 진행 → 각 이벤트 사운드 확인
     - 햅틱 on/off → 모바일에서 진동 피드백 확인
     - 게임 오버 → 재시작 → 설정 유지 확인 (사운드/햅틱 토글 상태)
  2. `npm test` 최종 실행 → 전체 통과 확인
  3. `npm run build` 번들 크기 최종 확인 (500KB gzip 이하)
  4. 콘솔 에러/경고 없음 확인
  5. 모바일(375px), 태블릿(768px), 데스크톱(1280px) 레이아웃 확인
  6. ROADMAP.md 업데이트 (Sprint 4 완료 상태 반영)
- **복잡도**: M
- **예상 소요**: 4시간

---

## 기술적 접근 방법

### 사운드 구현 전략: Web Audio API vs 파일

Web Audio API 프로그래매틱 방식을 우선 선택한다.

**이유**:
- 번들 크기 영향 없음 (파일 로딩 불필요)
- 외부 의존성 없음 (Howler.js 불필요)
- 간단한 효과음(클릭, 비프, 스윕)은 오실레이터로 충분히 구현 가능

**구현 예시**:
```typescript
// useSound.ts 내부 - 블록 배치 "톡" 소리
function playPlace(ctx: AudioContext) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05)
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.1)
}
```

**Autoplay 정책 대응**:
- `AudioContext`는 첫 사용자 인터랙션(클릭/터치) 후 초기화
- `useSound` 훅 내부에서 `audioContextRef`를 `null`로 초기화 후 첫 재생 요청 시 생성
- `ctx.state === 'suspended'`면 `ctx.resume()` 호출 후 재생

### PWA와 게임 상태 연동

Service Worker가 `gameStore.ts`의 Zustand persist LocalStorage와 충돌하지 않도록 주의한다.

- SW 캐싱 대상: JS/CSS/HTML/이미지 (정적 에셋)
- LocalStorage는 SW 캐시 범위 밖 → 별도 처리 불필요
- 앱 업데이트 시(`registerType: 'autoUpdate'`): 새 SW 활성화 후 게임 상태 복원 정상 동작 확인

### 사운드/햅틱 콜백 패턴

Zustand store 내부에서 React 훅 직접 호출 불가 → 컴포넌트 레벨 구독 패턴 사용:

```typescript
// App.tsx 또는 별도 GameEffects.tsx 컴포넌트
function GameEffects() {
  const lastEvent = useGameStore(s => s.lastAudioEvent) // 'place' | 'clear' | 'gameover' | null
  const { playPlace, playClear, playGameOver } = useSound()
  const { vibratePlace, vibrateClear, vibrateGameOver } = useHaptic()

  useEffect(() => {
    if (lastEvent === 'place') { playPlace(); vibratePlace() }
    if (lastEvent === 'clear') { playClear(); vibrateClear() }
    if (lastEvent === 'gameover') { playGameOver(); vibrateGameOver() }
  }, [lastEvent])

  return null
}
```

`gameStore.ts`에 `lastAudioEvent: string | null` 상태 추가. `placeBlock` 내에서 이벤트 발생 후 설정, 처리 후 초기화.

---

## 의존성 및 리스크

| 리스크 | 영향도 | 발생 확률 | 대응 방안 |
|--------|--------|-----------|-----------|
| iOS Safari Vibration API 미지원 | 낮음 | 확실 | 지원 여부 체크 후 graceful degradation, 토글 UI 조건부 렌더링 |
| Web Audio API autoplay 정책 위반 | 중간 | 중간 | 첫 인터랙션 후 AudioContext 초기화, `ctx.resume()` 패턴 적용 |
| vite-plugin-pwa Service Worker 캐시 무효화 이슈 | 중간 | 낮음 | `registerType: 'autoUpdate'` + `cleanupOutdatedCaches: true` 설정 |
| PWA 설치 프롬프트 브라우저별 동작 차이 | 낮음 | 높음 | `beforeinstallprompt` 미지원 브라우저는 프롬프트 비표시, iOS는 수동 안내로 대체 |
| 사운드 파일 사용 시 번들 크기 증가 | 중간 | 낮음 | Web Audio API 프로그래매틱 방식 우선, 파일 필요 시 `public/` 분리 배치 |
| Lighthouse PWA 점수 미달 (HTTPS 필요) | 중간 | 낮음 | 로컬 preview는 HTTP이므로 Vercel 배포 후 최종 측정 필요 |
| 바운스 애니메이션 spring 설정 과도한 탄성 | 낮음 | 중간 | stiffness/damping 값 조정 (400/25 기본값, 필요 시 350/30으로 조정) |

---

## 완료 기준 (Definition of Done)

| # | 완료 기준 | 검증 방법 |
|---|-----------|-----------|
| 1 | `npm run build`가 타입 에러 없이 성공한다 | 자동 |
| 2 | `npm test`가 전체 통과한다 | 자동 |
| 3 | gzip 번들 크기 500KB 이하이다 | 빌드 출력 확인 |
| 4 | `Board.tsx`의 `animatingSet` 루프에 `BOARD_SIZE` 상수가 사용된다 | 코드 리뷰 |
| 5 | 배치 불가 드롭 시 블록이 바운스 애니메이션으로 원위치에 복귀한다 | 수동 테스트 |
| 6 | PWA 설치 가능하다 (`manifest.json`, Service Worker 등록, 아이콘 포함) | DevTools Application 탭 |
| 7 | 오프라인 모드에서 게임을 플레이할 수 있다 | DevTools Network > Offline 시뮬레이션 |
| 8 | Lighthouse PWA 카테고리 점수가 통과 기준을 충족한다 | Lighthouse 측정 |
| 9 | Lighthouse Performance 점수 90 이상이다 | Lighthouse 측정 (배포 환경 또는 로컬 preview) |
| 10 | 블록 배치/라인 제거/콤보/게임 오버 시 각 사운드가 재생된다 | 수동 테스트 |
| 11 | 사운드 토글 off 시 모든 사운드가 재생되지 않는다 | 수동 테스트 |
| 12 | 사운드/햅틱 설정이 새로고침 후에도 유지된다 | 새로고침 후 수동 확인 |
| 13 | Android Chrome에서 블록 배치/라인 제거/게임 오버 시 햅틱 진동이 발생한다 | 수동 테스트 (실기기) |
| 14 | iOS Safari에서 햅틱 미지원 시 오류 없이 정상 동작한다 | 수동 테스트 |
| 15 | Chrome, Safari iOS, Firefox 최신 버전에서 게임 핵심 기능이 정상 동작한다 | 수동 크로스 브라우저 테스트 |
| 16 | 콘솔 런타임 에러 및 경고가 없다 | 브라우저 콘솔 확인 |

---

## 예상 산출물

| 산출물 | 경로 |
|--------|------|
| PWA 플러그인 설정 (업데이트) | `vite.config.ts` |
| PWA manifest | `public/manifest.json` |
| 앱 아이콘 (192px) | `public/icons/icon-192.png` |
| 앱 아이콘 (512px) | `public/icons/icon-512.png` |
| 설치 프롬프트 훅 | `src/hooks/useInstallPrompt.ts` |
| 설치 프롬프트 컴포넌트 | `src/components/UI/InstallPrompt.tsx` |
| 사운드 훅 | `src/hooks/useSound.ts` |
| 햅틱 훅 | `src/hooks/useHaptic.ts` |
| 설정 스토어 (신규) | `src/stores/settingsStore.ts` |
| 사운드 토글 컴포넌트 | `src/components/UI/SoundToggle.tsx` |
| 햅틱 토글 컴포넌트 | `src/components/UI/HapticToggle.tsx` |
| 게임 이펙트 컴포넌트 | `src/components/UI/GameEffects.tsx` |
| 업데이트: Board.tsx (TD1) | `src/components/Board/Board.tsx` |
| 업데이트: DraggableBlock.tsx (TD2, TD4) | `src/components/Block/DraggableBlock.tsx` |
| 업데이트: Cell.tsx (TD5) | `src/components/Board/Cell.tsx` |
| 업데이트: gameStore.ts | `src/stores/gameStore.ts` |
| 업데이트: App.tsx | `src/App.tsx` |
| Sprint 4 계획 문서 | `docs/sprint/sprint4/sprint-plan.md` |

---

## Playwright MCP 검증 시나리오

`npm run build && npm run preview` 실행 후 아래 순서로 검증한다.

### 기술 부채 해소 검증
1. `browser_navigate` → `http://localhost:4173` 접속
2. `browser_snapshot` → 초기 렌더링 확인
3. 블록을 배치 불가 위치에 드롭 → `browser_snapshot` → 바운스 복귀 애니메이션 결과 확인

### PWA 검증
4. `browser_snapshot` → 앱 정상 렌더링 확인
5. DevTools Application > Manifest → manifest 항목 확인 (이름, 아이콘, display 등)
6. DevTools Application > Service Workers → SW 등록 상태 `activated and running` 확인
7. DevTools Network > Offline 체크 → `browser_navigate` 새로고침 → 게임 화면 정상 로드 확인
8. `browser_console_messages(level: "error")` → SW 관련 에러 없음 확인

### 설치 프롬프트 검증
9. `browser_snapshot` → 설치 배너 또는 설치 가능 표시 확인
10. `browser_click` → 설치 배너의 "홈 화면에 추가" 버튼 클릭
11. `browser_snapshot` → 설치 처리 진행 확인

### 사운드 토글 검증
12. `browser_snapshot` → 사운드 토글 버튼 존재 및 접근성 라벨 확인
13. `browser_click` → 사운드 토글 off 클릭
14. `browser_snapshot` → 토글 상태 off 시각적 표시 확인
15. `browser_navigate` → 새로고침
16. `browser_snapshot` → 사운드 토글 off 상태 유지 확인

### 햅틱 토글 검증 (Vibration API 지원 환경)
17. `browser_snapshot` → 햅틱 토글 버튼 존재 확인
18. `browser_click` → 햅틱 토글 off 클릭
19. `browser_snapshot` → 토글 상태 변경 확인

### Lighthouse 검증
20. `browser_navigate` → `http://localhost:4173` 접속
21. Lighthouse Performance 탭 측정 → 점수 90+ 확인
22. Lighthouse PWA 탭 측정 → 통과 확인

### 공통 검증
23. `browser_console_messages(level: "error")` → 에러 없음 확인
24. `browser_resize(width: 375, height: 812)` → 모바일 레이아웃 정상 확인
25. `browser_resize(width: 1280, height: 800)` → 데스크톱 레이아웃 정상 확인

---

## 품질 검증 체크리스트

- [x] ROADMAP.md의 Sprint 4 목표 및 완료 기준과 일치
- [x] Sprint 3 검증 보고서의 모든 이월 항목(TD1-TD5, 바운스 애니메이션) 처리 계획 포함
- [x] 모든 태스크가 구체적이고 실행 가능한 단위로 분해됨
- [x] 각 태스크에 예상 소요 시간, 담당 파일, 검증 방법이 명시됨
- [x] 완료 기준(Definition of Done) 16개 항목이 측정 가능하게 정의됨
- [x] ROADMAP.md의 기술 고려사항(vite-plugin-pwa, Web Audio autoplay, Vibration iOS 미지원, 사운드 포맷) 모두 반영
- [x] 기술 부채 처리(TD1~TD5) 우선순위와 필수/선택 구분이 명확함
- [x] 파일이 올바른 경로(`docs/sprint/sprint4/sprint-plan.md`)에 저장됨

---

## 검증 결과

- [검증 보고서](verification-report.md)
