
cd frontend

docker build -t lab6-zad3-frontend2 .
cd ../backend
docker build -t lab6-zad3-backend .
cd ..


docker network rm frontend_network
docker network rm backend_network
docker network create --driver bridge --subnet=172.82.0.0/24 frontend_network
docker network create --driver bridge --subnet=172.82.1.0/24 backend_network


docker run -d --name database --network backend_network -p 27017:27017 mongo
sleep 5

docker create --network=backend_network --name backend -p 4200:4200 --env MONGODB_HOST=database --env MONGODB_PORT=27017 --env PORT=4200 lab6-zad3-backend
docker network connect frontend_network backend
docker start backend
IP_ADDRESS=$(docker inspect backend | jq '.[0].NetworkSettings.Networks.frontend_network.IPAddress' | tr -d '"') 


docker run -d --name frontend --network frontend_network -p 80:3000 --env API_BASE_URL=http://$IP_ADDRESS:4200 lab6-zad3-frontend2