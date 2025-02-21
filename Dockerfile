FROM node:23-alpine AS base

FROM base AS build
# RUN corepack enable
WORKDIR /digory-git
COPY . .
RUN npm i
RUN npm run build

FROM base AS dist
WORKDIR /digory-build
COPY --from=build /digory-git/node_modules node_modules
COPY --from=build /digory-git/dist .

CMD node main.js
# CMD ls /digory-build/data

