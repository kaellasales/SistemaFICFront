FROM node:20-slim

FROM node:20-slim

WORKDIR /app

COPY package*.json ./

# instala dependências de build necessárias para rollup
RUN apt-get update && apt-get install -y python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# força reinstalação limpa
RUN rm -rf node_modules package-lock.json && npm install --legacy-peer-deps

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
