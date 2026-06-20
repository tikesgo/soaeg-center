# 소액센터 프로젝트 컨텍스트

## 프로젝트 정체성

- 이 저장소는 **소액센터 전용** 정적 랜딩 사이트입니다.
- **세움기프트**, **SEUMBiz**, **TM_Collector** 등 다른 프로젝트와 **별개**입니다.
- 작업·배포·수정 시 이 프로젝트 경로(`soaeg-center`)만 대상으로 합니다.

## 아키텍처

| 항목 | 상태 |
|------|------|
| 관리자 화면 | 없음 |
| 데이터베이스 | 없음 |
| Supabase | 없음 |
| 로그인 | 없음 |
| 상담 신청 저장 | 없음 |
| 상담 UX | **연락처 안내 모달** (전화 / 카카오톡 / 텔레그램) |
| 기술 스택 | 정적 HTML / CSS / JavaScript |

## 사이트 URL (SEO)

배포 단계에 따라 아래 파일의 URL을 **동일한 값**으로 맞춥니다.

| 파일 | 용도 |
|------|------|
| `SITE_URL.txt` | 사람이 읽는 URL 메모 (배포 시 1차 교체 위치) |
| `js/site-config.js` | `SOAEG_SITE.url` / `productionUrl` 상수 |
| `index.html` 및 서브페이지 `<head>` | `canonical`, `og:url`, `og:image` |
| `robots.txt` | `Sitemap:` URL |
| `sitemap.xml` | 모든 `<loc>` URL |

1. **Vercel 무료 도메인** — `https://REPLACE-VERCEL-URL.vercel.app` → 배포 후 실제 `*.vercel.app` 주소로 교체
2. **커스텀 도메인** (`소액센터.kr`) — `site-config.js`의 `productionUrl` 기준으로 전환

각 HTML `<head>`에 `<!-- TODO: SEO URL은 SITE_URL.txt / js/site-config.js 와 동기화 -->` 주석이 있습니다.

## 연락처 설정

- 연락처 값은 **`js/contact-config.js`** 한 파일에서만 수정합니다.
- `js/main.js`가 `data-contact-value`, `data-contact-tel`, 채널 버튼에 값을 반영합니다.
- `index.html`에서 `contact-config.js`가 `main.js`보다 **먼저** 로드되어야 합니다.

## 주요 파일

| 파일 | 역할 |
|------|------|
| `index.html` | 메인 랜딩 (Hero, 채널톡 CTA) |
| `css/style.css` | 전체 스타일 |
| `js/contact-config.js` | **★ 전화·카카오·텔레그램 연락처 — 실제값 입력 위치** |
| `js/site-config.js` | 사이트 URL 상수 (`SOAEG_SITE.url`) |
| `SITE_URL.txt` | 배포 URL 메모 (HTML/robots/sitemap과 동기화) |
| `images/og-preview.png` | OG 공유 미리보기 이미지 (1200×630) |
| `images/hero-slide-1.png` | Hero 슬라이드 1 (1536×1024, 3:2) |
| `images/hero-slide-2.png` | Hero 슬라이드 2 (1536×1024, 3:2) |
| `js/main.js` | 채널톡, 네비, Hero 슬라이더 |
| `robots.txt` / `sitemap.xml` | SEO 크롤링 설정 |

## 배포

- Vercel 등 정적 호스팅에 그대로 배포 가능합니다.
- 빌드 단계 없음. 프로젝트 루트를 문서 루트로 지정하면 됩니다.
- 배포 직후 `SITE_URL.txt`의 placeholder를 실제 Vercel URL로 교체하고, 위 SEO 파일들을 일괄 동기화합니다.

### 배포 전 체크리스트

- [ ] `js/contact-config.js` — 실제 전화번호·카카오·텔레그램 ID 입력
- [ ] Vercel 배포 후 `REPLACE-VERCEL-URL.vercel.app` → 실제 URL로 교체 (`SITE_URL.txt`, `site-config.js`, HTML head, `robots.txt`, `sitemap.xml`)
- [ ] `images/og-preview.png` 존재 확인 (OG 미리보기)
- [ ] 메인·서브페이지 CTA → `index.html#open-contact` 모달 동작 확인
- [ ] privacy / FAQ / guide 문구가 연락처 안내 모달 방식과 일치하는지 확인
- [ ] (선택) 커스텀 도메인 연결 후 `productionUrl` 기준으로 canonical·sitemap 재전환

## 주의사항

- 개인정보 입력 폼·DB 연동·외부 API 저장 로직을 **추가하지 않습니다**.
- 채널 ID가 `준비중`이면 모달에서 카카오/텔레그램 버튼이 비활성화됩니다.
- 서브페이지 CTA는 메인(`index.html#open-contact`)으로 이동해 채널톡을 엽니다.

## Hero 슬라이드 이미지 (제작 가이드)

Hero 우측 슬라이더(`images/hero-slide-1.png`, `hero-slide-2.png`)는 **아래 규격으로 통일**합니다.

### 규격

| 항목 | 값 |
|------|-----|
| **제작 크기** | **1536 × 1024 px** |
| **비율** | **3 : 2** |
| **형식** | PNG 또는 WebP |
| **슬라이더 CSS** | `aspect-ratio: 3 / 2`, `object-fit: cover` (변경 없음) |

슬라이더 CSS와 이미지 비율이 동일하므로 `cover` 적용 시 여백·비율 불일치 없이 카드를 꽉 채웁니다.

### 스타일

- **톤:** 화이트 + 블루, 밝고 깨끗한 랜딩페이지
- **텍스트:** 크게, 작은 설명문 최소화
- **비주얼:** 3D 스마트폰 + 아이콘
- **요소:** 보안 / 상담 / 통신사(SKT·KT·LG U+) 테마 활용
- **배경:** `#F5F8FF`~`#FFFFFF`, 메인 블루 `#2B63D9`
- **세이프존:** 핵심 텍스트·로고는 가장자리 80px 안쪽, 하단 60px는 dot indicator와 겹칠 수 있음
- **주의:** 업스케일 금지, 캔버스 전체 풀블리드 제작

### 슬라이드 구성 (예시)

| 파일 | 주제 |
|------|------|
| `hero-slide-1.png` | 소액결제 상담 안내 |
| `hero-slide-2.png` | 정책 · 한도 · 미납 상담 |
