@echo off
chcp 65001 >nul
echo ==============================================
echo 🚀 자동 배포를 시작합니다 (GitHub + Vercel)
echo ==============================================

git branch -M main
git add .
git commit -m "Auto deploy - %date% %time%"

git push origin main

echo ==============================================
echo ✅ 배포가 완료되었습니다! (Vercel 대시보드 확인)
echo ==============================================
pause
