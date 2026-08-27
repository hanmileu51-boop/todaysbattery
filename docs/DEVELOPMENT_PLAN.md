# 🔋 [개발 계획서] 오늘의 배터리 (Today's Battery)

본 문서는 `app/PRD.md`에 명시된 요구사항을 바탕으로 작성된 **스프린트 단위 개발 계획서**입니다.
로그인, 결제, DB 없이 3초 만에 상태를 입력하고 1분 내 맞춤형 힐링 처방 카드를 제공하는 단일 기능 웹 애플리케이션 구축을 목표로 합니다.

---

## 📅 프로젝트 핵심 개요 및 마일스톤

| 스프린트 | 주요 목표 | 핵심 결과물 | 예상 기간 | 진행 상태 |
| :--- | :--- | :--- | :--- | :---: |
| **Sprint 1** | **UI/UX 기반 및 비주얼 인터랙션 수립** | 배터리 슬라이더, 5단계 고양이 모션 매핑, 피로 원인 칩 UI, 800px 스케일 래퍼 | 1-2일 | ✅ 완료 |
| **Sprint 2** | **LLM API 연동 및 데이터 파이프라인 구축** | Next.js `/api/prescribe` 라우트, GPT-4o-mini JSON 연동, 클라이언트 바인딩 | 1-2일 | ✅ 완료 |
| **Sprint 3** | **7가지 예외 처리 및 Fallback 시스템 구현** | 태그 미선택/중복클릭/지연/에러/타임아웃/오프라인/극단수치 Fallback 정책 | 1-2일 | ✅ 완료 |
| **Sprint 4** | **처방 카드 인터랙션, QA 및 DoD 검증** | 체크리스트, 피드백 토스트, 리셋 애니메이션, DoD 최종 검증 | 1일 | ✅ 완료 |
| **Sprint AI** | **Gemini 3.6 Flash 고도화 & AI 고양이 코치 대화** | Gemini 3.6 Flash 연동, `/api/chat` 대화 라우트 및 고양이 코치 1회 대화 UI | 1일 | ✅ 완료 |

---

## 🚀 스프린트별 상세 개발 계획

---

### 🏃 Sprint 1: UI/UX 기반 및 비주얼 인터랙션 수립 (Core UI Foundation)

#### 1.1 목표
- PRD 화면 명세(3.1~3.2)에 지정된 단일 화면 레이아웃 구축
- 0%~100% 체력 게이지 슬라이더와 5구간 고양이 비주얼/모션 매핑 구현
- 피로 원인 7종 단일 선택 칩 UI 및 해상도 미달 반응형 스케일링 래퍼 구현

#### 1.2 세부 작업 항목 (Tasks)
- [x] **[Layout] 단일 화면 구조 정립 (`app/page.tsx`, `app/layout.tsx`)**
  - 데스크톱 고정 뷰 중심 (가로 최소 800px 유지)
  - 가로 800px 미만 축소 시 CSS `transform: scale()` 적용 비율 정렬
- [x] **[Visual] 5단계 배터리 & 고양이 비주얼 매핑 (`components/battery-cat.tsx`, `components/battery-slider.tsx`)**
  - `80% ~ 100%` (Green `#22C55E`): 초롱초롱한 눈, 부비적 모션 + 골골송 음표
  - `50% ~ 79%` (Yellow-Green `#84CC16`): 무덤덤 평온, 'ㅅ' 입, 꼬리 살랑살랑 모션
  - `25% ~ 49%` (Orange `#F97316`): 반쯤 감긴 눈, 흘러내리는 고양이 모션
  - `10% ~ 24%` (Dark-Orange `#EF4444`): 다크서클, 가쁜 호흡 모션 + 배터리 경고등 Red 점멸
  - `0% ~ 9%` (Red-Purple `#991B1B`): 'X_X' 눈, 유령(영혼 아이콘) 떠오르는 모션
- [x] **[Input] 피로 원인 선택 칩 UI (`components/tag-chips.tsx`)**
  - 7가지 피로 원인 칩 배치: 공부(📚), 일(💼), 사람 관계(😵), 잠 부족(😴), 이유 없음(😢), 연애(❤️), 모르겠음(🤷)
  - 클릭 시 1개만 활성화되는 단일 선택 (Single Constraint) 및 시각적 강조 효과

#### 1.3 스프린트 완료 조건 (Definition of Done)
- 슬라이더 조작 시 1% 단위 텍스트 변경 및 5구간 고양이 표정/모션 전환에 프레임 드랍이 없어야 함.
- 칩 선택 시 단일 선택 상태가 명확히 유지되어야 함.

---

### 🏃 Sprint 2: LLM API 연동 및 데이터 파이프라인 구축 (LLM Pipeline)

#### 2.1 목표
- PRD 기능 명세(4.1~4.3) 기반 GPT-4o-mini API 통신 라우트 및 파이프라인 연동
- System Prompt 준수 및 Strict JSON Schema 파싱 구현

#### 2.2 세부 작업 항목 (Tasks)
- [x] **[Backend] Next.js API 라우트 생성 (`app/api/prescribe/route.ts`)**
  - `POST` 요청 처리: Body (`battery_level: number`, `fatigue_reason: string`) 검증
  - OpenAI GPT-4o-mini 호출 (temperature: 0.7, `response_format: { type: "json_object" }`)
  - System Prompt 설정: '오늘의 배터리 고양이' 페르소나 및 6가지 필드 규격 요구
- [x] **[Contract] JSON Response Schema 검증**
  - `status_comment` (string): 한 줄 비유 진단
  - `healing_routines` (string array, 3~4개): 1분 액션 리스트
  - `cheering_message` (string): 2~3문장 응원
  - `recommended_bgm` (string): BGM 무드/장르
  - `micro_mission` (string): 10초~1분 미션
  - `expected_charge_percent` (integer, 0~100): 충전 예상 수치
- [x] **[Frontend] 클라이언트 API 호출 및 로딩 처리 (`app/page.tsx`)**
  - 버튼 클릭 시 `disabled = true`, 로딩 스피너 및 *"고양이가 처방전 굽는 중..."* 문구 표시
  - 1입력 ➔ 2검증 ➔ 3LLM호출 ➔ 4결과카드로의 데이터 바인딩 파이프라인 연결

#### 2.3 스프린트 완료 조건 (Definition of Done)
- 유효한 입력에 대해 LLM API가 규격에 맞는 JSON 응답을 반환하고 결과 카드가 정상 렌더링되어야 함 (P95 2.5초 이내).

---

### 🏃 Sprint 3: 7가지 예외 처리 및 Fallback 시스템 구현 (Exception & Fallback)

#### 3.1 목표
- PRD 예외 처리 명세(Section 5)의 7가지 사용자 예외 상황에 대한 100% Visual Feedback 및 Fallback 구현
- 네트워크 불안정, API 장애, 타임아웃 발생 시에도 에러 창 노출 없이 힐링 처방 카드 보장

#### 3.2 세부 작업 항목 (Tasks)
- [x] **[Policy 1] 태그 미선택 예외 처리**
  - API 요청 사전 차단 (`preventDefault`)
  - 피로 원인 선택 영역(Chips Container)으로 스무스 스크롤 이동
  - 태그 컨테이너 Red 점멸 애니메이션 (keyframes 2회)
  - *"피로 원인을 하나 골라주세요!"* Red 툴팁 노출
- [x] **[Policy 2] 중복 클릭 방지**
  - 버튼 클릭 즉시 `disabled = true` 및 클릭 이벤트 차단
  - 로딩 스피너 + *"고양이가 처방전 굽는 중..."* 및 Debounce/Throttle 적용
- [x] **[Policy 3] 응답 지연 (3초 경과시)**
  - 결과 영역 스켈레톤 UI 카드 유지
  - 문구를 *"조금만 기다려주세요, 충전 완료 직전이에요!"*로 유연한 전환
- [x] **[Policy 4] API 에러 & 5초 타임아웃 Fallback**
  - `AbortController` 기반 5초 타임아웃 설정
  - HTTP 5xx, LLM 파싱 에러, 타임아웃 발생 시 사용자에게 에러 노출 금지
  - 정적 로컬 Fallback JSON 데이터 즉시 출력
- [x] **[Policy 5] 극단적 배터리 수치 (0% & 100%)**
  - `0%` 입력 시: 고양이 입 유령 애니메이션 + `[🚨 긴급 응급 충전 모드]` 배지
  - `100%` 입력 시: *"이미 완충 상태군요! 유지 루틴을 제공합니다"* 안내문 + `expected_charge_percent` 100% Clamping
- [x] **[Policy 6] 오프라인 상태 (`navigator.onLine === false`)**
  - 클릭 즉시 정적 Fallback 데이터 노출
  - 처방 카드 하단 *"오프라인 모드로 작성된 처방전입니다"* 안내 표시
- [x] **[Policy 7] 해상도 미달 반응형 스케일**
  - 가로 800px 미만 시 `min-width: 800px` 유지하며 CSS `transform: scale()` 중앙 정렬

#### 3.3 스프린트 완료 조건 (Definition of Done)
- API 서버를 끄거나 오프라인 상태, 5초 타임아웃 발생 시에도 에러 메시지 없이 100% 처방 카드가 출력되어야 함.

---

### 🏃 Sprint 4: 처방 결과 카드 인터랙션, QA 및 DoD 검증 (Polish & DoD Checklist)

#### 4.1 목표
- 처방 결과 카드 내부 인터랙션 완비 (체크박스, 피드백, 다시하기)
- PRD Section 6.2 Definition of Done (DoD) 전체 항목 통합 테스트 및 QA 완료

#### 4.2 세부 작업 항목 (Tasks)
- [x] **[Interaction] 1분 힐링 루틴 체크박스 (`components/result-card.tsx`)**
  - 루틴 항목 클릭 시 체크 표시 및 취소선(line-through) 시각적 피드백
- [x] **[Interaction] 피드백 버튼 & 토스트 UI**
  - `[👍 도움이 됐어요]` / `[👎 별로예요]` 단일 선택 활성화
  - *"피드백이 전달되었습니다!"* 토스트 메시지 노출 (2.2초 후 자동 소멸)
- [x] **[Interaction] [🔄 다시하기] 초기화 및 스크롤**
  - 슬라이더 50% 리셋, 원인 칩 해제
  - 결과 카드가 접히며(Slide-up) 상단 초기 화면으로 스무스 스크롤 복귀
- [x] **[Audit] DoD 최종 체크리스트 검증**
  - [x] 슬라이더 반응성 (5구간 비주얼 프레임 드랍 여부)
  - [x] 유효성 검사 (태그 미선택 시 Red 점멸 & 툴팁)
  - [x] 중복 방지 (버튼 비활성화 및 로딩 전환)
  - [x] LLM 파싱 & 렌더링 (3초 이내 카드시각화)
  - [x] Fallback 검증 (네트워크 차단/타임아웃/에러 시 100% 정적 데이터 보장)
  - [x] 상태 초기화 ([다시하기] 리셋 동작)
  - [x] In-Scope / Out-of-Scope 제약사항 엄수 (로그인/DB/결제/공유 기능 배제 확인)

---

## 📋 Definition of Done (DoD) 최종 체크리스트 요약

| 검증 항목 | 세부 확인 내용 | PASS 여부 |
| :--- | :--- | :---: |
| **슬라이더 반응성** | 0~100% 슬라이더 조작 시 5개 구간 고양이 표정/모션 실시간 매핑 | ✅ PASS |
| **유효성 검사** | 태그 미선택 시 API 차단, Red 점멸 애니메이션 및 안내 툴팁 동작 | ✅ PASS |
| **중복 방지** | 처방받기 클릭 즉시 `disabled`, 로딩 모션 전환 및 중복 호출 차단 | ✅ PASS |
| **LLM 연동** | 정상 API 응답 JSON 파싱 후 P95 2.5초 이내 처방 카드로 시각화 | ✅ PASS |
| **Fallback 보장** | 네트워크 차단, 5초 타임아웃, 5xx 에러 시 에러 노출 없이 정적 처방 출력 | ✅ PASS |
| **상태 초기화** | [다시하기] 클릭 시 슬라이더(50%) 및 원인 칩 초기화, 상단 스크롤 복귀 | ✅ PASS |
| **범위 제약 엄수** | 로그인, 결제, DB, 파일 업로드, SNS 공유 없는 독립 SPA 동작 | ✅ PASS |
