# customer-support
## How to run  
You need Docker and Kubernetes on your system. 
Generate a JWT secret (check ./backend/lib/utils) and save a secret.env in the ./kubernetes folder.  

Go into ./kubernetes/images, build all the images in the order it's put then inside ./kubernetes do `bash start.sh`
This will launch the different scripts inside microservices and deploy them in a kubernetes cluster.  
To stop run the stop.sh script, depending on the system you might want to run it twice.  

### Issues  
Due to problems with encoding you might need to copy/paste the scripts, check issues tab.

## Arthitecture 
![architecture diagram](architecture.png "Arhitecture")

### Folder Organization
Each microservice consists of ./app where the Node code resides and then ./db where the schema for the PostgreSQL db is. Then you also have Docker files to build the app and db separately, the yaml files are for kubernetes that will start the deployment, service and loadbalancer to expose the endpoints outside. The bash scripts are there to start everything up, I call these bash scripts from ./kubernetes folder.  

## Endpoints  
I wanted to include a loadbalancer that would start with /api but instead every service is just prefixed with it for now.
### Auth Service 
PORT: 3000  

POST /api/register to register the user  
When the user of type (role) agent is registered then there's a POST call to /api/agent/agents to create the agent and make it available (you need to register an agent before being able to create cases otherwise there won't be any agents to assign to your case)

POST /api/login to get the Bearer token  

Using JWT you can register 3 type of users, example:
```
{
    "username": "agent",
    "password": "password",
    "role": "agent"
}
```
The roles are customer, agent and admin. Each microservice has middleware that checks the Bearer token (which you get after loging in) through middleware you can interact with the endpoints.  

### Case Service
PORT: 4000  

agent GET /api/case  
get all cases as agent  

customer POST /api/case  
as customer post a new case that internally will be redirected to the agent service at /api/agent/case and will assign a new agent available (if not return err) - returns 500 for now but will change it  

request body example
```
{
    "title": "case1 title1",
    "description": "description1"
}
```

### Agent Service
PORT: 5000

agent GET /api/agent/case  
Get all the ongoing cases and their agents 
example of response  
```
{
    "cases": [
        {
            "case_id": 1,
            "title": "case1 title2",
            "description": "description1",
            "agent_id": 1,
            "customer_id": 2
        }
    ]
}
```

agent GET /api/agent/case/resolved  
Get all the resolved cases and their agents

agent DELETE /api/agent/case/:caseId  
Deletes the ongoing case and puts it in the resolved_cases database, making the assigned agent available again by putting the agent in the available_agents table  

admin PUT /api/agent/agents/:id  
As an admin you can change everything about the agent (note that the sensible data is handled in the auth db)  

admin DELTE /api/agent/agents/:id  
Delete the agent, however you can only delete available agents so it doesn't interfere on who's handling the case. Hence you need to close the case the agent is handling before deleting said agent.  

## Notes  
This project was mainly for me to learn more about Kubernetes and microservices for my [blog](https://bognov.tech/). Therefore the code is a disaster, there are no types/interfaces, or tests, the project needs cleanup, I need to implement better error handling and organize the folder structure, maybe add app/src/controller, /app/src/model, etc.  

### TODOs:
- Finish the frontend  and integrate it with k8s
- Decouple microservices through Kafka  
- Better deployment by only exposing the needed - endpoints  
- Add a proper getaway  