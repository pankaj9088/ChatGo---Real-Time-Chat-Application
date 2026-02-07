# 🚀 Quick Git Commands - ChatGo

## 📌 First Time Setup (Do Once)

### 1. Create Repository on GitHub
1. Go to https://github.com/new
2. Repository name: **ChatGo**
3. Description: **Real-time chat application with video calling**
4. Choose Public or Private
5. **DO NOT** check any boxes (README, .gitignore, license)
6. Click **Create repository**

### 2. Connect to GitHub
```bash
# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ChatGo.git

# Push to GitHub
git push -u origin main
```

---

## 🔄 Daily Workflow (Use These Often)

### Check Status
```bash
git status
```

### Add All Changes
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Your message here"
```

### Push to GitHub
```bash
git push
```

### Complete Workflow (Copy-Paste)
```bash
git add .
git commit -m "Update: describe what you changed"
git push
```

---

## 📝 Good Commit Message Examples

```bash
# Features
git commit -m "Add group chat functionality"
git commit -m "Add emoji picker to message input"
git commit -m "Implement video call feature"

# Fixes
git commit -m "Fix real-time messaging socket issue"
git commit -m "Fix avatar upload not working"
git commit -m "Fix dark mode toggle"

# Updates
git commit -m "Update README with deployment guide"
git commit -m "Update dependencies to latest versions"
git commit -m "Improve chat UI responsiveness"

# Refactor
git commit -m "Refactor message controller for better performance"
git commit -m "Clean up unused components"
```

---

## 🌿 Working with Branches

### Create New Branch
```bash
git checkout -b feature/new-feature
```

### Switch to Branch
```bash
git checkout main
git checkout feature/new-feature
```

### Merge Branch to Main
```bash
git checkout main
git merge feature/new-feature
git push
```

### Delete Branch
```bash
git branch -d feature/new-feature
```

---

## 🔍 View Information

### View Commit History
```bash
git log --oneline
```

### View Changes
```bash
git diff
```

### View Remote URL
```bash
git remote -v
```

---

## ⚡ Quick Fixes

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo All Local Changes
```bash
git reset --hard HEAD
```

### Pull Latest from GitHub
```bash
git pull origin main
```

### Update from GitHub (if conflicts)
```bash
git fetch origin
git merge origin/main
```

---

## 🚨 Emergency Commands

### Remove File from Git (Keep Local)
```bash
git rm --cached filename
```

### Remove Folder from Git (Keep Local)
```bash
git rm -r --cached foldername
```

### Fix "Already Exists" Error
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/ChatGo.git
```

---

## 📋 Complete Example Workflow

### Scenario: You added a new feature

```bash
# 1. Check what changed
git status

# 2. Add all changes
git add .

# 3. Commit with descriptive message
git commit -m "Add status feature with online/offline indicators"

# 4. Push to GitHub
git push

# Done! ✅
```

---

## 🎯 Common Scenarios

### Scenario 1: Start Working on New Feature
```bash
git checkout -b feature/group-chat
# ... make changes ...
git add .
git commit -m "Add group chat functionality"
git push -u origin feature/group-chat
```

### Scenario 2: Fix a Bug
```bash
git checkout -b fix/message-bug
# ... fix the bug ...
git add .
git commit -m "Fix message not sending issue"
git push -u origin fix/message-bug
```

### Scenario 3: Update Documentation
```bash
git add README.md
git commit -m "Update README with new features"
git push
```

### Scenario 4: Multiple Small Changes
```bash
# Change 1
git add .
git commit -m "Update chat UI colors"

# Change 2
git add .
git commit -m "Add loading spinner"

# Change 3
git add .
git commit -m "Fix typos in comments"

# Push all at once
git push
```

---

## 🔐 Security Checklist

Before every push:
```bash
# 1. Check status
git status

# 2. Make sure these are NOT listed:
#    ❌ backend/.env
#    ❌ frontend/.env
#    ❌ node_modules/

# 3. If .env is listed, remove it:
git rm --cached backend/.env
git rm --cached frontend/.env

# 4. Then commit and push
git add .
git commit -m "Remove .env from tracking"
git push
```

---

## 💡 Pro Tips

1. **Commit Often**: Small, frequent commits are better than large ones
2. **Clear Messages**: Future you will thank you
3. **Pull Before Push**: Always pull latest changes first
4. **Use Branches**: Keep main branch stable
5. **Review Changes**: Use `git status` and `git diff` before committing

---

## 🎓 Git Workflow Diagram

```
Working Directory → Staging Area → Local Repository → GitHub
     (edit)      →   (git add)   →  (git commit)   → (git push)
```

---

## 📞 Quick Help

### Forgot to add a file?
```bash
git add forgotten-file.js
git commit --amend --no-edit
git push --force
```

### Wrong commit message?
```bash
git commit --amend -m "Correct message"
git push --force
```

### Need to go back?
```bash
git log --oneline  # Find commit hash
git checkout abc123  # Replace abc123 with hash
```

---

**Keep this file handy for quick reference! 🚀**
