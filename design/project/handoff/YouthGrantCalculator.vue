<!--
  청년 금융·정책 지원금 모의계산기 — Vue 3 (Composition API) + Tailwind CSS
  단일 컴포넌트로 바로 실행 가능. 정책 데이터는 ./policies.js 에 분리되어 있습니다.
  Tailwind 설정 권장: fontFamily.sans 에 'Pretendard Variable' 추가.
-->
<script setup>
import { ref, computed } from 'vue'
import { policies, matchPolicies, CURRENT_YEAR, RESIDENCE_OPTIONS, STATUS_OPTIONS } from './policies.js'

const birthYear = ref('2004')
const incomeMan = ref(230)          // 월 세전 소득 (만원)
const residence = ref('alone')      // 'parents' | 'alone'
const status = ref('sme')           // 'sme' | 'jobseek' | 'student'
const submitted = ref(false)
const opened = ref({})              // 카드별 [자세히 보기] 펼침 상태

const age = computed(() => {
  const y = parseInt(birthYear.value, 10)
  return y >= 1950 && y <= CURRENT_YEAR ? CURRENT_YEAR - y : null
})

const result = computed(() =>
  matchPolicies({ age: age.value, incomeMan: incomeMan.value, residence: residence.value, status: status.value })
)
const monthlyTotal = computed(() => result.value.matched.reduce((a, p) => a + p.monthly, 0))
const lumpTotal = computed(() => result.value.matched.reduce((a, p) => a + p.lump, 0))

const won = (v) => {
  if (!v) return '0원'
  if (v >= 10_000_000) {
    const e = v / 10_000_000
    return `${Number.isInteger(e) ? e : e.toFixed(1)}천만 원`
  }
  if (v >= 10_000) return `${Math.round(v / 10_000).toLocaleString()}만 원`
  return `${v.toLocaleString()}원`
}

const incomeLabel = computed(() =>
  incomeMan.value >= 500 ? '500만 원 이상' : `${incomeMan.value.toLocaleString()}만 원`
)

const tip = computed(() => {
  if (incomeMan.value > 300) return '소득이 기준을 넘는 정책이 많아요. 세전/세후 금액을 다시 확인해 보세요.'
  if (residence.value === 'parents') return '부모님과 따로 살며 주민등록을 분리하면 청년월세 지원까지 받을 수 있어요.'
  return '구직 중이라면 국민취업지원제도, 재직 중이라면 내일채움공제를 함께 살펴보세요.'
})

const onBirthInput = (e) => (birthYear.value = e.target.value.replace(/\D/g, '').slice(0, 4))
const submit = () => { submitted.value = true; opened.value = {} }
const toggle = (id) => (opened.value = { ...opened.value, [id]: !opened.value[id] })

const chipClass = (on) =>
  on ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-600'
</script>

<template>
  <div class="min-h-screen bg-[#F2F4F6] font-sans text-[#191F28] flex justify-center pb-32">
    <div class="w-full max-w-[480px]">
      <!-- 헤더 -->
      <header class="px-6 pt-14 pb-7">
        <span class="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1.5 text-[12.5px] font-bold text-blue-700">
          {{ CURRENT_YEAR }}년 9월 기준 정책 반영
        </span>
        <h1 class="mt-4 text-[29px] font-extrabold leading-[1.35] tracking-tight">
          내 조건에 맞는 청년 지원금<br /><span class="text-blue-500">1초 만에</span> 확인하기
        </h1>
        <p class="mt-3 text-[15px] leading-relaxed text-gray-500">
          나이·소득·거주 형태만 입력하면 받을 수 있는 적금, 월세, 세금 혜택을 한 번에 모아드려요.
        </p>
      </header>

      <!-- 입력 폼 -->
      <section class="mx-4 rounded-3xl bg-white px-[22px] pb-6 pt-7 shadow-[0_12px_32px_-18px_rgba(0,0,0,0.18)]">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-bold text-gray-600">출생연도</label>
          <div class="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-gray-50 px-4">
            <input :value="birthYear" @input="onBirthInput" inputmode="numeric" maxlength="4" placeholder="2004"
              class="min-w-0 flex-1 bg-transparent py-4 text-[19px] font-bold outline-none" />
            <span class="text-[15px] font-semibold text-gray-400">년생</span>
            <span class="whitespace-nowrap rounded-lg bg-blue-500/10 px-2.5 py-1 text-[13px] font-bold text-blue-700">
              {{ age === null ? '연도 입력' : `만 ${age}세` }}
            </span>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-2">
          <div class="flex items-baseline justify-between">
            <label class="text-sm font-bold text-gray-600">월 세전 소득</label>
            <span class="text-[19px] font-extrabold tracking-tight text-blue-500">{{ incomeLabel }}</span>
          </div>
          <input type="range" min="0" max="500" step="10" v-model.number="incomeMan"
            class="h-6 w-full cursor-pointer accent-blue-500" />
          <div class="flex justify-between text-xs font-semibold text-gray-400">
            <span>0</span><span>250만</span><span>500만 이상</span>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-2.5">
          <label class="text-sm font-bold text-gray-600">거주 형태</label>
          <div class="grid grid-cols-2 gap-2.5">
            <button v-for="o in RESIDENCE_OPTIONS" :key="o.key" @click="residence = o.key"
              class="rounded-2xl border-[1.5px] py-4 text-[15px] font-bold transition"
              :class="chipClass(residence === o.key)">{{ o.label }}</button>
          </div>
        </div>

        <div class="mt-5 flex flex-col gap-2.5">
          <label class="text-sm font-bold text-gray-600">재직 상태</label>
          <button v-for="o in STATUS_OPTIONS" :key="o.key" @click="status = o.key"
            class="flex items-center justify-between gap-2.5 rounded-2xl border-[1.5px] px-[18px] py-4 text-left transition"
            :class="chipClass(status === o.key)">
            <span class="flex flex-col gap-0.5">
              <span class="text-[15.5px] font-bold">{{ o.label }}</span>
              <span class="text-[12.5px] font-medium text-gray-400">{{ o.hint }}</span>
            </span>
            <span class="h-5 w-5 rounded-full bg-white box-border"
              :class="status === o.key ? 'border-[6px] border-blue-500' : 'border-2 border-gray-300'"></span>
          </button>
        </div>

        <button @click="submit"
          class="mt-7 w-full rounded-2xl bg-blue-500 py-[19px] text-[17px] font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(49,130,246,0.75)] transition hover:bg-blue-600">
          맞춤 지원금 확인하기
        </button>
        <p class="mt-3 text-center text-xs text-gray-400">입력값은 저장되지 않아요 · 모의계산 결과예요</p>
      </section>

      <!-- 결과 대시보드 -->
      <section v-if="submitted" class="mx-4 mt-9">
        <h2 class="px-1.5 pb-3.5 text-xl font-extrabold tracking-tight">
          {{ age === null ? '청년' : `만 ${age}세 청년` }}님이 받을 수 있는 혜택
        </h2>

        <div class="rounded-[22px] bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 p-[22px] text-white shadow-[0_14px_30px_-16px_rgba(27,100,218,0.8)]">
          <div class="text-[13.5px] font-bold opacity-80">매칭된 정책 {{ result.matched.length }}개 · 예상 총 혜택</div>
          <div class="mt-2 text-[34px] font-extrabold tracking-tighter">{{ won(monthlyTotal * 12 + lumpTotal) }}</div>
          <div class="mt-3.5 flex gap-7 border-t border-white/20 pt-3.5">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-semibold opacity-80">매달 현금성 지원</span>
              <span class="text-[17px] font-extrabold">{{ won(monthlyTotal) }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs font-semibold opacity-80">만기·연간 목돈</span>
              <span class="text-[17px] font-extrabold">{{ won(lumpTotal) }}</span>
            </div>
          </div>
        </div>

        <div class="mt-3.5 flex flex-col gap-3">
          <article v-for="p in result.matched" :key="p.id" class="rounded-[20px] bg-white p-5 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.2)]">
            <div class="flex items-start gap-3">
              <div class="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#F2F4F6] text-xl">{{ p.icon }}</div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="text-[16.5px] font-extrabold tracking-tight">{{ p.name }}</span>
                  <span v-if="p.badge" class="rounded-md bg-orange-50 px-2 py-0.5 text-[11.5px] font-extrabold text-orange-600">{{ p.badge }}</span>
                </div>
                <div class="mt-0.5 text-[12.5px] font-semibold text-gray-400">{{ p.agency }}</div>
              </div>
            </div>

            <div class="mt-3.5 rounded-2xl bg-[#F2F4F6] px-4 py-3.5">
              <div class="text-[11.5px] font-bold text-gray-400">예상 혜택</div>
              <div class="mt-1 text-[18px] font-extrabold tracking-tight text-blue-700">{{ p.benefit }}</div>
              <div class="mt-1.5 text-[13px] leading-relaxed text-gray-600">{{ p.summary }}</div>
            </div>

            <ul v-if="opened[p.id]" class="mt-3 flex flex-col gap-2 px-1">
              <li v-for="d in p.details" :key="d" class="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-gray-600">
                <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gray-300"></span>{{ d }}
              </li>
            </ul>

            <div class="mt-4 grid grid-cols-2 gap-2.5">
              <button @click="toggle(p.id)" class="rounded-xl bg-[#F2F4F6] py-3.5 text-[14.5px] font-bold text-gray-600 transition hover:bg-gray-200">
                {{ opened[p.id] ? '접기' : '자세히 보기' }}
              </button>
              <button class="rounded-xl bg-[#191F28] py-3.5 text-[14.5px] font-bold text-white transition hover:bg-gray-700">신청하기</button>
            </div>
          </article>
        </div>

        <!-- 미매칭 -->
        <div class="mt-7 rounded-[20px] bg-white p-5">
          <div class="text-[15.5px] font-extrabold tracking-tight">아쉽게도 지금은 대상이 아니에요</div>
          <div class="mt-1 text-[13px] text-gray-400">조건이 바뀌면 바로 신청할 수 있어요.</div>
          <div class="mt-3.5 flex flex-col">
            <div v-for="p in result.unmatched" :key="p.id" class="flex items-start gap-3 border-t border-[#F2F4F6] py-3.5">
              <div class="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[#F2F4F6] text-base grayscale opacity-75">{{ p.icon }}</div>
              <div class="min-w-0 flex-1">
                <div class="text-[14.5px] font-bold text-gray-500">{{ p.name }}</div>
                <div class="mt-0.5 text-[13px] leading-relaxed text-gray-400">{{ p.missMsg }}</div>
              </div>
            </div>
          </div>
          <div class="mt-3.5 flex gap-2.5 rounded-2xl bg-blue-50 px-4 py-3.5">
            <span class="flex-none">💡</span>
            <span class="text-[13.5px] font-semibold leading-relaxed text-blue-700">{{ tip }}</span>
          </div>
        </div>

        <p class="mx-2 mt-5 text-[11.5px] leading-relaxed text-gray-500">
          본 화면은 목업으로, 정책 금액·조건은 예시 데이터입니다. 실제 신청 자격은 각 기관 공고를 확인해 주세요.
        </p>
      </section>
    </div>
  </div>
</template>
