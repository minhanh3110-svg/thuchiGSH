# Script kiểm tra file đã được Git track chưa
Write-Host "🔍 Kiểm tra Git status..." -ForegroundColor Yellow

# Check git status
Write-Host "`n📋 Files chưa được commit:" -ForegroundColor Cyan
git status

Write-Host "`n📦 Files đã được commit trong repo:" -ForegroundColor Cyan
git ls-files

Write-Host "`n🌿 Branch hiện tại:" -ForegroundColor Cyan
git branch

Write-Host "`n🔗 Remote repository:" -ForegroundColor Cyan
git remote -v

Write-Host "`n📝 Commit gần nhất:" -ForegroundColor Cyan
git log --oneline -5

Write-Host "`n✅ Hoàn tất kiểm tra!" -ForegroundColor Green
