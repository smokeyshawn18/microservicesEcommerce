<!-- Product service and kafka docker build -->
<!-- main file is in kafka pkg - docker-compose.yml -->

docker compose -f packages/kafka/docker-compose.yml up --build -d

docker compose -f docker-compose.yml up -d kafka-broker-1 kafka-broker-2 kafka-broker-3 kafka-ui

docker compose -f docker-compose.yml down

<!-- kafka run -->
