docker stop agentservice 
docker rm agentservice
docker build -t agentservice:latest -f Dockerfile.app .