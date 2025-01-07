# External Workload Support in Kubernetes

Jun 2020–Jul 2020


[Pull Request](https://github.com/kubernetes/ingress-gce/pull/1256)
[User Guide](https://github.com/zjkmxy/ingress-gce/blob/ffbeef674d70d84e33272ee295caa8efe6840006/docs/experimental/workload/README.md)

Kubernetes has a well-rounded ecosystem for pods in the cluster.
But it does not provide a standard interface for pods to interact with external workloads, such as VMs.
This project proposed ExternalWorkload custom resource to represent workloads,
provides pod to workload load balancing, and supports mixed backends for Services based on EndpointSlices.
I have implemented a PoC demo, which is merged into [GCE Ingress Controller](https://github.com/kubernetes/ingress-gce).
The KEP is being reviewed.
