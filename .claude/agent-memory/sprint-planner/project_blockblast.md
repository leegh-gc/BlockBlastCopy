---
name: BlockBlast 프로젝트 현황 및 기술 스택
description: Block Blast Copy 프로젝트의 기술 스택, 아키텍처, 스프린트 진행 현황
type: project
---

## 프로젝트 개요

- **목표**: 광고 없는 모바일 친화적 웹 기반 8x8 블록 퍼즐 게임
- **전체 기간**: 6주 (3 Phase, 6 Sprint)
- **시작일**: 2026-03-20
- **MVP 목표일**: 2026-04-17 (Phase 1 Sprint 2 완료)
- **배포 플랫폼**: Vercel

## 기술 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | React 18 (Hooks) |
| 번들러 | Vite |
| 상태 관리 | Zustand |
| 스타일링 | Tailwind CSS |
| 애니메이션 | Framer Motion |
| 언어 | TypeScript |
| 테스트 | Vitest + React Testing Library |
| 배포 | Vercel |

## 스프린트 진행 현황

### Sprint 1 - 완료 (2026-03-20)
- 8x8 게임 보드 렌더링
- 19종 블록 정의 및 표시
- 드래그 앤 드롭 기본 구현 (마우스 + 터치)
- Zustand gameStore 기본 구조
- 단위 테스트 10개 통과

**미결 기술 부채:**
- `vite.config.ts` TypeScript 타입 에러 (런타임 무관, Sprint 2 필수 수정)
- `DragState.currentPos`의 `Position` 타입 픽셀 좌표 혼용 (Sprint 2 권장 수정)
- `BlockTray.tsx` 이중 구독 (Sprint 3 처리)
- `placeBlock` 유효성 검사 부재 (Sprint 2 핵심 구현)

### Sprint 2 - 완료 (2026-03-20)
- 목표: 완전한 게임 루프 (배치 유효성, 라인 제거, 점수, 게임 오버, LocalStorage)
- 결과: 42/42 단위 테스트 통과, 번들 105KB (gzip), ESLint 에러/경고 없음
- 계획 문서: `docs/sprint/sprint2/sprint-plan.md`
- 검증 보고서: `docs/sprint/sprint2/verification-report.md`

**미결 기술 부채 (Sprint 3 처리 예정):**
- M1: `gameStore.ts` setTimeout 300ms 내 입력 차단 로직 부재 → `isAnimating` 플래그로 해소 예정
- L1: `BOARD_SIZE` 상수 4개 파일 중복 → `src/constants/game.ts` 단일 파일로 추출 예정
- M2: `ScoreDisplay.tsx` useEffect 의존성 이슈 → eslint-disable 처리로 의도적 억제 완료 (추가 처리 불필요)

### Sprint 3 - 계획 수립 완료 (2026-03-20)
- 기간: 2026-03-21 ~ 2026-04-03 (2주)
- Phase: Phase 2 - 개선 및 최적화
- 목표: Sprint 2 기술 부채 해소 + 애니메이션 정교화 + Lighthouse 90+ · 번들 500KB · 모바일 60fps
- 계획 문서: `docs/sprint/sprint3/sprint-plan.md`
- 현재 브랜치: `main_sprint-2` → `main_sprint-3` 신규 브랜치로 작업

**Why:** Phase 2 품질 개선 목표(M3: 품질 개선 릴리스, Sprint 4 종료) 달성을 위한 기반 마련
**How to apply:** Day 1-2 기술 부채(TD1 입력 차단, TD2 상수 추출) 우선 처리 후 애니메이션 → 성능 순서로 진행

## 핵심 아키텍처 결정 사항

1. 드래그 앤 드롭: HTML5 Drag API 대신 포인터 이벤트 직접 처리 (모바일 호환성)
2. 상태: Zustand store + persist 미들웨어 (LocalStorage 연동)
3. 라인 제거: Block Blast 규칙 - 블록이 떨어지지 않고 그 자리에서 제거
4. 게임 오버 판정: 블록 배치 후에만 수행 (성능 최적화)
5. 애니메이션: Framer Motion, requestAnimationFrame 기반

## 프로젝트 디렉토리 구조 (Sprint 2 완료 시점)

```
src/
  components/Board/   # Board.tsx, Cell.tsx
  components/Block/   # BlockTray.tsx, BlockPreview.tsx, DraggableBlock.tsx
  components/UI/      # ScoreDisplay.tsx, GameOverModal.tsx
  hooks/              # useDragDrop.ts
  stores/             # gameStore.ts
  types/              # game.ts
  utils/              # blockUtils.ts, boardUtils.ts, lineUtils.ts, scoreUtils.ts, gameOverUtils.ts, storage.ts
  utils/__tests__/    # 6개 테스트 파일 (42개 테스트)
  constants/          # blocks.ts (Sprint 3에서 game.ts 추가 예정)
```

## 스프린트 계획 문서 패턴

Sprint 계획 문서는 Sprint 2 형식을 기준으로 작성:
- 섹션: 스프린트 목표 → 인수 사항 → 기술 부채 처리 → 구현 범위 → 작업 분해(Day별) → 기술적 접근 방법 → 의존성/리스크 → 완료 기준 → 예상 산출물 → Playwright 검증 시나리오 → 품질 검증 체크리스트
- 태스크 단위: 복잡도(S/M/L), 예상 소요 시간, 담당 파일, 검증 방법 포함
