# Установка баз данных

## MySQL

```bash
sudo apt-get update
sudo apt-get install mysql-server
```

В данном репозитории присутствует [sql-скрипт](../../server/data/mysql/mysql-init.sql) для инициализации структуры БД. Используйте его для быстрого старта:

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

## Redis

```bash
sudo apt-get install redis
```

После установки сконфигурируйте redis-server для работы в качестве демона на локальном порту, для этого в стандартный конфиг (например, /etc/redis/redis.conf) внесите следующие изменения:

```bash
daemonise yes
bind 127.0.0.1
port 6379
```