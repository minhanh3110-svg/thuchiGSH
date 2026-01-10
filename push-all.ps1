# Script push tất cả files lên GitHub
Write-Host "🚀 Push tất cả files lên GitHub..." -ForegroundColor Green

# Check current status
Write-Host "`n📋 Files hiện tại:" -ForegroundColor Yellow
git status

# Add all files
Write-Host "`n➕ Adding all files..." -ForegroundColor Yellow
git add --all

# Show what will be committed
Write-Host "`n📝 Files sẽ được commit:" -ForegroundColor Yellow
git status

# Confirm
$confirm = Read-Host "`nBạn có muốn commit và push? (y/n)"
if ($confirm -eq 'y' -or $confirm -eq 'Y') {
    # Commit
    $message = Read-Host "Nhập commit message"
    if ([string]::IsNullOrWhiteSpace($message)) {
        $message = "Add all project files"
    }
    
    Write-Host "`n💾 Committing..." -ForegroundColor Yellow
    git commit -m $message
    
    # Push
    Write-Host "`n⬆️  Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host "`n✅ Hoàn tất! Kiểm tra trên GitHub." -ForegroundColor Green
} else {
    Write-Host "`n❌ Đã hủy." -ForegroundColor Red
}
