document.addEventListener('DOMContentLoaded', () => {
  // Screen DOM components
  const loginScreen = document.getElementById('login-screen');
  const registerScreen = document.getElementById('register-screen');
  const homeScreen = document.getElementById('home-screen');
  const testScreen = document.getElementById('test-screen');
  const resultScreen = document.getElementById('result-screen');
  const membershipScreen = document.getElementById('membership-screen');
  const loadingContainer = document.getElementById('loading-container');

  // Authentication Switchers
  const goRegisterBtn = document.getElementById('go-register-btn');
  const goLoginBtn = document.getElementById('go-login-btn');

  // Reg input nodes (Simplified: Name, Gender, Age, Phone, Address-City, Address-Dong)
  const regEmail = document.getElementById('reg-email');
  const regName = document.getElementById('reg-name');
  const regPassword = document.getElementById('reg-password'); // Phone number used as login password
  const regAge = document.getElementById('reg-age');
  const regAddrCity = document.getElementById('reg-addr-city');
  const regAddrDong = document.getElementById('reg-addr-dong');
  const registerSubmitBtn = document.getElementById('register-submit-btn');

  // Login inputs
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const loginSubmitBtn = document.getElementById('login-submit-btn');

  // Home welcome nodes & Birth entry before test
  const homeUserWelcome = document.getElementById('home-user-welcome');
  const sajuBirthInput = document.getElementById('saju-birth');
  const startTestBtn = document.getElementById('start-test-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const googleSheetUrlInput = document.getElementById('google-sheet-url');

  // Test screen dynamic components
  const abortTestBtn = document.getElementById('abort-test-btn');
  const currQNum = document.getElementById('curr-q-num');
  const progressFill = document.getElementById('progress-fill');
  const questionText = document.getElementById('question-text');
  const answerOptions = document.getElementById('answer-options');

  // Result display nodes
  const resMbtiType = document.getElementById('res-mbti-type');
  const resMbtiChar = document.getElementById('res-mbti-char');
  const resMbtiStyle = document.getElementById('res-mbti-style');
  const resIljuAvatar = document.getElementById('res-ilju-avatar');
  const resIljuName = document.getElementById('res-ilju-name');
  const resIljuChar = document.getElementById('res-ilju-char');
  const resIljuStudy = document.getElementById('res-ilju-study');
  const resJobsContainer = document.getElementById('res-jobs-container');

  // Grade inputs in Premium Screen
  const gradeGpaInput = document.getElementById('grade-gpa');
  const gradeMockInput = document.getElementById('grade-mock');
  const calcCollegeBtn = document.getElementById('calc-college-btn');
  const recommendedCollegePanel = document.getElementById('recommended-college-panel');
  const collegeListContainer = document.getElementById('college-list-container');

  // Curation display nodes
  const curationMissionPanel = document.getElementById('curation-mission-panel');
  const selectedCurTitle = document.getElementById('selected-cur-title');
  const curElectivesContainer = document.getElementById('cur-electives-container');
  const monthlyTimelineContainer = document.getElementById('monthly-timeline-container');
  const curClubMission = document.getElementById('cur-club-mission');
  const curServiceMission = document.getElementById('cur-service-mission');
  const curReadingMission = document.getElementById('cur-reading-mission');

  // Transition & Action buttons
  const backToHomeBtn = document.getElementById('back-to-home');
  const backToResultBtn = document.getElementById('back-to-result');
  const premiumPayBtn = document.getElementById('premium-pay-btn');

  // State Management
  let mbtiScores = { EI: 0, SN: 0, TF: 0, JP: 0 };
  let currentQuestionIndex = 0;
  let computedMbti = 'INFP';
  let computedIlju = '丁未'; 
  let currentUser = null; 

  // Database assets loaded from db.js
  const MbtiQuestions = window.MbtiQuestions || [];
  const SajuIljuKoreanData = window.SajuIljuKoreanData || {};
  const MbtiDetailData = window.MbtiDetailData || {};
  const CollegeCurationMissions = window.CollegeCurationMissions || {};

  // -- AUTH SWITCH NAVIGATION --
  goRegisterBtn.addEventListener('click', () => {
    loginScreen.classList.remove('active');
    registerScreen.classList.add('active');
  });

  goLoginBtn.addEventListener('click', () => {
    registerScreen.classList.remove('active');
    loginScreen.classList.add('active');
  });

  // -- SIMPLIFIED REGISTER ACTION --
  registerSubmitBtn.addEventListener('click', () => {
    const email = regEmail.value.trim();
    const name = regName.value.trim();
    const phone = regPassword.value.trim(); // password field maps to contact phone
    const gender = document.querySelector('input[name="reg-gender"]:checked').value;
    const age = regAge.value.trim();
    const city = regAddrCity.value.trim();
    const dong = regAddrDong.value.trim();

    if (!email || !name || !phone || !city || !dong) {
      alert('모든 가입 필수 항목을 입력해 주세요!');
      return;
    }

    const memberPayload = {
      email,
      name,
      phone,
      gender,
      age,
      address: `${city} ${dong}`,
      saju: "미검사", // Filled after testing
      mbti: "미검사"  // Filled after testing
    };

    loadingContainer.style.display = 'flex';

    // Store in local mock DB
    localStorage.setItem(email, JSON.stringify(memberPayload));

    setTimeout(() => {
      loadingContainer.style.display = 'none';
      alert('회원가입이 완료되었습니다! 가입하신 이메일과 연락처번호로 로그인 후 테스트를 진행해 주세요.');
      registerScreen.classList.remove('active');
      loginScreen.classList.add('active');
    }, 900);
  });

  // -- LOGIN SUBMIT ACTION --
  loginSubmitBtn.addEventListener('click', () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
      alert('이메일과 연락처를 입력해 주세요.');
      return;
    }

    const storedUser = localStorage.getItem(email);
    if (!storedUser) {
      alert('등록되지 않은 이메일입니다. 회원가입을 진행해 주세요.');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.phone !== password) {
      alert('비밀번호(연락처)가 일치하지 않습니다.');
      return;
    }

    // Success Authentication
    currentUser = parsedUser;

    homeUserWelcome.innerHTML = `
      학부모님 반갑습니다. (계정: <strong>${currentUser.email}</strong>)<br>
      가입자 성함: <strong>${currentUser.name}님</strong> / 자녀 나이: <strong>${currentUser.age}세 (${currentUser.gender})</strong><br>
      자녀의 생년월일을 아래에 기입하시고 진단 테스트를 진행해 주세요.
    `;

    loginScreen.classList.remove('active');
    homeScreen.classList.add('active');
  });

  // -- TEST START & ACCURATE MANSERYEOK --
  startTestBtn.addEventListener('click', () => {
    const birthVal = sajuBirthInput.value.trim();
    if (birthVal.length < 8) {
      alert('생년월일 8자리를 숫자로 정확히 입력해 주세요 (예: 19811125)');
      return;
    }

    const year = parseInt(birthVal.substring(0, 4), 10);
    const month = parseInt(birthVal.substring(4, 6), 10) - 1; // 0-indexed month
    const day = parseInt(birthVal.substring(6, 8), 10);

    if (isNaN(year) || isNaN(month) || isNaN(day) || month < 0 || month > 11 || day < 1 || day > 31) {
      alert('입력하신 날짜 형식이 올바르지 않습니다.');
      return;
    }

    // Call accurate manseryeok algorithm
    if (window.getIlju) {
      computedIlju = window.getIlju(year, month, day);
    } else {
      computedIlju = "丁未";
    }

    // Reset scores & route to test screen
    mbtiScores = { EI: 0, SN: 0, TF: 0, JP: 0 };
    currentQuestionIndex = 0;

    homeScreen.classList.remove('active');
    testScreen.classList.add('active');
    loadQuestion(0);
  });

  // -- TEST INTERACTIVES --
  abortTestBtn.addEventListener('click', () => {
    if (confirm('테스트를 중단하고 처음으로 돌아가시겠습니까?')) {
      testScreen.classList.remove('active');
      homeScreen.classList.add('active');
    }
  });

  backToHomeBtn.addEventListener('click', () => {
    resultScreen.classList.remove('active');
    homeScreen.classList.add('active');
  });

  backToResultBtn.addEventListener('click', () => {
    membershipScreen.classList.remove('active');
    resultScreen.classList.add('active');
  });

  premiumPayBtn.addEventListener('click', () => {
    gradeGpaInput.value = '';
    gradeMockInput.value = '';
    recommendedCollegePanel.style.display = 'none';
    curationMissionPanel.style.display = 'none';

    resultScreen.classList.remove('active');
    membershipScreen.classList.add('active');
  });

  // Load Single Question Card
  function loadQuestion(index) {
    if (index >= MbtiQuestions.length) {
      finishTest();
      return;
    }

    currentQuestionIndex = index;
    const q = MbtiQuestions[index];

    currQNum.textContent = index + 1;
    progressFill.style.width = `${((index + 1) / MbtiQuestions.length) * 100}%`;
    questionText.textContent = q.text;

    answerOptions.innerHTML = '';
    q.answers.forEach(ans => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = ans.text;
      btn.addEventListener('click', () => {
        mbtiScores[q.dimension] += ans.score;
        loadQuestion(index + 1);
      });
      answerOptions.appendChild(btn);
    });
  }

  // Finish MBTI, Save Results, AND trigger Google Sheet API Sync in the background!
  function finishTest() {
    testScreen.classList.remove('active');
    loadingContainer.style.display = 'flex';

    let mbtiResult = '';
    mbtiResult += mbtiScores.EI >= 0 ? 'E' : 'I';
    mbtiResult += mbtiScores.SN >= 0 ? 'S' : 'N';
    mbtiResult += mbtiScores.TF >= 0 ? 'T' : 'F';
    mbtiResult += mbtiScores.JP >= 0 ? 'J' : 'P';
    computedMbti = mbtiResult;

    // Resolve Saju Details
    const iljuInfo = SajuIljuKoreanData[computedIlju] || SajuIljuKoreanData["기타"];

    // Update Local session database
    if (currentUser) {
      currentUser.saju = iljuInfo.name;
      currentUser.mbti = computedMbti;
      localStorage.setItem(currentUser.email, JSON.stringify(currentUser));

      // Realtime POST trigger to Google Sheet Members Tab
      const sheetAppScriptUrl = googleSheetUrlInput.value.trim();
      if (sheetAppScriptUrl && !sheetAppScriptUrl.includes('DemoPlaceholderURL')) {
        console.log('Syncing registration info & test outcomes with Google Sheets Members Tab...', currentUser);
        fetch(sheetAppScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentUser)
        }).catch(err => console.warn('Delayed Sheets sync encountered networks drop.', err));
      }
    }

    setTimeout(() => {
      loadingContainer.style.display = 'none';
      populateResultScreen();
      resultScreen.classList.add('active');
    }, 1300);
  }

  // Render Result Screen elements (Decoupled Saju and MBTI structures)
  function populateResultScreen() {
    resMbtiType.textContent = computedMbti;

    const ilju = SajuIljuKoreanData[computedIlju] || SajuIljuKoreanData["기타"];
    resIljuName.textContent = ilju.name;
    
    // Set Saju animal icon
    if (computedIlju === "丁未") resIljuAvatar.textContent = "🐑";
    else if (computedIlju === "丁酉") resIljuAvatar.textContent = "🐓";
    else if (computedIlju === "庚寅") resIljuAvatar.textContent = "🐯";
    else if (computedIlju === "甲辰") resIljuAvatar.textContent = "🐉";
    else if (computedIlju === "癸亥") resIljuAvatar.textContent = "🐷";
    else if (computedIlju === "丙午") resIljuAvatar.textContent = "🐎";
    else if (computedIlju === "辛酉") resIljuAvatar.textContent = "🐓";
    else resIljuAvatar.textContent = "🦄";

    // Decoupled Saju Character & Study Style display
    resIljuChar.textContent = ilju.character;
    resIljuStudy.textContent = ilju.studyStyle;

    // Decoupled MBTI Character & Work environment display
    const mbtiMeta = MbtiDetailData[computedMbti] || MbtiDetailData["default"];
    resMbtiChar.textContent = mbtiMeta.character;
    resMbtiStyle.textContent = mbtiMeta.jobStyle;

    // Recommended Daymaster Careers tags
    resJobsContainer.innerHTML = '';
    ilju.jobs.forEach(job => {
      const span = document.createElement('span');
      span.className = 'job-badge';
      span.textContent = job;
      resJobsContainer.appendChild(span);
    });
  }

  // -- GRADE ANALYSIS MODULE --
  calcCollegeBtn.addEventListener('click', () => {
    const gpaVal = parseFloat(gradeGpaInput.value);
    const mockVal = parseInt(gradeMockInput.value, 10);

    if (isNaN(gpaVal) || isNaN(mockVal)) {
      alert('분석을 위해 내신 등급과 모의고사 등급 합을 입력란에 숫자로 기입해 주세요!');
      return;
    }

    loadingContainer.style.display = 'flex';

    setTimeout(() => {
      loadingContainer.style.display = 'none';
      buildRecommendedColleges(gpaVal, mockVal);
    }, 900);
  });

  // Generate target colleges & department matching lists depending on input GPA score
  // (Updated for 고2 5-Grade system where competitive cutoffs are compact)
  function buildRecommendedColleges(gpa, mockSum) {
    recommendedCollegePanel.style.display = 'block';
    curationMissionPanel.style.display = 'none';
    collegeListContainer.innerHTML = '';

    let collegeData = [];
    
    // 5-Grade System competitive cutoff mapping simulation (Grade 1 ~ 5)
    // Grade 1: Top 10% (equivalent to old 1~2 grades)
    // Grade 2: Top 34% (equivalent to old 3~4 grades)
    if (gpa <= 1.3) {
      collegeData = [
        { college: "서울대학교", dept: getDeptByMbti(computedMbti), type: "학생부종합(지역균형)", cut: "1.1 (최상위)" },
        { college: "연세대학교", dept: getDeptByMbti(computedMbti), type: "학생부종합(활동우수형)", cut: "1.2 (최상위)" },
        { college: "고려대학교", dept: getDeptByMbti(computedMbti), type: "학생부교과(학교추천)", cut: "1.3 (최상위)" }
      ];
    } else if (gpa <= 2.2) {
      collegeData = [
        { college: "한양대학교", dept: getDeptByMbti(computedMbti), type: "학생부교과(추천형)", cut: "1.7" },
        { college: "성균관대학교", dept: getDeptByMbti(computedMbti), type: "학생부종합(계열모집)", cut: "1.8" },
        { college: "중앙대학교", dept: getDeptByMbti(computedMbti), type: "학생부종합(CAU융합형)", cut: "2.0" }
      ];
    } else {
      collegeData = [
        { college: "경희대학교", dept: getDeptByMbti(computedMbti), type: "학생부종합(네오르네상스)", cut: "2.5" },
        { college: "건국대학교", dept: getDeptByMbti(computedMbti), type: "학생부종합(KU자기추천)", cut: "2.7" },
        { college: "국민대학교", dept: getDeptByMbti(computedMbti), type: "학생부교과(교과성적우수자)", cut: "3.0" }
      ];
    }

    collegeData.forEach(item => {
      const card = document.createElement('div');
      card.style.cssText = `
        background: hsla(223, 40%, 8%, 0.8);
        border: 1px solid var(--border-glass);
        border-radius: 12px;
        padding: 12px 16px;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;

      card.innerHTML = `
        <div>
          <div style="font-weight: 700; font-size: 0.92rem; color: #fff;">${item.college} [${item.dept}]</div>
          <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">${item.type} | 5등급제 합격선: ${item.cut}</div>
        </div>
        <i class="fa-solid fa-circle-chevron-right" style="color: var(--color-primary);"></i>
      `;

      card.addEventListener('mouseover', () => {
        card.style.borderColor = 'var(--color-secondary)';
      });
      card.addEventListener('mouseout', () => {
        card.style.borderColor = 'var(--border-glass)';
      });

      card.addEventListener('click', () => {
        loadCurationMissions(item.college, item.dept);
      });

      collegeListContainer.appendChild(card);
    });
  }

  function getDeptByMbti(mbti) {
    if (mbti.includes("NF")) return "심리학과";
    if (mbti.includes("NT")) return "컴퓨터공학과";
    if (mbti.includes("SF")) return "간호학과";
    if (mbti.includes("ST") && mbti.includes("J")) return "행정학과";
    return "경영학과"; 
  }

  // Load Extracurricular strategy for target selection + ELECTIVES roadmap guide
  // AND monthly timeline roadmap steps
  function loadCurationMissions(college, dept) {
    curationMissionPanel.style.display = 'block';
    selectedCurTitle.textContent = `${college} ${dept}`;

    const mission = CollegeCurationMissions[dept] || CollegeCurationMissions["기타학과"];
    curClubMission.textContent = mission.club;
    curServiceMission.textContent = mission.service;
    curReadingMission.textContent = mission.reading;

    // Load High School Elective Courses
    curElectivesContainer.innerHTML = '';
    const electivesList = mission.electives || [];
    electivesList.forEach(course => {
      const span = document.createElement('span');
      span.className = 'elective-item-badge';
      span.textContent = course;
      curElectivesContainer.appendChild(span);
    });

    // Load Monthly timeline roadmap steps (Subscription Value Generator)
    monthlyTimelineContainer.innerHTML = '';
    const monthlyData = mission.monthly || {};
    
    // Sort and render monthly milestones
    Object.keys(monthlyData).forEach(month => {
      const timelineRow = document.createElement('div');
      timelineRow.style.cssText = `
        background: hsla(223, 40%, 14%, 0.6);
        border: 1px solid var(--border-glass);
        border-left: 4px solid var(--color-secondary);
        border-radius: 8px;
        padding: 10px 14px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      `;

      timelineRow.innerHTML = `
        <div style="font-weight: 700; font-size: 0.85rem; color: var(--color-secondary); display:flex; justify-content:space-between; align-items:center;">
          <span>📅 ${month} 미션</span>
          <span style="font-size:0.75rem; font-weight:400; color:var(--text-muted);">미이행 시 다음 달 결제 자동 갱신</span>
        </div>
        <div style="font-size: 0.8rem; line-height: 1.5; color: var(--text-main); word-break:keep-all;">
          ${monthlyData[month]}
        </div>
      `;
      monthlyTimelineContainer.appendChild(timelineRow);
    });

    curationMissionPanel.scrollIntoView({ behavior: 'smooth' });
  }
});
