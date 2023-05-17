docker stop authcontainer
docker rm authcontainer
docker build --build-arg ENV_FILE=.env -t authservice .
# docker run --name authcontainer --env-file .env -p 3000:3000 authservice