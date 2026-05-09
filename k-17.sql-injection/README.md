# K-17. SQL Injection

## Запуск

```bash
cd k-17.sql-injection
npm install
node server.js
```

## Эндпоинты

`**POST /login/unsafe**` — уязвимый. Входные данные вставляются напрямую в строку запроса:

```js
`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
```

`**POST /login/safe**` — защищённый. Используются параметризованные запросы:

```js
db.prepare(`SELECT * FROM users WHERE username = ? AND password = ?`).get(username, password)
```

## Демо

Обычный логин:

```bash
curl -s -X POST http://localhost:3000/login/unsafe \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"hunter2"}' | jq
```

```
{
  "ok": true,
  "user": {
    "id": 1,
    "username": "alice",
    "password": "hunter2",
    "role": "user"
  }
}
```

Инъекция через `/login/unsafe` — комментируем проверку пароля:

```bash
curl -s -X POST http://localhost:3000/login/unsafe \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"' OR '1'='1' --\",\"password\":\"x\"}" | jq
```

Запрос превращается в:

```sql
SELECT * FROM users WHERE username = '' OR '1'='1' --' AND password = 'x'
```

```
{
  "ok": true,
  "user": {
    "id": 1,
    "username": "alice",
    "password": "hunter2",
    "role": "user"
  }
}
```

Тот же payload через `/login/safe` — не работает, строка воспринимается буквально:

```bash
curl -s -X POST http://localhost:3000/login/safe \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"' OR '1'='1' --\",\"password\":\"x\"}" | jq
```

```
{
  "ok": false,
  "error": "Invalid creds"
}
```

