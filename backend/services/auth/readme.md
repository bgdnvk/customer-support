# instructions
start docker  
run `bash script.sh` to create the image  

run `kubectl create configmap schema-configmap --from-file=schema.sql`  

generate secret `kubectl create secret generic secretenv --from-env-file=secret.env`  

run `bash kubernetes.sh`

# stop all:  
`kubectl delete deployments --all`