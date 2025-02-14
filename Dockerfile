# 使用 Nginx 作为 Web 服务器
FROM node:18 as builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安装依赖
RUN npm install

# 复制全部文件
COPY . .

# 构建前端项目
RUN npm run build

# 使用 Nginx 作为静态文件服务器
FROM nginx:alpine

# 复制编译后的前端代码到 Nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 运行 Nginx
CMD ["nginx", "-g", "daemon off;"]
