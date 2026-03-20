# Sprint 2 계획: 게임 로직과 데이터 저장

**스프린트 번호**: Sprint 2 / 6
**Phase**: Phase 1 - MVP 게임 코어
**기간**: 2026-03-21 ~ 2026-04-03 (2주)
**작성일**: 2026-03-20
**브랜치**: `main_sprint-1` → `main_sprint-2` (신규 브랜치 생성 후 작업)

---

## 스프린트 목표 (Sprint Goal)

> 블록 배치 유효성 검사, 라인 감지/제거, 점수 계산, 게임 오버 판정, LocalStorage 저장이 모두 동작하는 **완전한 게임 루프**를 완성한다.

Sprint 1에서 구축한 보드 렌더링과 드래그 앤 드롭 인프라 위에, 게임의 핵심 규칙(배치 규칙, 라인 클리어, 점수, 게임 오버)과 데이터 지속성을 구현한다. 이 스프린트가 완료되면 **M2: MVP 릴리스** 마일스톤에 도달한다.

---

## Sprint 1 인수 사항 (Input)

Sprint 1 검증 보고서(`docs/sprint/sprint1/verification-report.md`)에서 확인된 Sprint 2 진입 조건:

| 항목 | 상태 | 비고 |
|------|------|------|
| 8x8 보드 렌더링 | ✅ 완료 | |
| 19종 블록 정의 및 3개 표시 | ✅ 완료 | |
| 드래그 앤 드롭 기본 구현 | ✅ 완료 | |
| ESLint 에러 없음 | ✅ 완료 | |
| `tsc -b` 빌드 타입 에러 | ⚠️ 미결 | vite.config.ts 수정 필요 (Sprint 2 Day 1에 처리) |

---

## Sprint 1 기술 부채 처리 계획

Sprint 2 시작 전 아래 부채를 우선 처리한다.

### [필수] T1: vite.config.ts 타입 에러 수정

- **파일**: `vite.config.ts`
- **수정**: `import { defineConfig } from 'vite'` → `import { defineConfig } from 'vitest/config'`
- **검증**: `npm run build` 성공 확인
- **예상 소요**: 15분
- **우선순위**: 최우선 (Day 1 시작 시)

### [권장] T2: PixelPosition 타입 분리

- **파일**: `src/types/game.ts`, `src/hooks/useDragDrop.ts`, `src/components/Block/DraggableBlock.tsx`
- **수정**: `PixelPosition { x: number, y: number }` 타입 신규 정의, `DragState.currentPos` 타입을 `PixelPosition | null`로 변경
- **검증**: TypeScript 컴파일 에러 없음
- **예상 소요**: 30분
- **우선순위**: Day 1 (T1 완료 직후)

---

## 구현 범위

### 포함 (In Scope)

- 블록 배치 유효성 검사 (`boardUtils.ts`)
- 드롭 위치 시각적 프리뷰 (유효: 녹색, 무효: 빨간색)
- 라인 감지 및 제거 (`lineUtils.ts`)
- 점수 시스템 (`scoreUtils.ts`) - PRD 공식 준수
- 게임 오버 로직 (`gameOverUtils.ts`)
- 게임 오버 모달 UI
- 기본 애니메이션 (배치 스냅, 라인 페이드아웃, 점수 카운트업)
- LocalStorage 통합 (Zustand persist 미들웨어)
- 전체 게임 화면 레이아웃 완성

### 제외 (Out of Scope)

- 파티클 효과, 게임 오버 보드 셰이크 (Sprint 3)
- 모바일 터치 최적화 고도화 (Sprint 3)
- PWA, 사운드, 햅틱 (Sprint 4)
- 다크 모드, 설정 패널 (Sprint 5)

---

## 작업 분해 (Task Breakdown)

### Day 1-2: 기술 부채 처리 + 배치 유효성 검사

#### Task 1: 기술 부채 처리 (T1 + T2)
- **담당 파일**: `vite.config.ts`, `src/types/game.ts`, `src/hooks/useDragDrop.ts`, `src/components/Block/DraggableBlock.tsx`
- **작업 내용**:
  1. `vite.config.ts`: `defineConfig` import를 `vitest/config`에서 가져오도록 수정
  2. `src/types/game.ts`: `PixelPosition { x: number, y: number }` 타입 추가, `DragState.currentPos` 타입 변경
  3. `src/hooks/useDragDrop.ts`: `currentPos` 저장 시 `{ x: pixelX, y: pixelY }` 형식으로 변경
  4. `src/components/Block/DraggableBlock.tsx`: `currentPos.x`, `currentPos.y`로 참조 변경
- **검증**: `npm run build` 성공, 단위 테스트 전체 통과
- **복잡도**: S
- **예상 소요**: 1시간

#### Task 2: boardUtils.ts 구현
- **파일**: `src/utils/boardUtils.ts`
- **작업 내용**:
  1. `canPlaceBlock(board: Cell[][], block: Block, row: number, col: number): boolean` 함수 구현
     - 보드 범위 초과 여부 검사 (블록의 모든 채워진 셀이 0..7 범위 내)
     - 이미 채워진 셀 위 배치 여부 검사
     - 두 조건 모두 통과 시 `true` 반환
  2. `getBlockCells(block: Block, row: number, col: number): Position[]` 함수 구현
     - 블록 배치 시 영향받는 보드 좌표 목록 반환 (애니메이션/프리뷰 활용)
- **검증**: 단위 테스트 작성 (`src/utils/__tests__/boardUtils.test.ts`)
  - 유효한 위치 반환 케이스 (보드 중앙, 모서리 등)
  - 보드 범위 초과 케이스
  - 채워진 셀 위 배치 케이스
- **복잡도**: M
- **예상 소요**: 3시간

#### Task 3: gameStore.ts placeBlock 개선 + 드롭 프리뷰
- **파일**: `src/stores/gameStore.ts`, `src/components/Board/Cell.tsx`, `src/components/Board/Board.tsx`
- **작업 내용**:
  1. `gameStore.ts`: `placeBlock`에 `canPlaceBlock` 호출 추가, 유효하지 않으면 `dragState` 초기화 후 early return
  2. `Cell.tsx`: `row`, `col` props를 실제 활용. `isPreview`, `isInvalid` prop 추가하여 프리뷰 색상 적용
     - 유효 위치: `bg-green-400 opacity-30` 오버레이
     - 무효 위치: `bg-red-400 opacity-30` 오버레이
  3. `Board.tsx`: `dragState.boardPos`와 드래그 중인 블록 shape를 이용해 프리뷰 셀 계산, 각 Cell에 전달
- **검증**: 드래그 중 유효/무효 위치에 올바른 색상 표시
- **복잡도**: M
- **예상 소요**: 4시간

---

### Day 3-4: 라인 감지 및 제거 + 점수 시스템

#### Task 4: lineUtils.ts 구현
- **파일**: `src/utils/lineUtils.ts`
- **작업 내용**:
  1. `getCompletedLines(board: Cell[][]): { rows: number[], cols: number[] }` 함수 구현
     - 각 행(row) 8칸 모두 `filled: true`인지 검사
     - 각 열(col) 8칸 모두 `filled: true`인지 검사
     - 완성된 행 인덱스 배열, 열 인덱스 배열 반환
  2. `clearLines(board: Cell[][], completedRows: number[], completedCols: number[]): Cell[][]` 함수 구현
     - 완성된 행/열에 해당하는 셀을 `{ filled: false, color: null }`로 초기화
     - 교차점(완성 행 + 완성 열)도 동일하게 처리 (한 번에 초기화)
     - **주의**: 블록이 아래로 떨어지지 않음 (Block Blast 규칙)
- **검증**: 단위 테스트 (`src/utils/__tests__/lineUtils.test.ts`)
  - 단일 행 완성 케이스
  - 단일 열 완성 케이스
  - 행+열 동시 완성 (십자 제거) 케이스
  - 아무것도 완성되지 않은 케이스
- **복잡도**: M
- **예상 소요**: 3시간

#### Task 5: scoreUtils.ts 구현
- **파일**: `src/utils/scoreUtils.ts`
- **작업 내용**:
  1. `calcPlacementScore(block: Block): number` 함수
     - 블록의 채워진 셀 수 반환 (각 셀 1점)
  2. `calcLineClearScore(lineCount: number): number` 함수 - PRD 공식 적용
     - 1줄: 10점
     - 2줄: 30점
     - 3줄: 60점
     - 4줄: 100점
     - 5줄 이상: `n * (n * 5)` 보너스
  3. `calcComboScore(comboCount: number): number` 함수
     - 연속 라인 제거 시 +10점/콤보
  4. `GameState`에 `comboCount: number` 필드 추가 (라인 제거 연속 횟수 추적)
     - 블록 배치 시 라인이 제거되면 `comboCount++`
     - 라인이 제거되지 않으면 `comboCount = 0`으로 리셋
- **검증**: 단위 테스트 (`src/utils/__tests__/scoreUtils.test.ts`)
  - 각 라인 수별 점수 계산 정확도 확인
  - 콤보 보너스 누적 확인
- **복잡도**: S
- **예상 소요**: 2시간

#### Task 6: gameStore.ts 라인 감지 통합
- **파일**: `src/stores/gameStore.ts`
- **작업 내용**:
  1. `placeBlock` 액션 내에 블록 배치 후 다음 순서로 처리:
     ```
     1. canPlaceBlock 검사 → 실패 시 early return
     2. 보드에 블록 배치
     3. getCompletedLines 호출
     4. 완성된 라인이 있으면 clearLines 호출
     5. 점수 계산 (배치 점수 + 라인 클리어 점수 + 콤보 점수)
     6. comboCount 업데이트
     7. 최고 점수 갱신 여부 확인
     8. 사용된 블록 제거, 3개 모두 소진 시 새 블록 생성
     9. 게임 오버 조건 검사 (checkGameOver 호출)
     ```
  2. `comboCount` 상태 필드 추가
- **검증**: gameStore 통합 테스트 - 블록 배치 후 라인 제거 및 점수 계산 정확도 확인
- **복잡도**: M
- **예상 소요**: 3시간

---

### Day 5-6: 게임 오버 로직 + UI 컴포넌트

#### Task 7: gameOverUtils.ts 구현
- **파일**: `src/utils/gameOverUtils.ts`
- **작업 내용**:
  1. `canAnyBlockBePlaced(board: Cell[][], blocks: Block[]): boolean` 함수 구현
     - 3개 블록 각각에 대해 보드의 모든 빈 위치 조합 검사
     - 하나라도 배치 가능하면 즉시 `true` 반환 (조기 탈출 최적화)
     - 모두 배치 불가 시 `false` 반환
  2. 최적화 전략: 빈 위치 목록을 먼저 수집 후 순회 (전체 64 위치 반복 최소화)
- **검증**: 단위 테스트 (`src/utils/__tests__/gameOverUtils.test.ts`)
  - 배치 가능한 블록이 있는 케이스
  - 모든 블록이 배치 불가한 케이스 (거의 꽉 찬 보드)
  - 빈 보드 케이스 (항상 true)
- **복잡도**: M
- **예상 소요**: 3시간

#### Task 8: GameOverModal.tsx 구현
- **파일**: `src/components/UI/GameOverModal.tsx`
- **작업 내용**:
  1. 모달 구조 (Framer Motion `AnimatePresence` 활용):
     - 반투명 배경 오버레이 (fade in)
     - 중앙 카드 (scale + fade in)
  2. 표시 내용:
     - "GAME OVER" 타이틀
     - 최종 점수
     - 최고 점수 (갱신 시 "New Best!" 배지 표시)
  3. "다시 시작" 버튼 → `resetGame()` 액션 호출
  4. `isGameOver` 상태를 구독하여 표시 여부 결정
- **검증**: 게임 오버 상태에서 모달 표시, "다시 시작" 클릭 시 보드 초기화
- **복잡도**: M
- **예상 소요**: 3시간

#### Task 9: ScoreDisplay.tsx 구현
- **파일**: `src/components/UI/ScoreDisplay.tsx`
- **작업 내용**:
  1. 현재 점수 표시 (Framer Motion `useMotionValue` + `useTransform` 또는 간단한 useState로 카운트업)
  2. 최고 점수 표시
  3. 점수 변경 시 숫자 카운트업 애니메이션
  4. 점수 획득 시 `+N` 플로팅 텍스트 (position: absolute, 위로 올라가며 fade out)
     - 배치 점수와 라인 클리어 점수를 별도 플로팅으로 표시
- **검증**: 점수 획득 시 카운트업 및 플로팅 텍스트 표시 확인
- **복잡도**: M
- **예상 소요**: 3시간

---

### Day 7-8: 애니메이션 + LocalStorage

#### Task 10: 기본 애니메이션 구현
- **파일**: `src/components/Board/Board.tsx`, `src/components/Board/Cell.tsx`, `src/hooks/useDragDrop.ts`
- **작업 내용**:
  1. 블록 배치 스냅 애니메이션:
     - 드롭 시 블록이 타겟 그리드 위치로 스냅되는 느낌 (200ms ease-out)
     - `DraggableBlock.tsx`의 고스트 레이어가 사라지는 시점과 Board의 셀이 채워지는 시점 동기화
  2. 라인 제거 페이드아웃:
     - 완성된 라인의 Cell들이 `opacity: 0, scale: 0.8`로 페이드아웃 (300ms)
     - 애니메이션 완료 후 실제 상태 업데이트 (`clearLines` 호출)
     - Framer Motion `AnimatePresence` 또는 `motion.div` `exit` 속성 활용
  3. 드롭 실패 애니메이션:
     - 유효하지 않은 위치에 드롭 시 블록이 원래 위치(BlockTray)로 복귀 (바운스 없이 단순 이동)
- **기술 참고사항**:
  - 라인 제거 애니메이션을 위해 gameStore에 `animatingLines: { rows: number[], cols: number[] } | null` 임시 상태 추가 고려
  - 애니메이션 duration 동안 게임 입력 차단 (드래그 비활성화)
- **복잡도**: M
- **예상 소요**: 4시간

#### Task 11: LocalStorage 통합 (Zustand persist)
- **파일**: `src/stores/gameStore.ts`, `src/utils/storage.ts`
- **작업 내용**:
  1. `src/utils/storage.ts`: 스토리지 키 상수 정의, 직렬화/역직렬화 헬퍼 (선택적)
  2. `gameStore.ts`에 Zustand `persist` 미들웨어 적용:
     ```typescript
     import { persist } from 'zustand/middleware'
     // create<GameStore>()(persist(..., { name: 'block-blast-game' }))
     ```
  3. 저장할 상태 선택 (`partialize` 옵션):
     - 저장: `board`, `score`, `highScore`, `currentBlocks`, `isGameOver`, `comboCount`
     - 저장 제외: `dragState` (드래그 상태는 세션별 임시 데이터)
  4. 페이지 로드 시 저장된 상태 자동 복원 확인
  5. `highScore` 갱신 로직: `placeBlock` 처리 후 `score > highScore`이면 `highScore` 업데이트
- **검증**:
  - 게임 진행 후 새로고침 → 이전 보드 상태 복원
  - 최고 점수 갱신 후 새로고침 → 최고 점수 유지
  - `dragState`는 새로고침 후 초기값으로 리셋
- **복잡도**: S
- **예상 소요**: 2시간

---

### Day 9-10: 레이아웃 완성 + 통합 테스트

#### Task 12: 전체 게임 화면 레이아웃 완성
- **파일**: `src/App.tsx`, `src/App.css`, `src/index.css`
- **작업 내용**:
  1. `App.tsx` 최종 레이아웃 구성:
     ```
     [ ScoreDisplay (상단) ]
     [ Board (중앙, 8x8)  ]
     [ BlockTray (하단)   ]
     [ GameOverModal (오버레이, isGameOver 시) ]
     ```
  2. PRD 섹션 4.1 레이아웃 다이어그램 준수:
     - 전체 높이: `100dvh` (dynamic viewport height, iOS Safari 호환)
     - 세로 배치: `flex flex-col justify-between`
     - 보드: 화면 중앙 정렬, 모바일 90vw / 데스크톱 최대 500px
  3. PRD 섹션 4.2 라이트 모드 색상 팔레트 전체 적용:
     - 배경: `#F2F2F7`
     - 보드 배경: `#FFFFFF`
     - 셀 테두리: `#E5E5EA`
  4. `index.css`: `touch-action: none` 전역 적용 (body), safe-area-inset 패딩
- **검증**: PRD 레이아웃 다이어그램과 시각적 일치 여부 확인
- **복잡도**: S
- **예상 소요**: 3시간

#### Task 13: 통합 테스트 및 버그 수정
- **작업 내용**:
  1. 전체 게임 루프 E2E 시나리오 수동 테스트:
     - 블록 드래그 → 유효 위치 드롭 → 배치 확인
     - 블록 드래그 → 무효 위치 드롭 → 원위치 복귀 확인
     - 행/열 완성 → 라인 제거 + 점수 증가 확인
     - 십자 라인 제거 시나리오
     - 게임 오버 유도 → 모달 표시 → 재시작
     - 새로고침 후 게임 상태 복원
  2. 발견된 버그 수정
  3. 콘솔 에러/경고 없음 확인
  4. 모바일(375px)과 데스크톱(1280px) 레이아웃 확인
- **복잡도**: M
- **예상 소요**: 4시간

---

## 기술적 접근 방법

### 라인 제거 애니메이션과 상태 업데이트 순서

라인 제거 애니메이션을 구현할 때 **React 상태 업데이트 타이밍**이 핵심 과제입니다.

권장 방식:
1. 블록 배치 후 `completedLines`를 gameStore에 `animatingLines` 임시 상태로 저장
2. Board/Cell 컴포넌트가 `animatingLines`를 구독하여 해당 셀에 exit 애니메이션 적용
3. 300ms 후 실제 `clearLines` 호출 (setTimeout 또는 Framer Motion `onAnimationComplete`)
4. `animatingLines`를 null로 초기화

이 방식을 사용하면 애니메이션과 상태 업데이트가 분리되어 깜빡임 없이 자연스러운 전환이 가능합니다.

### 게임 오버 판정 최적화

보드 8x8 = 64개 위치 × 최대 3개 블록 = 최대 192번의 `canPlaceBlock` 호출입니다. 블록 배치 후에만 검사하며, 조기 탈출을 적용하므로 성능 문제는 없습니다. 별도 캐싱은 필요하지 않습니다.

### Zustand persist 직렬화 주의사항

`dragState`는 `partialize` 옵션으로 저장 제외합니다. `currentBlocks`는 `Block` 인터페이스(순수 직렬화 가능 객체)이므로 별도 직렬화 처리 불필요합니다.

---

## 의존성 및 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 라인 제거 애니메이션과 상태 동기화 어려움 | 중간 | `animatingLines` 임시 상태 패턴 사용, 애니메이션 단순화 옵션 유지 |
| 점수 플로팅 텍스트 위치 계산 어려움 | 낮음 | ScoreDisplay 영역에 고정 위치로 단순화 가능 |
| persist 미들웨어 + 기존 gameStore 구조 변경 | 낮음 | `create<GameStore>()(persist(...))` 래핑 패턴 적용 (표준 방식) |
| 드롭 프리뷰 셀 계산 성능 | 낮음 | 드래그 중에만 계산, `useMemo`로 메모이제이션 |

---

## 완료 기준 (Definition of Done)

| # | 완료 기준 | 검증 방법 |
|---|-----------|-----------|
| 1 | `npm run build`가 타입 에러 없이 성공한다 | CI/CD 또는 로컬 `npm run build` |
| 2 | 블록을 보드의 유효한 위치에 배치할 수 있다 | 수동 테스트 |
| 3 | 유효 위치: 녹색 반투명 프리뷰, 무효 위치: 빨간색 반투명 프리뷰가 표시된다 | 수동 테스트 |
| 4 | 완성된 행/열이 자동으로 감지되고 제거된다 (블록은 떨어지지 않음) | 수동 테스트 + 단위 테스트 |
| 5 | 점수가 PRD 공식대로 정확하게 계산된다 | 단위 테스트 (scoreUtils) |
| 6 | 3개 블록 모두 배치 불가 시 게임 오버 모달이 표시된다 | 수동 테스트 |
| 7 | 재시작 버튼으로 빈 보드 + 점수 0으로 초기화된다 | 수동 테스트 |
| 8 | 최고 점수와 게임 상태가 LocalStorage에 저장/복원된다 | 새로고침 후 수동 확인 |
| 9 | `boardUtils`, `lineUtils`, `scoreUtils`, `gameOverUtils` 단위 테스트가 존재하고 모두 통과한다 | `npm test` |
| 10 | 콘솔 런타임 에러가 없다 | 브라우저 콘솔 확인 |
| 11 | 모바일(375px)과 데스크톱(1280px)에서 레이아웃이 올바르다 | 브라우저 DevTools 수동 확인 |

---

## 예상 산출물

| 산출물 | 경로 |
|--------|------|
| 배치 유효성 검사 유틸 | `src/utils/boardUtils.ts` |
| 배치 유효성 단위 테스트 | `src/utils/__tests__/boardUtils.test.ts` |
| 라인 감지/제거 유틸 | `src/utils/lineUtils.ts` |
| 라인 감지 단위 테스트 | `src/utils/__tests__/lineUtils.test.ts` |
| 점수 계산 유틸 | `src/utils/scoreUtils.ts` |
| 점수 계산 단위 테스트 | `src/utils/__tests__/scoreUtils.test.ts` |
| 게임 오버 판정 유틸 | `src/utils/gameOverUtils.ts` |
| 게임 오버 단위 테스트 | `src/utils/__tests__/gameOverUtils.test.ts` |
| 스토리지 유틸 | `src/utils/storage.ts` |
| 점수 표시 컴포넌트 | `src/components/UI/ScoreDisplay.tsx` |
| 게임 오버 모달 컴포넌트 | `src/components/UI/GameOverModal.tsx` |
| 업데이트: gameStore | `src/stores/gameStore.ts` |
| 업데이트: game.ts 타입 | `src/types/game.ts` |
| 업데이트: App.tsx 레이아웃 | `src/App.tsx` |
| Sprint 2 계획 문서 | `docs/sprint/sprint2/sprint-plan.md` |

---

## Playwright MCP 검증 시나리오

`npm run dev` 실행 후 아래 순서로 검증한다.

### 블록 배치 검증
1. `browser_navigate` → `http://localhost:5173` 접속
2. `browser_snapshot` → 게임 보드와 3개 블록, 점수 영역 확인
3. `browser_snapshot` → 빌드 에러/콘솔 에러 없음 확인
4. 블록 드래그 후 유효 위치 hover → `browser_snapshot` → 녹색 프리뷰 확인
5. 블록 드래그 후 무효 위치 hover → `browser_snapshot` → 빨간색 프리뷰 확인
6. 유효 위치에 드롭 → `browser_snapshot` → 블록 배치 + 점수 증가 확인

### 라인 제거 검증
7. 여러 블록 배치로 행 또는 열 완성
8. `browser_snapshot` → 라인 제거 + 점수 증가 (10점+) 확인

### 게임 오버 검증
9. 보드를 거의 채워 게임 오버 유도
10. `browser_snapshot` → 게임 오버 모달 표시 확인 (최종 점수, 최고 점수, "다시 시작" 버튼)
11. `browser_click` → "다시 시작" 버튼 클릭
12. `browser_snapshot` → 빈 보드 + 점수 0으로 초기화 확인

### 데이터 저장 검증
13. 게임 진행 중 `browser_navigate` → 같은 URL로 새로고침
14. `browser_snapshot` → 이전 게임 상태 복원 확인 (보드, 점수 유지)

### 공통 검증
15. `browser_console_messages(level: "error")` → 에러 없음 확인
16. `browser_resize(width: 375, height: 812)` → 모바일 레이아웃 확인
17. `browser_resize(width: 1280, height: 800)` → 데스크톱 레이아웃 확인

---

## 품질 검증 체크리스트

- [x] ROADMAP.md의 Sprint 2 목표 및 완료 기준과 일치
- [x] Sprint 1 검증 보고서의 기술 부채(T1 필수, T2 권장) 처리 계획 포함
- [x] 모든 태스크가 구체적이고 실행 가능한 단위로 분해됨
- [x] 각 태스크에 예상 소요 시간과 검증 방법이 명시됨
- [x] 완료 기준(Definition of Done) 11개 항목이 측정 가능하게 정의됨
- [x] ROADMAP.md의 기술 고려사항(라인 감지 타이밍, 게임 오버 최적화, persist 직렬화) 반영
