# Sprint 3 계획: 애니메이션 정교화 및 성능 최적화

**스프린트 번호**: Sprint 3 / 6
**Phase**: Phase 2 - 개선 및 최적화
**기간**: 2026-03-21 ~ 2026-04-03 (2주)
**작성일**: 2026-03-20
**브랜치**: `main_sprint-2` → `main_sprint-3` (신규 브랜치 생성 후 작업)

---

## 스프린트 목표 (Sprint Goal)

> Sprint 2에서 발견된 기술 부채(입력 차단 로직 부재, BOARD_SIZE 상수 중복)를 해소하고, 애니메이션을 정교화하며, Lighthouse Performance 90+ · 번들 500KB 이하 · 모바일 60fps 애니메이션을 달성한다.

Sprint 2에서 구축한 완전한 게임 루프를 바탕으로, Phase 2의 첫 번째 스프린트로서 게임 품질을 플레이어가 체감할 수 있는 수준으로 끌어올린다. 기술 부채 해소와 성능 기반 마련을 병행하여 Sprint 4(PWA/사운드)가 안정된 코드베이스 위에서 진행될 수 있도록 한다.

---

## Sprint 2 인수 사항 (Input)

Sprint 2 검증 보고서(`docs/sprint/sprint2/verification-report.md`)에서 확인된 Sprint 3 진입 조건:

| 항목 | 상태 | 비고 |
|------|------|------|
| 완전한 게임 루프 (배치·라인·점수·게임오버) | ✅ 완료 | |
| 42/42 단위 테스트 통과 | ✅ 완료 | |
| `npm run build` 성공 (번들 105KB gzip) | ✅ 완료 | |
| ESLint 에러/경고 없음 | ✅ 완료 | ESLint disable 주석 1건 (ScoreDisplay) |
| setTimeout 중 입력 차단 로직 부재 (M1) | ⚠️ 미결 | Sprint 3 필수 처리 |
| BOARD_SIZE 상수 4개 파일 중복 정의 (L1) | ⚠️ 미결 | Sprint 3 Day 1 처리 |
| ScoreDisplay useEffect 의존성 이슈 (M2) | ✅ 해소됨 | eslint-disable 처리로 의도적 억제 |

---

## Sprint 2 기술 부채 처리 계획

Sprint 3 시작 전 아래 부채를 우선 처리한다.

### [필수] TD1: setTimeout 애니메이션 중 입력 차단 로직 추가

- **파일**: `src/stores/gameStore.ts`, `src/hooks/useDragDrop.ts`
- **문제**: `placeBlock`의 `setTimeout(300ms)` 내부에서 `clearLines`를 호출하는 동안, 이미 다음 블록 드래그가 가능하여 경쟁 조건(race condition) 발생 가능
- **수정**:
  1. `GameState`에 `isAnimating: boolean` 필드 추가
  2. `placeBlock` 호출 시 `isAnimating: true` 설정 → setTimeout 완료 후 `isAnimating: false`
  3. `useDragDrop.ts`: `isAnimating`이 `true`이면 `touchstart`/`mousedown` 이벤트 처리 차단
- **검증**: 라인 제거 애니메이션(300ms) 도중 다른 블록 드래그 시도 시 무반응 확인
- **예상 소요**: 1.5시간
- **우선순위**: 최우선 (Day 1 시작 시)

### [필수] TD2: BOARD_SIZE 상수 공통 파일 추출

- **파일**: `src/constants/game.ts` (신규), `src/utils/boardUtils.ts`, `src/utils/lineUtils.ts`, `src/utils/gameOverUtils.ts`, `src/stores/gameStore.ts`
- **문제**: `BOARD_SIZE = 8` 상수가 4개 파일에 각각 중복 정의되어, 향후 보드 크기 변경 시 일관성 깨질 위험
- **수정**:
  1. `src/constants/game.ts` 신규 생성: `export const BOARD_SIZE = 8` 및 기타 게임 전역 상수 정의
  2. 4개 파일에서 로컬 `BOARD_SIZE` 정의 삭제, `constants/game.ts`에서 import로 교체
- **검증**: `npm test` 전체 통과, `npm run build` 성공
- **예상 소요**: 30분
- **우선순위**: Day 1 (TD1 완료 직후)

---

## 구현 범위

### 포함 (In Scope)

- Sprint 2 기술 부채 처리 (TD1 입력 차단, TD2 상수 추출)
- 애니메이션 정교화
  - 블록 드래그 시 유효 위치 hover 프리뷰 투명도 개선 (opacity 0.6)
  - 라인 제거 파티클 효과 (선택적, 구현 복잡도에 따라 조정)
  - 블록 배치 불가 시 원위치 복귀 바운스 애니메이션
  - 게임 오버 시 보드 셰이크(shake) 효과
- 성능 최적화
  - `React.memo` 적용 (Cell 컴포넌트 중심)
  - `useMemo` / `useCallback` 캐싱
  - `will-change` CSS 속성 적용
  - 코드 스플리팅 (GameOverModal lazy load)
  - 번들 분석 및 트리 셰이킹 확인
- 모바일 터치 최적화 강화
  - iOS Safari 터치 지연 제거
  - 터치 영역 최소 44x44px 보장
  - 큰 블록 드래그 시 손가락 오프셋 조정

### 제외 (Out of Scope)

- PWA, Service Worker (Sprint 4)
- 사운드, 햅틱 피드백 (Sprint 4)
- 다크 모드, 설정 패널 (Sprint 5)
- 타임 어택 모드, 점수 공유 (Sprint 6)
- `BlockTray.tsx` 이중 구독 정리 (Sprint 4로 이월 - 동작에 영향 없음)

---

## 작업 분해 (Task Breakdown)

### Day 1-2: 기술 부채 처리

#### Task 1: 입력 차단 로직 추가 (TD1)

- **담당 파일**: `src/stores/gameStore.ts`, `src/hooks/useDragDrop.ts`, `src/types/game.ts`
- **작업 내용**:
  1. `src/types/game.ts`: `GameState`에 `isAnimating: boolean` 필드 추가
  2. `src/stores/gameStore.ts`: `placeBlock` 내 애니메이션 시작 직전 `set({ isAnimating: true })`, `setTimeout` 콜백 끝에서 `set({ isAnimating: false })`
  3. `src/hooks/useDragDrop.ts`: `useGameStore`에서 `isAnimating` 구독, `handleDragStart` (mousedown/touchstart 핸들러) 첫 줄에 `if (isAnimating) return` 조건 추가
  4. `GameState` 초기값에 `isAnimating: false` 추가, persist `partialize`에서 제외
- **검증**:
  - 라인 제거 애니메이션(300ms) 도중 블록 드래그 시도 시 드래그 시작 안 됨 확인
  - 300ms 경과 후 정상적으로 드래그 가능 확인
  - `npm test` 전체 통과
- **복잡도**: S
- **예상 소요**: 1.5시간

#### Task 2: BOARD_SIZE 상수 추출 (TD2)

- **담당 파일**: `src/constants/game.ts` (신규), `src/utils/boardUtils.ts`, `src/utils/lineUtils.ts`, `src/utils/gameOverUtils.ts`, `src/stores/gameStore.ts`
- **작업 내용**:
  1. `src/constants/game.ts` 신규 생성:
     ```typescript
     export const BOARD_SIZE = 8;
     export const BLOCK_TRAY_SIZE = 3;
     // 향후 추가될 전역 상수를 위한 단일 진입점
     ```
  2. `boardUtils.ts`, `lineUtils.ts`, `gameOverUtils.ts`, `gameStore.ts` 각각에서:
     - 로컬 `const BOARD_SIZE = 8` 정의 삭제
     - 파일 상단에 `import { BOARD_SIZE } from '../constants/game'` (또는 상대 경로) 추가
- **검증**: `npm test` 42/42 통과, `npm run build` 성공, TypeScript 컴파일 에러 없음
- **복잡도**: S
- **예상 소요**: 30분

---

### Day 3-5: 애니메이션 정교화

#### Task 3: 드래그 hover 프리뷰 개선

- **담당 파일**: `src/components/Board/Cell.tsx`, `src/components/Board/Board.tsx`
- **작업 내용**:
  1. 기존 유효 위치 프리뷰 `opacity-30` → `opacity-60`으로 변경 (ROADMAP 명세 0.6)
  2. Framer Motion `motion.div` 전환 애니메이션 추가 (`animate={{ opacity }}`, `transition: { duration: 0.1 }`)
  3. 드래그 중 hover 위치 변경 시 이전 프리뷰 → 새 프리뷰 크로스페이드
- **검증**: 드래그 중 유효 위치 이동 시 프리뷰가 부드럽게 전환됨 확인 (모바일 포함)
- **복잡도**: S
- **예상 소요**: 2시간

#### Task 4: 블록 배치 불가 원위치 바운스 애니메이션

- **담당 파일**: `src/components/Block/DraggableBlock.tsx`, `src/hooks/useDragDrop.ts`
- **작업 내용**:
  1. 드롭 실패(무효 위치) 시 `DraggableBlock`이 원래 BlockTray 위치로 복귀하는 애니메이션 구현
  2. 복귀 시 바운스 효과: Framer Motion `spring` transition (stiffness: 300, damping: 20)
  3. 복귀 중 블록이 반투명(opacity: 0.7)으로 표시되다가 완전 불투명으로 전환
  4. 구현 흐름:
     - `useDragDrop.ts`: 드롭 실패 시 블록의 원점 좌표(BlockTray 내 위치)를 `dragState`에 저장
     - `DraggableBlock.tsx`: `animate` prop에 복귀 좌표 전달, `onAnimationComplete`에서 드래그 상태 초기화
- **검증**: 무효 위치 드롭 후 블록이 Tray 위치로 바운스 복귀 확인, 복귀 중 다른 블록 드래그 불가(TD1 연동) 확인
- **복잡도**: M
- **예상 소요**: 3시간

#### Task 5: 게임 오버 보드 셰이크 효과

- **담당 파일**: `src/components/Board/Board.tsx`, `src/stores/gameStore.ts`
- **작업 내용**:
  1. `GameState`에 `isShaking: boolean` 필드 추가 (persist 제외)
  2. `gameStore.ts`: 게임 오버 판정 직후 `set({ isShaking: true })`, 500ms 후 `set({ isShaking: false })`
  3. `Board.tsx`: `isShaking`을 구독하여 Framer Motion `animate` 적용
     ```
     variants={{ shake: { x: [-8, 8, -6, 6, -4, 4, 0] } }}
     transition: { duration: 0.5, ease: 'easeInOut' }
     ```
  4. 셰이크 완료 후 GameOverModal 표시 (현재 즉시 표시에서 500ms 지연으로 변경)
- **검증**: 게임 오버 시 보드가 좌우로 흔들린 후 모달 표시 확인, 60fps 유지 확인
- **복잡도**: M
- **예상 소요**: 2시간

#### Task 6: 라인 제거 파티클 효과 (선택적)

- **담당 파일**: `src/components/Board/Board.tsx`, `src/components/Board/LineClearEffect.tsx` (신규)
- **작업 내용**:
  1. `LineClearEffect.tsx` 신규 컴포넌트: 라인 제거 시 셀 위치에서 작은 원형 파티클이 퍼져나가는 효과
  2. 구현 방식: CSS `@keyframes` + Framer Motion으로 6~8개 파티클을 방사형으로 이동 후 fade out
  3. 파티클 색상: 제거되는 셀의 블록 색상 활용
  4. Board.tsx에서 `animatingLines` 상태 변경 시 `LineClearEffect` 렌더링
  5. **성능 우선**: 파티클이 60fps를 유지하지 못하면 단순 flash 효과(배경색 잠깐 밝아지기)로 대체
- **검증**: 라인 제거 시 파티클 또는 flash 효과 표시 확인, 모바일에서 60fps 유지 확인
- **복잡도**: M
- **예상 소요**: 3시간
- **우선순위**: Task 3~5 완료 후 진행. 성능 영향 크면 scope-out 가능.

---

### Day 6-8: 성능 최적화

#### Task 7: React.memo 및 useMemo/useCallback 적용

- **담당 파일**: `src/components/Board/Cell.tsx`, `src/components/Board/Board.tsx`, `src/components/Block/BlockPreview.tsx`, `src/components/Block/BlockTray.tsx`
- **작업 내용**:
  1. `Cell.tsx`: `React.memo` 래핑. props 비교 함수 작성
     - `filled`, `color`, `isPreview`, `isInvalid`, `isAnimating` 중 변경된 것만 리렌더
     - 64개 셀 중 실제 변경된 셀만 리렌더링되도록 보장
  2. `Board.tsx`:
     - `useMemo`: 프리뷰 셀 계산 (`boardPos` + 블록 shape → `Set<string>`) 메모이제이션
     - `useCallback`: `onDrop` 핸들러 메모이제이션
  3. `BlockPreview.tsx`: `React.memo` 래핑 (블록 shape/색상이 바뀔 때만 리렌더)
  4. `BlockTray.tsx`: `useCallback`으로 각 블록별 드래그 핸들러 메모이제이션
- **검증**:
  - React DevTools Profiler로 블록 드래그 중 Cell 리렌더링 수 확인 (변경된 셀만 리렌더)
  - 드래그 중 프레임 드롭 없음 확인 (Chrome DevTools Performance)
- **복잡도**: M
- **예상 소요**: 4시간

#### Task 8: CSS will-change 및 passive 이벤트 리스너 적용

- **담당 파일**: `src/components/Board/Cell.tsx`, `src/components/Block/DraggableBlock.tsx`, `src/hooks/useDragDrop.ts`, `src/index.css`
- **작업 내용**:
  1. `Cell.tsx`: 애니메이션 대상 셀에 `will-change: opacity, transform` 인라인 스타일 추가
     - 주의: 64개 모든 셀에 항상 적용하면 메모리 증가. `isAnimating || isPreview || isInvalid` 조건부 적용
  2. `DraggableBlock.tsx`: 드래그 중인 블록에 `will-change: transform` 적용
  3. `useDragDrop.ts`: `mousemove`, `touchmove` 이벤트 리스너에 `{ passive: true }` 옵션 추가
     - `preventDefault()`가 필요한 `touchstart`는 `passive: false` 유지 (스크롤 방지 목적)
  4. `src/index.css`: 게임 영역 전체에 `contain: layout style` CSS 속성 추가 (레이아웃 격리)
- **검증**:
  - Chrome DevTools Performance 탭에서 "Forced Reflow" 경고 없음
  - `passive` 리스너 관련 콘솔 경고 없음
- **복잡도**: S
- **예상 소요**: 2시간

#### Task 9: 코드 스플리팅 및 번들 최적화

- **담당 파일**: `src/App.tsx`, `vite.config.ts`
- **작업 내용**:
  1. `App.tsx`: `GameOverModal` dynamic import로 변경
     ```typescript
     const GameOverModal = lazy(() => import('./components/UI/GameOverModal'));
     // Suspense fallback은 null (모달은 게임 오버 시에만 표시)
     ```
  2. `vite.config.ts`: 번들 분석 설정 추가
     ```typescript
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'framer-motion': ['framer-motion'],
             'zustand': ['zustand'],
           }
         }
       }
     }
     ```
  3. `npm run build -- --report` 또는 `rollup-plugin-visualizer`로 번들 구성 분석
  4. Framer Motion: 사용하지 않는 기능 tree-shaking 확인 (named import 방식 유지)
- **검증**: `npm run build` 후 gzip 번들 크기 500KB 이하 확인 (현재 105KB → 목표 유지)
- **복잡도**: M
- **예상 소요**: 3시간

---

### Day 9-10: 모바일 터치 최적화 강화 + 통합 검증

#### Task 10: 모바일 터치 최적화 강화

- **담당 파일**: `src/hooks/useDragDrop.ts`, `src/components/Block/DraggableBlock.tsx`, `src/index.css`
- **작업 내용**:
  1. **iOS Safari 터치 지연 제거**:
     - `index.css`에 `* { touch-action: manipulation; }` (단, 드래그 대상은 `touch-action: none` 유지)
     - `<meta name="viewport">` 태그에 `user-scalable=no` 추가 확인
  2. **터치 영역 최소 44x44px 보장**:
     - `BlockPreview.tsx`: 블록 컨테이너 최소 크기 `min-w-[44px] min-h-[44px]` 적용 (작은 블록 포함)
     - 실제 렌더링 크기 확인 (DevTools)
  3. **드래그 오프셋 조정**:
     - 현재 블록이 터치 포인트 중앙에 위치 → 손가락에 블록이 가려지는 문제 해소
     - `useDragDrop.ts`: `touchstart` 시 블록을 터치 포인트 위쪽으로 Y 오프셋 적용 (-60px ~ -80px, 블록 높이의 1.5배)
     - 마우스 드래그는 기존 방식 유지 (가릴 이유 없음)
  4. **드래그 중 페이지 스크롤 방지**:
     - 드래그 활성 상태에서 `touchmove`의 `preventDefault()` 호출 확인 (`passive: false`)
     - body `overflow: hidden` 드래그 시작/종료 시 토글
- **검증**:
  - iOS Safari (실기 또는 시뮬레이터) / Android Chrome에서 터치 드래그 부드럽게 동작
  - 작은 블록(1x1, 1x2)도 터치 영역 충분히 확보됨
  - 드래그 중 페이지 스크롤 없음
- **복잡도**: M
- **예상 소요**: 4시간

#### Task 11: Lighthouse 성능 측정 및 버그 수정

- **작업 내용**:
  1. `npm run build` 후 Vercel 또는 로컬 preview 서버에서 Lighthouse 측정
     - Performance, Best Practices, Accessibility 항목 확인
  2. Performance 90+ 미달 시 병목 항목 식별 및 수정:
     - 주요 관심: LCP (Largest Contentful Paint), TBT (Total Blocking Time), CLS
  3. Chrome DevTools Performance 탭으로 드래그 중 프레임 드롭 확인
  4. 발견된 버그 수정 및 콘솔 경고 제거
  5. 모바일(375px), 데스크톱(1280px) 레이아웃 최종 확인
- **복잡도**: M
- **예상 소요**: 3시간

---

## 기술적 접근 방법

### 입력 차단 패턴 (TD1 핵심 설계)

`isAnimating` 플래그를 Zustand store에 두어 단일 진실 공급원으로 관리한다. `useDragDrop` 훅이 이 플래그를 구독하고 드래그 시작 지점에서 조기 반환하는 방식은 구현이 단순하고 디버깅이 쉽다.

```
[placeBlock 호출]
  → set({ isAnimating: true })
  → 보드 상태 업데이트
  → animatingLines 저장
  → setTimeout(300ms)
       → clearLines 호출
       → set({ isAnimating: false, animatingLines: null })

[useDragDrop handleDragStart]
  → if (isAnimating) return  ← 이 한 줄로 경쟁 조건 방지
  → 드래그 시작
```

### React.memo 적용 전략

`Cell.tsx`는 8x8 = 64개 인스턴스가 존재한다. 매 드래그 이동마다 `Board.tsx`가 리렌더되면 64개 셀 전체가 리렌더될 수 있다. `React.memo`와 커스텀 비교 함수를 통해 실제 변경된 셀(프리뷰 위치, 애니메이션 대상)만 리렌더되도록 한다.

비교 함수 예시:
```typescript
const areEqual = (prev: CellProps, next: CellProps) =>
  prev.filled === next.filled &&
  prev.color === next.color &&
  prev.isPreview === next.isPreview &&
  prev.isInvalid === next.isInvalid &&
  prev.isAnimatingClear === next.isAnimatingClear;
```

### will-change 조건부 적용

`will-change: transform`을 모든 64개 셀에 항상 적용하면 GPU 메모리를 불필요하게 점유한다. 다음 조건에서만 적용한다:

- 드래그 중인 블록(`DraggableBlock`): 항상 적용
- 라인 제거 애니메이션 대상 셀: `animatingLines`에 포함된 경우에만 적용
- 드래그 프리뷰 셀: 프리뷰 상태인 경우에만 적용

---

## 의존성 및 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| TD1 isAnimating 도입으로 기존 테스트 깨짐 | 중간 | `gameStore.test.ts` 수정 필요. 초기값 `isAnimating: false` 추가, persist partialize 업데이트 |
| React.memo 커스텀 비교 함수 누락 prop | 중간 | 비교 함수에 모든 props 포함 여부 체크리스트 작성. DevTools Profiler로 검증 |
| 파티클 효과 60fps 미달 | 낮음 | Task 6에서 성능 우선으로 단순 flash 효과로 대체 가능. scope-out 기준 명확화 |
| iOS Safari will-change 메모리 이슈 | 낮음 | 조건부 적용으로 완화. 실기 테스트에서 메모리 확인 |
| DraggableBlock 원위치 좌표 계산 어려움 | 중간 | BlockTray에서 각 블록의 DOM ref를 통해 getBoundingClientRect()로 원점 계산 |

---

## 완료 기준 (Definition of Done)

| # | 완료 기준 | 검증 방법 |
|---|-----------|-----------|
| 1 | `npm run build`가 타입 에러 없이 성공한다 | `npm run build` |
| 2 | `npm test`가 전체 통과한다 (TD1·TD2 수정 반영) | `npm test` |
| 3 | 라인 제거 애니메이션(300ms) 도중 블록 드래그가 차단된다 | 수동 테스트 |
| 4 | `BOARD_SIZE` 상수가 `src/constants/game.ts` 단일 위치에서 정의된다 | 코드 리뷰 |
| 5 | Lighthouse Performance 점수 90 이상이다 | Lighthouse 측정 |
| 6 | gzip 번들 크기 500KB 이하이다 | `npm run build` 출력 확인 |
| 7 | 모든 애니메이션이 모바일에서 60fps를 유지한다 | Chrome DevTools Performance |
| 8 | 블록 배치 불가 시 원위치 바운스 애니메이션이 동작한다 | 수동 테스트 |
| 9 | 게임 오버 시 보드 셰이크 효과 후 모달이 표시된다 | 수동 테스트 |
| 10 | iOS Safari, Android Chrome에서 터치 드래그가 정상 동작한다 | 디바이스/시뮬레이터 수동 테스트 |
| 11 | 드래그 중 터치 영역이 최소 44x44px이다 | DevTools 수동 확인 |
| 12 | 콘솔 런타임 에러 및 passive 리스너 경고가 없다 | 브라우저 콘솔 확인 |

---

## 예상 산출물

| 산출물 | 경로 |
|--------|------|
| 게임 전역 상수 파일 (신규) | `src/constants/game.ts` |
| 라인 제거 파티클 효과 컴포넌트 (신규, 선택적) | `src/components/Board/LineClearEffect.tsx` |
| 업데이트: 타입 정의 (`isAnimating`, `isShaking`) | `src/types/game.ts` |
| 업데이트: gameStore (입력 차단, 셰이크 로직) | `src/stores/gameStore.ts` |
| 업데이트: useDragDrop (입력 차단, 오프셋 조정) | `src/hooks/useDragDrop.ts` |
| 업데이트: Cell (React.memo, will-change) | `src/components/Board/Cell.tsx` |
| 업데이트: Board (useMemo 최적화, 셰이크 애니메이션) | `src/components/Board/Board.tsx` |
| 업데이트: DraggableBlock (바운스 복귀 애니메이션, will-change) | `src/components/Block/DraggableBlock.tsx` |
| 업데이트: BlockPreview (React.memo, 최소 터치 영역) | `src/components/Block/BlockPreview.tsx` |
| 업데이트: App.tsx (GameOverModal lazy load) | `src/App.tsx` |
| 업데이트: index.css (touch-action, contain) | `src/index.css` |
| Sprint 3 계획 문서 | `docs/sprint/sprint3/sprint-plan.md` |

---

## Playwright MCP 검증 시나리오

`npm run dev` 실행 후 아래 순서로 검증한다.

### 기술 부채 해소 검증

1. `browser_navigate` → `http://localhost:5173` 접속
2. `browser_snapshot` → 초기 렌더링 확인, 콘솔 에러 없음
3. 블록을 드래그하여 행/열 완성 위치에 배치 (라인 제거 트리거)
4. 라인 제거 애니메이션(300ms) 진행 도중 즉시 다른 블록 드래그 시도
5. `browser_snapshot` → 드래그가 무시됨 확인 (입력 차단 검증)
6. 300ms 경과 후 다시 드래그 → `browser_snapshot` → 정상 드래그 가능 확인

### 애니메이션 검증

7. 블록을 무효 위치에 드롭 → `browser_snapshot` → 블록이 원위치로 바운스 복귀 확인
8. 보드를 채워 게임 오버 유도 → `browser_snapshot` → 보드 셰이크 효과 후 모달 표시 확인
9. 드래그 중 유효 위치 hover → `browser_snapshot` → opacity 0.6 프리뷰 표시 확인

### 모바일 터치 검증

10. `browser_resize(width: 375, height: 812)` → iPhone 크기로 전환
11. `browser_snapshot` → 터치 영역 크기 확인 (최소 44px)
12. `browser_click` → 블록 영역 클릭 → 즉각 반응 확인 (지연 없음)
13. `browser_snapshot` → 모바일 레이아웃 올바름 확인

### 성능 검증

14. `browser_resize(width: 1280, height: 800)` → 데스크톱 크기 복원
15. `browser_console_messages(level: "warning")` → passive 리스너 경고 없음 확인
16. `browser_console_messages(level: "error")` → 에러 없음 확인

---

## 품질 검증 체크리스트

- [x] ROADMAP.md의 Sprint 3 목표(Lighthouse 90+, 번들 500KB 이하, 모바일 60fps) 및 완료 기준과 일치
- [x] Sprint 2 verification-report.md의 기술 부채(M1 입력 차단, L1 BOARD_SIZE) 처리 계획 포함
- [x] ScoreDisplay useEffect 이슈(M2)는 Sprint 2에서 의도적 억제로 해소됨 - Sprint 3 처리 불필요
- [x] 모든 태스크가 구체적이고 실행 가능한 단위로 분해됨
- [x] 각 태스크에 예상 소요 시간과 검증 방법이 명시됨
- [x] 완료 기준(Definition of Done) 12개 항목이 측정 가능하게 정의됨
- [x] ROADMAP.md의 기술 고려사항(React.memo, will-change, Framer Motion layout 주의) 반영
- [x] Task 6(파티클 효과)에 scope-out 기준 명확히 기재
