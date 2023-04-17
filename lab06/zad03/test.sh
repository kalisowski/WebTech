IP_ADDRESS=$(docker inspect backend | jq '.[0].NetworkSettings.Networks.frontend_network.IPAddress' | tr -d '"') 

docker exec frontend curl -I $IP_ADDRESS:4200
if [ $? -eq 0 ]; then
    echo "Frontend to backend connectivity test passed."
else
    echo "Frontend to backend connectivity test failed."
fi


database_ip=$(docker inspect database --format='{{.NetworkSettings.Networks.backend_network.IPAddress}}')
backend_container_id=$(docker ps -aqf "name=backend")

docker exec -it $backend_container_id bash -c "timeout 5 bash -c '</dev/tcp/$database_ip/27017'; exit \$?"
if [ $? -eq 0 ]; then
    echo "Backend to MongoDB connectivity test passed."
else
    echo "Backend to MongoDB connectivity test failed."
fi


