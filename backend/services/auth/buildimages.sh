# issue w/ encoding
docker stop authdb
docker rm authdb
docker build -t authdb:latest -f ./db/Dockerfile.db ./db  
# issue w/ encoding 
docker stop authservice
docker rm authservice
docker build -t authservice:latest -f ./app/Dockerfile.app ./app