---
title: 'Service Invocation'
date: 2999-08-14
permalink: /posts/2999/08/service-invocation/
tags:
  - ndn
  - service-invocation
  - api
---

Overview
======

Industrial Best Practice
======
Separate Storage and Services for deployment


RPC Protocols
======

Microsoft RPC
------

HTTP RESTful
------

gRPC
------

GraphQL
------

Other Protocols
======

HTTP Live Streaming
------

Gossip & Sync
------

Pub-Sub
------

Message Queue
------

Distributed Execution
------

Properties
======

Communication Model
------
See the book (async/sync x unicast/multicast)

Scaling
------

Timeout & Retry
------

Circuit Breaker & Service Downgrade
------

Security Trade-off
------
Byzantine fault happens very rarely in a managed system, so some products ignore it for performance.

Caching
------

Consistency & Transaction
------

Reliability
------
MQ's (delivery guarantee)

Monitoring
------
Centralized Log. Metrics.
Istio's metric is very popular.

Internal vs External
------
Internal (West-East)
Internet facing (South-North)


Service Mesh's Issues
======
Istio has a good idea. The problem is it needs to be implemented by too many hacks.
The result of complexity is that, it takes too long to be ready for industrial usage.
Mixer issue, Pilot issue, Monolith

References
======
https://gudaoxuri.gitbook.io/microservices-architecture/wei-fu-wu-hua-zhi-ji-shu-jia-gou/eda
https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design
https://cloud.google.com/apis/design
https://aws.amazon.com/blogs/architecture/how-to-architect-apis-for-scale-and-security/
https://developer.microsoft.com/en-us/graph/


https://www.rabbitmq.com
https://docs.servicestack.net/redis-mq

https://thenewstack.io/the-top-3-service-mesh-developments-in-2020/
https://skyao.io/post/201904-istio-performance-issue/
https://www.envoyproxy.io/docs/envoy/latest/api-docs/xds_protocol
https://thenewstack.io/operators-and-sidecars-are-the-new-model-for-software-delivery/
