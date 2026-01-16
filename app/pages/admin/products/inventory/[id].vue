<script setup>
/**
 * 재고 상세/수정 페이지
 * - 물류창고, 재고위치, 수량 관리
 * - 입출고 이력
 */

import { useUiStore } from '~/stores/ui'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()

// 페이지 가이드
const { message: guideMessage } = usePageGuide()

// 창고 옵션
const warehouseOptions = [
  { value: 'main', label: '본사 창고' },
  { value: 'sub1', label: '제2 물류센터' },
  { value: 'sub2', label: '제3 물류센터' },
]

// 폼 데이터
const form = ref({
  sku: '',
  productId: '',
  productName: '',
  option: '',
  warehouse: 'main',
  location: '',
  quantity: 0,
  safetyStock: 10,
  memo: '',
})

// 입출고 이력
const stockHistory = ref([])

const isLoading = ref(false)
const isSaving = ref(false)

// 데이터 로드
const fetchInventory = async () => {
  isLoading.value = true
  await new Promise((r) => setTimeout(r, 300))

  // Mock 데이터
  form.value = {
    sku: 'PRD-001-BLK-M',
    productId: 'PRD-001',
    productName: '프리미엄 캐시미어 코트',
    option: '블랙 / M',
    warehouse: 'main',
    location: 'A-01-02',
    quantity: 45,
    safetyStock: 10,
    memo: '시즌 인기 상품. 재고 주의 필요.',
  }

  stockHistory.value = [
    { id: 1, type: 'in', amount: 50, beforeQty: 20, afterQty: 70, reason: '정기 입고', date: '2025-01-15 10:30', admin: '김관리' },
    { id: 2, type: 'out', amount: 15, beforeQty: 70, afterQty: 55, reason: '주문 출고 #ORD-1234', date: '2025-01-14 15:20', admin: '시스템' },
    { id: 3, type: 'out', amount: 10, beforeQty: 55, afterQty: 45, reason: '주문 출고 #ORD-1235', date: '2025-01-13 09:15', admin: '시스템' },
    { id: 4, type: 'in', amount: 30, beforeQty: 25, afterQty: 55, reason: '긴급 입고', date: '2025-01-10 14:00', admin: '박관리' },
    { id: 5, type: 'adjust', amount: -5, beforeQty: 30, afterQty: 25, reason: '재고 실사 조정', date: '2025-01-08 11:30', admin: '이관리' },
  ]

  isLoading.value = false
}

// 재고 상태 계산
const stockStatus = computed(() => {
  if (form.value.quantity === 0) return { label: '품절', color: 'error' }
  if (form.value.quantity <= form.value.safetyStock) return { label: '부족', color: 'warning' }
  return { label: '정상', color: 'success' }
})

// 입고 처리
const adjustAmount = ref(0)
const adjustReason = ref('')

const handleStockIn = () => {
  if (!adjustAmount.value || adjustAmount.value <= 0) {
    uiStore.showToast({ type: 'error', message: '입고 수량을 입력해주세요.' })
    return
  }

  const beforeQty = form.value.quantity
  form.value.quantity += adjustAmount.value

  stockHistory.value.unshift({
    id: Date.now(),
    type: 'in',
    amount: adjustAmount.value,
    beforeQty,
    afterQty: form.value.quantity,
    reason: adjustReason.value || '수동 입고',
    date: new Date().toLocaleString('ko-KR'),
    admin: '관리자',
  })

  uiStore.showToast({ type: 'success', message: `${adjustAmount.value}개 입고 처리되었습니다.` })
  adjustAmount.value = 0
  adjustReason.value = ''
}

const handleStockOut = () => {
  if (!adjustAmount.value || adjustAmount.value <= 0) {
    uiStore.showToast({ type: 'error', message: '출고 수량을 입력해주세요.' })
    return
  }
  if (adjustAmount.value > form.value.quantity) {
    uiStore.showToast({ type: 'error', message: '현재 재고보다 많이 출고할 수 없습니다.' })
    return
  }

  const beforeQty = form.value.quantity
  form.value.quantity -= adjustAmount.value

  stockHistory.value.unshift({
    id: Date.now(),
    type: 'out',
    amount: adjustAmount.value,
    beforeQty,
    afterQty: form.value.quantity,
    reason: adjustReason.value || '수동 출고',
    date: new Date().toLocaleString('ko-KR'),
    admin: '관리자',
  })

  uiStore.showToast({ type: 'success', message: `${adjustAmount.value}개 출고 처리되었습니다.` })
  adjustAmount.value = 0
  adjustReason.value = ''
}

// 저장
const handleSave = async () => {
  if (!form.value.location.trim()) {
    uiStore.showToast({ type: 'error', message: '재고 위치를 입력해주세요.' })
    return
  }

  isSaving.value = true
  await new Promise((r) => setTimeout(r, 500))

  uiStore.showToast({ type: 'success', message: '재고 정보가 저장되었습니다.' })
  isSaving.value = false
}

const handleCancel = () => router.back()

// 헬퍼
const getWarehouseLabel = (value) => warehouseOptions.find((w) => w.value === value)?.label || value

const getHistoryTypeBadge = (type) => {
  if (type === 'in') return { label: '입고', color: 'success' }
  if (type === 'out') return { label: '출고', color: 'error' }
  return { label: '조정', color: 'warning' }
}

onMounted(() => {
  fetchInventory()
})
</script>

<template>
  <LayoutFormPage
    title="재고 상세"
    description="SKU별 재고 정보를 확인하고 관리합니다."
    :is-saving="isSaving"
    show-cancel
    @save="handleSave"
    @cancel="handleCancel"
  >
    <!-- 페이지 가이드 툴팁 -->
    <UiPageTooltip :message="guideMessage" />

    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <UiSpinner size="lg" />
    </div>

    <div v-else class="space-y-6">
      <!-- 상품 정보 (읽기 전용) -->
      <UiCard title="상품 정보">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-xs text-neutral-500 mb-1">SKU</p>
            <code class="px-2 py-1 bg-neutral-100 rounded text-sm font-mono">{{ form.sku }}</code>
          </div>
          <div>
            <p class="text-xs text-neutral-500 mb-1">상품번호</p>
            <p class="text-sm text-neutral-900">{{ form.productId }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-neutral-500 mb-1">상품명</p>
            <p class="text-sm font-medium text-neutral-900">{{ form.productName }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-neutral-500 mb-1">옵션</p>
            <p class="text-sm text-neutral-700">{{ form.option }}</p>
          </div>
        </div>
      </UiCard>

      <!-- 재고 현황 -->
      <UiCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-neutral-900">재고 현황</h2>
            <UiBadge :variant="stockStatus.color">{{ stockStatus.label }}</UiBadge>
          </div>
        </template>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-neutral-50 rounded-lg text-center">
            <p class="text-xs text-neutral-500 mb-1">현재 재고</p>
            <p
              :class="[
                'text-3xl font-bold',
                stockStatus.color === 'error' ? 'text-error-600' :
                stockStatus.color === 'warning' ? 'text-warning-600' : 'text-neutral-900',
              ]"
            >
              {{ form.quantity }}
            </p>
          </div>
          <div class="p-4 bg-neutral-50 rounded-lg text-center">
            <p class="text-xs text-neutral-500 mb-1">안전 재고</p>
            <p class="text-3xl font-bold text-neutral-700">{{ form.safetyStock }}</p>
          </div>
        </div>

        <!-- 입출고 폼 -->
        <div class="p-4 bg-primary-50 rounded-lg border border-primary-200">
          <h3 class="text-sm font-medium text-primary-900 mb-3">입출고 처리</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs text-primary-700 mb-1">수량</label>
              <input
                v-model.number="adjustAmount"
                type="number"
                :min="1"
                placeholder="수량 입력"
                class="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
            </div>
            <div>
              <label class="block text-xs text-primary-700 mb-1">사유</label>
              <input
                v-model="adjustReason"
                type="text"
                placeholder="입출고 사유"
                class="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
            </div>
            <div class="flex items-end gap-2">
              <UiButton variant="primary" size="sm" class="flex-1" @click="handleStockIn">
                입고
              </UiButton>
              <UiButton variant="outline" size="sm" class="flex-1" @click="handleStockOut">
                출고
              </UiButton>
            </div>
          </div>
        </div>
      </UiCard>

      <!-- 창고 & 위치 정보 -->
      <UiCard title="창고 & 위치 정보">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">물류 창고</label>
            <select
              v-model="form.warehouse"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option v-for="opt in warehouseOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">
              재고 위치 <span class="text-error-500">*</span>
            </label>
            <input
              v-model="form.location"
              type="text"
              placeholder="예: A-01-02"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
            <p class="text-xs text-neutral-500 mt-1">창고 내 위치 코드 (예: 구역-열-선반)</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">안전 재고</label>
            <input
              v-model.number="form.safetyStock"
              type="number"
              :min="0"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
            <p class="text-xs text-neutral-500 mt-1">이 수량 이하일 때 부족 알림</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">메모</label>
            <textarea
              v-model="form.memo"
              rows="2"
              placeholder="재고 관련 메모"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </UiCard>

      <!-- 입출고 이력 -->
      <UiCard title="입출고 이력">
        <div class="overflow-x-auto -mx-4 md:-mx-6">
          <table class="w-full">
            <thead>
              <tr class="border-b border-neutral-200">
                <th class="text-left py-2 px-4 md:px-6 text-sm font-medium text-neutral-500">구분</th>
                <th class="text-right py-2 px-4 text-sm font-medium text-neutral-500">수량</th>
                <th class="text-right py-2 px-4 text-sm font-medium text-neutral-500">이전</th>
                <th class="text-right py-2 px-4 text-sm font-medium text-neutral-500">이후</th>
                <th class="text-left py-2 px-4 text-sm font-medium text-neutral-500">사유</th>
                <th class="text-left py-2 px-4 text-sm font-medium text-neutral-500">처리자</th>
                <th class="text-left py-2 px-4 md:px-6 text-sm font-medium text-neutral-500">일시</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="history in stockHistory"
                :key="history.id"
                class="border-b border-neutral-100"
              >
                <td class="py-3 px-4 md:px-6">
                  <UiBadge :variant="getHistoryTypeBadge(history.type).color" size="sm">
                    {{ getHistoryTypeBadge(history.type).label }}
                  </UiBadge>
                </td>
                <td
                  :class="[
                    'py-3 px-4 text-sm font-semibold text-right',
                    history.type === 'in' ? 'text-success-600' :
                    history.type === 'out' ? 'text-error-600' : 'text-warning-600',
                  ]"
                >
                  {{ history.type === 'in' ? '+' : history.type === 'out' ? '-' : '' }}{{ history.amount }}
                </td>
                <td class="py-3 px-4 text-sm text-neutral-500 text-right">{{ history.beforeQty }}</td>
                <td class="py-3 px-4 text-sm text-neutral-900 font-medium text-right">{{ history.afterQty }}</td>
                <td class="py-3 px-4 text-sm text-neutral-600">{{ history.reason }}</td>
                <td class="py-3 px-4 text-sm text-neutral-500">{{ history.admin }}</td>
                <td class="py-3 px-4 md:px-6 text-sm text-neutral-400">{{ history.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="stockHistory.length === 0" class="py-8 text-center text-neutral-500">
          입출고 이력이 없습니다.
        </div>
      </UiCard>
    </div>
  </LayoutFormPage>
</template>
