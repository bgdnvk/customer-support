docker stop authservice
docker rm authservice
docker build -t authservice:latest -f Dockerfile.app .