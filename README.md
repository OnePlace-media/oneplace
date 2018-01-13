# OnePlace

OnePlace - smart client for [Steem](https://github.com/steemit/steem) and [Golos](https://github.com/GolosChain/golos) blockchains. As a basis we took [Vue](https://vuejs.org) with [SSR](https://ssr.vuejs.org/en/) module for frontend and [LoopBack](https://loopback.io/) for backend.

## Installation

#### Clone the repository and install npm modules

```bash
git clone git@github.com:OnePlace-media/oneplace.git
cd oneplace && npm i
```

#### Install dependencies
This instruction is for debian based linux

##### NodeJS
Install NodeJS, we recommend using last [**LTS version**](https://nodejs.org/en/) and [**nvm**](https://github.com/creationix/nvm) for installation:

```bash
nvm install 8.9.4
nvm use 8.9.4
```

Also you need to install [mysql](https://www.mysql.com/) and [redis](https://redis.io/download) databases. Use [Docker Compose](https://docs.docker.com/compose/) with our [docker-compose.yml](./docker-compose.yml) or make manual install:

##### MySQL
```bash
sudo apt-get update
sudo apt-get install mysql-server
```

This repository includes init sql script, you can use it for fast start.
```bash
# Insert int sql script to ypu mysql daemon
mysql -u root < ./server/data/mysql/mysql-init.sql
# Login Mysql
mysql -u root
# Create new mysql user
CREATE USER 'oneplace'@'localhost' IDENTIFIED BY 'password';
# config privileges
GRANT ALL PRIVILEGES ON oneplace.* TO 'oneplace'@'localhost'
```

Also you can use [MySql WorkBench](https://www.mysql.com/products/workbench/) with our [model file](./server/data/mysql/wb-model.mwb) to extend sql schema.

##### Redis

```bash
sudo apt-get install redis
```

#### Configuration

Edit /etc/redis/redis.conf after instal redis-server for work as daemon on localhost:

```bash
daemonise yes
bind 127.0.0.1
port 6379
```

After you clone the repository and install dependencies you need to create configuration files.
```bash
cd server
# Main config file
cp config.sample.json config.json
# config for databases
cp datasources.sample.json datasources.json
```

##### config.json
```json
{
  ...,
  "postingWrapper": {
    "steemDomain": "steem node with HTTP JSON-RPC",
    "golosDomain": "golos node with HTTP JSON-RPC",
    "WIF": "APPLICATION POSTING_KEY",
    "username": "APPLICATION USERNAME"
  }
}
```

#### Build and start
We prepared npm commands for fast build and start services. First you must build client with you config.
```bash
# Build front-end part of repo
npm run build
```
For start instances we also recommend using [PM2](http://pm2.keymetrics.io/). See [process.json](./process.json). 

```bash
pm2 start process.json

# start monitoring panel
pm2 monit
```

But you can also try manual start.

##### Manual start

```bash
# Start LoopBack-API server
npm start

# Start VueSSR server
npm run client
```
Please see [package.json](./package.json) for more details.

## Post-install
This example is for nginx config file.
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
## Coming soon
- Cluster start and graceful reload, with zero downtime
- Full coverage Unit (frontend side) and BDD(API) test with Karma, Mocha and PhantomJS
- Continuous Integration and Auto Deploy
- Git flow and release notes
- Full documentation

## Issues

To report a non-critical issue, please file an issue on this GitHub project.

If you find a security issue please report details to: [oneplace83@gmail.com](mailto:oneplace83@gmail.com)

We will evaluate the risk and make a patch available before filing the issue.