/**
 * 정책 데이터 (policies.json 역할)
 *
 * 정책이 바뀌면 이 파일의 POLICIES 배열만 수정하면 됩니다. 화면/매칭 로직은 손댈 필요 없습니다.
 *
 * id / name / agency / icon   기본 정보
 * badge      카드 강조 배지 (없으면 null) — 예: "10월 2차 신청"
 * benefit    결과 카드의 큰 예상 혜택 문구
 * summary    한 줄 요약 · details는 [자세히 보기] 펼침 항목
 * monthly    월 현금성 지원액(원) · lump 만기/연간 목돈(원)
 * cond       매칭 조건(모두 AND, 필드가 없으면 제한 없음)
 *   minAge / maxAge        만 나이
 *   maxIncomeMan           월 세전 소득 상한(만원)
 *   residence              ['parents','alone'] 중 허용값
 *   status                 ['sme','jobseek','student'] 중 허용값
 * missMsg    조건 미달 시 안내 문구
 */
export const CURRENT_YEAR = 2026 // 만 나이 계산 기준 연도 (매년 갱신)

export const RESIDENCE_OPTIONS = [
  { key: 'parents', label: '부모님 동거' },
  { key: 'alone', label: '독립 · 자취' },
]

export const STATUS_OPTIONS = [
  { key: 'sme', label: '중소기업 재직', hint: '4대보험 가입 근로자' },
  { key: 'jobseek', label: '구직 중', hint: '미취업 · 취업 준비' },
  { key: 'student', label: '대학생 · 프리랜서', hint: '재학생, 아르바이트, 1인 사업자' },
]

export const POLICIES = [
  {
    id: 'future-saving',
    name: '청년미래적금',
    agency: '금융위원회 · 시중 12개 은행',
    icon: '🏦',
    badge: '10월 2차 신청', // 2차 신청 시즌 종료 시 null 로 변경
    benefit: '3년 만기 시 최대 2,200만 원',
    summary: '월 50만 원 납입 시 정부 기여금 + 비과세 이자까지 더해 목돈으로 돌려받아요.',
    details: [
      '가입 기간 3년 · 월 최대 50만 원 납입',
      '소득 구간별 정부 기여금 매칭 (월 최대 3.3만 원)',
      '이자소득 비과세 + 만기 후 청약통장 연계 가능',
      '2차 신청 접수: 10월 중 은행 앱에서 신청',
    ],
    monthly: 0,
    lump: 22_000_000,
    cond: { minAge: 19, maxAge: 34, maxIncomeMan: 300 },
    missMsg: '만 19~34세, 월 세전 소득 300만 원 이하일 때 신청할 수 있어요.',
  },
  {
    id: 'rent-support',
    name: '청년월세 특별지원',
    agency: '국토교통부 · 복지로',
    icon: '🏠',
    badge: null,
    benefit: '월 최대 20만 원 지원',
    summary: '보증금 5천만 원·월세 60만 원 이하 주택에 혼자 사는 청년에게 최대 12개월 지급해요.',
    details: [
      '실제 납부 월세 범위 내 최대 20만 원',
      '지원 기간 12개월(회차별 분할 지급 가능)',
      '부모와 별도 거주 + 주민등록 분리 필요',
      '임대차계약서·월세 이체 증빙 제출',
    ],
    monthly: 200_000,
    lump: 0,
    cond: { minAge: 19, maxAge: 34, maxIncomeMan: 250, residence: ['alone'] },
    missMsg: '부모님과 따로 살고(독립), 월 세전 소득 250만 원 이하인 만 19~34세가 대상이에요.',
  },
  {
    id: 'sme-tax',
    name: '중소기업 취업 청년 소득세 감면',
    agency: '국세청 · 홈택스',
    icon: '🧾',
    badge: null,
    benefit: '소득세 90% 감면 · 연 최대 150만 원',
    summary: '중소기업에 취업한 청년은 최대 5년간 근로소득세를 90% 깎아줘요.',
    details: [
      '감면율 90%, 연간 한도 150만 원',
      '취업일로부터 5년간 적용',
      '회사에 감면 신청서 제출 → 원천징수 단계에서 반영',
      '감면 제외 업종(금융·보험 등) 확인 필요',
    ],
    monthly: 0,
    lump: 1_500_000,
    cond: { minAge: 15, maxAge: 34, status: ['sme'] },
    missMsg: '중소기업 재직 중인 만 15~34세 근로자가 대상이에요.',
  },
  {
    id: 'naeil-chaeum',
    name: '청년내일채움공제',
    agency: '고용노동부 · 워크넷',
    icon: '💰',
    badge: null,
    benefit: '2년 만기 시 최대 1,200만 원',
    summary: '본인 납입금에 기업·정부 적립금이 더해져 2년 뒤 목돈으로 받아요.',
    details: [
      '본인 월 16만 원 × 24개월 납입',
      '기업 부담금 + 정부 지원금 추가 적립',
      '중도 퇴사 시 정부 적립분 환수',
      '제조·건설업 중심 우선 지원',
    ],
    monthly: 0,
    lump: 12_000_000,
    cond: { minAge: 15, maxAge: 34, maxIncomeMan: 320, status: ['sme'] },
    missMsg: '중소기업 재직 + 월 세전 소득 320만 원 이하 조건이 필요해요.',
  },
  {
    id: 'job-support',
    name: '국민취업지원제도 Ⅰ유형',
    agency: '고용노동부 · 고용센터',
    icon: '🎯',
    badge: null,
    benefit: '구직촉진수당 월 50만 원 × 6개월',
    summary: '구직 중인 청년에게 최대 300만 원의 수당과 맞춤 취업 서비스를 제공해요.',
    details: [
      '월 50만 원 × 6개월 (최대 300만 원)',
      '부양가족 1인당 월 10만 원 추가 가능',
      '취업활동계획 수립 및 구직활동 이행 필요',
      '직업훈련·일경험 프로그램 연계',
    ],
    monthly: 500_000,
    lump: 0,
    cond: { minAge: 18, maxAge: 34, maxIncomeMan: 120, status: ['jobseek'] },
    missMsg: '구직 중이고 월 세전 소득 120만 원 이하인 청년이 신청할 수 있어요.',
  },
  {
    id: 'housing-dream',
    name: '청년 주택드림 청약통장',
    agency: '국토교통부 · 시중은행',
    icon: '🔑',
    badge: null,
    benefit: '우대금리 최대 4.5% + 분양가 80% 대출',
    summary: '청약 당첨 시 분양대금의 80%까지 저리로 빌릴 수 있는 전용 통장이에요.',
    details: [
      '납입 원금에 최대 연 4.5% 우대금리',
      '월 100만 원까지 자유 납입',
      '당첨 후 주택드림 대출(연 2%대) 연계',
      '기존 청약통장은 전환 가입 가능',
    ],
    monthly: 0,
    lump: 0,
    cond: { minAge: 19, maxAge: 34, maxIncomeMan: 417 },
    missMsg: '만 19~34세, 연 소득 5천만 원(월 417만 원) 이하 무주택 청년이 대상이에요.',
  },
  {
    id: 'culture-pass',
    name: '청년 문화예술패스',
    agency: '문화체육관광부',
    icon: '🎫',
    badge: null,
    benefit: '공연·전시 관람비 연 15만 원',
    summary: '19세 청년에게 공연·전시에서 쓸 수 있는 포인트를 지급해요.',
    details: ['1인당 연 15만 원 (지역별 상이)', '공연·전시 예매처에서 즉시 사용', '발급 연도 내 소진 필요'],
    monthly: 0,
    lump: 150_000,
    cond: { minAge: 19, maxAge: 19 },
    missMsg: '만 19세 청년만 발급받을 수 있어요.',
  },
]

/** 로딩 화면 단계 (표시 텍스트만 수정하면 됩니다) */
export const LOADING_STEPS = ['만 나이·소득 조건 확인', '7개 정책 자격 대조', '예상 수령액 계산']

/** 입력/결과 화면 하단 꿀팁 카드 */
export const TIPS = [
  {
    no: '1',
    title: "소득은 '세전' 기준으로 보기",
    body: '대부분의 청년 정책은 건강보험료 부과 기준 세전 소득을 봅니다. 세후로 계산하면 탈락 판정이 날 수 있어요.',
  },
  {
    no: '2',
    title: '주민등록 분리부터 챙기기',
    body: '부모님과 따로 산다면 전입신고·주민등록 분리가 되어 있어야 월세 지원 심사를 통과해요.',
  },
  {
    no: '3',
    title: '적금·공제는 중복 가입 가능',
    body: '청년미래적금과 내일채움공제는 성격이 달라 동시에 유지할 수 있어요. 납입 여력만 확인하세요.',
  },
]

/** 오른쪽 레일 — 이번 주 많이 찾은 정책 */
export const TRENDING = [
  { rank: '1', name: '청년미래적금', delta: '+42%' },
  { rank: '2', name: '청년월세 특별지원', delta: '+18%' },
  { rank: '3', name: '주택드림 청약통장', delta: '+9%' },
  { rank: '4', name: '국민취업지원제도', delta: '+4%' },
]

/** 오른쪽 레일 — 서류 미리 챙기기 체크리스트 */
export const DOCS = ['주민등록초본 (세대원 표기)', '건강보험 자격득실 확인서', '임대차계약서 사본', '최근 3개월 급여명세서']

/** 왼쪽 레일 — 정책 브리핑 지표 */
export const BRIEFING_STATS = [
  { label: '수록된 청년 정책', value: `${POLICIES.length}개` },
  { label: '평균 매칭 정책 수', value: '3.2개' },
  { label: '올해 남은 신청 시즌', value: '2회' },
]

/** 조건 매칭: 입력값으로 matched / unmatched 를 나눕니다. */
export function matchPolicies({ age, incomeMan, residence, status }) {
  const matched = []
  const unmatched = []
  for (const p of POLICIES) {
    const c = p.cond
    const ok =
      age != null &&
      (c.minAge == null || age >= c.minAge) &&
      (c.maxAge == null || age <= c.maxAge) &&
      (c.maxIncomeMan == null || incomeMan <= c.maxIncomeMan) &&
      (!c.residence || c.residence.includes(residence)) &&
      (!c.status || c.status.includes(status))
    ;(ok ? matched : unmatched).push(p)
  }
  return { matched, unmatched }
}

/** 금액 포맷: 1000원 단위 → "22,000,000" 같은 숫자를 "2,200만 원" 식으로 축약 */
export function formatWon(v) {
  if (!v) return '0원'
  if (v >= 10_000_000) {
    const e = v / 10_000_000
    return `${Number.isInteger(e) ? e : e.toFixed(1)}천만 원`
  }
  if (v >= 10_000) return `${Math.round(v / 10_000).toLocaleString()}만 원`
  return `${v.toLocaleString()}원`
}
