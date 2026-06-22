# 🔄 Zen Dictation Machine v1.1 - Changes Log

## ✅ Fixed Issues

### 1. **Navigation Button Symbol** ✓
- **Before:** `?` (question mark)
- **After:** `→` (forward arrow)
- **File:** `dictation.html`

### 2. **Student Randomizer System** ✓
- **Group 1:** Students 1-15 (used on words 1, 3, 5, 7...)
- **Group 2:** Students 16-33 (used on words 2, 4, 6, 8...)
- **Alternation:** Automatic based on word number
- **No Duplicates:** Each student called maximum once per dictation
- **Reroll:** Reuses remaining students from the current group

**Example:**
```
Word 1 → Random student from 1-15
Word 2 → Random student from 16-33
Word 3 → Random student from 1-15
Word 4 → Random student from 16-33
...
```

## 📝 Technical Changes in app.js

### Before:
```javascript
let studentsPool = [];

function initStudents() {
    studentsPool = Array.from({length: 33}, (_, i) => i + 1);
}
```

### After:
```javascript
let group1 = []; // 1-15
let group2 = []; // 16-33

function initStudents() {
    group1 = Array.from({length: 15}, (_, i) => i + 1);
    group2 = Array.from({length: 18}, (_, i) => i + 16);
}

function getStudentPool() {
    return currentWordIndex % 2 === 0 ? group1 : group2;
}
```

## 🎮 How It Works

1. **On Load:** Both groups are initialized fully
2. **During Dictation:**
   - On odd words (1, 3, 5...) → students from group 1
   - On even words (2, 4, 6...) → students from group 2
3. **After Confirmation:** Student is removed from their group
4. **Reroll:** Reuses remaining students from current group
5. **If Group Empty:** Automatically restores before next word

## 🔄 Backward Compatibility
✓ All other features work as before
✓ Dictation phase unchanged
✓ Checking phase unchanged
✓ UI completely identical

---

**Version:** 1.1  
**Date:** 2026-06-22

