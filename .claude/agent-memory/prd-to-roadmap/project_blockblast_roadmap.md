---
name: BlockBlast 로드맵 초기 생성
description: Block Blast 퍼즐 게임 프로젝트의 ROADMAP.md 초기 생성 기록 (2026-03-20)
type: project
---

Block Blast 스타일 블록 퍼즐 게임 프로젝트의 ROADMAP.md를 2026-03-20에 초기 생성.

**주요 결정사항:**
- 6 Sprint (12주) 계획, 3개 Phase로 구분
- Phase 1 (MVP): 게임 코어 - 8x8 보드, 19종 블록, 드래그앤드롭, 라인 제거, 점수, 게임오버, LocalStorage
- Phase 2: 애니메이션 정교화, 성능 최적화, PWA, 사운드/햅틱
- Phase 3: 다크 모드, 설정 패널, 타임어택 모드, 점수 공유, 접근성
- 기술 스택: React 18 + Vite + TypeScript + Tailwind CSS + Zustand + Framer Motion

**Why:** PRD에서 MVP 기능이 모두 `[x]`로 표시되어 Phase 1 우선순위 명확. 클라이언트 사이드 전용 프로젝트라 백엔드 의존성 없음.

**How to apply:** Phase 1 완료 후 배포 가능한 상태를 목표로 하며, 이후 Phase는 사용자 피드백에 따라 조정 가능.
