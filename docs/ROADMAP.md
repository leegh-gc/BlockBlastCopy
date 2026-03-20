# 프로젝트 로드맵 - Block Blast 스타일 블록 퍼즐 게임

## 개요
- **목표**: 광고 없는 모바일 친화적 웹 기반 8x8 블록 퍼즐 게임 개발
- **전체 예상 기간**: 6주 (3 Phase, 6 Sprint)
- **현재 진행 단계**: Phase 1 Sprint 2 진행 예정
- **팀 규모 가정**: 소규모 (2-3명)

## 진행 상태 범례
- ✅ 완료
- 🔄 진행 중
- 📋 예정
- ⏸️ 보류

---

## 프로젝트 현황 대시보드

| 항목 | 상태 |
|------|------|
| 전체 진행률 | 17% (Sprint 1/6 완료) |
| 현재 Phase | Phase 1 (MVP) Sprint 2 진행 예정 |
| 다음 마일스톤 | Phase 1 Sprint 2 완료 - 게임 로직과 데이터 저장 |
| 시작일 | 2026-03-20 |
| Sprint 1 완료일 | 2026-03-20 |
| MVP 목표일 | 2026-04-17 (Phase 1 완료) |
| 전체 목표일 | 2026-05-01 |

---

## 기술 아키텍처 결정 사항

| 영역 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | React 18 (Hooks) | PRD 명시, 컴포넌트 기반 UI에 적합 |
| 번들러 | Vite | PRD 명시, 빠른 HMR과 빌드 |
| 상태 관리 | Zustand | Context API 대비 보일러플레이트 적고 성능 우수, 게임 상태 관리에 적합 |
| 스타일링 | Tailwind CSS | PRD 명시, 빠른 프로토타이핑 |
| 애니메이션 | Framer Motion | PRD 명시, React 생태계 통합 우수 |
| 언어 | TypeScript | PRD의 데이터 구조가 TS interface로 정의됨, 타입 안정성 |
| 테스트 | Vitest + React Testing Library | Vite 네이티브 테스트 러너 |
| 배포 | Vercel | PRD 권장, 무료 티어 + 간편 배포 |

### 프로젝트 디렉토리 구조 (목표)

```
src/
  components/       # React 컴포넌트
    Board/          # 게임 보드 관련
    Block/          # 블록 관련
    UI/             # 점수, 버튼 등 UI 요소
  hooks/            # 커스텀 훅 (useGame, useDragDrop 등)
  stores/           # Zustand 상태 저장소
  types/            # TypeScript 타입 정의
  utils/            # 유틸리티 함수 (점수 계산, 라인 감지 등)
  constants/        # 블록 정의, 색상 등 상수
  App.tsx
  main.tsx
public/
  icons/            # PWA 아이콘
```

---

## 의존성 맵

```
Phase 1 Sprint 1:
  프로젝트 셋업 → 타입 정의 → 게임 보드 렌더링 → 블록 정의/렌더링 → 드래그 앤 드롭

Phase 1 Sprint 2:
  드래그 앤 드롭 → 블록 배치 로직 → 라인 감지/제거 → 점수 시스템 → 게임 오버 → LocalStorage

Phase 2 Sprint 3:
  MVP 완성 → 애니메이션 정교화 → 성능 최적화

Phase 2 Sprint 4:
  성능 최적화 → PWA 구현 → 사운드/햅틱

Phase 3 Sprint 5:
  다크 모드 → 설정 패널

Phase 3 Sprint 6:
  타임 어택 모드 → 점수 공유 → 접근성
```

---

## Phase 1: MVP 게임 코어 (Sprint 1-2) 🔄

> **우선순위**: Must Have
> **목표**: 플레이 가능한 블록 퍼즐 게임 완성. 8x8 보드에서 블록을 드래그하여 배치하고, 라인을 제거하며, 점수를 기록할 수 있는 핵심 게임 루프 구현.

### Sprint 1: 게임 보드와 블록 시스템 (Week 1-2) ✅ 완료 (2026-03-20)

**Sprint Goal**: 8x8 보드가 렌더링되고, 블록을 드래그하여 보드 위에 올려놓을 수 있는 상태

- ✅ **프로젝트 초기 셋업** [복잡도: S]
  - Vite + React + TypeScript 프로젝트 생성 (`npm create vite@latest`)
  - Tailwind CSS 설치 및 설정
  - Zustand 설치
  - Framer Motion 설치
  - ESLint + Prettier 기본 설정
  - 디렉토리 구조 생성 (위 목표 구조 참고)
  - 검증: `npm run dev`로 기본 페이지 렌더링 확인

- ✅ **TypeScript 타입 정의** [복잡도: S]
  - `src/types/game.ts` 생성
  - `GameState`, `Cell`, `Block` 인터페이스 정의 (PRD 섹션 6.1 기반)
  - `Position`, `DragState` 등 보조 타입 정의
  - 검증: 타입 에러 없이 컴파일 확인

- ✅ **블록 상수 정의** [복잡도: M]
  - `src/constants/blocks.ts`에 19종 블록 shape 배열 정의 (실제 구현: 19종)
  - 각 블록별 색상 매핑 (PRD 섹션 4.2 색상 팔레트 기반)
  - 블록 랜덤 선택 유틸 함수 (`src/utils/blockUtils.ts`)
  - 검증: 단위 테스트로 블록이 올바른 shape를 가지는지 확인

- ✅ **8x8 게임 보드 컴포넌트** [복잡도: M]
  - `src/components/Board/Board.tsx`: 8x8 그리드 렌더링
  - `src/components/Board/Cell.tsx`: 개별 셀 컴포넌트 (filled/empty 상태)
  - 모바일: 화면 너비 90% 활용, 데스크톱: 최대 500px
  - 셀 크기 동적 계산 (뷰포트 기반)
  - Tailwind CSS로 그리드 레이아웃 구현
  - 검증: 모바일/데스크톱에서 보드가 올바른 크기로 렌더링

- ✅ **블록 선택 영역 컴포넌트** [복잡도: M]
  - `src/components/Block/BlockTray.tsx`: 하단 3개 블록 표시 영역
  - `src/components/Block/BlockPreview.tsx`: 개별 블록 미리보기
  - 3개 블록 랜덤 생성 및 표시
  - 검증: 화면 하단에 3개 블록이 올바르게 렌더링

- ✅ **게임 상태 저장소 (Zustand)** [복잡도: M]
  - `src/stores/gameStore.ts` 생성
  - 초기 상태: 빈 8x8 보드, 점수 0, 랜덤 3개 블록
  - 액션: `placeBlock`, `generateNewBlocks`, `resetGame`, `setDragState`
  - 검증: 스토어 액션 호출 시 상태가 올바르게 변경되는지 단위 테스트

- ✅ **드래그 앤 드롭 기본 구현** [복잡도: L]
  - `src/hooks/useDragDrop.ts` 커스텀 훅
  - 마우스 이벤트: mousedown, mousemove, mouseup
  - 터치 이벤트: touchstart, touchmove, touchend
  - 드래그 중 블록이 커서/손가락을 따라 이동
  - 블록 들어올리기 시 scale(1.1) + 그림자 효과
  - 드롭 위치의 보드 좌표 계산 (픽셀 -> 그리드 인덱스 변환)
  - 검증: 블록을 드래그하여 보드 위에서 이동 가능한지 확인

### Sprint 1 완료 기준 (Definition of Done)
- ✅ 8x8 보드가 모바일/데스크톱 모두에서 올바르게 렌더링된다
- ✅ 19종 블록이 정의되어 있고 3개가 하단에 표시된다
- ✅ 블록을 터치/마우스로 드래그하여 보드 위에서 이동할 수 있다
- ✅ TypeScript 컴파일 에러가 없다 (ESLint 에러 없음 확인)
- ✅ 콘솔에 런타임 에러가 없다

### Sprint 1 - 구현 참고사항
- 드래그 앤 드롭은 HTML5 Drag API 대신 포인터 이벤트 직접 처리 (모바일 호환성)
- `touch-action: none` CSS 설정으로 브라우저 기본 터치 동작 방지
- `Position` 타입을 픽셀 좌표 임시 저장에 재활용 (col = pixelX, row = pixelY)
- Sprint 2에서 `boardUtils.ts`로 배치 유효성 검사 분리 예정 (현재는 단순 배치만 구현)

### Sprint 1 검증 결과
- [검증 보고서](sprint/sprint1/verification-report.md)

### Sprint 1 - Playwright MCP 검증 시나리오

> `npm run dev` 실행 후 아래 순서로 검증

**게임 보드 렌더링 검증:**
1. `browser_navigate` -> `http://localhost:5173` 접속
2. `browser_snapshot` -> 8x8 그리드(64개 셀) 렌더링 확인
3. `browser_snapshot` -> 하단에 3개 블록 표시 확인
4. `browser_console_messages(level: "error")` -> 에러 없음 확인

**반응형 레이아웃 검증:**
5. `browser_resize(width: 375, height: 812)` -> 모바일 크기 전환
6. `browser_snapshot` -> 보드가 화면 너비 90% 활용하는지 확인
7. `browser_resize(width: 1280, height: 800)` -> 데스크톱 크기 전환
8. `browser_snapshot` -> 보드가 최대 500px로 제한되는지 확인

**드래그 앤 드롭 검증:**
9. `browser_snapshot` -> 블록 요소 ref 확인
10. `browser_click` -> 블록 영역 클릭하여 상호작용 가능 확인
11. `browser_console_messages(level: "error")` -> 드래그 관련 에러 없음 확인

---

### Sprint 2: 게임 로직과 데이터 저장 (Week 3-4) 📋

**Sprint Goal**: 블록 배치, 라인 제거, 점수 계산, 게임 오버가 동작하는 완전한 게임 루프 완성

- ⬜ **블록 배치 로직** [복잡도: M]
  - `src/utils/boardUtils.ts`: 배치 유효성 검사 함수
    - 보드 범위 내 확인
    - 모든 셀이 비어있는지 확인
    - 일부만 걸치는 배치 거부
  - 유효 위치: 녹색 반투명 프리뷰 (`#34C759` opacity 0.3)
  - 무효 위치: 빨간색 반투명 표시 (`#FF3B30` opacity 0.3)
  - 블록 배치 시 보드 상태 업데이트
  - 배치 후 사용된 블록 제거, 3개 모두 소진 시 새 3개 생성
  - 검증: 유효/무효 위치에 올바른 시각적 피드백 표시

- ⬜ **라인 감지 및 제거** [복잡도: M]
  - `src/utils/lineUtils.ts`: 완성된 행/열 감지 함수
  - 가로 8칸 또는 세로 8칸 모두 채워진 라인 감지
  - 동시 다중 라인 제거 지원 (십자 제거 포함)
  - 제거 후 빈 공간으로 즉시 전환 (블록이 떨어지지 않음)
  - 검증: 행/열 완성 시 올바르게 감지 및 제거되는지 단위 테스트

- ⬜ **점수 시스템** [복잡도: S]
  - `src/utils/scoreUtils.ts`: 점수 계산 함수
  - 블록 배치: 셀 수 x 1점
  - 라인 제거: 1줄 +10, 2줄 +30, 3줄 +60, 4줄 +100, 5줄+ n*(n*5) 보너스
  - 콤보 보너스: 연속 라인 제거 시 +10점/콤보
  - `src/components/UI/ScoreDisplay.tsx`: 현재 점수 + 최고 점수 표시
  - 검증: 다양한 시나리오에서 점수 계산이 PRD 공식과 일치하는지 단위 테스트

- ⬜ **게임 오버 로직** [복잡도: M]
  - `src/utils/gameOverUtils.ts`: 게임 오버 판정 함수
  - 3개 블록 모두 보드 어디에도 배치 불가능한지 검사
  - 매 블록 배치 후 게임 오버 조건 체크
  - `src/components/UI/GameOverModal.tsx`: 게임 오버 화면
    - 최종 점수 표시
    - 최고 점수 갱신 시 알림
    - "다시 시작" 버튼
  - 검증: 배치 불가능 상황에서 게임 오버가 올바르게 트리거

- ⬜ **기본 애니메이션** [복잡도: M]
  - 블록 배치 시 스냅 애니메이션 (200ms ease-out) - Framer Motion
  - 라인 제거 시 페이드 아웃 + 스케일 효과 (300ms)
  - 점수 증가 시 숫자 카운트업 애니메이션
  - +점수 플로팅 텍스트
  - 검증: 애니메이션이 60fps로 부드럽게 동작

- ⬜ **LocalStorage 통합** [복잡도: S]
  - `src/utils/storage.ts`: 저장/불러오기 유틸
  - 최고 점수 자동 저장
  - 게임 진행 상황 자동 저장 (매 블록 배치 후)
  - 페이지 새로고침 시 게임 상태 복원
  - Zustand `persist` 미들웨어 활용
  - 검증: 새로고침 후 게임 상태가 올바르게 복원

- ⬜ **전체 게임 화면 레이아웃 완성** [복잡도: S]
  - `src/App.tsx`: 전체 레이아웃 조합
  - 상단: 점수 표시 영역
  - 중앙: 8x8 게임 보드
  - 하단: 블록 선택 영역
  - PRD 섹션 4.1 레이아웃 구현
  - 라이트 모드 색상 팔레트 적용 (PRD 섹션 4.2)
  - 검증: PRD 레이아웃 다이어그램과 시각적으로 일치

### Sprint 2 완료 기준 (Definition of Done)
- 블록을 보드의 유효한 위치에 배치할 수 있다
- 유효/무효 위치에 시각적 피드백이 표시된다
- 완성된 행/열이 자동으로 감지되고 제거된다
- 점수가 PRD 공식대로 정확하게 계산된다
- 3개 블록 모두 배치 불가 시 게임 오버가 표시된다
- 재시작 버튼으로 새 게임을 시작할 수 있다
- 최고 점수와 게임 상태가 LocalStorage에 저장/복원된다
- 핵심 로직(라인 감지, 점수 계산, 게임 오버)에 단위 테스트가 존재한다

### Sprint 2 - 기술 고려사항
- 라인 감지는 블록 배치 직후에만 수행 (성능)
- 게임 오버 판정은 모든 블록 x 모든 빈 위치 조합 검사 필요 -> 최적화 고려 (빈 위치 캐싱)
- Zustand persist 미들웨어로 LocalStorage 연동 시 직렬화 가능한 상태만 저장
- 애니메이션은 `requestAnimationFrame` 기반으로 메인 스레드 블로킹 방지

### Sprint 2 - Playwright MCP 검증 시나리오

> `npm run dev` 실행 후 아래 순서로 검증

**블록 배치 검증:**
1. `browser_navigate` -> `http://localhost:5173` 접속
2. `browser_snapshot` -> 게임 보드와 3개 블록 확인
3. `browser_click` -> 블록 선택 후 보드 위치에 클릭 (배치 시도)
4. `browser_snapshot` -> 블록이 보드에 배치된 상태 확인
5. `browser_snapshot` -> 점수 변경 확인

**라인 제거 검증:**
6. 여러 블록을 배치하여 행 또는 열 완성
7. `browser_snapshot` -> 완성된 라인이 제거되고 점수 증가 확인

**게임 오버 검증:**
8. 게임을 진행하여 게임 오버 상태 유도
9. `browser_snapshot` -> 게임 오버 모달 표시 확인
10. `browser_click` -> "다시 시작" 버튼 클릭
11. `browser_snapshot` -> 빈 보드로 초기화 확인

**데이터 저장 검증:**
12. 게임 진행 중 `browser_navigate` -> 같은 URL로 새로고침
13. `browser_snapshot` -> 이전 게임 상태가 복원되었는지 확인

**공통 검증:**
14. `browser_console_messages(level: "error")` -> 에러 없음 확인

---

## Phase 2: 개선 및 최적화 (Sprint 3-4) 📋

> **우선순위**: Should Have
> **목표**: 게임 경험 품질 향상. 애니메이션 정교화, 성능 최적화, PWA 지원, 사운드/햅틱 추가.

### Sprint 3: 애니메이션 정교화 및 성능 최적화 (Week 5-6) 📋

**Sprint Goal**: Lighthouse 성능 점수 90+, 모바일에서 60fps 애니메이션, 번들 크기 500KB 이하

- ⬜ **애니메이션 정교화** [복잡도: M]
  - 블록 드래그 시 유효 위치 hover 프리뷰 (투명도 0.6)
  - 라인 제거 시 파티클 효과 추가 (선택적)
  - 블록 배치 불가 시 원위치 복귀 바운스 애니메이션
  - 게임 오버 시 보드 셰이크 효과
  - 검증: 모든 애니메이션이 모바일에서 60fps 유지

- ⬜ **성능 최적화** [복잡도: L]
  - React.memo로 불필요한 셀 리렌더링 방지
  - useMemo/useCallback으로 계산 결과 캐싱
  - 이미지 에셋 최적화 (있는 경우)
  - 코드 스플리팅 (게임 오버 모달 등 lazy load)
  - CSS `will-change` 속성으로 애니메이션 성능 향상
  - `passive: true` 이벤트 리스너 (스크롤/터치)
  - 번들 분석 및 트리 셰이킹 확인
  - 검증: Lighthouse Performance 90+, 번들 < 500KB gzip

- ⬜ **모바일 터치 최적화 강화** [복잡도: M]
  - iOS Safari 터치 지연 제거 (`touch-action` CSS)
  - 드래그 중 스크롤 방지
  - 터치 영역 최소 44x44px 보장
  - 큰 블록 드래그 시 손가락에 가려지지 않도록 오프셋 조정
  - 검증: iOS Safari, Android Chrome에서 부드러운 터치 인터랙션

### Sprint 3 완료 기준 (Definition of Done)
- Lighthouse Performance 점수 90 이상
- 번들 크기 500KB(gzip) 이하
- 모바일에서 터치 인터랙션이 16ms 이내 반응
- 모든 애니메이션이 60fps 유지
- iOS Safari, Android Chrome에서 터치 드래그 정상 동작

### Sprint 3 - 기술 고려사항
- `React.memo`는 셀 컴포넌트에 반드시 적용 (64개 셀이 매 프레임 리렌더링되면 성능 저하)
- Framer Motion의 `layout` 애니메이션은 성능 비용이 크므로 필요한 곳에만 사용
- Chrome DevTools Performance 탭으로 프레임 드롭 확인

### Sprint 3 - Playwright MCP 검증 시나리오

> `npm run dev` 실행 후 아래 순서로 검증

**애니메이션 검증:**
1. `browser_navigate` -> `http://localhost:5173` 접속
2. `browser_snapshot` -> 초기 렌더링 확인
3. 블록 배치 후 `browser_snapshot` -> 배치 애니메이션 결과 확인
4. 라인 완성 후 `browser_snapshot` -> 라인 제거 애니메이션 결과 확인

**모바일 터치 검증:**
5. `browser_resize(width: 375, height: 812)` -> iPhone 크기
6. `browser_snapshot` -> 터치 영역 크기 확인
7. `browser_click` -> 블록 터치 인터랙션 확인

**성능 검증:**
8. `browser_console_messages(level: "warning")` -> 성능 경고 없음 확인
9. `browser_console_messages(level: "error")` -> 에러 없음 확인

---

### Sprint 4: PWA 및 사운드/햅틱 (Week 7-8) 📋

**Sprint Goal**: 오프라인 플레이 가능, 홈 화면 설치 가능, 사운드/햅틱 피드백 추가

- ⬜ **PWA 구현** [복잡도: L]
  - `public/manifest.json` 설정 (PRD 섹션 9.3 기반)
  - Service Worker 등록 (Vite PWA 플러그인 활용: `vite-plugin-pwa`)
  - 오프라인 캐싱 전략 (Cache First)
  - 앱 아이콘 생성 (192x192, 512x512)
  - 홈 화면 설치 프롬프트
  - `<meta name="theme-color">` 설정
  - 검증: Chrome DevTools Application 탭에서 PWA 체크리스트 통과

- ⬜ **사운드 효과** [복잡도: M]
  - Web Audio API 또는 Howler.js 활용
  - 블록 배치 사운드 (짧은 "톡" 소리)
  - 라인 제거 사운드 (클리어 효과음)
  - 콤보 사운드 (점점 높아지는 톤)
  - 게임 오버 사운드
  - 사운드 on/off 토글
  - 검증: 각 게임 이벤트에 올바른 사운드 재생

- ⬜ **햅틱 피드백** [복잡도: S]
  - Vibration API 활용 (`navigator.vibrate()`)
  - 블록 배치 시 짧은 진동 (50ms)
  - 라인 제거 시 중간 진동 (100ms)
  - 게임 오버 시 긴 진동 패턴
  - 햅틱 on/off 토글
  - 검증: 지원 디바이스에서 진동 피드백 확인

- ⬜ **크로스 브라우저 테스트 및 버그 수정** [복잡도: M]
  - Chrome/Edge 최신 2개 버전 테스트
  - Safari iOS 14+ 테스트
  - Firefox 최신 2개 버전 테스트
  - Samsung Internet 테스트
  - 발견된 호환성 이슈 수정
  - 검증: 모든 대상 브라우저에서 게임 정상 동작

### Sprint 4 완료 기준 (Definition of Done)
- PWA 설치 가능하고 오프라인에서 플레이 가능
- Lighthouse PWA 점수 통과
- 사운드/햅틱이 동작하고 개별 토글 가능
- PRD 섹션 3.3의 모든 브라우저에서 정상 동작 확인

### Sprint 4 - 기술 고려사항
- `vite-plugin-pwa`로 Service Worker 자동 생성 권장 (수동 구현 대비 유지보수 용이)
- Web Audio API는 사용자 인터랙션 후에만 초기화 가능 (브라우저 autoplay 정책)
- Vibration API는 iOS Safari 미지원 -> 지원 여부 확인 후 graceful degradation
- 사운드 파일은 작은 크기의 WebM/OGG 포맷 사용 (번들 크기 영향 최소화)

### Sprint 4 - Playwright MCP 검증 시나리오

> `npm run dev` 실행 후 아래 순서로 검증

**PWA 검증:**
1. `browser_navigate` -> `http://localhost:5173` 접속
2. `browser_network_requests` -> Service Worker 등록 요청 확인
3. `browser_snapshot` -> 앱 정상 렌더링 확인
4. `browser_console_messages(level: "error")` -> SW 관련 에러 없음 확인

**사운드 토글 검증:**
5. `browser_snapshot` -> 사운드 토글 버튼 존재 확인
6. `browser_click` -> 사운드 토글 클릭
7. `browser_snapshot` -> 토글 상태 변경 확인

**공통 검증:**
8. `browser_console_messages(level: "error")` -> 에러 없음 확인

---

## Phase 3: 추가 기능 (Sprint 5-6) 📋

> **우선순위**: Could Have
> **목표**: 사용자 경험 확장. 다크 모드, 추가 게임 모드, 설정, 공유, 접근성.

### Sprint 5: 다크 모드 및 설정 (Week 9-10) 📋

**Sprint Goal**: 다크 모드 전환, 설정 패널에서 게임 옵션 관리 가능

- ⬜ **다크 모드** [복잡도: M]
  - Tailwind CSS `dark:` 클래스 활용
  - 시스템 설정 감지 (`prefers-color-scheme`)
  - 수동 토글 기능
  - PRD 섹션 4.2 다크 모드 색상 팔레트 적용
  - 선택 상태 LocalStorage 저장
  - 검증: 라이트/다크 전환 시 모든 요소 색상이 올바르게 변경

- ⬜ **설정 패널** [복잡도: M]
  - `src/components/UI/SettingsPanel.tsx`
  - 다크 모드 토글
  - 사운드 on/off
  - 햅틱 on/off
  - 애니메이션 속도 조정 (빠름/보통/느림)
  - 설정 LocalStorage 저장 (PRD 섹션 6.2 StoredGameData.settings)
  - 슬라이드 인/아웃 패널 또는 모달
  - 검증: 모든 설정 항목이 즉시 반영되고 새로고침 후 유지

- ⬜ **게임 통계** [복잡도: S]
  - PRD 섹션 6.2의 `stats` 필드 구현
  - 총 플레이 횟수, 누적 점수, 최고 콤보 기록
  - 설정 패널 또는 별도 영역에 표시
  - 검증: 게임 완료 시 통계가 올바르게 업데이트

### Sprint 5 완료 기준 (Definition of Done)
- 다크/라이트 모드 전환이 모든 컴포넌트에 적용된다
- 설정 패널에서 사운드/햅틱/애니메이션 속도를 조정할 수 있다
- 모든 설정이 LocalStorage에 저장되고 새로고침 후 유지된다
- 게임 통계가 정확하게 누적된다

### Sprint 5 - Playwright MCP 검증 시나리오

> `npm run dev` 실행 후 아래 순서로 검증

**다크 모드 검증:**
1. `browser_navigate` -> `http://localhost:5173` 접속
2. `browser_snapshot` -> 라이트 모드 기본 상태 확인
3. `browser_click` -> 다크 모드 토글 클릭
4. `browser_snapshot` -> 다크 모드 색상 적용 확인
5. `browser_navigate` -> 새로고침
6. `browser_snapshot` -> 다크 모드 유지 확인

**설정 패널 검증:**
7. `browser_click` -> 설정 버튼 클릭
8. `browser_snapshot` -> 설정 패널 표시 확인 (사운드, 햅틱, 애니메이션 옵션)
9. `browser_click` -> 사운드 토글 off
10. `browser_snapshot` -> 설정 변경 반영 확인
11. `browser_navigate` -> 새로고침
12. `browser_snapshot` -> 설정 유지 확인

---

### Sprint 6: 추가 게임 모드 및 공유 (Week 11-12) 📋

**Sprint Goal**: 타임 어택 모드 플레이 가능, 점수 이미지 공유 가능

- ⬜ **타임 어택 모드** [복잡도: L]
  - 3분 제한 타이머 UI
  - 타이머 카운트다운 애니메이션
  - 시간 종료 시 게임 오버
  - 모드 선택 화면 (클래식 / 타임 어택)
  - 모드별 최고 점수 별도 저장
  - 검증: 3분 후 게임 오버, 모드별 점수 분리 저장

- ⬜ **점수 공유 기능** [복잡도: M]
  - Canvas API 또는 html2canvas로 점수 카드 이미지 생성
  - 결과 이미지: 점수, 최고 콤보, 게임 모드 표시
  - Web Share API 활용 (모바일)
  - 폴백: 이미지 다운로드 버튼
  - 검증: 공유 버튼 클릭 시 이미지가 생성되고 공유/다운로드 가능

- ⬜ **접근성 기본 지원** [복잡도: M]
  - ARIA 라벨 추가 (보드, 셀, 블록, 버튼)
  - 키보드 내비게이션 기본 지원 (Tab, Enter, 방향키)
  - 스크린 리더 호환을 위한 실시간 점수 안내 (`aria-live`)
  - 충분한 색상 대비 확인 (WCAG AA 기준)
  - 검증: 키보드만으로 게임 기본 조작 가능, axe-core 경고 없음

### Sprint 6 완료 기준 (Definition of Done)
- 클래식/타임 어택 모드 선택 및 플레이 가능
- 타임 어택 3분 제한 정확히 동작
- 점수 공유 이미지 생성 및 공유/다운로드 가능
- 키보드만으로 게임 기본 조작 가능
- ARIA 라벨이 주요 요소에 적용됨

### Sprint 6 - Playwright MCP 검증 시나리오

> `npm run dev` 실행 후 아래 순서로 검증

**게임 모드 선택 검증:**
1. `browser_navigate` -> `http://localhost:5173` 접속
2. `browser_snapshot` -> 모드 선택 UI 확인
3. `browser_click` -> "타임 어택" 모드 선택
4. `browser_snapshot` -> 타이머 표시 확인
5. `browser_wait_for` -> 타이머 카운트다운 진행 확인

**점수 공유 검증:**
6. 게임 오버 후 `browser_snapshot` -> 공유 버튼 존재 확인
7. `browser_click` -> 공유 버튼 클릭
8. `browser_snapshot` -> 공유 이미지/다이얼로그 표시 확인

**접근성 검증:**
9. `browser_snapshot` -> ARIA 라벨 존재 확인 (접근성 트리에서)
10. `browser_console_messages(level: "error")` -> 에러 없음 확인

---

## 리스크 및 완화 전략

| 리스크 | 영향도 | 발생 확률 | 완화 전략 |
|--------|--------|-----------|-----------|
| 모바일 터치 드래그 성능 저하 | 높음 | 중간 | `requestAnimationFrame` 최적화, passive 리스너, CSS `will-change` |
| iOS Safari 터치 이벤트 비호환 | 높음 | 높음 | Phase 1에서 조기 테스트, `touch-action` CSS, 포인터 이벤트 폴백 |
| 다양한 화면 비율 대응 실패 | 중간 | 중간 | 상대 단위(vw, vh) 사용, min/max 크기 제한, ResizeObserver |
| 번들 크기 초과 (500KB) | 중간 | 낮음 | 트리 셰이킹 확인, 동적 import, 사운드 파일 최적화 |
| Framer Motion 성능 오버헤드 | 중간 | 낮음 | 필요 시 CSS 애니메이션으로 대체, 애니메이션 범위 제한 |
| 게임 오버 판정 성능 (전수 검사) | 낮음 | 낮음 | 빈 위치 캐싱, 블록별 조기 탈출 최적화 |

---

## 마일스톤

| 마일스톤 | 예상 완료일 | 실제 완료일 | 산출물 |
|----------|------------|------------|--------|
| M1: 프로토타입 | Sprint 1 종료 (2026-04-03) | 2026-03-20 | 보드 렌더링 + 블록 드래그 데모 |
| M2: MVP 릴리스 | Sprint 2 종료 (2026-04-17) | - | 플레이 가능한 완전한 게임 (배포) |
| M3: 품질 개선 릴리스 | Sprint 4 종료 (2026-05-15) | - | PWA + 사운드 + 성능 최적화 |
| M4: 기능 확장 릴리스 | Sprint 6 종료 (2026-06-12) | - | 다크 모드 + 타임어택 + 공유 |

---

## 기술 부채 관리

Phase별로 다음 기술 부채 항목을 추적하고 해소합니다:

- **Phase 1 이후**: 드래그 앤 드롭 훅 리팩토링 (마우스/터치 이벤트 통합), 테스트 커버리지 확인
- **Phase 2 이후**: 애니메이션 코드 정리 (중복 제거), 사운드 로딩 전략 최적화
- **Phase 3 이후**: 다크 모드 스타일 누락 점검, 접근성 감사 결과 반영

### Sprint 1 완료 후 확인된 기술 부채

- `DragState.currentPos`의 `Position` 타입이 픽셀 좌표를 row/col로 임시 저장하고 있어 의미가 혼란스러움. Sprint 2에서 별도 `PixelPos` 타입 분리 검토 필요.
- `placeBlock`에 배치 유효성 검사가 없어 보드 범위 밖 배치 시 일부 셀만 배치됨. Sprint 2에서 `boardUtils.ts`로 분리 구현 예정.
- `vite.config.ts`의 `test` 설정이 TypeScript 타입 체크 시 에러 발생 (빌드 시 `tsc -b` 에러). 런타임 동작에는 영향 없으나 `vitest/config`의 `defineConfig` 사용으로 수정 필요.
- `BlockTray`에서 `useDragDrop`과 `useGameStore` 양쪽에서 `currentBlocks`를 구독하는 중복 구독 존재. 추후 정리 필요.

---

## 향후 계획 (Backlog) - Won't Have (현재 범위 외)

다음 기능은 현재 로드맵 범위에 포함되지 않으며, MVP 이후 사용자 피드백에 따라 검토합니다:

- ⬜ 일일 챌린지 모드 (서버 필요: 매일 동일 시드 제공)
- ⬜ 리더보드 (서버 + 데이터베이스 필요)
- ⬜ 색맹 모드 (대체 색상 팔레트)
- ⬜ 글꼴 크기 조정
- ⬜ 배경 음악 (토글 가능)
- ⬜ 커스텀 도메인 구매 및 연결
- ⬜ 앱 스토어 등록 (TWA for Android)
- ⬜ Google Analytics 또는 자체 분석 도구 연동
