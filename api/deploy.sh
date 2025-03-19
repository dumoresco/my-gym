#!/bin/bash

# Defina as variáveis de imagem e repositório
IMAGE_NAME="us-central1-docker.pkg.dev/my-gym-454216/meu-repo/my-gym:latest"

# 1. Construa a imagem Docker sem cache
echo "Construindo a imagem Docker..."
docker build --no-cache -t $IMAGE_NAME .

# 2. Envie a imagem para o Google Container Registry
echo "Enviando a imagem para o Google Container Registry..."
docker push $IMAGE_NAME

# 3. Atualize o serviço no Google Cloud Run
echo "Atualizando o serviço no Google Cloud Run..."
gcloud run services update my-gym --image $IMAGE_NAME

echo "Processo concluído com sucesso!"
