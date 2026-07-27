# 3205.front

Фронтенд для проверки URL: создание заданий, список jobs, детали и отмена активного задания.

## Требования

- Node.js 20+
- Запущенный бэкенд (по умолчанию `http://localhost:3000`)

## Локальный запуск

```bash
npm ci
cp .env.template .env
npm run dev
```

Приложение: http://localhost:5173

## Docker

```bash
docker compose up --build
```

Фронт: http://localhost:5173

В `docker-compose.yml` задан `VITE_API_URL=http://localhost:3000` — запросы идут из браузера на хост, бэкенд должен быть доступен на этом адресе.

## API (бэкенд)

### `POST /api/jobs` - создать задание на проверку URL.

Тело запроса:

```json
{
  "urls": [
    "https://example.com",
    "https://another.com"
  ]
}
```

### `GET` `/api/jobs` - получить список всех заданий с краткой информацией.
### `GET` `/api/jobs/:id` - получить детальную информация по джобе и результаты по каждому URL.
### `DELETE` `/api/jobs/:id` - отменить задание.

## Структура проекта

```
src/
  api/jobs.ts              # запросы к API
  components/
    CreateJobForm.tsx      # форма создания задания
    JobsList.tsx           # список jobs
    ActiveJobDetails.tsx   # детали и polling
  store/jobStore.ts        # activeJobId, refreshToken
  App.tsx
```
