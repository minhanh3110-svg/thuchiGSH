#!/bin/bash
# Script để push code lên GitHub
# Chạy: ./push-github.sh

echo "🚀 Đẩy code lên GitHub..."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Khởi tạo Git..."
    git init
fi

# Add all files
echo "📝 Thêm tất cả files..."
git add .

# Commit
read -p "Nhập commit message (Enter để dùng mặc định): " commitMessage
if [ -z "$commitMessage" ]; then
    commitMessage="Update: $(date '+%Y-%m-%d %H:%M')"
fi

echo "💾 Commit với message: $commitMessage"
git commit -m "$commitMessage"

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "🔗 Thêm remote origin..."
    read -p "Nhập GitHub repo URL (https://github.com/username/repo.git): " repoUrl
    git remote add origin "$repoUrl"
fi

# Push
echo "⬆️  Đẩy code lên GitHub..."
git push -u origin main

echo "✅ Hoàn tất! Code đã được đẩy lên GitHub!"
