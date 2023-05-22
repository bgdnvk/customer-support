# customer-support

### Microservices based architecture w/ decentralized auth + kubernetes
Auth services implemented  
Case implemeneted  
Agent WIP (check issues)  

#### TODO list:  
finish frontend  
cleanup/reorganize the microservices(better folder structure and types/interfaces)  
add tests  
better way to run/start the project  
maybe add a getaway  
maybe add kafka

## How to run  
The project isn't finished I haven't made a single script you can run yet. But here's something to get started.

Each (micro) service has ./app folder and ./db with their own docker images, build image then run it. If you use k8s then you can use my bash scripts, if not then you can start the services by running every yaml file inside ./app and ./db then launching the loadbalancer.yaml to have everything exposed. If you use the bash scripts then first run the buildimages scripts (buildapp and builddb) then outside run start.sh, to stop everything do bash stop.sh (maybe twice, check issues).

Since I'm using env vars first you need to make a JWT secret and add it to kubernetes as a secret. Inside lib/utils you can find secret-generator to generate the JWT secret and use it everywhere afterwards.  You can just put that inside secret.env in the auth service and it will be automatically generated for you.