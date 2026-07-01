/**
 * 소액센터 실제 상담 사례 데이터 스키마
 * ----------------------------------------
 * 현재: 정적 HTML과 동기화용 참조 데이터
 * 향후: API/DB 응답을 동일 스키마로 매핑 후 목록·상세 렌더링에 사용
 *
 * DB 연동 시 교체 포인트:
 * 1. fetch('/api/cases') → CASES 배열 갱신
 * 2. cases/index.html 카드 영역을 JS 렌더로 교체 (또는 SSR)
 * 3. cases/{id}/ 상세 본문 필드를 API에서 주입
 */
(function (global) {
  /** @typedef {Object} CaseRelatedLink
   *  @property {string} href
   *  @property {string} title
   */

  /** @typedef {Object} CaseItem
   *  @property {string} id          - URL 슬러그 (예: "001")
   *  @property {string} number      - 표시 번호 (예: "001")
   *  @property {number} rating      - 1~5
   *  @property {string} title
   *  @property {string} summary
   *  @property {string} type        - 상담유형
   *  @property {string} carrier     - 통신사
   *  @property {string} published   - ISO 날짜 (YYYY-MM-DD)
   *  @property {string} detailPath  - 상대 경로
   *  @property {CaseRelatedLink[]} related
   */

  /** @type {CaseItem[]} */
  var CASES = [
    {
      id: "001",
      number: "001",
      rating: 5,
      title: "번호이동 후 소액결제가 되지 않았던 사례",
      summary:
        "번호이동 직후 소액결제가 제한되어 문의를 주셨으며 통신사 정책에 대한 안내를 진행했습니다.",
      type: "번호이동",
      carrier: "KT",
      published: "2026-07-01",
      detailPath: "001/",
      related: [
        {
          href: "../guide/number-porting-mobile-payment-not-working/",
          title: "번호이동 후 소액결제가 안 되는 이유",
        },
        {
          href: "../guide/when-mobile-payment-available-after-activation/",
          title: "신규개통 후 소액결제 언제부터 가능한가",
        },
        {
          href: "../policy/small-payment-policy/",
          title: "소액결제 정책이란",
        },
      ],
    },
  ];

  global.SOAEG_CASES = {
    listPath: "/cases/",
    items: CASES,
    getById: function (id) {
      return CASES.find(function (item) {
        return item.id === id;
      });
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
