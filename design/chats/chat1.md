# Youth Finance Calculator Design

_Started 2026-09-18 06:32 UTC_

---

## User

Make UI mockups for Vue 3 (Composition API)와 Tailwind CSS를 사용해서 "청년 금융·정책 지원금 모의계산기" 원페이지 웹 사이트 코드를 작성해 줘.

[요구사항]
1. 디자인 및 UI:
- 모바일 친화적인 반응형 디자인 (최신 트렌드에 맞는 깔끔하고 세련된 UI, 토스/카카오페이 느낌의 부드러운 카드 레이아웃).
- 상단에 직관적인 타이틀과 서브 문구 배치 ("내 조건에 맞는 청년 지원금 1초 만에 확인하기").
- 입력 폼 영역:
  - 출생연도 (예: 2004년생 등 입력 시 만 나이 자동 계산)
  - 월 세전 소득 (원 단위 또는 만원 단위 슬라이더/인풋)
  - 거주 형태 선택 (부모님 동거 / 독립 자취)
  - 재직 상태 선택 (중소기업 재직 / 구직 중 / 대학생·프리랜서 등)
- "맞춤 지원금 확인하기" 버튼 (강렬하고 눈에 띄는 CTA 버튼).

2. 결과 대시보드 영역 (버튼 클릭 시 조건에 맞춰 동적 렌더링):
- 매칭된 정책 카드 리스트 (예: 청년미래적금, 청년월세지원, 중소기업 소득세 감면 등).
- 각 카드마다 예상 혜택 요약 (예: "3년 만기 시 최대 2,200만 원", "월 최대 20만 원 지원")과 [자세히 보기 / 신청하기] 버튼 배치.
- 조건에 맞지 않는 항목은 하단에 "아쉽게도 대상이 아니에요" 또는 팁으로 가볍게 처리.

3. 데이터 구조 (중요):
- 정책 데이터는 외부 API 없이 코드 내부의 `policies.json` 형태의 객체 배열로 분리해 줘.
- 나중에 10월 청년미래적금 2차 신청 시즌이나 소득 기준이 바뀔 때 이 배열 데이터만 쉽게 수정할 수 있도록 주석과 구조를 깔끔하게 짜줘.

4. 기타:
- 프론트엔드 단일 파일(또는 컴포넌트 구조)로 바로 실행 가능하게 작성해 줘.

## Assistant

## Assistant

## Assistant

_[tool: list_files]_

디자인 시스템 프로젝트가 비어 있어서, 토스/카카오페이 계열 금융 UI 톤(Pretendard, #3182F6, 회색 배경 + 흰 카드)으로 직접 시스템을 잡고 목업을 만들겠습니다.

_[tool: dc_write]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: ready_for_verification]_

인터랙티브 목업 + Vue 핸드오프 코드 두 벌로 만들었습니다.

- **목업**: `청년지원금 계산기.dc.html` — 출생연도→만나이 자동 계산, 소득 슬라이더, 거주/재직 선택, CTA 클릭 시 결과 대시보드(총 혜택 요약 카드 → 매칭 정책 카드 → 미매칭 + 팁) 동적 렌더링.
- **Vue 코드**: `handoff/YouthGrantCalculator.vue` (Composition API + Tailwind), 정책 데이터는 `handoff/policies.js`로 분리 — `cond`(나이/소득/거주/재직) + `monthly`/`lump`만 고치면 10월 2차 신청이나 소득 기준 변경이 바로 반영됩니다.

정책 금액·조건은 예시 데이터입니다. 실제 공고 기준으로 바꿔 드릴까요?

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Vue 파일의 동일한 저대비 텍스트(`text-gray-300`)도 맞춰 올렸습니다.

_[tool: run_script]_

_[tool: ready_for_verification]_

저대비 텍스트 3곳(슬라이더 눈금, CTA 하단 안내, 하단 고지문)을 팔레트 내 진한 회색으로 올렸고, Vue 파일에도 같은 수정을 반영했습니다.

## User

결과가 바로 다음창으로 넘어 가는식으로 뜨게 하면 좋겠어 좀 걸리며 로딩화면 뜨게 하면서 그리고 꿀팁 + 양옆으로 뭐가 허전하고

## Assistant

결과를 별도 화면으로 전환(로딩 → 결과), 꿀팁 섹션 추가, 와이드 화면 양옆 레일 추가로 다시 구성합니다.

_[tool: dc_write]_

_[tool: ready_for_verification]_

세 화면 흐름으로 바꿨습니다.

- **입력 → 로딩 → 결과** 전환: CTA 누르면 입력 화면이 사라지고 스피너 + 3단계 체크("조건 확인 → 자격 대조 → 수령액 계산", 약 2초) 후 결과 화면. 상단 ‹ 버튼과 하단 "조건 바꿔서 다시 계산하기"로 복귀.
- **꿀팁**: 입력 화면 하단과 결과 화면에 번호형 꿀팁 3개 카드.
- **양옆 레일**(1200px 이상에서만 표시): 왼쪽 정책 브리핑 지표 + 다가오는 신청 시즌, 오른쪽 인기 정책 랭킹 + 서류 체크리스트. 모바일에서는 자동 숨김.

Vue 파일도 같은 구조로 업데이트할까요?

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

레일 폭을 200px·간격 20px로 줄이고 표시 기준을 940px로 낮춰 현재 미리보기 폭에서도 양옆이 채워지게 했고, 인기 정책 첫 행의 불필요한 구분선을 제거했습니다.

## User

웹 모바일 버전으로 만들어진거 맞아?

## Assistant

모바일 우선 레이아웃(480px 기준, 940px 미만에서 레일 자동 숨김)은 맞지만 viewport 메타가 빠져 실제 휴대폰에서 축소 렌더될 수 있었습니다 — 추가했습니다.

_[tool: dc_html_str_replace]_

_[tool: multi_screenshot]_

_[tool: show_html]_

_[tool: ready_for_verification]_

네 — 모바일 웹 우선으로 만들어져 있습니다.

- 본문 컬럼 최대 480px, 폭 100% 가변 / 버튼·칩 터치 영역 48px 이상
- 940px 미만(휴대폰·태블릿)에서는 양옆 레일이 자동으로 숨고 한 컬럼만 표시
- 입력 → 로딩 → 결과가 화면 전환 방식이라 작은 화면에서 스크롤 부담 없음
- 방금 `viewport` 메타를 추가해 실제 기기에서 1:1 배율로 렌더됩니다

Vue 파일도 이 3화면 구조 + 레일로 맞춰 업데이트해 둘까요?

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

레일 폭 190px·간격 14px, 표시 기준 900px로 낮춰 현재 미리보기(924px)에서 양옆이 보이게 했습니다. 모바일 폭에서는 그대로 숨습니다.

