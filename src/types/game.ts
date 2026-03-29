// 보드 좌표
export interface Position {
  row: number;
  col: number;
}

// 보드의 개별 셀
export interface Cell {
  filled: boolean;
  color: string | null; // Tailwind 색상 클래스 (예: 'bg-blue-500')
}

// 블록 하나의 모양 (2D 배열: 1 = 채워진 셀, 0 = 빈 셀)
export type BlockShape = number[][];

// 블록 정의 (상수에서 사용)
export interface BlockDefinition {
  id: string;
  shape: BlockShape;
  color: string; // Tailwind 색상 클래스
}

// 게임에 실제로 등장하는 블록 인스턴스
export interface Block {
  id: string;           // 고유 인스턴스 ID (crypto.randomUUID())
  definitionId: string; // BlockDefinition의 id
  shape: BlockShape;
  color: string;
}

// 픽셀 좌표 (화면 좌표계)
export interface PixelPosition {
  x: number;
  y: number;
}

// 드래그 상태
export interface DragState {
  isDragging: boolean;
  blockId: string | null;           // 드래그 중인 Block 인스턴스 ID
  currentPos: PixelPosition | null; // 현재 커서/터치 위치 (픽셀)
  boardPos: Position | null;        // 보드 위 그리드 좌표 (드롭 타겟)
  offsetX: number;                  // 클릭/터치 시작 지점과 블록 좌상단의 X 오프셋
  offsetY: number;
}

// 오디오/햅틱 이벤트 종류
export type AudioEvent = 'place' | 'clear' | 'combo' | 'gameover' | null

// 전체 게임 상태
export interface GameState {
  board: Cell[][];         // 8x8 2D 배열
  score: number;
  highScore: number;
  currentBlocks: Block[];  // 하단에 표시되는 최대 3개 블록
  dragState: DragState;
  isGameOver: boolean;
  comboCount: number;      // 연속 라인 제거 횟수
  animatingLines: { rows: number[]; cols: number[] } | null; // 애니메이션 중인 라인
  isAnimating: boolean;    // 라인 제거 애니메이션 진행 중 (입력 차단용)
  isShaking: boolean;      // 게임 오버 보드 셰이크
  lastAudioEvent: AudioEvent; // 사운드/햅틱 트리거용 마지막 이벤트
  currentMaxCombo: number; // 현재 게임에서 달성한 최고 콤보
  sessionLinesCleared: number; // 현재 게임에서 제거한 총 라인 수
}
