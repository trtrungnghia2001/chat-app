# Dùng image nhẹ
FROM node:18

# Làm việc tại thư mục /app
WORKDIR /app

# Copy package.json và cài đặt
COPY package*.json ./
RUN npm install

# Copy toàn bộ code
COPY . .

# Mở port Vite
EXPOSE 5173

# Chạy Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]