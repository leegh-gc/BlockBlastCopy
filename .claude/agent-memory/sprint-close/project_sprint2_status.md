---
name: Sprint 2 완료 상태
description: Sprint 2 게임 루프(라인 제거, 점수, 게임 오버, LocalStorage) 구현 완료 상태 및 알려진 이슈
type: project
---

Sprint 2 (게임 로직과 데이터 저장)가 2026-03-20 완료됨. 브랜치: main_sprint-2.

**Why:** Sprint 2 마무리 작업으로 ROADMAP 업데이트, 코드 리뷰, 검증 보고서 작성 완료.

**How to apply:** Sprint 3 시작 전 아래 Medium 이슈를 우선 처리할 것을 권장함.

## 완료된 구현

- PixelPosition 타입 분리 (기술부채 처리)
- boardUtils.ts (canPlaceBlock, getBlockCells)
- 드롭 프리뷰 (유효: 녹색, 무효: 빨간색)
- lineUtils.ts (라인 감지/제거, 중력 없음)
- scoreUtils.ts (PRD 점수 공식: 배치+라인+콤보)
- gameStore 통합 (라인감지, 점수, 게임오버 판정, persist)
- gameOverUtils.ts (canAnyBlockBePlaced)
- GameOverModal.tsx (Framer Motion AnimatePresence)
- ScoreDisplay.tsx (카운트업 + 플로팅 점수)
- 라인 제거 300ms 페이드아웃 애니메이션 (animatingLines 패턴)
- Zustand persist (LocalStorage, dragState 제외)
- 전체 레이아웃 완성 (PRD 색상 팔레트)
- 단위 테스트: 42/42 통과
- npm run build 성공 (번들 105KB gzip)

## Sprint 3 진입 전 처리 권장 Medium 이슈

1. gameStore.ts: placeBlock의 setTimeout(300ms) 내 경쟁 조건 방지 - 라인 애니메이션 중 입력 차단 로직 추가
2. BOARD_SIZE 상수 중복 정의 - src/constants/game.ts로 추출
3. ScoreDisplay.tsx: useEffect 카운트업 로직 리팩토링 검토 (현재 eslint-disable 처리)

## GitHub 인증 이슈 (Sprint 1과 동일)

- Git 인증 계정: leegh-gc (gh CLI)
- 원격 저장소 소유자: leegyuhun
- 계정 불일치로 gh CLI를 통한 PR 자동 생성 불가. 수동 생성 필요.
- PR URL (수동 생성): https://github.com/leegyuhun/BlockBlastCopy/compare/main...main_sprint-2

## 검증 보고서

- docs/sprint/sprint2/verification-report.md
- 수동 검증 6개 항목 미완료 (UI 테스트 필요)
