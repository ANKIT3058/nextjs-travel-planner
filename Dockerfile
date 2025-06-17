FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ Generate Prisma client before building the app
RUN npx prisma generate

RUN npm run build

COPY start.sh .
RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]
