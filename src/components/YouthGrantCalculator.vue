<!--
  청년 금융·정책 지원금 모의계산기 — Vue 3 (Composition API) + Tailwind CSS
  입력 → 로딩 → 결과 3화면 흐름. 정책 데이터는 ../data/policies.js 에 분리되어 있습니다.
-->
<script setup>
import { ref, computed, onUnmounted } from 'vue'
import {
  CURRENT_YEAR,
  RESIDENCE_OPTIONS,
  STATUS_OPTIONS,
  LOADING_STEPS,
  TIPS,
  TRENDING,
  DOCS,
  BRIEFING_STATS,
  matchPolicies,
  formatWon,
} from '../data/policies.js'

const birthYear = ref('2004')
const incomeMan = ref(230) // 월 세전 소득 (만원)
const residence = ref('alone') // 'parents' | 'alone'
const status = ref('sme') // 'sme' | 'jobseek' | 'student'
const view = ref('form') // 'form' | 'loading' | 'result'
const step = ref(0)
const opened = ref({}) // 카드별 [자세히 보기] 펼침 상태
let timer = null

onUnmounted(() => clearInterval(timer))

const age = computed(() => {
  const y = parseInt(birthYear.value, 10)
  return y >= 1950 && y <= CURRENT_YEAR ? CURRENT_YEAR - y : null
})
const ageLabel = computed(() => (age.value === null ? '연도 입력' : `만 ${age.value}세`))
const incomeLabel = computed(() =>
  incomeMan.value >= 500 ? '500만 원 이상' : `${incomeMan.value.toLocaleString()}만 원`,
)

const result = computed(() =>
  matchPolicies({ age: age.value, incomeMan: incomeMan.value, residence: residence.value, status: status.value }),
)
const monthlyTotal = computed(() => result.value.matched.reduce((a, p) => a + p.monthly, 0))
const lumpTotal = computed(() => result.value.matched.reduce((a, p) => a + p.lump, 0))

const nickname = computed(() => (age.value === null ? '청년' : `만 ${age.value}세 청년`))
const loadingSub = computed(() => `${age.value === null ? '청년' : `만 ${age.value}세`} · 월 ${incomeMan.value}만 원 기준`)

const tip = computed(() => {
  if (incomeMan.value > 300)
    return '소득이 기준을 넘는 정책이 많아요. 연말정산 기준 소득이 다르면 결과가 달라질 수 있으니 세전/세후 금액을 확인해 보세요.'
  if (residence.value === 'parents')
    return '부모님과 따로 살며 주민등록을 분리하면 청년월세 지원까지 받을 수 있어요.'
  return '구직 중이라면 국민취업지원제도, 재직 중이라면 내일채움공제를 함께 살펴보세요.'
})

const onBirthInput = (e) => {
  birthYear.value = e.target.value.replace(/\D/g, '').slice(0, 4)
}

const runLoading = () => {
  clearInterval(timer)
  step.value = 0
  opened.value = {}
  view.value = 'loading'
  timer = setInterval(() => {
    const next = step.value + 1
    if (next > LOADING_STEPS.length) {
      clearInterval(timer)
      view.value = 'result'
      return
    }
    step.value = next
  }, 620)
}

const goBack = () => {
  clearInterval(timer)
  view.value = 'form'
}

const toggle = (id) => {
  opened.value = { ...opened.value, [id]: !opened.value[id] }
}

const chipClass = (on) =>
  on
    ? 'border-[#3182F6] bg-[#3182F6]/[0.06] text-[#1B64DA]'
    : 'border-[#E5E8EB] bg-[#F9FAFB] text-[#4E5968]'
</script>

<template>
  <div class="min-h-screen bg-[#F2F4F6] font-sans text-[#191F28] flex justify-center items-start gap-3.5 pb-[120px]">
    <!-- 왼쪽 레일 (900px 이상) -->
    <aside class="hidden rail:flex w-[190px] flex-none sticky top-14 flex-col gap-3.5 pt-14">
      <div class="text-[13px] font-extrabold tracking-[-.3px] text-[#8B95A1]">{{ CURRENT_YEAR }} 청년정책 브리핑</div>
      <div class="rounded-[18px] bg-white p-[18px] shadow-[0_1px_2px_rgba(0,0,0,.04)]">
        <div class="flex flex-col gap-3.5">
          <div v-for="s in BRIEFING_STATS" :key="s.label" class="flex flex-col gap-[3px]">
            <span class="text-[12.5px] font-semibold tracking-[-.2px] text-[#8B95A1]">{{ s.label }}</span>
            <span class="text-[21px] font-extrabold tracking-[-.7px] text-[#191F28]">{{ s.value }}</span>
          </div>
        </div>
      </div>
      <div class="rounded-[18px] bg-[#191F28] p-[18px] text-white">
        <div class="text-xs font-bold opacity-65">다가오는 신청 시즌</div>
        <div class="mt-1.5 text-base font-extrabold tracking-[-.5px]">청년미래적금 2차</div>
        <div class="mt-2.5 inline-flex rounded-lg bg-white/[0.14] px-2.5 py-[5px] text-[12.5px] font-extrabold">
          10월 접수 예정
        </div>
      </div>
    </aside>

    <div class="w-full max-w-[480px] flex-none">
      <!-- ── 입력 화면 ───────────────────────────────────────────── -->
      <div v-if="view === 'form'">
        <div class="px-6 pb-7 pt-[52px]">
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-[#3182F6]/10 px-[11px] py-1.5 text-[12.5px] font-bold tracking-[-.2px] text-[#1B64DA]"
          >
            {{ CURRENT_YEAR }}년 9월 기준 정책 반영
          </span>
          <h1 class="mt-4 text-[29px] font-extrabold leading-[1.35] tracking-[-1.1px] text-pretty break-keep">
            내 조건에 맞는 청년 지원금<br />
            <span class="text-[#3182F6]">1초 만에</span> 확인하기
          </h1>
          <p class="mt-3 text-[15px] leading-[1.55] tracking-[-.3px] text-[#6B7684] text-pretty break-keep">
            나이·소득·거주 형태만 입력하면 받을 수 있는 적금, 월세, 세금 혜택을 한 번에 모아드려요.
          </p>
        </div>

        <div
          class="mx-4 rounded-[24px] bg-white px-[22px] pb-6 pt-7 shadow-[0_1px_2px_rgba(0,0,0,.04),0_12px_32px_-18px_rgba(0,0,0,.18)]"
        >
          <!-- 출생연도 -->
          <div class="flex flex-col gap-[9px]">
            <label class="text-sm font-bold tracking-[-.3px] text-[#4E5968]">출생연도</label>
            <div class="flex items-center gap-2.5 rounded-2xl border border-[#E5E8EB] bg-[#F9FAFB] px-4">
              <input
                :value="birthYear"
                @input="onBirthInput"
                inputmode="numeric"
                maxlength="4"
                placeholder="2004"
                class="min-w-0 flex-1 bg-transparent py-[15px] font-sans text-[19px] font-bold tracking-[-.4px] text-[#191F28] outline-none"
              />
              <span class="text-[15px] font-semibold text-[#8B95A1]">년생</span>
              <span
                class="whitespace-nowrap rounded-lg bg-[#3182F6]/10 px-2.5 py-[5px] text-[13px] font-bold text-[#1B64DA]"
              >
                {{ ageLabel }}
              </span>
            </div>
          </div>

          <!-- 월 세전 소득 -->
          <div class="mt-6 flex flex-col gap-[9px]">
            <div class="flex items-baseline justify-between">
              <label class="text-sm font-bold tracking-[-.3px] text-[#4E5968]">월 세전 소득</label>
              <span class="text-[19px] font-extrabold tracking-[-.5px] text-[#3182F6]">{{ incomeLabel }}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              v-model.number="incomeMan"
              class="mt-0.5 h-[26px] w-full cursor-pointer"
            />
            <div class="flex justify-between text-xs font-semibold text-[#8B95A1]">
              <span>0</span><span>250만</span><span>500만 이상</span>
            </div>
          </div>

          <!-- 거주 형태 -->
          <div class="mt-[26px] flex flex-col gap-2.5">
            <label class="text-sm font-bold tracking-[-.3px] text-[#4E5968]">거주 형태</label>
            <div class="grid grid-cols-2 gap-2.5">
              <button
                v-for="o in RESIDENCE_OPTIONS"
                :key="o.key"
                type="button"
                @click="residence = o.key"
                class="flex min-h-[44px] items-center justify-center rounded-[14px] border-[1.5px] py-4 text-[15px] font-bold tracking-[-.3px] transition-colors duration-150"
                :class="chipClass(residence === o.key)"
              >
                {{ o.label }}
              </button>
            </div>
          </div>

          <!-- 재직 상태 -->
          <div class="mt-[22px] flex flex-col gap-2.5">
            <label class="text-sm font-bold tracking-[-.3px] text-[#4E5968]">재직 상태</label>
            <div class="flex flex-col gap-2.5">
              <button
                v-for="o in STATUS_OPTIONS"
                :key="o.key"
                type="button"
                @click="status = o.key"
                class="flex min-h-[44px] items-center justify-between gap-2.5 rounded-[14px] border-[1.5px] px-[18px] py-4 text-left transition-colors duration-150"
                :class="chipClass(status === o.key)"
              >
                <span class="flex flex-col gap-[3px]">
                  <span class="text-[15.5px] font-bold tracking-[-.4px]">{{ o.label }}</span>
                  <span class="text-[12.5px] font-medium tracking-[-.2px] text-[#8B95A1]">{{ o.hint }}</span>
                </span>
                <span
                  class="h-5 w-5 flex-none box-border rounded-full bg-white"
                  :class="status === o.key ? 'border-[6px] border-[#3182F6]' : 'border-2 border-[#D1D6DB]'"
                ></span>
              </button>
            </div>
          </div>

          <button
            type="button"
            @click="runLoading"
            class="mt-7 w-full min-h-[44px] rounded-2xl bg-[#3182F6] py-[19px] font-sans text-[17px] font-extrabold tracking-[-.4px] text-white shadow-[0_10px_24px_-10px_rgba(49,130,246,.75)] transition-colors duration-150 hover:bg-[#1B64DA]"
          >
            맞춤 지원금 확인하기
          </button>
          <p class="mt-3 text-center text-xs tracking-[-.2px] text-[#8B95A1]">
            입력값은 저장되지 않아요 · 모의계산 결과예요
          </p>
        </div>

        <!-- 꿀팁 (입력 화면) -->
        <div class="mx-4 mt-5 rounded-[20px] bg-white p-5">
          <div class="text-[15.5px] font-extrabold tracking-[-.4px]">🍯 신청 전 꿀팁</div>
          <div class="mt-3.5 flex flex-col gap-3">
            <div v-for="t in TIPS" :key="t.no" class="flex items-start gap-[11px]">
              <span
                class="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] bg-[#F0F7FF] text-xs font-extrabold text-[#1B64DA]"
                >{{ t.no }}</span
              >
              <span class="flex min-w-0 flex-1 flex-col gap-[3px]">
                <span class="text-sm font-bold tracking-[-.3px]">{{ t.title }}</span>
                <span class="text-[13px] leading-[1.55] tracking-[-.2px] text-[#6B7684] text-pretty break-keep">{{ t.body }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── 로딩 화면 ───────────────────────────────────────────── -->
      <div
        v-else-if="view === 'loading'"
        class="flex min-h-[82vh] flex-col items-center justify-center px-6 py-10 animate-rise"
      >
        <div class="relative h-[76px] w-[76px]">
          <div class="absolute inset-0 rounded-full border-[6px] border-[#E5E8EB]"></div>
          <div class="absolute inset-0 animate-spin-fast rounded-full border-[6px] border-transparent border-t-[#3182F6]"></div>
        </div>
        <div class="mt-[26px] text-center text-xl font-extrabold tracking-[-.7px]">조건을 맞춰보고 있어요</div>
        <div class="mt-2 text-sm tracking-[-.3px] text-[#6B7684]">{{ loadingSub }}</div>
        <div class="mt-7 flex w-full max-w-[300px] flex-col gap-[11px]">
          <div
            v-for="(label, i) in LOADING_STEPS"
            :key="label"
            class="flex items-center gap-2.5 rounded-[14px] px-4 py-[13px] transition-all duration-300"
            :class="[
              step > i || step === i ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,.05)]' : 'bg-transparent',
              step > i ? 'text-[#191F28]' : step === i ? 'text-[#3182F6] animate-pulse-step' : 'text-[#B0B8C1]',
            ]"
          >
            <span
              class="flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px] font-extrabold"
              :class="step > i ? 'bg-[#3182F6] text-white' : 'bg-[#E5E8EB] text-[#8B95A1]'"
            >
              {{ step > i ? '✓' : i + 1 }}
            </span>
            <span class="text-sm font-bold tracking-[-.3px]">{{ label }}</span>
          </div>
        </div>
      </div>

      <!-- ── 결과 화면 ───────────────────────────────────────────── -->
      <div v-else class="animate-rise-slow">
        <div class="flex items-center gap-2.5 px-[22px] pb-[18px] pt-[46px]">
          <button
            type="button"
            @click="goBack"
            aria-label="입력 화면으로 돌아가기"
            class="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-white font-sans text-[17px] font-extrabold text-[#4E5968] shadow-[0_1px_3px_rgba(0,0,0,.06)] transition-colors duration-150 hover:bg-[#E5E8EB]"
          >
            ‹
          </button>
          <div class="flex min-w-0 flex-1 flex-col gap-0.5">
            <span class="text-[12.5px] font-bold tracking-[-.2px] text-[#8B95A1]">모의계산 결과</span>
            <span class="text-lg font-extrabold tracking-[-.6px]">{{ nickname }}님이 받을 수 있는 혜택</span>
          </div>
        </div>

        <div class="mx-4">
          <!-- 총 혜택 요약 -->
          <div
            class="rounded-[22px] bg-gradient-to-br from-[#1B64DA] via-[#3182F6] to-[#4593FC] p-[22px] text-white shadow-[0_14px_30px_-16px_rgba(27,100,218,.8)]"
          >
            <div class="text-[13.5px] font-bold tracking-[-.3px] opacity-[.82]">
              매칭된 정책 {{ result.matched.length }}개 · 예상 총 혜택
            </div>
            <div class="mt-2 text-[34px] font-extrabold tracking-[-1.6px]">
              {{ formatWon(monthlyTotal * 12 + lumpTotal) }}
            </div>
            <div class="mt-3.5 flex gap-[26px] border-t border-white/[0.22] pt-3.5">
              <div class="flex flex-col gap-1">
                <span class="text-xs font-semibold opacity-80">매달 현금성 지원</span>
                <span class="text-[17px] font-extrabold tracking-[-.5px]">{{ formatWon(monthlyTotal) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-semibold opacity-80">만기·연간 목돈</span>
                <span class="text-[17px] font-extrabold tracking-[-.5px]">{{ formatWon(lumpTotal) }}</span>
              </div>
            </div>
          </div>

          <!-- 매칭된 정책 카드 -->
          <div class="mt-3.5 flex flex-col gap-3">
            <article
              v-for="p in result.matched"
              :key="p.id"
              class="rounded-[20px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.04),0_10px_24px_-18px_rgba(0,0,0,.2)]"
            >
              <div class="flex items-start gap-[13px]">
                <div class="flex h-11 w-11 flex-none items-center justify-center rounded-[13px] bg-[#F2F4F6] text-xl">
                  {{ p.icon }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span class="text-[16.5px] font-extrabold tracking-[-.5px]">{{ p.name }}</span>
                    <span
                      v-if="p.badge"
                      class="rounded-[7px] bg-[#FFF0E8] px-2 py-[3px] text-[11.5px] font-extrabold text-[#F2731C]"
                      >{{ p.badge }}</span
                    >
                  </div>
                  <div class="mt-[3px] text-[12.5px] font-semibold tracking-[-.2px] text-[#8B95A1]">{{ p.agency }}</div>
                </div>
              </div>

              <div class="mt-3.5 rounded-[14px] bg-[#F2F4F6] px-4 py-3.5">
                <div class="text-[11.5px] font-bold text-[#8B95A1]">예상 혜택</div>
                <div class="mt-1 text-[18px] font-extrabold tracking-[-.6px] text-[#1B64DA] text-pretty break-keep">
                  {{ p.benefit }}
                </div>
                <div class="mt-1.5 text-[13px] leading-[1.5] tracking-[-.2px] text-[#4E5968] text-pretty break-keep">
                  {{ p.summary }}
                </div>
              </div>

              <ul v-if="opened[p.id]" class="mt-3 flex flex-col gap-2 px-1">
                <li
                  v-for="d in p.details"
                  :key="d"
                  class="flex items-start gap-[9px] text-[13.5px] leading-[1.55] tracking-[-.2px] text-[#4E5968] text-pretty break-keep"
                >
                  <span class="mt-1.5 h-[5px] w-[5px] flex-none rounded-full bg-[#C4CBD3]"></span>{{ d }}
                </li>
              </ul>

              <div class="mt-4 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  @click="toggle(p.id)"
                  class="min-h-[44px] rounded-[13px] bg-[#F2F4F6] py-3.5 text-[14.5px] font-bold tracking-[-.3px] text-[#4E5968] transition-colors duration-150 hover:bg-[#E5E8EB]"
                >
                  {{ opened[p.id] ? '접기' : '자세히 보기' }}
                </button>
                <button
                  type="button"
                  class="min-h-[44px] rounded-[13px] bg-[#191F28] py-3.5 text-[14.5px] font-bold tracking-[-.3px] text-white transition-colors duration-150 hover:bg-[#333D4B]"
                >
                  신청하기
                </button>
              </div>
            </article>
          </div>

          <!-- 미매칭 정책 -->
          <div class="mt-7 rounded-[20px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
            <div class="text-[15.5px] font-extrabold tracking-[-.4px]">아쉽게도 지금은 대상이 아니에요</div>
            <div class="mt-1 text-[13px] tracking-[-.2px] text-[#8B95A1]">조건이 바뀌면 바로 신청할 수 있어요.</div>
            <div class="mt-3.5 flex flex-col">
              <div
                v-for="p in result.unmatched"
                :key="p.id"
                class="flex items-start gap-3 border-t border-[#F2F4F6] py-3.5"
              >
                <div
                  class="flex h-9 w-9 flex-none items-center justify-center rounded-[11px] bg-[#F2F4F6] text-base opacity-75 grayscale"
                >
                  {{ p.icon }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-[14.5px] font-bold tracking-[-.3px] text-[#6B7684]">{{ p.name }}</div>
                  <div class="mt-[3px] text-[13px] leading-[1.5] tracking-[-.2px] text-[#8B95A1] text-pretty break-keep">
                    {{ p.missMsg }}
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3.5 flex gap-2.5 rounded-[14px] bg-[#F0F7FF] px-4 py-[15px]">
              <span class="flex-none text-[15px]">💡</span>
              <span class="text-[13.5px] font-semibold leading-[1.55] tracking-[-.2px] text-[#1B64DA] text-pretty break-keep">{{
                tip
              }}</span>
            </div>
          </div>

          <!-- 꿀팁 (결과 화면) -->
          <div class="mt-3.5 rounded-[20px] bg-white p-5">
            <div class="text-[15.5px] font-extrabold tracking-[-.4px]">🍯 놓치면 아쉬운 꿀팁</div>
            <div class="mt-3.5 flex flex-col gap-3">
              <div v-for="t in TIPS" :key="t.no" class="flex items-start gap-[11px]">
                <span
                  class="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] bg-[#F0F7FF] text-xs font-extrabold text-[#1B64DA]"
                  >{{ t.no }}</span
                >
                <span class="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span class="text-sm font-bold tracking-[-.3px]">{{ t.title }}</span>
                  <span class="text-[13px] leading-[1.55] tracking-[-.2px] text-[#6B7684] text-pretty break-keep">{{
                    t.body
                  }}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="goBack"
            class="mt-3.5 min-h-[44px] w-full rounded-2xl border-[1.5px] border-[#E5E8EB] bg-white py-[17px] text-[15.5px] font-extrabold tracking-[-.3px] text-[#4E5968] transition-colors duration-150 hover:bg-[#F9FAFB]"
          >
            조건 바꿔서 다시 계산하기
          </button>

          <p class="mx-2 mt-[22px] text-[11.5px] leading-[1.6] tracking-[-.2px] text-[#6B7684] text-pretty break-keep">
            본 화면은 UI 목업으로, 정책 금액·조건은 예시 데이터입니다. 실제 신청 자격은 각 기관 공고를 확인해 주세요.
          </p>
        </div>
      </div>
    </div>

    <!-- 오른쪽 레일 (900px 이상) -->
    <aside class="hidden rail:flex w-[190px] flex-none sticky top-14 flex-col gap-3.5 pt-14">
      <div class="text-[13px] font-extrabold tracking-[-.3px] text-[#8B95A1]">이번 주 많이 찾은 정책</div>
      <div class="rounded-[18px] bg-white px-[18px] py-2 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
        <div
          v-for="(t, i) in TRENDING"
          :key="t.rank"
          class="flex items-center gap-[11px] py-[13px]"
          :class="i ? 'border-t border-[#F2F4F6]' : ''"
        >
          <span class="w-3 flex-none text-[13px] font-extrabold text-[#3182F6]">{{ t.rank }}</span>
          <span class="min-w-0 flex-1 truncate text-[13.5px] font-bold tracking-[-.3px]">{{ t.name }}</span>
          <span class="flex-none text-xs font-bold text-[#8B95A1]">{{ t.delta }}</span>
        </div>
      </div>
      <div class="rounded-[18px] bg-[#F0F7FF] p-[18px]">
        <div class="text-[13.5px] font-extrabold tracking-[-.3px] text-[#1B64DA]">서류 미리 챙기기</div>
        <div class="mt-2.5 flex flex-col gap-2">
          <div
            v-for="d in DOCS"
            :key="d"
            class="flex items-center gap-2 text-[13px] font-semibold tracking-[-.2px] text-[#1B64DA]"
          >
            <span
              class="flex h-[15px] w-[15px] flex-none items-center justify-center rounded-[5px] bg-[#3182F6]/20 text-[9px]"
              >✓</span
            >{{ d }}
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
