/**
 * 소액센터 사이트 URL 설정
 *
 * Vercel 배포 후 아래 url 값을 실제 Vercel 도메인으로 교체하세요.
 * 예: https://soaeg-center-xxxx.vercel.app
 *
 * 동시에 아래 파일의 URL도 같은 값으로 맞춰야 합니다.
 * - index.html 및 모든 서브페이지 <head> (canonical, og:url, og:image)
 * - robots.txt
 * - sitemap.xml
 *
 * 커스텀 도메인(소액센터.kr) 연결 후에는 productionUrl 기준으로 전환하세요.
 */
window.SOAEG_SITE = {
  // TODO: Vercel 무료 도메인 배포 후 실제 주소로 교체
  url: "https://soaeg-center.vercel.app",
  // 커스텀 도메인 연결 시 canonical/og/sitemap을 productionUrl로 전환
  productionUrl: "https://소액센터.kr",
};
