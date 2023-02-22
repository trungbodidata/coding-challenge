FROM node:16-alpine as fromBuilder

WORKDIR /app

COPY . /app
RUN npm install --force
RUN npm run build

FROM node:16-alpine

WORKDIR /home/app

COPY --from=fromBuilder /app/.next /home/app/.next
COPY --from=fromBuilder /app/package.json /home/app/package.json
COPY --from=fromBuilder /app/node_modules /home/app/node_modules
COPY --from=fromBuilder /app/public /home/app/public

CMD [ "npm", "start" ]