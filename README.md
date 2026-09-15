# NeuroHub — Telegram Mini App

Готовый фронтенд Mini App: главное меню, каталог нейросетей, чат и прокрутка секций.

## Что внутри

- `index.html` — разметка
- `css/style.css` — тёмная тема, snap-scroll, карточки
- `js/app.js` — меню, фильтры, демо-чат, Telegram WebApp SDK

Ответы нейросетей сейчас демо. Живые модели подключаются через ваш backend (OpenRouter и т.д.).

## Залить на Vercel

1. Создайте репозиторий на GitHub и положите туда эти три папки/файла.
2. Vercel → **Import Project** → этот репозиторий.
3. Framework: Other. Output не нужен — это статика.
4. После деплоя скопируйте `https://....vercel.app`
5. @BotFather → `/newapp` → вставьте этот URL.

## Локально

Откройте `index.html` в браузере. В Telegram тема и имя пользователя появятся только внутри Mini App.
