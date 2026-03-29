# Sprint 5 검증 보고서

**스프린트**: Sprint 5 - 다크 모드 및 설정 패널
**검증일**: 2026-03-20
**브랜치**: `main_sprint-5`
**PR**: https://github.com/leegh-gc/BlockBlastCopy/pull/1

---

## 자동 검증 결과

### DoD #1: `npm run build`가 타입 에러 없이 성공한다

- 결과: ✅ 통과
- 출력: `✓ built in 285ms` (타입 에러 없음)

### DoD #2: `npm test`가 전체 통과한다

- 결과: ✅ 통과
- 출력: `Tests 42 passed (42)` — 6개 테스트 파일, 42개 케이스 전체 통과

### DoD #3: gzip 번들 크기 500KB 이하이다

- 결과: ✅ 통과
- 측정값: `index-5LvP_Kaz.js` → **109.91KB gzip** (목표 500KB 대비 22% 수준)
- 참고: Sprint 4 대비 1.52KB 증가 (다크모드/설정/통계 기능 추가 대비 매우 작은 증가폭)

---

## 코드 리뷰 결과

> code-reviewer subagent 미사용, 수동 코드 리뷰 수행 (Sprint 5 변경 파일 19개)

### Critical / High 이슈: 없음

### Medium 이슈: 없음

### Low 이슈 (참고용)

| # | 파일 | 내용 |
|---|------|------|
| L1 | `src/components/UI/SettingsPanel.tsx` | `--panel-bg`, `--stats-cell-bg` CSS 변수가 `index.css`에 정의되어 있으나 다크 모드에서 CSS 변수 폴백이 일부 Tailwind `dark:` 클래스와 혼용됨. 기능상 문제없으나 일관성을 위해 향후 CSS 변수 방식 또는 Tailwind `dark:` 방식으로 통일 권장. |
| L2 | `src/stores/gameStore.ts` | `setTimeout` 내부에서 `useStatsStore.getState()` 호출 시 클로저 내 `newScore`, `newMaxCombo`, `newLinesCleared` 값을 사용하는데 이 값들은 외부 스코프에서 정확히 계산되어 있어 안전함. 그러나 향후 복잡한 비동기 로직 추가 시 경합 조건 리스크가 있으므로 주의. |
| L3 | `src/components/UI/StatsDisplay.tsx` | `setTimeout(() => setConfirming(false), 3000)` 타이머가 컴포넌트 언마운트 시 정리되지 않음. 패널이 빠르게 열고 닫히는 경우 메모리 누수 가능성. `useEffect`의 cleanup 함수로 감싸는 것 권장. |

---

## DoD 항목별 검증 현황

| # | 완료 기준 | 검증 방법 | 상태 |
|---|-----------|-----------|------|
| 1 | `npm run build`가 타입 에러 없이 성공한다 | 자동 | ✅ |
| 2 | `npm test`가 전체 통과한다 | 자동 | ✅ |
| 3 | gzip 번들 크기 500KB 이하이다 | 빌드 출력 | ✅ |
| 4 | 시스템 다크 모드 설정 시 앱이 자동으로 다크 모드로 전환된다 | 수동 | ⬜ |
| 5 | 설정 패널에서 "라이트/다크/시스템" 테마를 수동 변경할 수 있다 | 수동 | ⬜ |
| 6 | 다크/라이트 전환 시 모든 컴포넌트의 색상이 PRD 4.2 팔레트와 일치한다 | 시각적 | ⬜ |
| 7 | 새로고침 후 선택한 테마가 유지된다 (LocalStorage 저장) | 수동 | ⬜ |
| 8 | 페이지 로드 시 다크 모드 FOUC(깜빡임)가 없다 | 수동 | ⬜ |
| 9 | 설정 패널이 슬라이드 인/아웃 애니메이션으로 열리고 닫힌다 | 수동 | ⬜ |
| 10 | 설정 패널에서 사운드/햅틱/애니메이션 속도를 조정할 수 있다 | 수동 | ⬜ |
| 11 | 모든 설정이 즉시 반영되고 새로고침 후 유지된다 | 수동 | ⬜ |
| 12 | 게임 완료 시 총 플레이 횟수, 누적 점수, 최고 콤보 통계가 업데이트된다 | 수동 | ⬜ |
| 13 | 게임 통계가 LocalStorage에 저장되고 새로고침 후 유지된다 | 수동 | ⬜ |
| 14 | Chrome, Safari iOS, Firefox 최신 버전에서 다크 모드 및 설정 패널이 정상 동작한다 | 크로스 브라우저 | ⬜ |
| 15 | Lighthouse Performance 점수가 90 이상이다 | Lighthouse | ⬜ |
| 16 | 콘솔 런타임 에러 및 경고가 없다 | 브라우저 콘솔 | ⬜ |

> 자동 검증: 3/3 통과. 수동 검증(#4~#16)은 `npm run preview` 또는 Vercel 배포 후 수행 필요.

---

## 수동 검증 시나리오 (미완료)

다음 항목은 `npm run build && npm run preview` 실행 후 브라우저에서 직접 수행해야 합니다.

### 다크 모드 검증

1. `http://localhost:4173` 접속 → 라이트 모드 초기 상태 확인 (배경 `#F2F2F7`)
2. 기어 아이콘 클릭 → 설정 패널 오픈
3. 테마 "다크" 선택 → 앱 전체 다크 모드 전환 확인 (배경 `#1C1C1E`)
4. 페이지 새로고침 → 다크 모드 유지 확인 (FOUC 없음)
5. 테마 "시스템" 선택 후 OS 다크 모드 전환 → 자동 반영 확인

### 설정 패널 검증

6. 기어 아이콘 클릭 → 패널이 우측에서 슬라이드 인 확인
7. 사운드 off 토글 → 블록 배치 시 사운드 없음 확인
8. 애니메이션 "빠름" 선택 → 라인 제거 애니메이션 빠르게 동작 확인
9. 새로고침 → 사운드 off, 애니메이션 "빠름" 유지 확인
10. 백드롭 클릭 → 패널 닫힘 확인

### 게임 통계 검증

11. 설정 패널 하단 → 통계 섹션 (초기값: 모두 0)
12. 게임 진행 → 게임 오버 → 설정 패널 재오픈 → 총 플레이 1, 점수 반영 확인
13. 통계 초기화 버튼 1회 클릭 → 확인 문구 표시
14. 다시 클릭 → 통계 리셋 확인

### 모바일 레이아웃 검증 (375px)

15. 브라우저 개발자 도구 → 375x812 뷰포트 설정
16. 설정 패널이 `min(320px, 85vw)` 너비로 표시 확인
17. 전체 게임 루프 동작 확인

---

## Sprint 4 이월 기술 부채 처리 결과

| 항목 | 처리 결과 |
|------|-----------|
| TD3: LineClearEffect gap/padding 미보정 | 선택적 검토 항목 - 시각적 허용 범위 내로 판단, Sprint 6으로 재이월 |
| iOS 설치 프롬프트 수동 안내 배너 | Sprint 5 구현 범위에서 제외, Sprint 6 백로그 이관 |
| 크로스 브라우저 테스트 (Safari iOS, Firefox) | DoD #14 수동 검증 항목으로 유지 |
| Lighthouse PWA/Performance 최종 확인 | DoD #15 수동 검증 항목으로 유지 (Vercel 배포 후 측정 권장) |

---

## 구현 구조 요약

```
신규 파일:
  src/hooks/useTheme.ts              - theme 구독 → document.documentElement.classList 제어
  src/hooks/useAnimationDuration.ts  - animationSpeed 구독 → duration 배율 함수 반환
  src/components/UI/SettingsPanel.tsx - 슬라이드 인 패널 (SegmentControl, ToggleSwitch 내부 컴포넌트)
  src/components/UI/StatsDisplay.tsx  - 통계 그리드 + 2-tap 초기화
  src/stores/statsStore.ts            - persist 스토어 (block-blast-stats 키)

업데이트 파일:
  src/stores/settingsStore.ts  - theme, animationSpeed 필드 추가
  src/stores/gameStore.ts      - currentMaxCombo, sessionLinesCleared 추가, recordGameEnd 연동
  src/App.tsx                  - useTheme() 호출, SettingsPanel 통합, GearIcon
  index.html                   - FOUC 방지 인라인 스크립트
  전체 컴포넌트                - dark: 클래스 적용
```

---

## Sprint 6 이월 항목

| 항목 | 우선순위 |
|------|----------|
| iOS 설치 프롬프트 수동 안내 배너 | Low |
| TD3: LineClearEffect gap/padding 보정 | Low |
| Lighthouse Performance/PWA 최종 측정 (Vercel 배포 환경) | Medium |
| 크로스 브라우저 테스트 (Safari iOS, Firefox) | Medium |
| StatsDisplay `setTimeout` cleanup 개선 (L3 이슈) | Low |
