# Usando Node.js 22 como base
FROM node:22

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do package.json e yarn.lock e instala as dependências
COPY package.json yarn.lock ./

RUN yarn

# Copia todo o código da aplicação
COPY . .


# Se estiver usando TypeScript, faça o build da aplicação
RUN echo "Iniciando build da aplicação..." && yarn build && echo "Build concluído"

# Expõe a porta da API
EXPOSE 3000


RUN npx prisma generate


# Iniciar a aplicação
CMD ["yarn", "start"]
