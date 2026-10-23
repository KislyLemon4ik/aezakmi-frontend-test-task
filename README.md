# Aezakmi Group — тестовое задание Frontend

SPA на **React + TypeScript + Vite** по макету Figma: логин, таблица курсов валют с графиком динамики и форма канбан-карточки с превью.

## Стек

- React 19 + TypeScript
- Vite
- React Router
- React Hook Form

## Функциональность

### 1. Логин
- Mock-авторизация (без бэкенда)
- Валидация email / пароля с отображением ошибок
- Сессия в `localStorage`
- Защита роутов: без входа доступна только `/login`
- Logout в сайдбаре

### 2. Курсы валют
- Актуальные курсы из открытого API (база: USD)
- Таблица с флагами валют
- Клик по строке открывает панель динамики относительно USD
- Периоды: `1W`, `1M`, `3M`, `6M`, `1Y`
- SVG-график на основе исторических данных API
- Состояния loading и error с кнопкой повтора

### 3. Канбан-карточки
- Создание / редактирование формы на `react-hook-form`
- Обязательные поля: Title, Description, Priority
- Теги (слово + пробел), картинки через drag-and-drop или выбор файла
- При отправке — `alert` с данными формы (имитация бэкенда)
- Превью карточки, список карточек, редактирование

## Запуск

Нужен **Node.js 18+** (лучше 20 или 22).

```bash
npm install
npm run dev
```

Открой адрес из терминала (обычно `http://127.0.0.1:5173`).

Другие команды:

```bash
npm run build    # production-сборка
npm run preview  # локальный просмотр сборки
npm run lint     # ESLint
```

## Демо-вход

Любой валидный email и пароль от 6 символов, например:

- Email: `test@mail.com`
- Password: `123456`

## Используемые API

### Курсы валют — [Frankfurter](https://www.frankfurter.app/)

Открытый API, ключ не нужен.

- Актуальные курсы: `https://api.frankfurter.dev/v1/latest?from=USD&to=AUD,BGN,...`
- История для графика: `https://api.frankfurter.dev/v1/{start}..{end}?from=USD&to={CODE}`

**Важно:** открытый API отдаёт один рыночный курс на валюту.  
Колонки таблицы:

- **Course** — курс из API
- **Surrender** — Course × 1.02
- **Buy** — Course × 0.98
- **Change** в таблице зарезервирован; процент изменения за выбранный период показывается в правой панели динамики

### Флаги — [Flagcdn](https://flagcdn.com/)

Картинки флагов по коду страны/региона, например:

`https://flagcdn.com/24x18/eu.png`

## Структура проекта

```text
src/
  api/           # Frankfurter + флаги
  components/    # Layout, Sidebar, график, protected route
  context/       # Auth + Cards
  pages/         # Login, Currencies, Kanban
  types/         # TypeScript-типы
```

## Автор

Глеб Кулешевский  
Frontend-тестовое задание для Aezakmi Group
