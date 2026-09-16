FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist/toursen-web/browser ./browser
CMD ["sh", "-c", "serve -s browser -l ${PORT:-3000}"]
