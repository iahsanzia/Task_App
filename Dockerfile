FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build:front

RUN npm prune --omit=dev

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV TRUST_PROXY_HOPS=0
ENV HTTPS_ENABLED=false

EXPOSE 3000

CMD ["npm", "run", "start:container"]