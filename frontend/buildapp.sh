docker stop nextjs 
docker rm nextjs 
docker build -t nextjs:latest -f Dockerfile.front .