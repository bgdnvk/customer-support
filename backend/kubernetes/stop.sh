# encoding
kubectl delete deployments --all
# encoding issues as well
kubectl delete secret secretenv
kubectl delete services --all

# for some reason pods keep on running ????
# delete everything (several times) with:
kubectl delete all --all