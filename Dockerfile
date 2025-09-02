FROM node:20-alpine AS builder
# 设置npm registry
RUN npm config set registry https://registry.npmmirror.com/
# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目所有文件到工作目录
COPY . .

# 设置环境变量
ENV NODE_ENV production

# 构建Next.js应用
RUN npm run build

# 使用Node.js官方轻量级镜像作为运行阶段的基础镜像
FROM node:20-alpine AS runner

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV production
# 设置Next.js应用的端口
ENV PORT 3000

# 从构建阶段复制必要的文件到运行阶段
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# 安装生产环境依赖（不包括开发依赖）
# 设置npm registry
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install --only=production

# 暴露应用运行的端口
EXPOSE 3000
# 启动Next.js应用
CMD ["npm", "start"]
