// 실제 날짜 기반 만세력 일주 계산용 상수를 정의하는 라이브러리 파일
// (일진 기준일로부터 경과 일수를 계산하여 60갑자 일주를 정확히 도출하는 오프라인 알고리즘)

// 60갑자 천간/지지 테이블
const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 60갑자 배열 생성 (甲子=0, 乙丑=1, ..., 丁未=43, 癸亥=59)
const GANZI_TABLE = [];
for (let i = 0; i < 60; i++) {
  GANZI_TABLE.push(HEAVENLY_STEMS[i % 10] + EARTHLY_BRANCHES[i % 12]);
}

// 만세력 일주 연산 핵심 로직
// 기준일: 1900년 1월 1일 (일진: 甲戌, GANZI_TABLE 상의 index = 10)
const BASE_YEAR = 1900;
const BASE_MONTH = 0; // 1월
const BASE_DATE = 1;
const BASE_GANZI_INDEX = 10; // 甲戌

function getIlju(year, month, day) {
  // 월은 JavaScript Date와 매칭되게 0-indexed로 처리 (1월 = 0)
  const baseDate = new Date(Date.UTC(BASE_YEAR, BASE_MONTH, BASE_DATE));
  const targetDate = new Date(Date.UTC(year, month, day));
  
  // 두 날짜 사이의 차이를 일수(days)로 환산
  const diffTime = targetDate.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return "丁未"; // 예외 범위 조절용 기본값
  }

  // 60갑자 순환 연산
  const ganziIndex = (BASE_GANZI_INDEX + diffDays) % 60;
  return GANZI_TABLE[ganziIndex];
}

window.getIlju = getIlju;
