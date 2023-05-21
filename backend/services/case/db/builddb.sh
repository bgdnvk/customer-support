docker stop casedb
docker rm casedb
docker build -t casedb:latest -f Dockerfile.db .