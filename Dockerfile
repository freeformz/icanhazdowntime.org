FROM alpine:latest

LABEL "com.github.actions.name"="Build"
LABEL "com.github.actions.description"="Build the website"
LABEL "com.github.actions.icon"="mic"
LABEL "com.github.actions.color"="yellow"

LABEL "repository"="http://github.com/freeformz/icanhazdowntime.org"
LABEL "homepage"="http://icanhazdowntime.org"

RUN apk add --no-cache hugo bash git