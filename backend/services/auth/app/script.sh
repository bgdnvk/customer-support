docker stop authservice
docker rm authservice
# docker build --build-arg ENV_FILE=.env -t authservice .
docker build -t authservice:latest -f Dockerfile.app .