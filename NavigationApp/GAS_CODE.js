/**
 * [구글 스프레드시트 배포용 Apps Script 소스 코드]
 * 
 * 적용 방법:
 * 1. 구글 스프레드시트 (https://docs.google.com/spreadsheets/d/1atSIrIhx74hP17Fhxe9Ej-KP8BDQ2WgRCZWc6AMfAXk/edit) 접속
 * 2. 상단 메뉴 [확장 프로그램] > [Apps Script] 클릭
 * 3. 기존 에디터의 코드를 모두 지우고 아래 소스코드를 복사해서 붙여넣기
 * 4. 프로젝트 저장(디스크 아이콘) 후 우측 상단 [배포] > [새 배포] 클릭
 * 5. 유형 선택: "웹앱"
 * 6. 웹앱 설정:
 *    - 설명: 고교학점제 네비게이션 회원 가입 데이터 연동
 *    - 다음 사용자 권한으로 실행: "웹앱을 실행하는 사용자" 또는 "나" (나를 추천)
 *    - 액세스 권한이 있는 사용자: "모든 사람" (Anonymous 필수)
 * 7. [배포] 버튼 클릭 후 생성된 [웹앱 URL]을 웹 앱 홈 화면의 구글 시트 연동 설정창에 복사해서 입력하시면 연동이 완료됩니다!
 */

function doPost(e) {
  try {
    var jsonString = e.postData.contents;
    var data = JSON.parse(jsonString);

    // 타깃 스프레드시트 열기
    var sheetId = "1atSIrIhx74hP17Fhxe9Ej-KP8BDQ2WgRCZWc6AMfAXk";
    var ss = SpreadsheetApp.openById(sheetId);
    
    // Members 탭 가져오기 또는 없으면 생성
    var sheet = ss.getSheetByName("Members");
    if (!sheet) {
      sheet = ss.insertSheet("Members");
      // 헤더 행 삽입
      sheet.appendRow(["가입 시간", "이메일(아이디)", "이름", "연락처", "성별", "자녀 나이", "주소", "사주 일주", "자녀 MBTI"]);
    }

    // 기록할 행 데이터 생성
    var timestamp = new Date();
    var rowData = [
      timestamp,
      data.email || "",
      data.name || "",
      data.phone || "",
      data.gender || "",
      data.age || "",
      data.address || "",
      data.saju || "",
      data.mbti || ""
    ];

    // 행 추가
    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Members 주입 완료" }))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// CORS 대응용 GET 옵션 메소드 지원
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ "status": "active", "message": "Highschool Navigation API 구동 중" }))
                       .setMimeType(ContentService.MimeType.JSON);
}
