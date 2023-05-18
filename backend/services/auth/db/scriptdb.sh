docker stop authdb
docker rm authdb
docker build -t authdb:latest -f Dockerfile.db .