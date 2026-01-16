/**
 * 페이지별 가이드 메시지 데이터
 * key: 라우트 경로 (동적 라우트는 :id 형태로 표시)
 */
export const pageGuideMessages = {
  // 대시보드
  '/admin': {
    message: '대시보드\n현재 주문현황과 매출 현황, 교환/반품/취소 관련하여 한눈에 볼 수 있어요!',
  },

  // 주문 관리
  '/admin/orders': {
    message: '주문 목록\n전체 주문 목록을 확인하고, 주문 상태를 일괄 변경할 수 있어요!',
  },
  '/admin/orders/:id': {
    message: '주문 상세\n주문 상세 정보를 확인하고, 주문 회원 정보 상세보기를 통해 회원 상세 페이지로 이동하고, 배송 상태 변경 버튼으로 상태 변경과 송장번호를 등록할 수 있어요.',
  },
  '/admin/orders/claims': {
    message: '교환/반품/취소\n요청을 한눈에 확인하고 처리할 수 있어요!',
  },

  // 상품 관리
  '/admin/products': {
    message: '상품 목록\n필터 검색으로 상품을 조회하고, 벌크 선택으로 상태 변경 및 상품 정보를 수정하거나 새 상품을 등록할 수 있어요.',
  },
  '/admin/products/:id': {
    message: '상품 상세\n상품의 기본 정보와 금액, 옵션, 상세 정보를 확인하고 수정할 수 있어요! 상품 이미지 등록 및 관리도 가능해요.',
  },
  '/admin/products/categories': {
    message: '상품 카테고리\n카테고리를 추가, 수정, 삭제하고 드래그앤드랍으로 순서를 변경하고, 카테고리 계층 구조도 관리할 수 있어요.',
  },

  // 상품 관리 - 재고
  '/admin/products/inventory': {
    message: '재고 관리\nSKU별 재고 현황을 조회하고 관리할 수 있어요!\nSKU, 상품명, 상품번호로 검색하고, 벌크 선택으로 입고/출고 처리가 가능해요.',
  },
  '/admin/products/inventory/:id': {
    message: '재고 상세\nSKU별 재고 정보를 확인하고 관리해요.\n물류 창고, 재고 위치, 안전 재고를 설정하고 입출고 이력도 확인할 수 있어요!',
  },

  // 회원 관리
  '/admin/users': {
    message: '회원 목록\n필터 검색으로 회원을 조회하고, 등급 변경 및 벌크 선택으로 회원 정보를 관리할 수 있어요!',
  },
  '/admin/users/:id': {
    message: '회원 상세\n회원의 상세 정보와 주문 내역, 주문 통계, 적립금 현황을 확인하고, CS 응대 시 메모를 등록하여 기록할 수 있어요.',
  },
  '/admin/users/grades': {
    message: '회원 등급\n등급과 조건을 설정하고, 등급별 다양한 혜택을 관리할 수 있어요!',
  },

  // 콘텐츠 관리 - 공지사항
  '/admin/contents/notices': {
    message: '공지사항 목록\n공지사항을 등록하고 관리해요. 필터 검색으로 공지사항을 조회하고, 벌크 선택으로 삭제할 수 있고, 상세 내용을 확인하고 수정할 수 있어요.',
  },
  '/admin/contents/notices/:id': {
    message: '공지사항 상세\n공지사항 내용을 확인하고 수정할 수 있어요. 상단 고정 여부도 변경할 수 있어요!',
  },

  // 콘텐츠 관리 - FAQ
  '/admin/contents/faq': {
    message: 'FAQ 목록\n자주 묻는 질문(FAQ)을 등록하고 관리해요. 필터 검색으로 FAQ를 조회하고, 벌크 선택으로 삭제할 수 있고, 상세 내용을 확인하고 수정할 수 있어요!\n순서는 노출 순서를 의미해요. \n예를 들어 1번이 가장 먼저 노출되고, 2번이 그 다음으로 노출되는 식이에요.',
  },
  '/admin/contents/faq/:id': {
    message: 'FAQ 상세\nFAQ 내용을 확인하고 수정할 수 있어요. 분류와 순서도 변경할 수 있어요!',
  },

  // 콘텐츠 관리 - Q&A
  '/admin/contents/qna': {
    message: 'Q&A 목록\n고객 문의 목록을 확인하고 답변할 수 있어요. 필터 검색으로 Q&A를 조회하고, 벌크 선택으로 삭제할 수 있고, 상세 내용을 확인하고 수정할 수 있어요.\n답변 상태를 목록에서 한눈에 확인하여 빠르게 처리 할 수 있어요. ',
  },
  '/admin/contents/qna/:id': {
    message: 'Q&A 상세\n고객 문의 내용을 확인하고 답변을 등록할 수 있어요!',
  },

  // 콘텐츠 관리 - 배너
  '/admin/contents/banners': {
    message: '배너 목록\n메인 배너를 등록하고 노출 순서를 관리할 수 있어요. 상세 내용을 확인하고 수정할 수 있어요.\n벌크선택으로 상태 변경 및 삭제도 가능해요!',
  },
  '/admin/contents/banners/:id': {
    message: '배너 상세\n배너 정보를 확인하고 수정할 수 있어요. 노출 여부와 노출 기간, 배너 이미지와 배너의 위치 등록, 연결 링크 등을 관리할 수 있어요.',
  },

  // 콘텐츠 관리 - 팝업
  '/admin/contents/popups': {
    message: '팝업 목록\n팝업을 등록하고 노출 기간을 관리할 수 있어요. 상세 내용을 확인하고 수정할 수 있어요.\n벌크선택으로 상태 변경 및 삭제도 가능해요!',
  },
  '/admin/contents/popups/:id': {
    message: '팝업 상세\n팝업 정보를 확인하고 수정할 수 있어요. 노출 여부와 노출 기간, 팝업 이미지와 팝업의 모양과 위치를 등록하고, 연결 링크와 닫기 옵션도 선택할 수 있어요!',
  },

  // 프로모션 - 할인
  '/admin/promotions/discounts': {
    message: '할인 프로모션\n할인 프로모션을 등록하고 관리할 수 있어요. 필터 검색으로 할인 프로모션을 조회하고, 벌크 선택으로 상태 변경 및 삭제할 수 있고, 상세 내용을 확인하고 수정할 수 있어요.\n상품 할인은 상품 상세페이지에서, 전체 할인과 카테고리별 할인은 여기서 등록하세요. 여기 등록된 할인이 우선 적용됩니다.',
  },
  '/admin/promotions/discounts/:id': {
    message: '할인 프로모션 상세\n할인 프로모션 정보를 확인하고 수정할 수 있어요. 할인 종류와 할인 금액/비율, 할인 기간, 할인 대상 카테고리, 할인 상태 등을 관리할 수 있어요!',
  },

  // 프로모션 - 쿠폰
  '/admin/promotions/coupons': {
    message: '쿠폰 관리\n쿠폰을 등록하고 발급 상태를 관리할 수 있어요!\n벌크 선택으로 발급 시작/중지를 일괄 변경할 수 있고, 사용/발급 현황도 한눈에 확인할 수 있어요.',
  },
  '/admin/promotions/coupons/:id': {
    message: '쿠폰 상세\n쿠폰 정보를 확인하고 수정할 수 있어요.\n쿠폰코드 자동생성 기능으로 편리하게 코드를 만들고, 할인 설정과 발급 대상, 유효기간을 관리해보세요!',
  },

  // 통계
  '/admin/statistics': {
    message: '통계 분석\n매출, 상품, 고객 데이터를 한눈에 분석할 수 있어요!\n탭을 전환하여 매출 분석, 상품 분석, 고객 분석을 확인하세요.',
  },

  // 설정
  '/admin/settings': {
    message: '쇼핑몰 기본 정보\n쇼핑몰 기본 정보와 운영 설정을 관리할 수 있어요.\n쇼핑몰 정보에 입력된 정보는 푸터에 노출되어 사용자에게 제공됩니다. 소셜미디어 링크와 SEO 설정을 잘 활용하여 노출 정보를 최적화하세요!',
  },
  '/admin/settings/policies': {
    message: '정책 설정\n나의 사업에 맞는 상품 정책과 배송/반품 정책을 설정할 수 있어요. 정책 설정은 상품 상세페이지에 노출됩니다.',
  },
}

/**
 * 라우트 경로로 가이드 메시지 조회
 * @param {string} path - 현재 라우트 경로
 * @returns {object|null} - 가이드 객체 또는 null
 */
export const getPageGuide = (path) => {
  // 정확한 매칭 우선
  if (pageGuideMessages[path]) {
    return pageGuideMessages[path]
  }

  // 동적 라우트 패턴 매칭 (:id, :slug 등)
  for (const [pattern, guide] of Object.entries(pageGuideMessages)) {
    if (pattern.includes(':')) {
      const regexPattern = pattern.replace(/:[^/]+/g, '[^/]+')
      const regex = new RegExp(`^${regexPattern}$`)
      if (regex.test(path)) {
        return guide
      }
    }
  }

  return null
}
