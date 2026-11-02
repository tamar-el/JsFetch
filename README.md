# תרגיל 6 - 10 תרגילי JavaScript עם fetch (Promises, async/await) 🌟

עשרה תרגילים קצרים שבהם מביאים נתונים מ-API ציבורי עם `fetch`, ומשרשרים בקשות אחת אחרי השנייה.

בכל תרגיל:
- ✅ הפונקציה **מחזירה Promise**. פונקציית `async` עושה את זה לבד.
- ✅ מציגים את התוצאה עם `console.log`.
- ✅ אפשר לכתוב עם `async`/`await` + `try`/`catch` (**מומלץ**), או עם `.then()` / `.catch()`. שתי הדרכים מתקבלות.

ה-API: [https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com) - מחזיר JSON לבדיקות.

### שתי הדרכים, אותה תוצאה

```js
// async/await + try/catch (מומלץ)
async function getUser(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const user = await response.json();
    console.log(`User's name: ${user.name}`);
  } catch (error) {
    console.log("Something went wrong:", error.message);
  }
}

// .then() / .catch()
function getUser(userId) {
  return fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then((response) => response.json())
    .then((user) => console.log(`User's name: ${user.name}`))
    .catch((error) => console.log("Something went wrong:", error.message));
}
```

## איך מתחילים

1. לוחצים למעלה על **Use this template** ← **Create a new repository**, ויוצרים ריפו משלכן.
2. עושים `git clone` לריפו החדש ופותחים אותו ב-VS Code.
3. בטרמינל מריצים פעם אחת: `npm install` (צריך Node בגרסה 20 ומעלה. בודקים עם `node -v`).
4. כותבים את הקוד בקבצים `ex1.js` עד `ex10.js`, בתוך הפונקציה שכבר מוכנה בכל קובץ. מותר להוסיף לה `async` לפני `function`. אל תשנו את שם הפונקציה ואת שורת ה-`module.exports`.

### איך מנסים את הקוד מול ה-API האמיתי

בקובץ `main.js` יש קריאה לכל פונקציה. מורידים את ה-`//` מהשורה של התרגיל ומריצים:

```bash
node main.js
```

(צריך חיבור לאינטרנט.)

## איך בודקים

```bash
npm test
```

- בהתחלה כל הטסטים אדומים (✘). כל טסט מתחיל במספר התרגיל שהוא בודק.
- הטסטים **לא** פונים לאינטרנט: הם מחליפים את `fetch` בשרת מדומה שעונה כמו jsonplaceholder, ובודקים מה הדפסתן ואילו כתובות ביקשתן. בחלק מהבדיקות המספרים שונים מהאתר האמיתי (למשל, למשתמש 5 יש 12 משימות), כדי לוודא שהקוד סופר באמת ולא כותב תשובה קבועה.
- מתחת לכל טסט שנכשל כתוב מה לא עבד, ואחריו מה הקוד שלכן הדפיס בפועל (`printed`) ואילו כתובות הוא ביקש (`fetched`).
- כשכל הטסטים ירוקים (✔) מופיעה ההודעה **✅ המשימה אושרה** ואפשר לעבור למשימה הבאה.
- אחרי `git push` הטסטים רצים גם ב-GitHub (לשונית Actions). וי ירוק ליד ה-commit = המשימה אושרה.
- מריצים טסט של תרגיל אחד בלבד: `node --test test/ex4.test.js`

> אל תשנו את הקבצים בתיקייה `test/`.

### מה הטסטים בודקים בכל תרגיל

- שההודעה מודפסת **בדיוק** כמו בדוגמה (אותן מילים, אותם רווחים).
- שהקוד עובד גם עם מספר (id) אחר, ולא רק עם הדוגמה.
- שהפונקציה מחזירה Promise, ושכשה-Promise הזה מסתיים ההודעה כבר הודפסה. עם `async`/`await`: עושים `await` לכל `fetch` ולכל `.json()`. עם `.then()`: מחזירים את כל השרשרת (`return fetch(...).then(...).then(...)`), ולא רק `return fetch(...)`.

## התרגילים

| # | קובץ | פונקציה | נושא |
|---|---|---|---|
| 1 | `ex1.js` | `getUser(userId)` | שם של משתמש |
| 2 | `ex2.js` | `getPost(postId)` | כותרת של פוסט |
| 3 | `ex3.js` | `getUserEmail(userId)` | אימייל של משתמש |
| 4 | `ex4.js` | `listUserTodos(userId)` | כמה משימות יש למשתמש |
| 5 | `ex5.js` | `checkPostExists(postId)` | האם הפוסט קיים (טיפול בשגיאות) |
| 6 | `ex6.js` | `fetchWithDelay(url, delay)` | השהיה ואז fetch |
| 7 | `ex7.js` | `showKeys(url)` | המפתחות של אובייקט JSON |
| 8 | `ex8.js` | `getUserFirstPost(userId)` | משתמש ← הפוסט הראשון שלו |
| 9 | `ex9.js` | `getPostCommentsCount(postId)` | פוסט ← מספר התגובות |
| 10 | `ex10.js` | `todoAndUser(todoId)` | משימה ← המשתמש שלה ← שניהם |

## 🟢 תרגילים 1-7: fetch בסיסי

### תרגיל 1: נתוני משתמש
יוצרים `getUser(userId)`.
- עושים fetch ל-`https://jsonplaceholder.typicode.com/users/<userId>`
- מחזירים Promise
- מציגים את שם המשתמש

✅ פלט לדוגמה:
```
User's name: Leanne Graham
```

### תרגיל 2: פרטי פוסט
יוצרים `getPost(postId)`.
- עושים fetch ל-`https://jsonplaceholder.typicode.com/posts/<postId>`
- מציגים `"Post title: <title>"`

✅ פלט לדוגמה:
```
Post title: sunt aut facere repellat provident occaecati excepturi optio reprehenderit
```

### תרגיל 3: האימייל של המשתמש
יוצרים `getUserEmail(userId)`.
- מביאים את המשתמש לפי ה-ID
- מדפיסים `"User's email: <email>"`

✅ פלט לדוגמה:
```
User's email: Sincere@april.biz
```

### תרגיל 4: כל המשימות של משתמש
יוצרים `listUserTodos(userId)`.
- מביאים את המשימות: `https://jsonplaceholder.typicode.com/todos?userId=<userId>`
- מציגים כמה משימות יש למשתמש

✅ פלט לדוגמה:
```
User 3 has 20 todos
```

### תרגיל 5: האם הפוסט קיים (טיפול בשגיאות)
יוצרים `checkPostExists(postId)`.
- מביאים את הפוסט לפי ה-ID
- אם נמצא, מציגים `"Post exists"`
- אם יש שגיאה, מציגים `"Post not found"` (עם `try`/`catch`, או עם `.catch`)

✅ פלט לדוגמה:
```
Post exists
```
או:
```
Post not found
```

> **שימו לב:** `fetch` **לא** נכשל כשהשרת עונה 404 (למשל `posts/9999`). הוא נכשל רק כשאין רשת. לכן בודקים את `response.ok`, ואם הוא `false` זורקים שגיאה בעצמכן (`throw new Error(...)`), כך שה-`catch` יתפוס אותה. הטסטים בודקים גם פוסט שלא קיים וגם תקלת רשת.

### תרגיל 6: השהיה ואז fetch
יוצרים `fetchWithDelay(url, delay)`.
- מחכים `delay` מילישניות
- ואז עושים fetch לכתובת
- מציגים את 50 התווים הראשונים של התשובה

✅ פלט לדוגמה:
```
First 50 chars: { "userId": 1, "id": 1, "title": "sunt aut...
```

רמז: כדי לחכות, עוטפים את `setTimeout` ב-`new Promise(...)` ועושים לו `await` (או משרשרים אחריו `.then`). את התשובה אפשר לקרוא כטקסט עם `response.text()` ולחתוך עם `.slice(0, 50)`.
(התשובה של jsonplaceholder כתובה בכמה שורות, ולכן גם הפלט שלכן יתפרס על כמה שורות - זה בסדר. גם `JSON.stringify(data).slice(0, 50)` מתקבל.)

### תרגיל 7: המפתחות של JSON
יוצרים `showKeys(url)`.
- מביאים נתוני JSON
- מציגים את כל המפתחות של האובייקט העליון

✅ פלט לדוגמה:
```
Keys: [ 'userId', 'id', 'title', 'completed' ]
```

רמז: `Object.keys(...)`. הפלט בדוגמה הוא מה ש-`console.log("Keys:", keys)` מדפיס.

## 🟡 תרגילים 8-10: fetch משורשר

בתרגילים האלה עושים fetch אחד, ורק כשהתשובה שלו מגיעה עושים fetch שני. עם `async`/`await` פשוט כותבים את ה-`await` השני בשורה שאחרי הראשון. עם `.then()` עושים `return` ל-fetch השני מתוך ה-`.then()`, כדי שהשרשרת תחכה לו.

### תרגיל 8: משתמש, ואז הפוסט הראשון שלו
יוצרים `getUserFirstPost(userId)`.
- שלב 1: מביאים את המשתמש לפי ה-ID
- שלב 2: מביאים את הפוסטים של אותו משתמש (`posts?userId=<id>`)
- שלב 3: מציגים את הכותרת של הפוסט הראשון

✅ פלט לדוגמה:
```
First post title: sunt aut facere repellat provident occaecati excepturi optio reprehenderit
```

### תרגיל 9: פוסט, ואז מספר התגובות
יוצרים `getPostCommentsCount(postId)`.
- שלב 1: מביאים את הפוסט לפי ה-ID
- שלב 2: מביאים את התגובות של הפוסט (`posts/<id>/comments` או `comments?postId=<id>`)
- מציגים: `"Post has <N> comments"`

✅ פלט לדוגמה:
```
Post has 5 comments
```

### תרגיל 10: משימה ← משתמש ← שניהם
יוצרים `todoAndUser(todoId)`.
- שלב 1: מביאים את המשימה (todo) לפי ה-ID
- שלב 2: לוקחים מהמשימה את ה-`userId`
- שלב 3: מביאים את המשתמש לפי ה-`userId`

מציגים:
```
Todo title: delectus aut autem
User name: Leanne Graham
```

רמז: את ה-`userId` לוקחים מהמשימה שהגיעה, לא מה-`todoId` (משימה 21, למשל, שייכת למשתמש 2).
