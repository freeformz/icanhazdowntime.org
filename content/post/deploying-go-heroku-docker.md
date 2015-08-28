+++
date = "2015-08-18T10:11:50-07:00"
description = "This post covers using the heroku docker cli plugin to deploy a Go application to Heroku."
keywords = ["go", "heroku"]
categories = ["go", "heroku"]
title = "Deploying Go Apps to Heroku with Docker"
published = true
+++

This post covers using the [`heroku docker`][heroku-docker] cli plugin to deploy a [Go][go] application to [Heroku][heroku]. Only Linux and MAC OSX are supported until [`docker-compose`][docker-compose] supports MS Windows.

## Prerequisites

- [Docker][docker]: Installable via either the [toolbox for MAC OSX][docker-toolbox-mac] or via the [Linux getting started guide][docker-linux]
- [Docker Compose][docker-compose]: Included in the Docker Toolbox. Linux instructions are [here][docker-compose-linux]
- Free [Heroku][heroku] Account
- [Heroku Toolbelt][heroku-toolbelt]
- [Heroku Docker CLI Plugin][heroku-docker]

Please take a look at the links above and make sure everything is installed as per the linked instructions.

## Getting Started

Start by cloning the [Go Websocket Chat Demo][go-websocket-chat-demo] Heroku application, a simple websocket application using redis to pass messages between processes:

```console
$ git clone https://github.com/heroku-examples/go-websocket-chat-demo.git
$ cd go-websocket-chat-demo
```

**Note**: It doesn't matter where the code is located for this exercise as we'll be doing everything inside of a docker container that will setup a `$GOPATH` for you.

The application is already prepared for Heroku as it contains both a [`Procfile`][procfile], which tells Heroku what to run, and an [`app.json`][app-json] file containing meta-data about the app.

In the case of Heroku Docker, the important part of the `app.json` file is the `image`, `mount_dir` & `addons` keys, as seen below:

```json
{
  "name": "Go Websocket Chat Demo",
  "image": "heroku/go:1.5",
  "mount_dir": "src/github.com/heroku-examples/go-websocket-chat-demo",
  "repository": "http://github.com/heroku-examples/go-websocket-chat-demol",
  "addons": [ "heroku-redis" ]
}
```

The `image` key is used to determine which docker image to use. The `mount_dir` key is used to determine where to mount your source code for the interactive `docker-compose run shell` target (more on that later). And the `addons` key tells Heroku which [Addons][addons] the application requires. The [addons currently supported][addons-supported] by the Heroku Docker CLI plugin are: [Heroku Postgresql][heroku-postgresql] (heroku-postgresql), [Heroku Redis][heroku-redis] (heroku-redis), [Redis Cloud][redis-cloud] (rediscloud), [Mongolab][mongolab] (mongolab) & [Memcached Cloud][memcachedcloud] (memcachedcloud). Supported addons will be attached to your container and created on your heroku application if they don't exist during `docker:release`.

Given this configuration we can initialize the app with the following command:

```console
$ heroku docker:init
```

This creates two files: `Dockerfile` & `docker-compose.yml`. The `Dockerfile` is simple and just specifies the base `heroku/go` docker image. The `docker-compose.yml` file describes the containers required to run the application locally based on your `addons` and the contents of your `Procfile`.

## Run Locally

Run the following command to start the application and it's dependencies in local containers:

```console
$ docker-compose up web
```

The first time this runs the docker images required to run the containers are constructed by pulling the required images from [Docker Hub][docker-hub]. These images are cached locally for re-use. The code is then copied into the container and compiled.

When the container is finished starting you'll see some output like this:

```console
$ docker-compose up web
...
web_1         | [negroni] listening on :8080
...
herokuRedis_1 | 1:M 28 Aug 21:05:40.442 * The server is now ready to accept connections on port 6379
web_1         | time="2015-08-28T21:06:36Z" level=info msg="Redis Subscription Received" channel=chat count=1 kind=subscribe
```

Open the app in a browser by running:

```console
$ open http://$(docker-machine ip default):8080
```

Your web application and redis database are containerized, running inside your local Docker environment, connected to each other via Docker Compose, creating a sort of "local cloud" on your machine.

## Deploying to Heroku

Create a Heroku application like so:

```console
$ heroku create
Creating peaceful-tor-8674... done, stack is cedar-14
https://peaceful-tor-8674.herokuapp.com/ | https://git.heroku.com/peaceful-tor-8674.git
Git remote heroku added
```

Deploy the application to Heroku using the following command:

```console
$ heroku docker:release
Remote addons:  (0)
Local addons: heroku-redis (1)
Missing addons: heroku-redis (1)
Provisioning heroku-redis...
Creating local slug...
Building web...
Step 0 : FROM heroku/go:1.5
# Executing 2 build triggers
Trigger 0, COPY . /app/.temp
Step 0 : COPY . /app/.temp
Trigger 1, RUN /app/.cache/gotools/bin/compile
Step 0 : RUN /app/.cache/gotools/bin/compile
 ---> Running in 0db7ad69945e
godep go install -tags heroku ./...
 ---> 53f3c75d186c
Removing intermediate container 0db7ad69945e
Removing intermediate container edb3fca8865a
Successfully built 53f3c75d186c
extracting slug from container...
creating remote slug...
language-pack: heroku-docker (heroku/go:1.5)
remote process types: { web: 'cd /app/user/src/github.com/heroku-examples/go-websocket-chat-demo && go-websocket-chat-demo-web' }
uploading slug [====================] 100% of 3 MB, 0.0s
releasing slug...
Successfully released peaceful-tor-8674!
```

That's it! You'll notice that a `heroku-redis` addon was added to the application because we haven't added one yet and it's an addon listed in the `app.json` file.

**NOTE**: Sometimes the `heroku-redis` instance isn't immediately available. You can check availability with `heroku redis`, looking at the `Status` field. If the app started before the database is available messages sent via the web interface will not show up in the chat log and you will need to restart the application (`heroku restart`) after the redis isntance is available.

Open the website and talk to yourself and share the link with someone else to chat with them.

```console
$ heroku open
```

## A Local Shell

The plugin configures a `shell` process that you can use to get shell access to containers running your app. This is similar to [one-off dynos][one-off] on Heroku, and is handy for completing administrative tasks like database tasks, package vendoring, testing, etc.

You can also get a local shell into your application as well with:

```console
$ docker-compose run shell
Building shell...
Step 0 : FROM heroku/go:1.5
# Executing 2 build triggers
Trigger 0, COPY . /app/.temp
Step 0 : COPY . /app/.temp
 ---> Using cache
Trigger 1, RUN /app/.cache/gotools/bin/compile
Step 0 : RUN /app/.cache/gotools/bin/compile
 ---> Using cache
 ---> 53f3c75d186c
root@3a1d7501c029:~/user/src/github.com/heroku-examples/go-websocket-chat-demo #
```

The `shell` container mounts your local working directory into the Docker container where it needs to be inside of a `$GOPATH`. Any changes that happen outside of that directory and it's sub directories are however lost when the shell exits.

## Wrap Up

[Heroku's Docker support][heroku-docker-support] is currently in beta. As we work to make the integration better, we'd love to hear your feedback so we can focus on building the things you need. Feel free to reach out to me directly with you thoughts and ideas.

You can visit the Heroku Dev Center for more information on [Heroku's Docker CLI][heroku-docker]. And you can learn more about [Docker][docker] from their [documentation][docker-docs] site. You can also find more information about deploying [Go][go] apps to Heroku on the [Dev Center][heroku-go].

[heroku-docker]: https://github.com/heroku/heroku-docker
[heroku-docker-support]: https://devcenter.heroku.com/articles/docker
[heroku-go]: https://devcenter.heroku.com/categories/go
[docker-docs]: https://docs.docker.com/
[go]: https://golang.org
[docker]: https://www.docker.com/
[heroku]: https://heroku.com
[docker-compose]: https://docs.docker.com/compose/
[docker-toolbox-mac]: http://docs.docker.com/mac/started/
[docker-linux]: http://docs.docker.com/linux/started/
[docker-compose-linux]: https://docs.docker.com/compose/install/
[heroku-toolbelt]: https://toolbelt.heroku.com/
[go-websocket-chat-demo]: https://github.com/heroku-examples/go-websocket-chat-demo
[procfile]: https://devcenter.heroku.com/articles/procfile
[app-json]: https://devcenter.heroku.com/articles/app-json-schema
[addons]: https://addons.heroku.com/
[addons-supported]: https://github.com/heroku/heroku-docker/blob/master/lib/addons.js
[mongolab]: https://addons.heroku.com/mongolab
[redis-cloud]: https://addons.heroku.com/rediscloud
[memcachedcloud]: https://addons.heroku.com/memcachedcloud
[heroku-redis]: https://addons.heroku.com/heroku-redis
[heroku-postgresql]: https://addons.heroku.com/heroku-postgresql
[docker-hub]: https://hub.docker.com/
[one-off]: https://devcenter.heroku.com/articles/one-off-dynos
