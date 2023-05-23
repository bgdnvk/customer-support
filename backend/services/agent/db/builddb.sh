docker stop agentdb
docker rm agentdb
docker build -t agentdb:latest -f Dockerfile.db .