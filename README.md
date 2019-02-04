# Redis scheduler
A simple application that prints messages by the scheduled time.
Redis used as a service that collects all messages that have to be printed.
Now it works as a broadcast. Every new message adds to a sorted set.

> Please note that message can be printed in particular app only after the first run of this application.
> The first run creates a new key in Redis equals to app machine hostname.

Hope this was not confusing you. Just try it.

## To run the service
Firstly we need to have all dependencies.
Run `npm i` to install them.

Since we are modern people we should have at least `docker-compose.yml` in our app to run it without any setups.
So, use the following command:

```sh
$ docker-compose up --build
```

to run the infrastructure. It will run one instance of Redis and an app which prints scheduled messages.
To run a few applications use the following command:
```sh
$ docker-compose up --build --scale app=3
```

To schedule a new message use the following command
```sh
$ docker-compose run app node cli setup -t 2019-02-04T15:29:50Z -m 'A new scheduled message'
```
where:
- `-t` is a time from the future
- `-m` - a message that is going to be printed
