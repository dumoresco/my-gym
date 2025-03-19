# Usa a imagem do Node.js
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto
COPY package.json  ./
COPY prisma ./prisma/ 
# Copia o .env
COPY .env ./


# Instala as dependências
RUN yarn

# Copia o restante do código
COPY . .

# Faz o build do projeto
RUN yarn build


# Definir a variável de ambiente PORT
ENV PORT 8080

# Expor a porta 8080
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
