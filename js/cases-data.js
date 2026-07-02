/**
 * 소액센터 실제 상담 사례 데이터 스키마
 * ----------------------------------------
 * 현재: 정적 HTML과 동기화용 참조 데이터
 * 향후: API/DB 응답을 동일 스키마로 매핑 후 목록·상세 렌더링에 사용
 *
 * 사례 추가 체크리스트 (#002, #003 …):
 * 1. cases/_template/detail.index.html → cases/{id}/index.html 복사·내용 교체
 * 2. cases/_template/list-card.html → cases/index.html 카드 영역에 붙여넣기
 * 3. 아래 CASES 배열에 동일 필드 추가
 * 4. cases/index.html JSON-LD ItemList 에 ListItem 추가
 * 5. sitemap.xml 에 /cases/{id}/ URL 추가
 * 6. Hero 배지 data-cases-badge="count" 는 initCasesHeroBadges()가 자동 반영
 *
 * 템플릿 위치: cases/_template/
 * 라이브 참고: cases/001/index.html, cases/index.html 내 case-card
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
    {
      id: "002",
      number: "002",
      rating: 5,
      title: "KT 소액결제가 될지 걱정되셨던 30대 여성 고객 상담 사례",
      summary:
        "최근 KT 소액결제 이슈를 보고 이용 가능 여부가 걱정되어 상담을 요청하셨으며, 정책·미납 확인 후 이용 가능 상태를 안내드렸습니다.",
      type: "이용 가능 여부 문의",
      carrier: "KT",
      published: "2026-07-02",
      detailPath: "002/",
      related: [
        {
          href: "../policy/how-to-check-mobile-payment-policy/",
          title: "통신사 소액결제 정책 확인 방법",
        },
        {
          href: "../policy/small-payment-policy/",
          title: "소액결제 정책이란",
        },
        {
          href: "../overdue/mobile-payment-possible-with-overdue/",
          title: "소액결제 미납인데 결제 가능한가",
        },
      ],
    },
  ];

  function initCasesHeroBadges() {
    if (typeof document === "undefined") {
      return;
    }

    var badges = document.querySelector("[data-cases-hero-badges]");
    if (!badges) {
      return;
    }

    var countEl = badges.querySelector('[data-cases-badge="count"]');
    if (countEl) {
      countEl.textContent = String(CASES.length);
    }

    var relatedEl = badges.querySelector('[data-cases-badge="related"]');
    var article = document.querySelector("[data-case-id]");
    if (relatedEl && article) {
      var item = CASES.find(function (entry) {
        return entry.id === article.getAttribute("data-case-id");
      });
      if (item && item.related && item.related.length) {
        relatedEl.textContent = String(item.related.length);
      }
    }
  }

  global.SOAEG_CASES = {
    listPath: "/cases/",
    items: CASES,
    getById: function (id) {
      return CASES.find(function (item) {
        return item.id === id;
      });
    },
  };

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initCasesHeroBadges);
  }
})(typeof window !== "undefined" ? window : globalThis);
