# K-18. Directory Traversal

## Запуск

```bash
cd k-18.directory-traversal
npm install
node server.js
```

В папке `files/` лежит `non-secret.txt`. В корне проекта — `secret.txt`, который сервер отдавать не должен.

## Эндпоинты

`**GET /file/unsafe?name=...**` — уязвимый. Путь из запроса напрямую склеивается с базовой директорией:

```js
const filePath = path.join(FILES_DIR, req.query.name);
```

`**GET /file/safe?name=...**` — защищённый. После резолва путь проверяется — он должен начинаться с `FILES_DIR`:

```js
const filePath = path.resolve(FILES_DIR, req.query.name);
if (!filePath.startsWith(FILES_DIR + path.sep)) return res.status(403)...
```

## Демо

Легитимный запрос:

```bash
curl -s "http://localhost:3000/file/unsafe?name=non-secret.txt" | jq
```

```
{
  "ok": true,
  "content": "non-secret info"
}
```

Выход за пределы директории через `/file/unsafe`:

```bash
curl -s "http://localhost:3000/file/unsafe?name=../secret.txt" | jq
```

```
{
  "ok": true,
  "content": "secret info"
}
```

`path.join` не убирает `../` — сервер читает файл за пределами `files/`.

> В реальной атаке вместо `../secret.txt` можно запросить любой системный файл, например `../../etc/passwd` или `../../~/.ssh/id_rsa` — всё, до чего есть доступ у процесса Node.js.

Тот же запрос через `/file/safe` — получаем 403:

```bash
curl -s "http://localhost:3000/file/safe?name=../secret.txt" | jq
```

```
{
  "ok": false,
  "error": "Access denied"
}
```

`path.resolve` возвращает абсолютный путь, и проверка `startsWith(FILES_DIR)` его отсекает.