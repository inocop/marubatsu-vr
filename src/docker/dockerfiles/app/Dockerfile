FROM ubuntu:18.04

RUN apt-get update \
&&  apt-get install -y vim \
                       curl \
                       gnupg \
                       git \
# node install \
&&  curl --silent --location https://deb.nodesource.com/setup_8.x | bash - \
&&  apt-get install -y nodejs \
# disk clean \
&&  apt-get clean \
&&  rm -rf /var/lib/apt/lists/*

RUN npm install -g @vue/cli

CMD tail -f /dev/null
WORKDIR /opt/myapp
