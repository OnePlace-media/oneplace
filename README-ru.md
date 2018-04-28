# ![OnePlace](/client/static/img/logo_hub.png)

Oneplace - это web-приложение для взаимодействия с блокчейнами [Steem](https://github.com/steemit/steem) и [Golos](https://github.com/GolosChain/golos). В качестве основы были использованы такие технологии как [Vue](https://vuejs.org) с [SSR](https://ssr.vuejs.org/ru/) модулем для клиентской части проекта и [LoopBack](https://loopback.io/) для реализации серверной составляющей. Детально цели проекта описаны в [документе WhitePaper](./client/static/whitepaper_ru.pdf).

## Начало работы

Данная инструкция ориентирована на пользоватлей linux с debian дистрибутивами. Для запуска приложения потребуется установить следующие зависимости:

### NodeJS

Установите NodeJS, мы рекомендуем использовать [**LTS version**](https://nodejs.org/en/) и [**nvm**](https://github.com/creationix/nvm) для установки:

```bash
nvm install 8.9.4
nvm use 8.9.4
```

### Базы данных

OnePlace является комплексным решением и имеет дополнительный функционал над обоими блокчейнами, приложение имеет собственные хранилища. Вам необходимо установить базы данных [mysql](https://www.mysql.com/) и [redis](https://redis.io/download). Используйте [Docker Compose](https://docs.docker.com/compose/) с нашим [docker-compose.yml](./docker-compose.yml) или установите в ручном режиме, следуя интсрукции по [ссылке](./docs/ru/install-db.md). При использовании docker-compose данные будут сохранятся в директорию: **./server/data/docker/{DB_NAME}>**

```bash
docker-compose up -d
```

## Установка

### 1. Склонируйте репозиторий с github

```bash
git clone git@github.com:OnePlace-media/oneplace.git && cd oneplace
```

### 2. Установите npm зависимости

```bash
npm install
```

### 3. Создайте файлы конфигрураций

Скопируйте 2 файла json из готовых шаблонов:

```bash
cd server

# Главный config
cp ./server/config.sample.json ./server/config.json

# Параметры к источникам данных (mysql, redis, email)
cp ./server/datasources.sample.json ./serverdatasources.json
```

#### ./server/config.json

Более подробную информацию о config.json можно получить в официальной [документации к LoopBack](https://loopback.io/doc/en/lb3/config.json.html). Ниже описаны поля относящиеся непосредсвтенно к oneplace

```json
{
  ...,
  "postingWrapper": {
    "steemDomain": "URL ноды STEEM с HTTP JSON-RPC протоколом",
    "golosDomain": "URL ноды GOLOS с HTTP JSON-RPC протоколом",
    "WIF": "Приватный постинг ключ аккаунта приложения в блокчейнах STEEM и GOLOS",
    "username": "Имя аккаунта приложения в блокчейнах STEEM и GOLOS (без @)"
  }
}
```

#### ./server/datasources.json

Более подробную информацию о datasources.json можно получить в официальной [документации к LoopBack](https://loopback.io/doc/en/lb3/Defining-data-sources.html). В случае использования docker-compose достаточно прописать параметры SMTP для в секции **email**.

```json
{
  ...,
  "email": {
    "name": "email",
    "connector": "mail",
    "transports": [
      {
        "type": "SMTP",
        "host": "...",
        "secure": true,
        "port": 465,
        "auth": {
          "user": "...",
          "pass": "..."
        }
      }
    ]
  }
}
```

## Сборка и запуск

Мы приготовили несколько команд для быстрой сборки и запуска всех сервисов. Если вы проделали все шаги по установки, можете приступать к сборке и запуску процессов: 

### Сборка VUE клиента

Для начала необходимо собрать рабочую версию клиента для этого используется [webpack](https://webpack.js.org/):

```bash
# Сборка фронт части проекта
npm run build
```

### Запуск node.js процессов

Oneplace состоит из нескольких node.js приложений:

* VUE-SSR server - серверный рендер front части проекта
* LoopBack server - REST API для получения данных из БЧ и доп функционала
* CacheUpdater daemon - демон, кеширующий топовые посты по тэгам в базе redis, для быстрого формирования трендовых списков.

#### Режим разработки

```bash
# Запуск LoopBack-API сервера
npm start

# Запуск VueSSR сервера в режиме наблюдения изменений
npm run client:dev
```

#### Режим боевой

Для запуска демонов мы рекомендуем использовать [PM2](http://pm2.keymetrics.io/). Для этого существует готовый [process.json](./process.json):

```bash
pm2 start process.json

# запуск мониторинг pm2
pm2 monit
```

Описание остальных скриптов NPM можно найти в [package.json](./package.json).

## После установки

На данный момент проект не является монолитным приложением, с помощью nginx вы легко можете объединить интерфейсы VUE с loopback, простой пример:

```nginx
location /api {
  proxy_pass http://127.0.0.1:3001;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Real-IP $remote_addr;
}
location ~* ^/(dist|static) {
  root /var/www/oneplace/data/www/oneplace.media/client;
  expires 7d;
}
location / {
  proxy_pass http://127.0.0.1:3000;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Real-IP $remote_addr;
}
```

## Тесты

Для тестов необходимо запустить тестовые базы данных, это можно сделать через специальные [docker-compose.yml](./server/test/docker-compose.yml). [config.test.json](./server/config.test.json) уже присутсвуют в репозитории:

```bash
docker-compose -f ./server/test/docker-compose.yml up -d
```

Запуск тестов:

```bash

# Тесты API
npm run test:api

# Тесты frontend чаcти
npm run test:client

# Все тесты по очереди
npm run test

```

## Вопросы

Чтобы сообщить о некритической проблеме, создайте issue в этом репозитории.

Если вы обнаружили проблему с безопасностью, пожалуйста, отправьте подробное описание на: [oneplace83@gmail.com](mailto:oneplace83@gmail.com)

Мы оценим риск и сделаем патч до возникновения проблемы.
