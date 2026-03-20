---
name: Sprint 3 완료 상태
description: Sprint 3 애니메이션 정교화 및 성능 최적화 구현 완료 상태 및 알려진 이슈
type: project
---

Sprint 3 (애니메이션 정교화 및 성능 최적화)가 2026-03-20 완료됨. 브랜치: main_sprint-3.

**Why:** Sprint 3 마무리 작업으로 검증 보고서 작성 완료.

**How to apply:** Sprint 4 시작 전 아래 이월 항목 처리를 검토할 것.

## 완료된 구현

- TD1: isAnimating 플래그로 라인 제거 애니메이션(300ms) 중 드래그 입력 차단
- TD2: BOARD_SIZE를 src/constants/game.ts 단일 진입점으로 통합
- 드래그 프리뷰 크로스페이드 (opacity 0.6, 0.1s transition)
- 게임오버 보드 셰이크 (500ms shake → 모달 표시)
- LineClearEffect: 라인 제거 flash 오버레이 (파티클 대신 성능 우선)
- React.memo 커스텀 비교함수 (Cell) + BlockPreview memo
- useMemo 3건 (previewInfo, previewSet, animatingSet)
- will-change 조건부 적용 (isAnimating || isPreview || isInvalid)
- mousemove passive: true 이벤트 리스너
- GameOverModal lazy load (별도 청크 0.72KB 분리)
- 터치 최적화: Y 오프셋 -75px, 44px 터치 영역, touch-action: manipulation
- #root contain: layout style
- 테스트: 42/42 통과
- 빌드: 105.95KB gzip (목표 500KB 이하 달성)

## Sprint 4 진입 전 처리 권장 Medium 이슈

1. Board.tsx: animatingSet 루프 상한값 하드코딩 `8` → `BOARD_SIZE` 상수로 교체 (TD2 취지와 불일치)
2. 바운스 복귀 애니메이션 미구현 (현재 단순 원위치로 동작) - DoD #8 이월

## Sprint 4 Out-of-Scope 이월 항목

- BlockTray.tsx 이중 구독 정리 (Sprint 3에서도 Out-of-Scope였음)

## GitHub 인증 이슈 (Sprint 1, 2와 동일)

- Git 인증 계정: leegh-gc (gh CLI)
- 원격 저장소 소유자: leegyuhun
- 계정 불일치로 gh CLI를 통한 PR 자동 생성 불가. 수동 생성 필요.
- PR URL (수동 생성): https://github.com/leegyuhun/BlockBlastCopy/compare/main...main_sprint-3

## 검증 보고서

- docs/sprint/sprint3/verification-report.md
- 수동 검증 8개 항목 미완료 (UI 테스트 필요)
