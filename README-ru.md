<style>
img[alt=OnePlace] {
  width: 50%;
  display: block;
  margin: 50px auto;
  border: none;
  background: none;
}
</style>
![OnePlace](/client/static/img/logo.svg)

OnePlace - это web-приложение для взаимодействия с блокчейнами [Steem](https://github.com/steemit/steem) и [Golos](https://github.com/GolosChain/golos). В качестве основы были использованы такие технологии как [Vue](https://vuejs.org) с [SSR](https://ssr.vuejs.org/ru/) модулем для клиентской части проекта и [LoopBack](https://loopback.io/) для реализации серверной составляющей.

## Установка

#### Клонирование репозитория и установка npm модулей

```bash
git clone git@github.com:OnePlace-media/oneplace.git
cd oneplace && npm i
```

#### Установка зависимостей
Данная инструкция ориентирована на пользоватлей linux с debian дистрибутивами.

##### NodeJS
Установите NodeJS, мы рекомендуем использовать [**LTS version**](https://nodejs.org/en/) и [**nvm**](https://github.com/creationix/nvm) для установки:

```bash
nvm install 8.9.4
nvm use 8.9.4
```

OnePlace является комплексным решением и имеет дополнительный функционал над обоими блокчейнами. Вам необходимо установить базы данных [mysql](https://www.mysql.com/) и [redis](https://redis.io/download). Используйте [Docker Compose](https://docs.docker.com/compose/) с нашим [docker-compose.yml](./docker-compose.yml) или установите в ручном режиме:

##### MySQL
```bash
sudo apt-get update
sudo apt-get install mysql-server
```

В данном репозитории присутствует sql-скрипт для инициализации структуры БД. Используйте его для быстрого старта:
```bash
# Вставка sql-скрипта в mysql
mysql -u root < ./server/data/mysql/mysql-init.sql
# Логин Mysql
mysql -u root
# Создаем нового пользователя
CREATE USER 'oneplace'@'localhost' IDENTIFIED BY 'password';
# Настройка привилегий
GRANT ALL PRIVILEGES ON oneplace.* TO 'oneplace'@'localhost'
```

Вы так же можете использовать [MySql WorkBench](https://www.mysql.com/products/workbench/) с нашим [model файлом](./server/data/mysql/wb-model.mwb) для расширения sql-схемы.

##### Redis

```bash
sudo apt-get install redis
```

#### Конфигурация

После установки сконфигурируйте redis-server для работы в качестве демона на локальном порту, для этого в стандартный конфиг (например, /etc/redis/redis.conf) внесите следующие изменения:

```bash
daemonise yes
bind 127.0.0.1
port 6379
```

После установки зависимостей необходимо создать конфигурационные файлы из шаблонов:

```bash
cd server
# Главный config
cp config.sample.json config.json
# Параметры к источникам данных (mysql, redis и т.д.)
cp datasources.sample.json datasources.json
```

##### config.json
```json
{
  ...,
  "postingWrapper": {
    "steemDomain": "URL до ноды STEEM с HTTP JSON-RPC протоколом",
    "golosDomain": "URL до ноды GOLOS с HTTP JSON-RPC протоколом",
    "WIF": "Приватный постинг ключ аккаунта приложения в блокчейнах STEEM и GOLOS",
    "username": "Имя аккаунта приложения в блокчейнах STEEM и GOLOS (без @)"
  }
}
```

#### Сборка и запуск
Мы приготовили несколько команд для быстрой сборки и запуска всех сервисов. Для начала необходимо собрать рабочую версию клиента с готовым конфигом:
```bash
# Сборка фронт части проекта
npm run build
```
Для запуска демонов мы рекомендуем использовать [PM2](http://pm2.keymetrics.io/). Подробнее в [process.json](./process.json).

```bash
pm2 start process.json

# запуск мониторинг pm2
pm2 monit
```

Но вы можете осуществить запуск вручную.

##### Запуск в ручном режиме

```bash
# Запуск LoopBack-API сервера
npm start

# Запуск VueSSR сервера
npm run client
```
Подробнее см. [package.json](./package.json).

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
## В ближайшем будущем
- Запуск демонов в кластере и soft рестарт с нулевым простоем
- Полное покрытие Unit тестами (frontend) и BDD (API) тестами с Karma, Mocha и PhantomJS
- Непрерывная интеграция и автоматический деплой
- Git flow и релизы с change log
- Полная документация

## Вопросы

Чтобы сообщить о некритической проблеме, создайте issue в этом репозитории.

Если вы обнаружили проблему с безопасностью, пожалуйста, отправьте подробное описание на: [oneplace83@gmail.com](mailto:oneplace83@gmail.com)

Мы оценим риск и сделаем патч до возникновения проблемы.
