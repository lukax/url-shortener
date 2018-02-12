###########################
###########################
###########################
FROM node:8.9.4 as builder
WORKDIR /home/node/jeitin

COPY . .

RUN yarn --pure-lockfile
RUN yarn run build.prod

###########################
###########################
###########################
FROM node:8.9.4-slim as runner
WORKDIR /home/node/jeitin

# See https://crbug.com/795759
RUN apt-get update && apt-get install -yq libgconf-2-4

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Uncomment to skip the chromium download when installing puppeteer. If you do,
# you'll need to launch puppeteer with:
#     browser.launch({executablePath: 'google-chrome-unstable'})
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install puppeteer so it's available in the container.
# RUN npm i puppeteer

# Add user so we don't need --no-sandbox.
# RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
#    && mkdir -p /home/pptruser/Downloads \
#    && chown -R pptruser:pptruser /home/pptruser \
#    && chown -R pptruser:pptruser /node_modules

# Run everything after as non-privileged user.
# USER pptruser

# copy all files not listed in .dockerignore
COPY --from=builder /home/node/jeitin/dist /home/node/jeitin/dist
COPY --from=builder /home/node/jeitin/node_modules /home/node/jeitin/node_modules
COPY --from=builder /home/node/jeitin/process.prod.yml /home/node/jeitin/process.prod.yml
COPY --from=builder /home/node/jeitin/package.json /home/node/jeitin/package.json
COPY --from=builder /home/node/jeitin/.env /home/node/jeitin/.env

# before switching to non-root user, change ownership of home
RUN chown -R node:node .
USER node

###########################
###########################
###########################

# FROM nginx:1.13
# COPY --from=builder /home/node/jeitin/dist/prod /var/www/dist/prod
# COPY ./.docker/prod/nginx.conf /etc/nginx/conf.d/jeitin.template

# CMD /bin/bash -c "envsubst '$$NGINX_HOST $$NGINX_PORT' < /etc/nginx/conf.d/jeitin.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"

EXPOSE 9001

ENTRYPOINT ["dumb-init", "--"]
CMD ["yarn", "run", "pm2-runtime", "process.prod.yml"]
