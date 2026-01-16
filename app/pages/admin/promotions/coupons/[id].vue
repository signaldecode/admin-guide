<script setup>
/**
 * 쿠폰 등록/수정 페이지
 * - /admin/promotions/coupons/new → 등록 모드
 * - /admin/promotions/coupons/:id → 수정 모드
 */

import { useUiStore } from '~/stores/ui'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()

// 페이지 가이드
const { message: guideMessage } = usePageGuide()

// 모드 판별
const isEditMode = computed(() => route.params.id !== 'new')

// 대상 등급 옵션
const gradeOptions = [
  { value: 'all', label: '전체 회원' },
  { value: 'vip', label: 'VIP' },
  { value: 'gold', label: '골드' },
  { value: 'silver', label: '실버' },
  { value: 'normal', label: '일반' },
]

// 폼 데이터
const form = ref({
  name: '',
  code: '',
  description: '',
  discountType: 'percent',
  discountValue: 10,
  minOrderAmount: 0,
  maxDiscountAmount: null,
  startDate: '',
  endDate: '',
  totalQuantity: null,
  targetGrades: ['all'],
  status: 'active',
})

// 사용 통계 (수정 모드에서만)
const usageStats = ref({
  issuedCount: 0,
  usedCount: 0,
  totalDiscountAmount: 0,
})

const isLoading = ref(false)
const isSaving = ref(false)

// 데이터 로드
const fetchCoupon = async () => {
  isLoading.value = true
  await new Promise((r) => setTimeout(r, 300))

  // Mock 데이터
  form.value = {
    name: '신규회원 환영 쿠폰',
    code: 'WELCOME2025',
    description: '신규 가입 회원에게 발급되는 환영 쿠폰입니다.',
    discountType: 'percent',
    discountValue: 15,
    minOrderAmount: 30000,
    maxDiscountAmount: 10000,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    totalQuantity: null,
    targetGrades: ['all'],
    status: 'active',
  }

  usageStats.value = {
    issuedCount: 1234,
    usedCount: 567,
    totalDiscountAmount: 5670000,
  }

  isLoading.value = false
}

// 쿠폰 코드 생성
const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  form.value.code = code
}

// 저장
const handleSave = async () => {
  if (!form.value.name.trim()) {
    uiStore.showToast({ type: 'error', message: '쿠폰명을 입력해주세요.' })
    return
  }
  if (!form.value.code.trim()) {
    uiStore.showToast({ type: 'error', message: '쿠폰코드를 입력해주세요.' })
    return
  }
  if (!form.value.discountValue || form.value.discountValue <= 0) {
    uiStore.showToast({ type: 'error', message: '할인값을 입력해주세요.' })
    return
  }
  if (form.value.discountType === 'percent' && form.value.discountValue > 100) {
    uiStore.showToast({ type: 'error', message: '할인율은 100%를 초과할 수 없습니다.' })
    return
  }
  if (!form.value.startDate) {
    uiStore.showToast({ type: 'error', message: '시작일을 입력해주세요.' })
    return
  }

  isSaving.value = true
  await new Promise((r) => setTimeout(r, 500))

  uiStore.showToast({
    type: 'success',
    message: isEditMode.value ? '쿠폰이 수정되었습니다.' : '쿠폰이 등록되었습니다.',
  })
  router.push('/admin/promotions/coupons')
}

// 삭제
const handleDelete = async () => {
  if (!confirm('이 쿠폰을 삭제하시겠습니까?\n발급된 쿠폰은 사용할 수 없게 됩니다.')) return
  await new Promise((r) => setTimeout(r, 300))
  uiStore.showToast({ type: 'success', message: '쿠폰이 삭제되었습니다.' })
  router.push('/admin/promotions/coupons')
}

const handleCancel = () => router.back()

// 헬퍼
const formatCurrency = (value) => new Intl.NumberFormat('ko-KR').format(value) + '원'

onMounted(() => {
  if (isEditMode.value) {
    fetchCoupon()
  } else {
    // 새 쿠폰: 기본 날짜 설정
    form.value.startDate = new Date().toISOString().split('T')[0]
  }
})
</script>

<template>
  <LayoutFormPage
    :title="isEditMode ? '쿠폰 수정' : '쿠폰 등록'"
    :description="isEditMode ? '쿠폰 정보를 수정합니다.' : '새 쿠폰을 등록합니다.'"
    :is-saving="isSaving"
    show-cancel
    :show-delete="isEditMode"
    @save="handleSave"
    @cancel="handleCancel"
    @delete="handleDelete"
  >
    <!-- 페이지 가이드 툴팁 -->
    <UiPageTooltip :message="guideMessage" />

    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <UiSpinner size="lg" />
    </div>

    <div v-else class="space-y-6">
      <!-- 사용 통계 (수정 모드에서만) -->
      <div v-if="isEditMode" class="grid grid-cols-3 gap-4">
        <UiCard padding="md">
          <p class="text-sm text-neutral-500">발급 수</p>
          <p class="text-2xl font-bold text-neutral-900">{{ usageStats.issuedCount.toLocaleString() }}</p>
        </UiCard>
        <UiCard padding="md">
          <p class="text-sm text-neutral-500">사용 수</p>
          <p class="text-2xl font-bold text-primary-600">{{ usageStats.usedCount.toLocaleString() }}</p>
        </UiCard>
        <UiCard padding="md">
          <p class="text-sm text-neutral-500">총 할인금액</p>
          <p class="text-2xl font-bold text-neutral-900">{{ formatCurrency(usageStats.totalDiscountAmount) }}</p>
        </UiCard>
      </div>

      <!-- 발급 상태 -->
      <UiCard title="발급 상태">
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.status" type="radio" value="active" class="w-4 h-4 text-primary-600">
            <span class="text-sm text-neutral-700">발급중</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.status" type="radio" value="inactive" class="w-4 h-4 text-primary-600">
            <span class="text-sm text-neutral-700">발급중지</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.status" type="radio" value="scheduled" class="w-4 h-4 text-primary-600">
            <span class="text-sm text-neutral-700">예약</span>
          </label>
        </div>
      </UiCard>

      <!-- 기본 정보 -->
      <UiCard title="기본 정보">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              쿠폰명 <span class="text-error-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="예: 신규회원 환영 쿠폰"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              쿠폰 코드 <span class="text-error-500">*</span>
            </label>
            <div class="flex gap-2">
              <input
                v-model="form.code"
                type="text"
                placeholder="예: WELCOME2025"
                class="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
              <UiButton variant="outline" size="sm" @click="generateCode">
                자동생성
              </UiButton>
            </div>
            <p class="text-xs text-neutral-500 mt-1">고객이 입력하는 쿠폰 코드입니다. 영문/숫자만 사용 가능합니다.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">설명</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="쿠폰에 대한 설명을 입력하세요."
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </UiCard>

      <!-- 할인 설정 -->
      <UiCard title="할인 설정">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">할인 유형</label>
              <div class="flex gap-2">
                <label
                  :class="[
                    'flex-1 px-4 py-2 border rounded-lg cursor-pointer transition-colors text-center',
                    form.discountType === 'percent' ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-neutral-200 hover:border-neutral-300 text-neutral-600',
                  ]"
                >
                  <input v-model="form.discountType" type="radio" value="percent" class="sr-only">
                  %
                </label>
                <label
                  :class="[
                    'flex-1 px-4 py-2 border rounded-lg cursor-pointer transition-colors text-center',
                    form.discountType === 'amount' ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-neutral-200 hover:border-neutral-300 text-neutral-600',
                  ]"
                >
                  <input v-model="form.discountType" type="radio" value="amount" class="sr-only">
                  원
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">
                할인 {{ form.discountType === 'percent' ? '비율' : '금액' }} <span class="text-error-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model.number="form.discountValue"
                  type="number"
                  :min="0"
                  :max="form.discountType === 'percent' ? 100 : undefined"
                  class="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                  {{ form.discountType === 'percent' ? '%' : '원' }}
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">최소 주문금액</label>
              <div class="relative">
                <input
                  v-model.number="form.minOrderAmount"
                  type="number"
                  :min="0"
                  step="1000"
                  class="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">원</span>
              </div>
              <p class="text-xs text-neutral-500 mt-1">0원이면 제한 없음</p>
            </div>

            <div v-if="form.discountType === 'percent'">
              <label class="block text-sm font-medium text-neutral-700 mb-1">최대 할인금액</label>
              <div class="relative">
                <input
                  v-model.number="form.maxDiscountAmount"
                  type="number"
                  :min="0"
                  step="1000"
                  placeholder="제한 없음"
                  class="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">원</span>
              </div>
              <p class="text-xs text-neutral-500 mt-1">비워두면 제한 없음</p>
            </div>
          </div>
        </div>
      </UiCard>

      <!-- 유효기간 -->
      <UiCard title="유효기간">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              시작일 <span class="text-error-500">*</span>
            </label>
            <input
              v-model="form.startDate"
              type="date"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">종료일</label>
            <input
              v-model="form.endDate"
              type="date"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
            <p class="text-xs text-neutral-500 mt-1">비워두면 종료일 없음</p>
          </div>
        </div>
      </UiCard>

      <!-- 발급 수량 -->
      <UiCard title="발급 수량">
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1">총 발급 수량</label>
          <input
            v-model.number="form.totalQuantity"
            type="number"
            :min="0"
            placeholder="제한 없음"
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
          <p class="text-xs text-neutral-500 mt-1">비워두면 무제한 발급</p>
        </div>
      </UiCard>

      <!-- 대상 설정 -->
      <UiCard title="대상 설정">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-neutral-700 mb-2">발급 대상 등급</label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="grade in gradeOptions"
              :key="grade.value"
              :class="[
                'px-4 py-2 border rounded-lg cursor-pointer transition-colors text-sm',
                form.targetGrades.includes(grade.value) ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-neutral-200 hover:border-neutral-300 text-neutral-600',
              ]"
            >
              <input
                v-model="form.targetGrades"
                type="checkbox"
                :value="grade.value"
                class="sr-only"
              >
              {{ grade.label }}
            </label>
          </div>
        </div>
      </UiCard>

      <!-- 쿠폰 미리보기 -->
      <UiCard title="쿠폰 미리보기">
        <div class="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200">
          <div class="text-center">
            <p class="text-xs text-primary-600 mb-1">{{ form.name || '쿠폰명' }}</p>
            <p class="text-3xl font-bold text-primary-700">
              {{ form.discountValue || 0 }}{{ form.discountType === 'percent' ? '%' : '원' }}
            </p>
            <p v-if="form.minOrderAmount" class="text-xs text-primary-600 mt-1">
              {{ form.minOrderAmount.toLocaleString() }}원 이상 구매 시
            </p>
            <div class="mt-3 pt-3 border-t border-primary-200 border-dashed">
              <code class="text-sm font-mono text-primary-800">{{ form.code || 'CODE' }}</code>
            </div>
          </div>
        </div>
      </UiCard>
    </div>
  </LayoutFormPage>
</template>
