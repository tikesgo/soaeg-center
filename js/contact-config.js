/**
 * 소액센터 연락처 설정 — ★ 실제 운영값은 이 파일만 수정 ★
 *
 * [수정 위치] js/contact-config.js (현재 파일)
 *
 * phone      : 표시용 전화번호 (예: 010-1234-5678)
 * kakaoId    : 카카오톡 ID 또는 채널 URL (준비 전: "준비중")
 * telegramId : 텔레그램 @username 또는 t.me URL (준비 전: "준비중")
 *
 * 값이 "준비중"이면 모달에서 해당 채널 버튼이 비활성화됩니다.
 * 실제 URL/ID 입력 시 버튼이 활성화됩니다.
 *
 * 채널톡 상담창 연동은 js/channel-config.js 의 pluginKey를 사용합니다.
 * 상담 버튼 클릭 시 ChannelIO('showMessenger')가 실행됩니다.
 */
window.SOAEG_CONTACT = {
  phone: "010-0000-0000",
  kakaoId: "준비중",
  telegramId: "준비중",
  pendingLabel: "준비중",
};
