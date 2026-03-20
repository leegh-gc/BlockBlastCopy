---
name: Sprint 1 완료 상태
description: Sprint 1 게임 보드와 블록 시스템 구현 완료 상태 및 알려진 이슈
type: project
---

Sprint 1 (게임 보드와 블록 드래그 앤 드롭 시스템)이 2026-03-20 완료됨. 브랜치: main_sprint-1.

**Why:** Sprint 1 마무리 작업으로 ROADMAP 업데이트, 코드 리뷰, 검증 보고서 작성 완료.

**How to apply:** Sprint 2 시작 전 아래 기술 부채 항목을 먼저 처리할 것을 권장함.

## 완료된 구현

- TypeScript 타입 정의 (game.ts)
- 19종 블록 상수 (blocks.ts)
- Zustand 게임 저장소 (gameStore.ts)
- 8x8 게임 보드 + Cell 컴포넌트
- BlockTray, BlockPreview, DraggableBlock
- useDragDrop 커스텀 훅 (마우스+터치)
- 단위 테스트 10개 전체 통과

## Sprint 2 진입 전 수정 권장 사항

1. vite.config.ts: `import { defineConfig } from 'vite'` → `import { defineConfig } from 'vitest/config'` (tsc -b 타입 에러 해소)
2. DragState.currentPos 타입 분리: PixelPosition {x, y} 별도 타입 정의
3. placeBlock 배치 유효성 검사 추가 (boardUtils.ts 분리)

## GitHub 인증 이슈

- Git 인증 계정: leegh-gc (gh CLI)
- 원격 저장소 소유자: leegyuhun
- 계정 불일치로 gh CLI를 통한 PR 자동 생성 불가. 수동 생성 필요.
- PR URL: https://github.com/leegyuhun/BlockBlastCopy/pull/new/main_sprint-1
