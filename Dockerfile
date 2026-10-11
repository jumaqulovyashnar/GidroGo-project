
FROM node:22

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

EXPOSE 5173

CMD ["pnpm", "dev", "--host", "0.0.0.0"]
