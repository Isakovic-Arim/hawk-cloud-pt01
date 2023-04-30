FROM node:alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml .env.local* ./

RUN npm install -g pnpm && \
    pnpm install

EXPOSE 3000

CMD ["pnpm", "run", "dev"]