# 1. 使用 Node.js 构建 Vite 项目
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. 使用 Nginx 作为前端服务器
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. 运行 Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
