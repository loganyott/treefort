## web-fort  

This repository is the "webfort" Wordpress Theme for 
[https://www.treefortmusicfest.com](https://www.treefortmusicfest.com) hosted on WP Engine. Email
[web@treefortmusicfest.com](mailto:web@treefortmusicfest.com) or 
[dev@treefortmusicfest.com](mailto:dev@treefortmusicfest.com) for tech questions.

### Continous Integration

Currently all pushes to `origin/master` will get auto deployed via CircleCI to our **LIVE PRODUCTION 
SITE** so please exercise caution when closing PRs or modifying `origin/master` directly.

### Getting started

Download a copy of the production backup database from WPEngine

```
docker-compose up
```

Open a new terminal and type -
```
unzip site-archive-treefortfest-live-1514435930-T8GN8MLgvN9pKgNGhPiCvk3q5qvl6KeK3M2o.zip
mysql -h 127.0.0.1 -u root -ptreefort wordpress < ~/Downloads/wp-content/mysql.sql
```
- You'll need a local WP installation, XAMPP or something like [Server Press](https://serverpress.com/)
- point your local repo at the theme folder on your local installation
- 'npm install' 
- 'grunt' will watch for changes and compile your sass and build your js

### Screenshot 
![screenshot](screenshot.png)
