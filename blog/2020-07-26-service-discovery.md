---
title: 'Service Discovery: A Survey'
tags:
  - ndn
  - service-dicvovery
  - api
authors: kinu
hide_table_of_contents: false
---

There is always a need for service discovery and load balancing, but no universal solution.
Sometimes naive ways may satisfy most needs.

<!-- truncate -->

## Introduction

People are going towards finer decomposition of software.
A widely adopted concept is called microservices, which is roughly making different modules or components into lightweight programs.

The benefits of microservices include the following
- **Independence**: small groups work on different services.
- **Scalability**: frequently used components can have more replicas.
- **Distributed deployment**: different components can be deployed on different nodes.
- **Rolling update**: it's easy to upgrade a single component of the system, and roll back if it does not work.
- **Software security**: one misbehaving component won't ruin all data.
- **Different languages**

But there are trade-offs compared to a monolithic way:
- Complexity in communication: function calls become remote.
- Complexity in deployment and configuration
- Fake independence: highly coupled services may affect one another, which still prevents independence we intend to have.

Service discovery is more important in microservices.
- Executors (data plane components) need to know where to find an available instance of downstream services.
- Controllers (control plane components) need to know how many instances are available.

There is no universal solutions, so the simplest one that handles 60% of cases will win the market.
Though DNS is widely used in service discovery, it is more like an application interface rather than a protocol.
- It does not solve the problem how services are collected by the DNS server.
- Sometimes a local daemon is used as a fake DNS server. Information about services are distributed by other means.
- Sometimes the system manages hosts to control the IP lookup.

## General Methods

Generally, there are two patterns of discovery, two patterns of registration, and two patterns of registry consistency:
- **Client-side discovery**: the client application queries services and sends request to a provider.
- **Server-side discovery**: the client application sends the request to a load balancer, unaware of service providers.
  - The load balancer may be an agent daemon running on localhost.
- **Self registration**: the service provider registers itself into service registry.
- **Third-party registration**: the service provider is unaware of service registry. Instead, a controller registers it.
- **Strong consistency**: updates are seen in order; unavailable to minority on network partition.
- **Eventual consistency**: always available; updates are out of order.

### Client-side discovery

- Client side has more choices.
- There are fewer network hops.
- Client side logic is more complex, and strongly coupled with service registry.

It is said that Netflix Eureka uses this pattern.

### Server-side discovery

- Client application is independent with service registry.
  - Sometimes we want to use some old applications that is unaware of microservice framework.
    Only server-side discovery can support this use case.
- Some cloud provider provides a built-in version.
- The load balancer becomes another system component.
  - It can be built-in to the deploy environment.
  - NDN can provide a natural load balancer. Will discuss later.

Most existing resolutions use server-side discovery, such as Kubernetes, Consul, AWS ELB, Nginx, etc.
Their implementations are very different, though.
(Maybe platform-side discovery is a more proper name?)

### Self registration

- Theoretically, the service provider knows its own state best.
  - However, other nodes can only understand a limited set of states.
    Thus, not all metrics the server knows can be reflected in service registry.
- The service is coupled to the service registry.
  - But some solution like Consul start a daemon agent to do self registration.
    Thus, the service application code may be not coupled to service registry.
- The service cannot unregister itself sometimes. A third-party health checking component may be needed.

Consul uses self registration.

### Third-party registration

- The server side logic is less complex.
- The registrar can also perform health checks and other functionalities.
- The registrar may not have the latest status of the service.
- Again, the registrar becomes another system component.

Kubernetes and cloud instance-groups use this method.

### Strong consistency

In CAP theorem, a strong consistent database is a CP system.
Generally it may refer to either sequential consistency or a stronger extension, linearizability.
- **Sequential consistency**: All writes are globally ordered and seen in the order of happening.
  - E.g. if a node see data's changing in this way $(X=0,Y=0) \rightarrow (X=5,Y=0) \rightarrow (X=5,Y=10)$,
    all other nodes must see the same sequence. No one should see $(X=0,Y=10)$ at any time.
- **Linearizability**: When a read finishes, it must return the latest state of an object.
  - E.g. if a node starts a read request at $t_1$ and it finishes at $t_2$, then it must contain the newest data before $t_2$.
    If another node sends an update request which finishes between $t_1$ and $t_2$, it must be reflected.
    All times are wall clock of the master node.
  - All linearizable requests must go to a leader.

Pros for strong consistency is that all constrains are preserved.
For example, if someone transfer $10 from account A to account B at one ATM,
then the total number of money will always be the same from all ATMs' view.
Though he may still double spend the money if the *write* operation is not linearizable.

:::info

I learned that ATM can actually work offline with inconsist data. It allows people to withdraw or transfer a small amount.

:::

A downside is that when there is a network partition, the minority is paused.
This may be bad especially in multi-cluster service discovery.
For example, we have three clusters `A`, `B` and `C`, with some service holding on each of them.
Then, if `A` is isolated, all write requests to the service registry will fail, because it cannot connect to the leader.
All nodes in `A` will only see `[A, B, C]` when they query the service.
Well, the cluster is still running because the service instance at `A` is reachable and discoverable.
But `A` is not able to remove `B` and `C` from this list, neither can it replace A with another node.

### Eventual consistency

The C in CAP theorem is so strong that it only allows single-copy consistency.
By Brewer, this is even stricter than ACID's C.
There is a BASE model handling the system without strong consistency requirement.

- **Basic Availability**: The database is working most of the time, even for the minority after a network partition.
- **Soft-state**: Stores don’t have to be write-consistent, nor do different replicas have to be mutually consistent all the time.
- **Eventual consistency**: Stores exhibit consistency at some later point.

In service discovery scenario, this allows each part updating its own state after a network partition.
However, a node may have an incorrect global view.
Consider we have a rolling update from instances `[A, B]` to `[C, D]`.
Then, under sequential consistency, every node sees `[A, B] -> [A, B, C] -> [B, C] -> [B, C, D] -> [C, D]`.
But under eventual consistency, a node may see `[A, B] -> [B] -> [] -> [C] -> [C, D]`.
If the node relies on the view of service registry to invoke services, there will be an outage.

## Kubernetes

Kubernetes maintains **services** and **endpointslices** resources for service discovery.
- Each service has a **selector** to select pods.
- Every **pod** has labels.
- **Endpointslices** are collections of addresses of pods selected by the selector of service.
- There is a **EndpointSlice controller** that watches services and pods and create endpointslices for services.
- Every node runs a daemon called `kube-proxy` that helps load balancing for services.

### Service Definition

In Kubernetes, there are EndpointSlices to connect services and pods.
An EncpointSlice controller watches the changes of services and pods,
uses selectors provided by a service to select pods,
collects their addresses and conditions,
and creates corresponding EndpointSlices for each service.
In current version (1.18), a service only have one EndpointSlices which is propagated to every node.
This is expected to be changed next year.

A typical Service definition is like this:
```yaml
# Object Type (service) and Spec Version (v1)
apiVersion: v1
kind: Service
metadata:  # Metadata (spec shared by all obj)
  name: frontend      # The name of the service
  namespace: default  # The namespace
  labels:  # The labels of the service itself, used for group operations
    app: guestbook
    tier: frontend
  annotations:  # Arbitrary anno. for third-party to use.
    cloud.google.com/neg: '{"ingress": true}'
spec: # Generally an object has a spec and a status
# Spec = user's expectation
# Status = runtime info
  type: ClusterIP
  ports:
  - protocol: TCP   # The protocol type
    port: 80        # The port used to access this service
    targetPort: 80  # The port exposed on target pods
  selector:  # Selectors used to pick pods as backend
    app: guestbook
    tier: frontend
```

### Service Types

There are several service types.
Some types are subtypes of other types.
In these cases, we write the same `type` field and use other fields to differentiate them.

#### ClusterIP

This is an internal service, which needs a unique internal IP but not accessible from outside.
The internal IP assigned to this service does not change with its endpoints, so it provides a stable access point.
Compared to DNS, IP is not cached by any node and thus more sensitive to endpoint changes.

- A service can expose multiple ports
- A service automatically have a DNS name `<service-name>.<namespace-name>.svc.cluster.local`
- By using session affinity, we can make sure a client always connects to the same endpoint.
  (Not frequently used)
- Pods can have liveness and readiness probes. Services will only take ready pods as endpoints.
- The IP can be manually specified if necessary.

Some note on virtual IP vs DNS copied from the website:
> A question that pops up every now and then is why Kubernetes relies on proxying to
> forward inbound traffic to backends. What about other approaches? For example,
> would it be possible to configure DNS records that have multiple A values (or AAAA for
> IPv6), and rely on round-robin name resolution?
>
> There are a few reasons for using proxying for Services:
> - There is a long history of DNS implementations not respecting record TTLs,
>   and caching the results of name lookups after they should have expired.
> - Some apps do DNS lookups only once and cache the results indefinitely.
> - Even if apps and libraries did proper re-resolution, the low or zero TTLs on the
>   DNS records could impose a high load on DNS that then becomes difficult to manage.


#### LoadBalancer

The cloud provider will give it a load balancer, whose IP can be used to access it externally.
Since the load balancer is created automatically by the cloud provider, cloud infrastructure is required.
Also, different cloud providers may implement this differently.

- On some VM-based cloud, the load balancer can only route traffic to nodes equally, and the node does a second load balancing.
  - This is a loss of performance, but tolerable.

#### NodePort

Expose a fixed port on any node for this service.
External clients can connect to *any* node of the cluster using its external IP and the specific port.
The node connected will route the traffic to the endpoint pods.

> Using a NodePort gives you the freedom to set up your own load balancing solution, to
> configure environments that are not fully supported by Kubernetes, or even to just
> expose one or more nodes' IPs directly.

#### Headless

*type: ClusterIP/ExternalName, clusterIP: none*

By explicitly specifying `none` to clusterIP, we can get a service without a single IP.
The service will still have a DNS name.
If there are selectors, endpoints will be created as usual and the DNS name will be related to endpoints
instead of service IP.
The kube-proxy will not do load balancing.
Therefore, users can use their own service discovery and load balancer.

#### Manual

*type: any, w/o selector*

If a service is created without selectors, endpoints controller will not create endpoints for it.
Users can implement their own service discovery controller to create endpoints.
Once endpoints is created, kube-proxy will routes traffic according to it.

#### ExternalName

Services of type ExternalName map a Service to a DNS name.
So the cluster can use this service to access an external service with a DNS name.

### Controllers

EndpointSlice controller creates endpointslices resource that connects services and pods.
Currently EndpointSlice controller is running on a master node.
This may be a practical trade-off, since it is not required to be part of the master.

It's a typical pattern that a controller watches some resources from API server and manages some others.
In the EndpointSlice controller's case, it watches services and pods and manages endpointslices.
Endpointslices take services as its owner, so when a service is deleted, endpointslices are also deleted.
One service can have multiple endpointslices, though current controller only creates one.

Multiple controller replicas use raft to elect a leader.
At one time only one leader exists in a cluster.
If all controllers are down, the endpointslices "freeze" &mdash; they won't reflect new changes of pods' IPs.
But existing pods can still use them to access services.

### Health Check

Kubernetes health check in done on the pod side.
Each pod can have a liveness probe and a readiness probe, which can be shell scripts, HTTP path, etc.
A pod fails to pass the liveness probe will be restarted;
a pod fails on the readiness probe will be marked as unhealthy and removed from endpointslices.

### Ingress

Ingress is a L7 load balancer, which exposes HTTP/HTTPS to the Internet.
Traffic towards specific HTTP prefix will be directed to specified backend services.
Ingress needs an ingress controller, which can be provided by cloud (like GCE) or third party (Nginx).

## HashiCorp Consul

Just like other products developped by HashiCorp, Consul is quite a simple but popular solution.
Probably because the previous competitor ZooKeeper is not designed for service discovery.

Consul needs to have a cluster itself, which has its own master nodes and daemons running on VMs.
However, it can also be deployed on a Kubernetes cluster and sync up with Kubernetes services.
In this case, it simply sync up the service registry, without knowing whether a k8s service is accessible or not.
Consul clients use a broadcast gossip protocol to maintain memberships; servers use raft to elect a leader.

### Service Definition

Since Consul runs as a daemon on a VM, its service definitions are json files put into a `consul.d` folder.

```json
{
  "service": {
    "name": "socat",
    "port": 8081,
    "connect": {
      "sidecar_service": {}
    }
  }
}
```

The sample file defines a service called `socat` which runs on 8081 port.
DNS name `socat.service.consul` can be used to query this service.
Consul also provides an HTTP and a gRPC interface for programs and a BUI for human operators.

### Health Check

A Consul service definition can specify a shell command for health check.
Unhealthy services will be taken off from DNS.
Consul also has node health checking to ensure a node is running with a Consul agent.

### Sidecar

Consul also provides sidecar proxies for traffic management.

## Apache ZooKeeper

ZooKeeper is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services.
It is not designed for service discovery, but people can use it to do so.

Some people argued that ZooKeeper is a CP system, so an isolated partition may freeze and unable to change the service registry.

## Istio

Istio is a **service mesh** running on Kubernetes. It is built on top of Kubernetes service discovery.
Consul also declares it to be a service mesh.
I feel this concept is as vague as serverless.
Just list here for reference.

## NDN Service Discovery

### Prefix Match

NDN forwarding mechanism enables Interest multicast by nature.
Every router equipped with general-purpose routing strategies (like multicast and self-learning) can become a load balancer.
Thus, server-side (or platform-side) discovery is better for all scenarios on NDN.
If the application has to choose a specific service provider, forwarding hints can be used.

This only solves part of the problem &mdash; the load balancing part. The service registration problem is still there.
But if we change our view points, we can also say that this mechanism decouples load balancing with registration.
Thus, NDN service discovery is more tolerant of failure in the L7 control plane.
Because the hop-by-hop forwarding may eventually direct a service call to a provider even when the requester cannot see the service.

### Distributed Network Measurement Protocol (DNMP)

Though not designed for service discovery, DNMP can be used to do registration and health check.
The controller can publish an "all" command to a service.
Eventually, it will get all results from service providers.
The benefits and drawbacks need further thinking.

One main difference between DNMP and Kubernetes is the underlying database.
DNMP uses sync protocol to propagate publications everywhere.
Kubernetes uses etcd, which also keeps data everywhere but is based on leader election (raft).
Sync is eventually consistent but etcd is linearizable.

### NDN Lite

[NDN Lite](https://ndn-lite.named-data.net) is an NDN library designed for home IoT.

NDN-Lite makes full use of broadcast.
In NDN-Lite, each service broadcasts advertisement Interests periodically.
A program will cache the service status it hears if it needs this kind of service.

For service invocation, NDN-Lite uses a pub-sub system similar to DNMP.
This is because a program may want to send commands to all service instances in a range (i.e. management), instead of calling one.
A sync-based pub-sub system provides functionalities for both anycast invocation and management.

### Future

It's hard to say what is the best way for NDN service discovery.
Especially, on a cluster, it is less efficient if we do a pub-sub for all service invocation.
Given that anycast invocation and service management have different requirements, we may end up with two systems:
- An AP system handling service invocation. Stateful forwarding may good enough if we design a better forwarding strategy.
- A CP system handling service management. A variant of DNMP sync maybe used here.
- If possible, we want to avoid leader election,
  because a compromised leader may be a threat to system security.
  We want to avoid any single point of trust and explore other ways to achieve strong consistency.

## References

- Mohamed Ahmed. [Kubernetes Patterns : The Service Discovery Pattern](https://www.magalix.com/blog/kubernetes-patterns-the-service-discovery-pattern). Oct 11, 2019.
- Christian Posta. [Istio as an Example of When Not to Do Microservices](https://blog.christianposta.com/microservices/istio-as-an-example-of-when-not-to-do-microservices/). 2020.
- Istio Authors. [Istio 1.6 - Architecture](https://istio.io/latest/docs/ops/deployment/architecture/). May 20, 2020.
- Chris Richardson, Floyd Smith. Microservices: From Design to Deployment. NGINX, Inc. 2016.
- Kubernetes Authors. [Kubernetes - Service](https://kubernetes.io/docs/concepts/services-networking/service). May 30, 2020.
- HashiCorp. [Consul Architecture](https://www.consul.io/docs/internals/architecture). April 13, 2020.
- Knewton. [Eureka! Why You Shouldn’t Use ZooKeeper for Service Discovery](https://medium.com/knerd/eureka-why-you-shouldnt-use-zookeeper-for-service-discovery-4932c5c7e764). Dec 15, 2014.
- Márton Waszlavik. [Demystifying CAP theorem, Eventual Consistency and exactly once delivery guarantee](https://medium.com/@marton.waszlavik/demystifying-cap-theorem-eventual-consistency-and-exactly-once-delivery-guarantee-ed20cf7cc877). Oct 11, 2016.
- Daniel Abadi. [Overview of Consistency Levels in Database Systems](http://dbmsmusings.blogspot.com/2019/07/overview-of-consistency-levels-in.html). DBMS Musings. Jul 25, 2019.
- NDN Team. [NDN-Lite Service Discovery](https://github.com/named-data-iot/ndn-lite/wiki/Service-Discovery). May 18, 2020.
- Eric Brewer. [CAP twelve years later: How the "rules" have changed](https://doi.org/10.1109/MC.2012.37). Jan 17, 2012.
