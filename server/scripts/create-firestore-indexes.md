# Firestore Indexes Required for Exercise Queries

The following composite indexes need to be created in Firebase Console for the exercise API to work fully.

## Required Indexes

### 1. Alternatives Query (target + name)
**Used by:** `GET /api/exercises/:id/alternatives`

```
Collection: exercises
Fields:
  - target (Ascending)
  - name (Ascending)
```

**Direct creation link:**
https://console.firebase.google.com/v1/r/project/iron-ai-trainer/firestore/indexes?create_composite=ClFwcm9qZWN0cy9pcm9uLWFpLXRyYWluZXIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2V4ZXJjaXNlcy9pbmRleGVzL18QARoKCgZ0YXJnZXQQARoICgRuYW1lEAEaDAoIX19uYW1lX18QAQ

### 2. Body Part Filter Query (bodyPart + name)
**Used by:** `GET /api/exercises/by-body-part/:part`

```
Collection: exercises
Fields:
  - bodyPart (Ascending)
  - name (Ascending)
```

### 3. Equipment Filter Query (equipment + name)
**Used by:** `GET /api/exercises?equipment=...`

```
Collection: exercises
Fields:
  - equipment (Ascending)
  - name (Ascending)
```

## How to Create Indexes

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (iron-ai-trainer)
3. Navigate to Firestore Database → Indexes
4. Click "Add Index" for each required index above
5. OR click the direct creation link provided above to auto-create

## Alternative: Auto-Create via Query Errors

You can also trigger the queries that need indexes and follow the error links:

```bash
# This will fail but show the index creation link in server logs
curl http://localhost:5000/api/exercises/Barbell_Squat/alternatives
```

Check server logs for the index creation URL.




