---
title: 'Service Discovery: A Survey'
date: 2120-07-16
permalink: /posts/2020/07/service-discovery/
tags:
  - ndn
  - service-dicvovery
---

There is always a need for service discovery and load balancing, but no universal solution.
Sometimes naive ways may satisfy most needs.

Introduction
======

People are going towards finer decomposition of software.
A widely adopted concept is called microservices, which is roughly making different modules or components into lightweight programs.

The benefits of microservices include the following
- Independence: small groups work on different services.
- Scalability: frequently used components can have more replicas.
- Distributed deployment: different components can be deployed on different nodes.
- Rolling update: it's easy to upgrade a single component of the system, and roll back if it does not work.
- Software security: one misbehaving component won't ruin all data.
- Different languages

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

General Methods
------

Kubernetes
======

Service Definition
------

Service Types
------

### ClusterIP

### LoadBalancer

### NodePort

### Headless

### ExternalName

### Manual

### Ingress

Health Check
------

Controllers
------

HashiCorp Consul
======

Service Definition
------

Health Check
------

Sync
------

Apache ZooKeeper
======
ZooKeeper is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services.
It is not designed for service discovery, but people can use it to do so.

...

Istio
======
Istio is a service mesh running on k8s.
I don't know about this. Just mark the name here.

NDN Service Discovery
======

Prefix Match
------

NDN Lite
------

Future
------

References
======
- https://www.magalix.com/blog/kubernetes-patterns-the-service-discovery-pattern
- https://blog.christianposta.com/microservices/istio-as-an-example-of-when-not-to-do-microservices/
- https://istio.io/latest/docs/ops/deployment/architecture/
