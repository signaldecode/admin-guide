<script setup>
/**
 * 쿠폰 관리 목록 페이지
 */

import { useUiStore } from '~/stores/ui'

const router = useRouter()
const uiStore = useUiStore()

// 페이지 가이드
const { message: guideMessage } = usePageGuide()

// 상태 옵션
const statusOptions = [
  { value: 'active', label: '발급중', color: 'success' },
  { value: 'scheduled', label: '예약', color: 'info' },
  { value: 'ended', label: '종료', color: 'neutral' },
  { value: 'inactive', label: '발급중지', color: 'warning' },
]

// 할인 타입 옵션
const discountTypeOptions = [
  { value: 'percent', label: '정률 (%)' },
  { value: 'amount', label: '정액 (원)' },
]

// 대상 등급 옵션
const gradeOptions = [
  { value: 'all', label: '전체' },
  { value: 'vip', label: 'VIP' },
  { value: 'gold', label: '골드' },
  { value: 'silver', label: '실버' },
  { value: 'normal', label: '일반' },
]

// Mock 데이터
const coupons = ref([
  {
    id: 1,
    name: '신규회원 환영 쿠폰',
    code: 'WELCOME2025',
    discountType: 'percent',
    discountValue: 15,
    minOrderAmount: 30000,
    maxDiscountAmount: 10000,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    totalQuantity: null,
    issuedCount: 1234,
    usedCount: 567,
    targetGrades: ['all'],
    status: 'active',
  },
  {
    id: 2,
    name: 'VIP 전용 할인',
    code: 'VIP30OFF',
    discountType: 'percent',
    discountValue: 30,
    minOrderAmount: 50000,
    maxDiscountAmount: 30000,
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    totalQuantity: 500,
    issuedCount: 156,
    usedCount: 89,
    targetGrades: ['vip'],
    status: 'active',
  },
  {
    id: 3,
    name: '5천원 할인쿠폰',
    code: 'SAVE5000',
    discountType: 'amount',
    discountValue: 5000,
    minOrderAmount: 30000,
    maxDiscountAmount: null,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    totalQuantity: 1000,
    issuedCount: 1000,
    usedCount: 782,
    targetGrades: ['all'],
    status: 'ended',
  },
  {
    id: 4,
    name: '설날 특별 쿠폰',
    code: 'LUNAR2025',
    discountType: 'percent',
    discountValue: 20,
    minOrderAmount: 50000,
    maxDiscountAmount: 20000,
    startDate: '2025-01-28',
    endDate: '2025-02-02',
    totalQuantity: 2000,
    issuedCount: 0,
    usedCount: 0,
    targetGrades: ['all'],
    status: 'scheduled',
  },
  {
    id: 5,
    name: '1만원 할인쿠폰',
    code: 'SAVE10000',
    discountType: 'amount',
    discountValue: 10000,
    minOrderAmount: 50000,
    maxDiscountAmount: null,
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    totalQuantity: 500,
    issuedCount: 245,
    usedCount: 123,
    targetGrades: ['gold', 'vip'],
    status: 'inactive',
  },
])

// 필터
const filterStatus = ref('')
const filterDiscountType = ref('')
const searchKeyword = ref('')

// 필터링된 목록
const filteredList = computed(() => {
  let result = [...coupons.value]
  if (filterStatus.value) {
    result = result.filter((c) => c.status === filterStatus.value)
  }
  if (filterDiscountType.value) {
    result = result.filter((c) => c.discountType === filterDiscountType.value)
  }
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter((c) =>
      c.name.toLowerCase().includes(keyword) ||
      c.code.toLowerCase().includes(keyword)
    )
  }
  return result.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
})

// 테이블 컬럼
const tableColumns = [
  { key: 'name', label: '쿠폰명' },
  { key: 'code', label: '쿠폰코드' },
  { key: 'discount', label: '할인' },
  { key: 'period', label: '유효기간' },
  { key: 'usage', label: '사용/발급', align: 'center' },
  { key: 'status', label: '상태', width: 'w-24' },
]

// 선택
const selectedIds = ref([])
const handleSelectAll = (selectAll) => {
  selectedIds.value = selectAll ? paginatedList.value.map((c) => c.id) : []
}
const handleSelect = (id) => {
  const idx = selectedIds.value.indexOf(id)
  idx > -1 ? selectedIds.value.splice(idx, 1) : selectedIds.value.push(id)
}

// 벌크 삭제
const bulkDelete = () => {
  if (!selectedIds.value.length || !confirm(`선택한 ${selectedIds.value.length}개를 삭제하시겠습니까?`)) return
  coupons.value = coupons.value.filter((c) => !selectedIds.value.includes(c.id))
  selectedIds.value = []
  uiStore.showToast({ type: 'success', message: '삭제되었습니다.' })
}

// 벌크 상태 변경
const bulkStatusChange = (newStatus) => {
  if (!selectedIds.value.length) return
  coupons.value = coupons.value.map((c) =>
    selectedIds.value.includes(c.id) ? { ...c, status: newStatus } : c
  )
  selectedIds.value = []
  const statusLabel = statusOptions.find((s) => s.value === newStatus)?.label || newStatus
  uiStore.showToast({ type: 'success', message: `상태가 "${statusLabel}"(으)로 변경되었습니다.` })
}

// 헬퍼 함수
const getStatusBadge = (status) => statusOptions.find((s) => s.value === status) || statusOptions[3]

const formatDiscount = (type, value) => {
  return type === 'percent' ? `${value}%` : `${value.toLocaleString()}원`
}

const formatPeriod = (start, end) => {
  const startStr = start ? new Date(start).toLocaleDateString('ko-KR') : ''
  const endStr = end ? new Date(end).toLocaleDateString('ko-KR') : '종료일 없음'
  return `${startStr} ~ ${endStr}`
}

const formatUsage = (used, issued, total) => {
  const totalStr = total ? `/${total}` : ''
  return `${used} / ${issued}${totalStr}`
}

const getUsagePercent = (used, issued) => {
  if (!issued) return 0
  return Math.round((used / issued) * 100)
}

// 페이지 이동
const goToCreate = () => router.push('/admin/promotions/coupons/new')
const goToDetail = (coupon) => router.push(`/admin/promotions/coupons/${coupon.id}`)

// 검색
const handleSearch = () => { currentPage.value = 1 }
const handleReset = () => {
  filterStatus.value = ''
  filterDiscountType.value = ''
  searchKeyword.value = ''
  currentPage.value = 1
}

// 페이지네이션
const currentPage = ref(1)
const perPage = 30
const totalPages = computed(() => Math.ceil(filteredList.value.length / perPage))
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredList.value.slice(start, start + perPage)
})
</script>

<template>
  <LayoutListPage title="쿠폰 관리" description="쿠폰을 등록하고 발급 상태를 관리합니다.">
    <!-- 페이지 가이드 툴팁 -->
    <UiPageTooltip :message="guideMessage" />

    <template #actions>
      <UiButton variant="primary" @click="goToCreate">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        쿠폰 등록
      </UiButton>
    </template>

    <template #filters>
      <DomainFilterCard @search="handleSearch" @reset="handleReset">
        <template #selects>
          <select
            v-model="filterStatus"
            class="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">상태 전체</option>
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <select
            v-model="filterDiscountType"
            class="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">할인타입 전체</option>
            <option v-for="opt in discountTypeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </template>
        <template #search>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="쿠폰명 또는 코드 검색"
            class="flex-1 min-w-0 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            @keyup.enter="handleSearch"
          >
        </template>
      </DomainFilterCard>
    </template>

    <template #bulk>
      <DomainBulkActionBar :count="selectedIds.length" :show="selectedIds.length > 0">
        <UiButton variant="outline" size="sm" @click="bulkStatusChange('active')">발급 시작</UiButton>
        <UiButton variant="outline" size="sm" @click="bulkStatusChange('inactive')">발급 중지</UiButton>
        <UiButton variant="danger" size="sm" @click="bulkDelete">삭제</UiButton>
      </DomainBulkActionBar>
    </template>

    <DomainDataTable
      :columns="tableColumns"
      :items="paginatedList"
      :selected-ids="selectedIds"
      selectable
      empty-title="등록된 쿠폰이 없습니다"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @row-click="goToDetail"
    >
      <template #cell-name="{ item }">
        <span class="text-sm font-medium text-neutral-900">{{ item.name }}</span>
      </template>

      <template #cell-code="{ item }">
        <code class="px-2 py-1 bg-neutral-100 rounded text-xs font-mono text-neutral-700">
          {{ item.code }}
        </code>
      </template>

      <template #cell-discount="{ item }">
        <div class="text-sm">
          <span class="font-semibold text-primary-600">{{ formatDiscount(item.discountType, item.discountValue) }}</span>
          <span v-if="item.minOrderAmount" class="text-neutral-400 ml-1">
            ({{ item.minOrderAmount.toLocaleString() }}원 이상)
          </span>
        </div>
      </template>

      <template #cell-period="{ item }">
        <span class="text-sm text-neutral-500">{{ formatPeriod(item.startDate, item.endDate) }}</span>
      </template>

      <template #cell-usage="{ item }">
        <div class="text-center">
          <p class="text-sm text-neutral-700">
            {{ formatUsage(item.usedCount, item.issuedCount, item.totalQuantity) }}
          </p>
          <div v-if="item.issuedCount > 0" class="w-16 h-1.5 bg-neutral-200 rounded-full mx-auto mt-1">
            <div
              class="h-full bg-primary-500 rounded-full"
              :style="{ width: `${getUsagePercent(item.usedCount, item.issuedCount)}%` }"
            />
          </div>
        </div>
      </template>

      <template #cell-status="{ item }">
        <UiBadge :variant="getStatusBadge(item.status).color" size="sm">
          {{ getStatusBadge(item.status).label }}
        </UiBadge>
      </template>

      <template #mobile-card="{ item }">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-neutral-900">{{ item.name }}</span>
          <UiBadge :variant="getStatusBadge(item.status).color" size="sm">
            {{ getStatusBadge(item.status).label }}
          </UiBadge>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <code class="px-2 py-0.5 bg-neutral-100 rounded text-xs font-mono text-neutral-600">
            {{ item.code }}
          </code>
          <span class="text-sm font-semibold text-primary-600">
            {{ formatDiscount(item.discountType, item.discountValue) }}
          </span>
        </div>
        <div class="flex items-center justify-between text-xs text-neutral-500">
          <span>{{ formatPeriod(item.startDate, item.endDate) }}</span>
          <span>사용 {{ item.usedCount }} / 발급 {{ item.issuedCount }}</span>
        </div>
      </template>
    </DomainDataTable>

    <template #pagination>
      <UiPagination
        v-model:currentPage="currentPage"
        :total-pages="totalPages"
        :total-items="filteredList.length"
        :per-page="perPage"
      />
    </template>
  </LayoutListPage>
</template>
