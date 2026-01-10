# Script để push code lên GitHub
# Chạy: .\push-github.ps1

Write-Host "🚀 Đẩy code lên GitHub..." -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "📦 Khởi tạo Git..." -ForegroundColor Yellow
    git init
}

# Add all files
Write-Host "📝 Thêm tất cả files..." -ForegroundColor Yellow
git add .

# Commit
$commitMessage = Read-Host "Nhập commit message (Enter để dùng mặc định)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host "💾 Commit với message: $commitMessage" -ForegroundColor Yellow
git commit -m $commitMessage

# Check if remote exists
$remoteExists = git remote | Select-String "origin"
if (-not $remoteExists) {
    Write-Host "🔗 Thêm remote origin..." -ForegroundColor Yellow
    $repoUrl = Read-Host "Nhập GitHub repo URL (https://github.com/username/repo.git)"
    git remote add origin $repoUrl
}

# Push
Write-Host "⬆️  Đẩy code lên GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "✅ Hoàn tất! Code đã được đẩy lên GitHub!" -ForegroundColor Green
