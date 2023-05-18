# create env vars
kubectl create secret generic secretenv --from-env-file=secret.env
# start deployments
kubectl apply -f loadbalancer.yaml
kubectl apply -f ./db/postgresql.yaml
kubectl apply -f ./app/deployment.yaml