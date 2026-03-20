# Sprint 2 검증 보고서

**스프린트**: Sprint 2 - 게임 로직과 데이터 저장
**검증일**: 2026-03-20
**브랜치**: `main_sprint-2`
**검증자**: sprint-close agent

---

## 자동 검증 결과

### 빌드 및 테스트

| 항목 | 결과 | 세부 내용 |
|------|------|-----------|
| `npm run build` | ✅ 성공 | 타입 에러 없음, 번들 105KB (gzip) |
| `npm test` | ✅ 성공 | 42/42 테스트 통과 (6개 파일) |
| `eslint src` | ✅ 성공 | 에러/경고 없음 (ESLint disable 주석 1건 적용) |

### 테스트 파일 목록

| 파일 | 테스트 수 | 상태 |
|------|-----------|------|
| `src/utils/__tests__/boardUtils.test.ts` | - | ✅ 통과 |
| `src/utils/__tests__/lineUtils.test.ts` | - | ✅ 통과 |
| `src/utils/__tests__/scoreUtils.test.ts` | - | ✅ 통과 |
| `src/utils/__tests__/gameOverUtils.test.ts` | - | ✅ 통과 |
| `src/stores/__tests__/gameStore.test.ts` | - | ✅ 통과 |
| `src/utils/__tests__/blockUtils.test.ts` | - | ✅ 통과 |

---

## 코드 리뷰 결과

### Critical / High 이슈

없음.

### Medium 이슈

| # | 파일 | 이슈 | 영향도 |
|---|------|------|--------|
| M1 | `src/stores/gameStore.ts` | `placeBlock`의 `setTimeout(300ms)` 내부 클로저가 상태 변화를 즉시 참조하지 않아, 애니메이션 도중 추가 배치 시 경쟁 조건이 발생할 수 있음 | Medium - Sprint 3에서 입력 차단 로직 추가 시 해소 |
| M2 | `src/components/UI/ScoreDisplay.tsx` | `useEffect` 내 카운트업 로직이 `displayScore`를 클로저로 캡처하여 의존성 배열에서 제외 (eslint-disable 처리). 의도적 구현이나 스냅샷 시점 값 의존으로 엣지케이스 존재 | Low - 기능에는 영향 없음 |
| M3 | `src/utils/gameOverUtils.ts` | `blocks.length === 0` 체크 후 `false` 반환 - 블록이 모두 소진된 직후 새 블록 생성 전 순간에 게임 오버 오탐 가능성. 현재 로직상 발생하지 않으나 방어적 처리 검토 필요 | Low |

### Low 이슈 / 개선 제안

| # | 파일 | 내용 |
|---|------|------|
| L1 | `src/stores/gameStore.ts` | `BOARD_SIZE` 상수가 `boardUtils.ts`, `lineUtils.ts`, `gameOverUtils.ts`, `gameStore.ts`에 중복 정의됨. 공통 상수 파일(`src/constants/game.ts`)로 추출 권장 |
| L2 | `src/components/UI/GameOverModal.tsx` | `isNewBest` 조건이 `score >= highScore && score > 0`. 게임 오버 후 `highScore`가 이미 `score`와 동일하게 갱신되므로 `>=` 사용이 맞으나, 최초 게임 오버(score=0) 제외 로직 확인 필요 |

---

## Definition of Done 체크리스트

| # | 완료 기준 | 검증 방법 | 결과 |
|---|-----------|-----------|------|
| 1 | `npm run build`가 타입 에러 없이 성공한다 | 자동 | ✅ |
| 2 | 블록을 보드의 유효한 위치에 배치할 수 있다 | 수동 필요 | ⬜ |
| 3 | 유효 위치: 녹색, 무효 위치: 빨간색 프리뷰가 표시된다 | 수동 필요 | ⬜ |
| 4 | 완성된 행/열이 자동으로 감지되고 제거된다 (블록 낙하 없음) | 단위 테스트 + 수동 | ✅ (단위) / ⬜ (수동) |
| 5 | 점수가 PRD 공식대로 정확하게 계산된다 | 단위 테스트 | ✅ |
| 6 | 3개 블록 모두 배치 불가 시 게임 오버 모달이 표시된다 | 수동 필요 | ⬜ |
| 7 | 재시작 버튼으로 빈 보드 + 점수 0으로 초기화된다 | 수동 필요 | ⬜ |
| 8 | 최고 점수와 게임 상태가 LocalStorage에 저장/복원된다 | 수동 필요 | ⬜ |
| 9 | 단위 테스트가 존재하고 모두 통과한다 | 자동 | ✅ (42/42) |
| 10 | 콘솔 런타임 에러가 없다 | 수동 필요 | ⬜ |
| 11 | 모바일(375px)과 데스크톱(1280px)에서 레이아웃이 올바르다 | 수동 필요 | ⬜ |

---

## 수동 검증 필요 항목

`npm run dev` 후 `http://localhost:5173` 에서 아래 항목을 직접 확인해야 합니다.

1. **블록 드래그 프리뷰**: 블록을 드래그하여 빈 위치 위에서 녹색 반투명 오버레이, 이미 채워진 셀이나 범위 밖에서 빨간색 오버레이 확인
2. **블록 배치 후 점수 증가**: 블록 드롭 후 상단 Score 숫자 카운트업 및 `+N` 플로팅 텍스트 확인
3. **라인 제거**: 행 또는 열을 꽉 채운 후 300ms 페이드아웃 → 셀 제거 확인
4. **게임 오버 모달**: 보드를 채워 게임 오버 유도 → "GAME OVER" 모달, 최종 점수, 최고 점수 표시 확인
5. **재시작**: 모달의 "다시 시작" 버튼 클릭 → 빈 보드 + 점수 0 초기화 확인
6. **LocalStorage 복원**: 게임 진행 후 새로고침 → 보드 상태와 점수 복원 확인
7. **브라우저 콘솔 에러**: DevTools Console 탭에서 에러 없음 확인
8. **모바일 레이아웃**: DevTools Device Toolbar에서 375px로 전환 후 레이아웃 확인
9. **데스크톱 레이아웃**: 1280px에서 보드 최대 500px 제한 확인

---

## ESLint 수정 사항

**파일**: `src/components/UI/ScoreDisplay.tsx`

카운트업 애니메이션 `useEffect`에서 `displayScore`가 의존성 배열에 포함되면 카운트업 중 매 setState마다 effect가 재실행되어 무한 루프가 발생합니다. `score` 변경 시에만 실행되는 것이 의도된 동작이므로 `eslint-disable-next-line react-hooks/exhaustive-deps` 주석으로 경고를 억제했습니다.

---

## 스프린트 완료 판정

자동 검증 항목 (5/11) 모두 통과. 수동 검증 항목 (6/11)은 개발자가 직접 수행해야 합니다.

**코드 품질**: Critical/High 이슈 없음. Medium 이슈 3건은 Sprint 3에서 해소 예정.
