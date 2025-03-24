# test-avangard

Тестовое задание: [./TASK.md](./TASK.md)

## Установка

### Предварительные зависимости

- [poetry](https://python-poetry.org/docs/#installing-with-the-official-installer)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [docker](https://docs.docker.com/engine/install/)

```bash

# 1. Клонируем репозиторий
git clone https://github.com/LorinLex/test-avangard.git
cd test-avangard

# 2. Устанавливаем зависимости API
cd backend
poetry install

# 3. Устанавливаем зависимости веб-приложения
cd ../frontend
npm i

```

## Запуск

*. Для работы API требуется поднятая БД postgres. В папке `docker` конфигурация для поднятия локальной базы. Об этом чуть ниже.

1. Переменные окружения (`.env`)

    В корне проекта есть шаблон переменных `.env.example`. Создайте в корне проекта на его основе файл `.env` и заполните поля. Пример:

    ```env

    SECRET_KEY=very_secret_key
    PROJECT_NAME=test-avangard
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER=admin
    POSTGRES_PASSWORD=admin
    POSTGRES_DB=test-avangard

    ```

2. База данных в докере

    * Если поднята своя БД - пропустите этот шаг

    База данных конфигурируется из `.env`

    ```bash

    # из корня проекта
    docker-compose -f docker/docker-compose.local.yaml up -d

    ```

3. Запускаем API

    ```bash

    cd backend

    # Проводим миграции
    alembic upgrade head

    # Запускаем
    uvicorn src.app:app

    ```

4. Запускаем веб-приложение

    В новом терминале:

    ```bash

    cd frontend
    npm run dev

    ```
