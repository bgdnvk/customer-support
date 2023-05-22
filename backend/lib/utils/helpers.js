// get the IP of a cluster inside an env file
// POSTGRES_CLUSTER_IP=$(kubectl get service postgres -o jsonpath='{.spec.clusterIP}')