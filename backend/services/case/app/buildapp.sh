docker stop caseservice
docker rm caseservice
docker build -t caseservice:latest -f Dockerfile.app .