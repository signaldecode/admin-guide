<script setup>
/**
 * 재고 관리 목록 페이지
 * - SKU(상품+옵션) 별 재고 조회
 * - 상품명, 상품번호 검색
 */

import { useUiStore } from '~/stores/ui'

const router = useRouter()
const uiStore = useUiStore()

// 페이지 가이드
const { message: guideMessage } = usePageGuide()

// 재고 상태 옵션
const stockStatusOptions = [
  { value: 'normal', label: '정상', color: 'success' },
  { value: 'low', label: '부족', color: 'warning' },
  { value: 'out', label: '품절', color: 'error' },
]

// 창고 옵션
const warehouseOptions = [
  { value: 'main', label: '본사 창고' },
  { value: 'sub1', label: '제2 물류센터' },
  { value: 'sub2', label: '제3 물류센터' },
]

// Mock 데이터
const inventoryItems = ref([
  {
    id: 1,
    sku: 'PRD-001-BLK-M',
    productId: 'PRD-001',
    productName: '프리미엄 캐시미어 코트',
    option: '블랙 / M',
    warehouse: 'main',
    location: 'A-01-02',
    quantity: 45,
    safetyStock: 10,
    status: 'normal',
  },
  {
    id: 2,
    sku: 'PRD-001-BLK-L',
    productId: 'PRD-001',
    productName: '프리미엄 캐시미어 코트',
    option: '블랙 / L',
    warehouse: 'main',
    location: 'A-01-03',
    quantity: 8,
    safetyStock: 10,
    status: 'low',
  },
  {
    id: 3,
    sku: 'PRD-001-NVY-M',
    productId: 'PRD-001',
    productName: '프리미엄 캐시미어 코트',
    option: '네이비 / M',
    warehouse: 'main',
    location: 'A-01-04',
    quantity: 0,
    safetyStock: 10,
    status: 'out',
  },
  {
    id: 4,
    sku: 'PRD-002-WHT-260',
    productId: 'PRD-002',
    productName: '스니커즈 화이트',
    option: '화이트 / 260',
    warehouse: 'sub1',
    location: 'B-03-01',
    quantity: 120,
    safetyStock: 20,
    status: 'normal',
  },
  {
    id: 5,
    sku: 'PRD-002-WHT-270',
    productId: 'PRD-002',
    productName: '스니커즈 화이트',
    option: '화이트 / 270',
    warehouse: 'sub1',
    location: 'B-03-02',
    quantity: 15,
    safetyStock: 20,
    status: 'low',
  },
  {
    id: 6,
    sku: 'PRD-003-BEG-F',
    productId: 'PRD-003',
    productName: '클래식 레더 토트백',
    option: '베이지 / FREE',
    warehouse: 'main',
    location: 'C-02-05',
    quantity: 67,
    safetyStock: 15,
    status: 'normal',
  },
  {
    id: 7,
    sku: 'PRD-004-IVR-S',
    productId: 'PRD-004',
    productName: '울 블렌드 니트 스웨터',
    option: '아이보리 / S',
    warehouse: 'sub2',
    location: 'D-01-08',
    quantity: 0,
    safetyStock: 10,
    status: 'out',
  },
  {
    id: 8,
    sku: 'PRD-005-PNK-F',
    productId: 'PRD-005',
    productName: '실크 블라우스',
    option: '핑크 / FREE',
    warehouse: 'main',
    location: 'A-05-02',
    quantity: 34,
    safetyStock: 10,
    status: 'normal',
  },
])

// 필터
const filterStatus = ref('')
const filterWarehouse = ref('')
const searchType = ref('all')
const searchKeyword = ref('')

// 검색 타입 옵션
const searchTypeOptions = [
  { value: 'all', label: '전체' },
  { value: 'sku', label: 'SKU' },
  { value: 'productName', label: '상품명' },
  { value: 'productId', label: '상품번호' },
]

// 필터링된 목록
const filteredList = computed(() => {
  let result = [...inventoryItems.value]

  if (filterStatus.value) {
    result = result.filter((item) => item.status === filterStatus.value)
  }

  if (filterWarehouse.value) {
    result = result.filter((item) => item.warehouse === filterWarehouse.value)
  }

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter((item) => {
      if (searchType.value === 'sku') {
        return item.sku.toLowerCase().includes(keyword)
      } else if (searchType.value === 'productName') {
        return item.productName.toLowerCase().includes(keyword)
      } else if (searchType.value === 'productId') {
        return item.productId.toLowerCase().includes(keyword)
      } else {
        return (
          item.sku.toLowerCase().includes(keyword) ||
          item.productName.toLowerCase().includes(keyword) ||
          item.productId.toLowerCase().includes(keyword)
        )
      }
    })
  }

  return result
})

// 테이블 컬럼
const tableColumns = [
  { key: 'sku', label: 'SKU' },
  { key: 'product', label: '상품정보' },
  { key: 'warehouse', label: '창고' },
  { key: 'location', label: '위치' },
  { key: 'quantity', label: '재고', align: 'right' },
  { key: 'status', label: '상태', width: 'w-20' },
]

// 선택
const selectedIds = ref([])
const handleSelectAll = (selectAll) => {
  selectedIds.value = selectAll ? paginatedList.value.map((item) => item.id) : []
}
const handleSelect = (id) => {
  const idx = selectedIds.value.indexOf(id)
  idx > -1 ? selectedIds.value.splice(idx, 1) : selectedIds.value.push(id)
}

// 벌크 재고 조정
const bulkAdjustStock = (type) => {
  if (!selectedIds.value.length) return
  const action = type === 'add' ? '입고' : '출고'
  const amount = prompt(`선택한 ${selectedIds.value.length}개 항목의 ${action} 수량을 입력하세요.`)
  if (!amount || isNaN(Number(amount))) return

  inventoryItems.value = inventoryItems.value.map((item) => {
    if (selectedIds.value.includes(item.id)) {
      const newQty = type === 'add'
        ? item.quantity + Number(amount)
        : Math.max(0, item.quantity - Number(amount))
      return {
        ...item,
        quantity: newQty,
        status: newQty === 0 ? 'out' : newQty <= item.safetyStock ? 'low' : 'normal',
      }
    }
    return item
  })
  selectedIds.value = []
  uiStore.showToast({ type: 'success', message: `${action} 처리가 완료되었습니다.` })
}

// 헬퍼 함수
const getStatusBadge = (status) => stockStatusOptions.find((s) => s.value === status) || stockStatusOptions[0]
const getWarehouseLabel = (value) => warehouseOptions.find((w) => w.value === value)?.label || value

// 페이지 이동
const goToDetail = (item) => router.push(`/admin/products/inventory/${item.id}`)

// 검색
const handleSearch = () => { currentPage.value = 1 }
const handleReset = () => {
  filterStatus.value = ''
  filterWarehouse.value = ''
  searchType.value = 'all'
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

// 재고 현황 요약
const stockSummary = computed(() => {
  const total = inventoryItems.value.length
  const normal = inventoryItems.value.filter((i) => i.status === 'normal').length
  const low = inventoryItems.value.filter((i) => i.status === 'low').length
  const out = inventoryItems.value.filter((i) => i.status === 'out').length
  return { total, normal, low, out }
})
</script>

<template>
  <LayoutListPage title="재고 관리" description="SKU별 재고 현황을 조회하고 관리합니다.">
    <!-- 페이지 가이드 툴팁 -->
    <UiPageTooltip :message="guideMessage" />

    <!-- 재고 현황 요약 -->
    <div class="flex items-center gap-6 mb-6 p-4 bg-neutral-50 rounded-lg overflow-x-auto">
      <div class="flex items-center gap-2 whitespace-nowrap">
        <span class="text-sm text-neutral-500">전체</span>
        <span class="text-lg font-bold text-neutral-900">{{ stockSummary.total }}</span>
      </div>
      <div class="w-px h-6 bg-neutral-300" />
      <div class="flex items-center gap-2 whitespace-nowrap">
        <span class="w-2 h-2 rounded-full bg-success-500" />
        <span class="text-sm text-neutral-600">정상</span>
        <span class="text-lg font-bold text-success-600">{{ stockSummary.normal }}</span>
      </div>
      <div class="w-px h-6 bg-neutral-300" />
      <div class="flex items-center gap-2 whitespace-nowrap">
        <span class="w-2 h-2 rounded-full bg-warning-500" />
        <span class="text-sm text-neutral-600">부족</span>
        <span class="text-lg font-bold text-warning-600">{{ stockSummary.low }}</span>
      </div>
      <div class="w-px h-6 bg-neutral-300" />
      <div class="flex items-center gap-2 whitespace-nowrap">
        <span class="w-2 h-2 rounded-full bg-error-500" />
        <span class="text-sm text-neutral-600">품절</span>
        <span class="text-lg font-bold text-error-600">{{ stockSummary.out }}</span>
      </div>
    </div>

    <template #filters>
      <DomainFilterCard @search="handleSearch" @reset="handleReset">
        <template #selects>
          <select
            v-model="filterStatus"
            class="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">상태 전체</option>
            <option v-for="opt in stockStatusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <select
            v-model="filterWarehouse"
            class="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">창고 전체</option>
            <option v-for="opt in warehouseOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <select
            v-model="searchType"
            class="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option v-for="opt in searchTypeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </template>
        <template #search>
          <input
            v-model="searchKeyword"
            type="text"
            :placeholder="searchType === 'sku' ? 'SKU 검색' : searchType === 'productName' ? '상품명 검색' : searchType === 'productId' ? '상품번호 검색' : 'SKU, 상품명, 상품번호 검색'"
            class="flex-1 min-w-0 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            @keyup.enter="handleSearch"
          >
        </template>
      </DomainFilterCard>
    </template>

    <template #bulk>
      <DomainBulkActionBar :count="selectedIds.length" :show="selectedIds.length > 0">
        <UiButton variant="outline" size="sm" @click="bulkAdjustStock('add')">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          입고
        </UiButton>
        <UiButton variant="outline" size="sm" @click="bulkAdjustStock('subtract')">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
          출고
        </UiButton>
      </DomainBulkActionBar>
    </template>

    <DomainDataTable
      :columns="tableColumns"
      :items="paginatedList"
      :selected-ids="selectedIds"
      selectable
      empty-title="재고 데이터가 없습니다"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @row-click="goToDetail"
    >
      <template #cell-sku="{ item }">
        <code class="px-2 py-1 bg-neutral-100 rounded text-xs font-mono text-neutral-700">
          {{ item.sku }}
        </code>
      </template>

      <template #cell-product="{ item }">
        <div>
          <p class="text-sm font-medium text-neutral-900">{{ item.productName }}</p>
          <p class="text-xs text-neutral-500">{{ item.productId }} · {{ item.option }}</p>
        </div>
      </template>

      <template #cell-warehouse="{ item }">
        <span class="text-sm text-neutral-600">{{ getWarehouseLabel(item.warehouse) }}</span>
      </template>

      <template #cell-location="{ item }">
        <span class="text-sm font-mono text-neutral-600">{{ item.location }}</span>
      </template>

      <template #cell-quantity="{ item }">
        <div class="text-right">
          <span
            :class="[
              'text-sm font-semibold',
              item.status === 'out' ? 'text-error-600' :
              item.status === 'low' ? 'text-warning-600' : 'text-neutral-900',
            ]"
          >
            {{ item.quantity }}
          </span>
          <span class="text-xs text-neutral-400 ml-1">/ {{ item.safetyStock }}</span>
        </div>
      </template>

      <template #cell-status="{ item }">
        <UiBadge :variant="getStatusBadge(item.status).color" size="sm">
          {{ getStatusBadge(item.status).label }}
        </UiBadge>
      </template>

      <template #mobile-card="{ item }">
        <div class="flex items-center justify-between mb-2">
          <code class="px-2 py-0.5 bg-neutral-100 rounded text-xs font-mono">{{ item.sku }}</code>
          <UiBadge :variant="getStatusBadge(item.status).color" size="sm">
            {{ getStatusBadge(item.status).label }}
          </UiBadge>
        </div>
        <p class="text-sm font-medium text-neutral-900 mb-1">{{ item.productName }}</p>
        <p class="text-xs text-neutral-500 mb-2">{{ item.option }}</p>
        <div class="flex items-center justify-between text-xs">
          <span class="text-neutral-500">{{ getWarehouseLabel(item.warehouse) }} · {{ item.location }}</span>
          <span class="font-semibold">재고 {{ item.quantity }}</span>
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
