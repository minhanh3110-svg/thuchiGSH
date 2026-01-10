# Script kiểm tra và tạo lại các file config
Write-Host "🔍 Kiểm tra các file cấu hình..." -ForegroundColor Yellow

# Check vercel.json
if (-not (Test-Path "vercel.json")) {
    Write-Host "❌ Thiếu vercel.json - Đang tạo..." -ForegroundColor Red
    @"
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
"@ | Out-File -FilePath "vercel.json" -Encoding utf8
    Write-Host "✅ Đã tạo vercel.json" -ForegroundColor Green
} else {
    Write-Host "✅ vercel.json OK" -ForegroundColor Green
}

# Check netlify.toml
if (-not (Test-Path "netlify.toml")) {
    Write-Host "❌ Thiếu netlify.toml - Đang tạo..." -ForegroundColor Red
    @"
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
"@ | Out-File -FilePath "netlify.toml" -Encoding utf8
    Write-Host "✅ Đã tạo netlify.toml" -ForegroundColor Green
} else {
    Write-Host "✅ netlify.toml OK" -ForegroundColor Green
}

# Check public/_redirects
if (-not (Test-Path "public")) {
    New-Item -ItemType Directory -Path "public" -Force | Out-Null
}

if (-not (Test-Path "public/_redirects")) {
    Write-Host "❌ Thiếu public/_redirects - Đang tạo..." -ForegroundColor Red
    "/*    /index.html   200" | Out-File -FilePath "public/_redirects" -Encoding utf8
    Write-Host "✅ Đã tạo public/_redirects" -ForegroundColor Green
} else {
    Write-Host "✅ public/_redirects OK" -ForegroundColor Green
}

Write-Host "`n✅ Hoàn tất kiểm tra!" -ForegroundColor Green
Write-Host "Tiếp theo chạy: npm run build" -ForegroundColor Yellow
