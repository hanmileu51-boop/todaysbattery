# 🏃 [스프린트 백로그 및 실행 계획] 오늘의 배터리

본 문서는 `docs/DEVELOPMENT_PLAN.md`를 바탕으로 **스프린트 단위 개발 진행 및 추적**을 위해 작성된 상세 백로그 가이드입니다.

---

## 📌 Sprint 1: UI/UX 기반 및 비주얼 인터랙션 수립

- **목표**: PRD 와이어프레임 준수, 0~100% 배터리 슬라이더, 5구간 고양이 비주얼 모션, 7개 원인 태그 UI 및 해상도 대응
- **담당 파일**:
  - `app/page.tsx`
  - `components/battery-cat.tsx`
  - `components/battery-slider.tsx`
  - `components/tag-chips.tsx`

### 📝 작업 목록 (Task Breakdown)
1. **[Task 1-1]** ✅ 단일 화면 레이아웃 및 800px CSS scale 래퍼(`components/responsive-scaler.tsx`) 적용 완료
2. **[Task 1-2]** ✅ 배터리 슬라이더 핸들 및 트랙 1% 단위 반응형 바인딩 점검 완료
3. **[Task 1-3]** ✅ 고양이 비주얼 5구간 매핑 검증 (Purr / Calm / Sleepy / Drained / Dead) 완료
4. **[Task 1-4]** ✅ 7종 피로 원인 태그 칩 단일 선택 제약(Single Constraint) 적용 확인 완료

---

## 📌 Sprint 2: LLM API 연동 및 데이터 파이프라인 구축

- **목표**: GPT-4o-mini API 라우트 연동, JSON Schema 검증 및 1분 맞춤 처방 파이프라인 구축
- **담당 파일**:
  - `app/api/prescribe/route.ts` (NEW)
  - `lib/battery.ts`
  - `app/page.tsx`

### 📝 작업 목록 (Task Breakdown)
1. **[Task 2-1]** ✅ Next.js API Route Handler (`POST /api/prescribe`) 작성 완료
2. **[Task 2-2]** ✅ OpenAI GPT-4o-mini API 연동 및 System Prompt 주입 완료
3. **[Task 2-3]** ✅ Response JSON Schema 검증 및 `parseLLMResponse` 로직 적용 완료
4. **[Task 2-4]** ✅ 클라이언트 `handleSubmit` 함수와 `/api/prescribe` API 데이터 파이프라인 바인딩 완료

---

## 📌 Sprint 3: 7가지 예외 처리 및 Fallback 시스템 구현

- **목표**: PRD Section 5의 7가지 사용자 예외 상황에 대처하는 완전한 Fallback 및 Visual Feedback 적용
- **담당 파일**:
  - `app/page.tsx`
  - `lib/battery.ts`
  - `app/api/prescribe/route.ts`

### 📝 작업 목록 (Task Breakdown)
1. **[Task 3-1]** ✅ 태그 미선택 시 API 차단 + Red 점멸 애니메이션 + 툴팁 노출 적용 완료
2. **[Task 3-2]** ✅ 중복 클릭 방지 (즉시 disabled + 스피너 전환 + Debounce) 적용 완료
3. **[Task 3-3]** ✅ 3초 응답 지연시 안내 문구 유연 변경 적용 완료
4. **[Task 3-4]** ✅ 5초 타임아웃 / API 에러 / 5xx 장애 시 사용자 노출 없는 정적 JSON Fallback 구현 완료
5. **[Task 3-5]** ✅ 0% (긴급 응급 충전 배지) 및 100% (유지 루틴 + Clamping) 극단 수치 처리 완료
6. **[Task 3-6]** ✅ `navigator.onLine === false` 감지 시 오프라인 정적 처방 및 안내 문구 표시 완료
7. **[Task 3-7]** ✅ 가로 800px 미만 시 `transform: scale()` 중앙 비율 정렬 적용 완료

---

## 📌 Sprint 4: 처방 결과 카드 인터랙션, QA 및 DoD 검증

- **목표**: 처방 결과 카드 내 상세 기능(체크박스, 피드백, 다시하기) 완성 및 최종 DoD 검증
- **담당 파일**:
  - `components/result-card.tsx`
  - `app/page.tsx`
  - `docs/DEVELOPMENT_PLAN.md`

### 📝 작업 목록 (Task Breakdown)
1. **[Task 4-1]** ✅ 힐링 루틴 체크박스 인터랙션 (체크표시 & 취소선 피드백) 완료
2. **[Task 4-2]** ✅ `[👍 도움이 됐어요]` / `[👎 별로예요]` 피드백 버튼 및 2.2초 토스트 출력 완료
3. **[Task 4-3]** ✅ `[🔄 다시하기]` 클릭 시 50% 슬라이더/태그 리셋 및 상단 스무스 스크롤 이동 완료
4. **[Task 4-4]** ✅ DoD 체크리스트 7종 항목 종합 검증 및 QA 통과 완료
