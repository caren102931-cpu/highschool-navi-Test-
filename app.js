document.addEventListener('DOMContentLoaded', () => {
  // Screen DOM components
  const homeScreen = document.getElementById('home-screen');
  const resultScreen = document.getElementById('result-screen');
  const membershipScreen = document.getElementById('membership-screen');
  const loadingContainer = document.getElementById('loading-container');

  // Input & action components
  const mbtiInput = document.getElementById('mbti-input');
  const analyzeBtn = document.getElementById('analyze-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const googleSheetUrlInput = document.getElementById('google-sheet-url');
  
  // Back & Transition Buttons
  const backToHomeBtn = document.getElementById('back-to-home');
  const backToResultBtn = document.getElementById('back-to-result');
  const premiumPayBtn = document.getElementById('premium-pay-btn');

  // Result display nodes
  const resAnalysisText = document.getElementById('res-analysis-text');
  const resJobsContainer = document.getElementById('res-jobs-container');
  const resMbtiBadge = document.getElementById('res-mbti-badge');

  // Curation display nodes
  const curMbtiBadge = document.getElementById('cur-mbti-badge');
  const curGuideText = document.getElementById('cur-guide-text');
  const curSubjectsContainer = document.getElementById('cur-subjects-container');
  const curWarningText = document.getElementById('cur-warning-text');
  const curClubMission = document.getElementById('cur-club-mission');
  const curServiceMission = document.getElementById('cur-service-mission');
  const curReadingMission = document.getElementById('cur-reading-mission');

  // State
  let currentMbti = 'INFP';

  // Retrieve global Mock database records
  const TendencyMatchData = window.TendencyMatchData || {};
  const UniversityRequiresData = window.UniversityRequiresData || {};
  const DefaultTendency = window.DefaultTendency || {};
  const DefaultRequires = window.DefaultRequires || {};

  // Formatting helper for input keys
  mbtiInput.addEventListener('input', (e) => {
    let cleaned = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (cleaned.length > 4) {
      cleaned = cleaned.substring(0, 4);
    }
    e.target.value = cleaned;
  });

  // Toggle settings view
  settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('active');
  });

  googleSheetUrlInput.addEventListener('change', (e) => {
    const url = e.target.value.trim();
    if (url) {
      alert('구글 시트 연동 정보가 설정되었습니다! (시뮬레이션 모드 활성화)');
    }
  });

  // Handle Analysis Action
  analyzeBtn.addEventListener('click', () => {
    const inputVal = mbtiInput.value.trim();
    if (inputVal.length < 4) {
      alert('MBTI 4자리를 정확히 입력해 주세요! (예: INFP)');
      return;
    }

    currentMbti = inputVal;

    // Trigger Transition with loading skeleton simulation
    homeScreen.classList.remove('active');
    loadingContainer.style.display = 'flex';

    setTimeout(() => {
      loadingContainer.style.display = 'none';
      populateResultScreen(currentMbti);
      resultScreen.classList.add('active');
    }, 1200); // 1.2s premium load effect
  });

  // Transition back buttons
  backToHomeBtn.addEventListener('click', () => {
    resultScreen.classList.remove('active');
    homeScreen.classList.add('active');
  });

  backToResultBtn.addEventListener('click', () => {
    membershipScreen.classList.remove('active');
    resultScreen.classList.add('active');
  });

  // CTA trigger to membership
  premiumPayBtn.addEventListener('click', () => {
    loadingContainer.style.display = 'flex';
    resultScreen.classList.remove('active');
    
    setTimeout(() => {
      loadingContainer.style.display = 'none';
      populateCurationScreen(currentMbti);
      membershipScreen.classList.add('active');
    }, 800);
  });

  // Populate Result Details
  function populateResultScreen(mbti) {
    resMbtiBadge.textContent = mbti;
    
    const match = TendencyMatchData[mbti] || DefaultTendency;
    resAnalysisText.textContent = match.analysis;
    
    resJobsContainer.innerHTML = '';
    match.jobs.forEach(job => {
      const span = document.createElement('span');
      span.className = 'job-badge';
      span.textContent = job;
      resJobsContainer.appendChild(span);
    });
  }

  // Populate Curation Details
  function populateCurationScreen(mbti) {
    curMbtiBadge.textContent = mbti;

    const data = UniversityRequiresData[mbti] || DefaultRequires;
    curGuideText.textContent = data.guide;
    
    curSubjectsContainer.innerHTML = '';
    data.subjects.forEach(subject => {
      const span = document.createElement('span');
      span.className = 'subject-badge';
      span.textContent = subject;
      curSubjectsContainer.appendChild(span);
    });

    curWarningText.textContent = data.warning;
    
    curClubMission.textContent = data.mission.club;
    curServiceMission.textContent = data.mission.service;
    curReadingMission.textContent = data.mission.reading;
  }
});
