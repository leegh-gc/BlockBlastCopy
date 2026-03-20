# Sprint 3 검증 보고서

**스프린트**: Sprint 3 - 애니메이션 정교화 및 성능 최적화
**검증일**: 2026-03-20
**브랜치**: `main_sprint-3`
**검증자**: sprint-close agent

---

## 자동 검증 결과

### 빌드 및 테스트

| 항목 | 결과 | 세부 내용 |
|------|------|-----------|
| `npm run build` | ✅ 성공 | 타입 에러 없음 |
| `npm test` | ✅ 성공 | 42/42 테스트 통과 (6개 파일) |
| 번들 크기 (gzip) | ✅ 500KB 이하 | `index.js`: 105.95KB, `GameOverModal`: 0.72KB (별도 청크) |

### 번들 구성

| 파일 | 크기 (raw) | 크기 (gzip) |
|------|-----------|------------|
| `dist/assets/index-*.js` | 331.40 kB | 105.95 kB |
| `dist/assets/GameOverModal-*.js` | 1.63 kB | 0.72 kB |
| `dist/assets/index-*.css` | 16.23 kB | 4.18 kB |
| `dist/index.html` | 0.49 kB | 0.31 kB |

GameOverModal이 별도 청크로 분리되어 초기 로딩 번들에서 제외됨. 목표 500KB 이하 달성.

### 테스트 파일 목록

| 파일 | 상태 |
|------|------|
| `src/utils/__tests__/boardUtils.test.ts` | ✅ 통과 |
| `src/utils/__tests__/lineUtils.test.ts` | ✅ 통과 |
| `src/utils/__tests__/scoreUtils.test.ts` | ✅ 통과 |
| `src/utils/__tests__/gameOverUtils.test.ts` | ✅ 통과 |
| `src/stores/__tests__/gameStore.test.ts` | ✅ 통과 |
| `src/utils/__tests__/blockUtils.test.ts` | ✅ 통과 |

---

## 코드 리뷰 결과

### Critical / High 이슈

없음.

### Medium 이슈

| # | 파일 | 이슈 | 영향도 |
|---|------|------|--------|
| M1 | `src/components/Board/Board.tsx` | `animatingSet` 계산 시 루프 상한값이 하드코딩된 `8`로 사용됨 (`for (let c = 0; c < 8; c++)`). `BOARD_SIZE` 상수로 교체하는 것이 일관성 면에서 더 좋음. TD2의 취지와 불일치 | Low - 기능에 영향 없음, Sprint 4에서 수정 권장 |

### Low 이슈 / 개선 제안

| # | 파일 | 내용 |
|---|------|------|
| L1 | `src/components/Board/LineClearEffect.tsx` | 플래시 오버레이 위치 계산(`left/top` %)이 보드의 `gap-0.5` 및 `p-1` 패딩을 고려하지 않아 셀과 픽셀 단위 정렬이 약간 어긋날 수 있음. 시각적 효과 용도로는 허용 범위 |
| L2 | `src/components/Block/DraggableBlock.tsx` | Y 오프셋 `-75px` 하드코딩. 블록 크기(`cellSize=22`)와 최대 shape 높이를 기반으로 동적 계산하는 방식이 더 견고함. 현재 값은 실용적으로 충분히 동작 |
| L3 | `src/components/Board/Cell.tsx` | `areEqual` 비교 함수에 `row`, `col` props가 포함되지 않음. `key`로 구분되므로 문제없으나 명시적 완전성 측면에서 검토 가능 |

---

## Sprint 3 기술 부채 처리 결과

Sprint 2에서 이월된 기술 부채:

| # | 이슈 | Sprint 3 처리 결과 |
|---|------|-------------------|
| M1 (구) | `placeBlock` setTimeout 중 경쟁 조건 | ✅ 해소 - `isAnimating` 플래그로 드래그 입력 차단 구현 |
| L1 (구) | BOARD_SIZE 상수 4개 파일 중복 정의 | ✅ 해소 - `src/constants/game.ts` 단일 진입점 통합 |
| M2 (구) | ScoreDisplay useEffect 의존성 이슈 | ✅ 유지 - 의도적 억제, 기능 정상 동작 확인 |

---

## Definition of Done 체크리스트

| # | 완료 기준 | 검증 방법 | 결과 |
|---|-----------|-----------|------|
| 1 | `npm run build`가 타입 에러 없이 성공한다 | 자동 | ✅ |
| 2 | `npm test`가 전체 통과한다 (TD1·TD2 수정 반영) | 자동 | ✅ (42/42) |
| 3 | 라인 제거 애니메이션(300ms) 도중 블록 드래그가 차단된다 | 수동 필요 | ⬜ |
| 4 | `BOARD_SIZE` 상수가 `src/constants/game.ts` 단일 위치에서 정의된다 | 코드 리뷰 | ✅ |
| 5 | Lighthouse Performance 점수 90 이상이다 | 수동 필요 | ⬜ |
| 6 | gzip 번들 크기 500KB 이하이다 | 자동 | ✅ (105.95KB) |
| 7 | 모든 애니메이션이 모바일에서 60fps를 유지한다 | 수동 필요 | ⬜ |
| 8 | 블록 배치 불가 시 원위치 복귀 애니메이션이 동작한다 | 수동 필요 | ⬜ (미구현 - 단순 원위치로 대체) |
| 9 | 게임 오버 시 보드 셰이크 효과 후 모달이 표시된다 | 수동 필요 | ⬜ |
| 10 | iOS Safari, Android Chrome에서 터치 드래그가 정상 동작한다 | 수동 필요 | ⬜ |
| 11 | 드래그 중 터치 영역이 최소 44x44px이다 | 코드 리뷰 | ✅ (BlockPreview minWidth/minHeight: 44px) |
| 12 | 콘솔 런타임 에러 및 passive 리스너 경고가 없다 | 수동 필요 | ⬜ |

**참고**: DoD #8 바운스 복귀 애니메이션은 sprint-plan의 Task 4에 해당. 구현 범위에서 `DraggableBlock`이 단순 원위치 방식으로 처리됨. 바운스 Framer Motion spring 전환은 Sprint 4로 이월.

---

## 구현된 기능 요약

### 기술 부채 해소

- **TD1 isAnimating**: `gameStore.ts`에 `isAnimating: boolean` 상태 추가. `placeBlock` 호출 시 `true` → 300ms 후 `false`. `useDragDrop.ts`에서 `onMouseDown`/`onTouchStart` 첫 줄에 `if (isAnimating) return` 적용.
- **TD2 BOARD_SIZE**: `src/constants/game.ts` 신규 생성 (`BOARD_SIZE = 8`, `BLOCK_TRAY_SIZE = 3`). `boardUtils.ts`, `lineUtils.ts`, `gameOverUtils.ts`, `gameStore.ts`, `useDragDrop.ts`, `Board.tsx`, `LineClearEffect.tsx`에서 import로 교체.

### 애니메이션

- **드래그 프리뷰 크로스페이드**: `Cell.tsx`에서 `isPreview`/`isInvalid` 오버레이에 `initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 0.1 }}` 적용.
- **게임오버 보드 셰이크**: `Board.tsx`에서 `isShaking` 구독, `animate={{ x: [-8, 8, -6, 6, -4, 4, -2, 2, 0] }}`, `duration: 0.5`. 셰이크 500ms 후 `isGameOver: true` + 모달 표시.
- **LineClearEffect**: `Board.tsx` 오버레이 레이어. `animatingLines` 상태 기반으로 완성 행/열 셀 위치에 white flash (`opacity: 0.9 → 0`, `duration: 0.3`). 성능 우선으로 파티클 대신 flash 구현.

### 성능 최적화

- **React.memo Cell**: 커스텀 비교 함수 `areEqual` 적용 (`filled`, `color`, `isPreview`, `isInvalid`, `isAnimating` 비교). 실제 변경된 셀만 리렌더링.
- **React.memo BlockPreview**: `React.memo` 적용, `displayName` 설정.
- **useMemo Board**: `previewInfo`, `previewSet`, `animatingSet` 3개 메모이제이션.
- **will-change 조건부**: `Cell.tsx`에서 `needsGpu = isAnimating || isPreview || isInvalid` 조건부로 `willChange: 'opacity, transform'` 적용. `DraggableBlock.tsx`에서 `willChange: 'transform'` 상시 적용.
- **passive 이벤트**: `mousemove`에 `{ passive: true }` 적용. `touchmove`는 `preventDefault()` 필요로 `{ passive: false }` 유지.

### 코드 스플리팅

- `App.tsx`: `GameOverModal` lazy import + `Suspense fallback={null}`. 별도 청크 0.72KB(gzip) 분리.

### 터치 최적화

- **Y 오프셋**: `DraggableBlock.tsx`에서 `top: y - 75` 적용으로 드래그 시 손가락에 가려지는 문제 해소.
- **터치 영역**: `BlockPreview.tsx`에서 `minWidth: 44, minHeight: 44` 적용.
- **touch-action**: `index.css` body에 `touch-action: manipulation` 적용. Board div에 `touch-action: none` 유지.
- **contain**: `#root`에 `contain: layout style` 적용으로 레이아웃 격리 및 reflow 최소화.

---

## 수동 검증 필요 항목

`npm run dev` 후 `http://localhost:5173` 에서 아래 항목을 직접 확인해야 합니다.

1. **입력 차단 검증**: 행/열 완성 후 라인 제거 애니메이션(300ms) 중 다른 블록 드래그 시도 시 무반응 확인. 300ms 경과 후 정상 드래그 가능 확인.
2. **프리뷰 크로스페이드**: 블록을 드래그하여 유효 위치 이동 시 opacity 0.6 오버레이가 0.1s 전환 확인.
3. **게임오버 셰이크**: 보드를 채워 게임 오버 유도 → 보드 좌우 흔들림 500ms → 모달 표시 순서 확인.
4. **LineClearEffect**: 라인 제거 시 해당 행/열 위치에 흰색 flash 효과 확인.
5. **Lighthouse Performance 90+**: `npm run build` 후 로컬 preview 서버에서 Lighthouse 측정.
6. **모바일 60fps**: Chrome DevTools Performance 탭으로 드래그 중 프레임 드롭 없음 확인.
7. **터치 드래그**: iOS Safari 또는 DevTools 모바일 모드에서 블록 드래그 정상 동작 확인.
8. **콘솔 경고 없음**: DevTools Console에서 passive 리스너 경고 및 런타임 에러 없음 확인.
9. **데스크톱/모바일 레이아웃**: 375px, 1280px 양쪽 레이아웃 이상 없음 확인.

---

## Sprint 4 이월 항목

| 항목 | 이유 |
|------|------|
| 바운스 복귀 애니메이션 (DoD #8) | DraggableBlock Framer Motion spring 전환 미구현. 현재 단순 원위치로 동작 |
| `Board.tsx` animatingSet 루프 하드코딩 `8` | Medium 이슈 M1 - BOARD_SIZE 상수로 교체 |
| `BlockTray.tsx` 이중 구독 정리 | Sprint 3 Out-of-Scope로 계획 단계에서 제외됨 |

---

## 스프린트 완료 판정

자동 검증 항목 (4/12) 통과. 수동 검증 항목 (8/12)은 개발자가 직접 수행해야 합니다.

**코드 품질**: Critical/High 이슈 없음. Medium 이슈 1건 (Board.tsx 하드코딩 `8`), Low 이슈 3건. Sprint 4에서 처리 권장.

**빌드 결과**: 42/42 테스트 통과, 번들 105.95KB gzip (목표 500KB 이하 달성), GameOverModal 별도 청크 0.72KB 분리 성공.
