## web-fort  

This repository is the "webfort" Wordpress Theme for 
[https://www.treefortmusicfest.com](https://www.treefortmusicfest.com) hosted on WP Engine. Email
[web@treefortmusicfest.com](mailto:web@treefortmusicfest.com) or 
[dev@treefortmusicfest.com](mailto:dev@treefortmusicfest.com) for tech questions.

### Continous Integration

Currently all pushes to `origin/master` will get auto deployed via CircleCI to our **LIVE PRODUCTION 
SITE** so please exercise caution when closing PRs or modifying `origin/master` directly.

### Getting started

Download a copy of the production backup database from WPEngine. See Will or Josh for instructions.

Start docker -

```
cd web-fort/
docker-compose up
```

Open a new terminal and type -
```
cd ~/Downloads/
unzip site-archive-treefortfest-live-1515213575-QwnFzNMQiiuv04gVCpMWDwByC6Q41TjteQPc.zip -d /tmp/treefortweb
mysql -h 127.0.0.1 -u root -peveryoneiswelcome -e "SET GLOBAL show_compatibility_56 = ON;"
mysql -h 127.0.0.1 -u root -peveryoneiswelcome wordpress < ~/Downloads/wp-content/mysql.sql
mysql -h 127.0.0.1 -u root -peveryoneiswelcome wordpress -e "update wp_options set option_value = 'http://localhost' where option_name in ('siteurl','home')";
cd $TREEFORT_DEV_ROOT/web-fort/
yarn
./node_modules/.bin/grunt
```

Visit http://localhost

### Screenshot 
![screenshot](screenshot.png)
