# instructions
start docker  
run `bash script.sh` to create the image  

kubectl get services and get the cluster-ip in our nodejs app

<!-- run `kubectl create configmap schema-configmap --from-file=schema.sql`   -->

generate secret `kubectl create secret generic secretenv --from-env-file=secret.env`  

# start
run `bash start.sh`

# stop all:  
`kubectl delete deployments --all`