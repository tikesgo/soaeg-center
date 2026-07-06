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
 * 4. cases/index.html JSON-LD ItemList 에 ListItem 추가 (최신순: position 1 = 최신)
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
    {
      id: "003",
      number: "003",
      rating: 5,
      title: "한도가 남아 있는데 왜 소액결제가 안 될까요?",
      summary:
        "T world에서 소액결제 한도가 남아 있는데도 결제가 반복 실패해 문의하셨으며, 정책 적용 상태와 한도·정책 차이를 안내드렸습니다.",
      type: "결제 실패·한도 문의",
      carrier: "SKT",
      published: "2026-07-03",
      detailPath: "003/",
      related: [
        {
          href: "../guide/why-mobile-small-payment-not-working/",
          title: "소액결제가 안되는 이유",
        },
        {
          href: "../limit/mobile-small-payment-limit-guide/",
          title: "소액결제 한도 총정리",
        },
        {
          href: "../policy/small-payment-policy/",
          title: "소액결제 정책이란",
        },
      ],
    },
    {
      id: "004",
      number: "004",
      rating: 5,
      title: "소액결제 정책이 있었지만 일부 이용이 가능했던 실제 상담 사례",
      summary:
        "매월 1일 한도 초기화 시점에 약 100만원 진행을 문의하셨으나, 과거 미납 이력으로 정책이 적용된 상태에서 약 50만원만 승인 가능했던 사례입니다.",
      type: "정책·한도 상담",
      carrier: "해당 통신사",
      published: "2026-07-03",
      detailPath: "004/",
      related: [
        {
          href: "../policy/small-payment-policy/",
          title: "소액결제 정책이란",
        },
        {
          href: "../policy/how-to-check-mobile-payment-policy/",
          title: "통신사 소액결제 정책 확인 방법",
        },
        {
          href: "../overdue/mobile-payment-possible-with-overdue/",
          title: "소액결제 미납인데 결제 가능한가",
        },
      ],
    },
    {
      id: "005",
      number: "005",
      rating: 5,
      title: "미납으로 인해 소액결제 이용이 어려웠던 실제 상담 사례",
      summary:
        "LG 후불 알뜰폰 이용 고객이 15만원 진행을 문의하셨으며, 상담 과정에서 미납·정책·한도를 확인한 뒤 이번에는 진행이 어려웠던 사례입니다.",
      type: "미납·이용 불가 상담",
      carrier: "LG U+ (알뜰폰)",
      published: "2026-07-04",
      detailPath: "005/",
      related: [
        {
          href: "../overdue/lgu-overdue-mobile-payment/",
          title: "LGU+ 미납과 소액결제 총정리",
        },
        {
          href: "../overdue/mobile-payment-possible-with-overdue/",
          title: "소액결제 미납인데 결제 가능한가",
        },
        {
          href: "../guide/lgu-mobile-payment-not-working/",
          title: "LGU+ 소액결제가 안되는 이유",
        },
      ],
    },
    {
      id: "006",
      number: "006",
      rating: 5,
      title: "콘텐츠결제를 이미 이용했지만 추가로 소액결제를 진행했던 실제 상담 사례",
      summary:
        "SKT 이용 고객이 콘텐츠결제 50만원 이용 후 추가 자금이 필요해 문의하셨으며, 상담 과정에서 소액결제 100만원 진행과 요금 청구 시점을 안내드렸습니다.",
      type: "콘텐츠결제·소액결제 상담",
      carrier: "SKT",
      published: "2026-07-06",
      detailPath: "006/",
      related: [
        {
          href: "../guide/mobile-payment-user-guide/",
          title: "휴대폰 소액결제 이용가이드",
        },
        {
          href: "../limit/mobile-small-payment-limit-guide/",
          title: "소액결제 한도 총정리",
        },
        {
          href: "../guide/how-to-use-mobile-small-payment/",
          title: "휴대폰 소액결제 이용방법",
        },
      ],
    },
  ];

  function initCasesListOrder() {
    if (typeof document === "undefined") {
      return;
    }

    var list = document.querySelector("[data-cases-list]");
    if (!list) {
      return;
    }

    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-case-id]"));
    if (cards.length < 2) {
      return;
    }

    var orderByPublished = {};
    CASES.forEach(function (item) {
      orderByPublished[item.id] = item.published;
    });

    cards.sort(function (a, b) {
      var idA = a.getAttribute("data-case-id");
      var idB = b.getAttribute("data-case-id");
      var dateA = orderByPublished[idA] || "";
      var dateB = orderByPublished[idB] || "";
      return dateB.localeCompare(dateA) || idB.localeCompare(idA);
    });

    cards.forEach(function (card) {
      list.appendChild(card);
    });
  }

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
    document.addEventListener("DOMContentLoaded", function () {
      initCasesListOrder();
      initCasesHeroBadges();
    });
  }
})(typeof window !== "undefined" ? window : globalThis);
