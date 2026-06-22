# 📊 Student Distribution in Zen Dictation Machine

## Visual Schema

```
DICTATION PHASE
┌─────────────────────────────────────────────────────────────┐
│ Word 1     Word 2     Word 3     Word 4     Word 5    ...   │
├─────────────────────────────────────────────────────────────┤
│ Group 1    Group 2    Group 1    Group 2    Group 1    ...   │
│ (1-15)     (16-33)    (1-15)     (16-33)    (1-15)    ...   │
└─────────────────────────────────────────────────────────────┘

CHECKING PHASE
Student from current group writes the word
├─ Click Reroll → another student from SAME group
├─ Confirm → student REMOVED from group
└─ Move to next word → switches to OTHER group
```

## Example Dictation with 5 Words

```
┌─────────────────────────────────────────────────────────────┐
│ WORD 1                                                      │
├─────────────────────────────────────────────────────────────┤
│ Group 1: [1,2,3...15]                                      │
│ Selected student: 7 ✓                                      │
│ Student 7 removed → Group 1: [1,2,3...6,8...15]           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ WORD 2                                                      │
├─────────────────────────────────────────────────────────────┤
│ Group 2: [16,17,18...33]                                   │
│ Selected student: 23 ✓                                     │
│ Student 23 removed → Group 2: [16,17...22,24...33]        │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ WORD 3                                                      │
├─────────────────────────────────────────────────────────────┤
│ Group 1: [1,2,3...6,8...15] ← (7 already wrote)           │
│ Selected student: 12 ✓                                     │
│ Student 12 removed → Group 1: [1,2,3...6,8...11,13...15] │
└─────────────────────────────────────────────────────────────┘
```

## System Advantages

✅ **Fairness:** Each student called maximum once per dictation  
✅ **Alternation:** Different class groups alternate  
✅ **Flexibility:** Reroll allows reusing remaining students  
✅ **Simplicity:** No manual configuration needed, all automatic  

## What Happens When Pools Are Exhausted?

If all students from a group have already written:

**Word N (even):**
- Group 2 is empty → **automatically restored**
- Becomes: [16, 17, 18... 33]
- Selection starts fresh

Perfect for long dictations (20+ words)

