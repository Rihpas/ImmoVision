docker kill app
docker rm app

docker run -dp 3000:3000 \
    -ti \
    --name app \
    -w /app --mount type=bind,src="$(pwd)",target=/app \
    node:18-alpine \
    sh -c "npm install && npm run dev"