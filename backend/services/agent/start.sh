# create env vars
# kubectl create secret generic secretenv --from-env-file=secret.env
# start deployments
# kubectl apply -f loadbalancer.yaml
# kubectl apply -f ./db/postgresql.yaml
kubectl apply -f ./app/deployment.yaml
kubectl apply -f loadbalancer.yaml

# kubectl create namespace ingress-nginx
# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.0/deploy/static/provider/cloud/deploy.yaml
# kubectl apply -f ingress.yaml