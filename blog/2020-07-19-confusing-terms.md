---
title: 'Confusing Terms'
authors: kinu
tags:
  - ndn
  - term
hide_table_of_contents: false
---

I find that some terms are confusing.

<!-- truncate -->

## L4 & L7

In NDN's model there is no transport layer.
NDN client libraries fill in the gap between application and NDN network layer.
Even IP world does not strictly follow the OSI model.
However, people often use the word "L4 load balancer" or "L7 load balancer".
Therefore, I think I can use them in my posts as follows

- **L7** means the application layer. It often handles with HTTP request, RPC, or something equivalent in IP world.
- **L4** means components that handles IP addresses and port numbers in IP world. Not used in NDN world.

A general traffic pattern in Kubernetes is
- The browser connects to an L7 load balancer (ingress).
- The ingress LB has mapping from path to endpoints, which are L4 LBs. It forwards HTTP requests to different L4 LBs.
  - For example, `/foo` to `1.1.1.1`; `/bar` to `2.2.2.2` and `3.3.3.3`.
  - These IP can be virtual.
- The L4 LB maintains a collection of service nodes. It forwards the request to a specific service node.
- If the service node depends on other services, it sends data to the corresponding L4 LB.

## Control Plane & Data Plane

In network research, **control plane** often means routing and **data plane** refers to forwarding.
However, in cloud computing context, people often use these words differently.
- **Data plane** refers to some mechanism that directs data from a service to another.
  This can be done by sidecar proxy or something else.
- **Control plane** refers to controllers that manage and configure data plane.
For example, in Kubernetes, the master node and controllers are often referred as control plane,
and other nodes are data plane.
They are totally application layer concepts, since they only affect how a process chooses its destination,
not how a router forwards a packet.

## Centralized vs Distributed

Though Paul Baron showed what is decentralized and what is distributed in his paper,
it is still confusing when we go to L7 and face to leader election systems.
In my point of view, there are four kinds of systems today:

### Totally centralized

- One single center server controls the whole system and most operations need to communicate with the server.
- There is a single point of failure.

### Peer to peer

- Each node works with nodes it knows. No need to talk with a specific server.
- Depending on the specific design, but generally no single point of failure.

### Leader election

- One leader is elected from a large set of candidates.
- For most operations, nodes need to communicate with the leader.
- A new leader is elected in the majority when the current leader fails.
- When there is a network partition, the minority can either become unavailable or move forward on its own.

### Controller leader election

- The control plane does leader election, but data plane nodes just talk to the services they depend on.
- Most services do not depend on the control plane, so they don't communicate with the leader too frequently.
- When the whole control plane is down, services lose the ability to know the status of other services.
  However, it can assume that current knowledge is correct and forward data to the node it knows.
  If the data path is not down, the system will can still work.

It is hard to say the elected leader or controller is a centralized server or not.
Most people seem to consider them as distributed system if every node is a candidate.

## Multiple Unicast vs Multicast

Wekipedia says

> multicast is group communication where **data** transmission is addressed to a group of destination computers simultaneously.

However, in NDN we have Interest and Data packets.
Consider the following scenarios:

### Data Propagation

There is a datum that multiple consumers request.

This is the typical multicast scenario.
In NDN this is done by Interest aggregation and Data caching.
The optimization point is to avoid duplicated data transimission.


### Service Selection

A datum is replicated at multiple places and a consumer needs it but does not care where to fetch from.

In NDN this is done by Interest multicast.
By the flow balancing, at most one Data replica will go back to the consumer.
However, from data's view, this is (reversed) **anycast** rather than multicast.
The optimization point is to choose the best route from multiple candidates.

A similar case is that an application needs a service and wants to choose one from multiple providers.
This is anycast without doubt, but implemented by Interest multicast in NDN.

### Status Check

A controller wants to check the status of multiple service providers.

This is a confusing case.
Since it is brought up from NDN-Lite service discovery, I choose the word *controller* rather than *consumer*.
It seems that the controller can multicast the request to all providers and collect **all** results.
However, is this really multicast?

- From data's view, the status of all providers are different data.
  Each datum must go through a whole trip from the provider to the controller.
- The only thing we can optimize is the number of replicas of the original Interest.
  But Interests in NDN are small in size, like TCP ACKs.
  Also, the replica number is irrelevant to latency because we can send them at the same time.
  - If we make an simile to TCP, it's like sending a group ACK to different data sent by different senders.
- A more serious problem is how does the controller know negative facts.
  That is, since the controller only receives packets from healthy providers,
  how can it know the providers who didn't reply?
  - Even the controller knows, those forwarders do not know the no-response providers for sure.
    Therefore, when the controller retransimits the Interest,
    it's more likely to reach the replied providers again.

Considering all the problems stated above, we shouldn't use multicast Interests here.
Instead, we should do multiple unicasts.

### Conclusion

From discussion above, it seems that the flow of **Data** reflect the traffic better:
- Propagating a datum to whoever needs it is multicast
- Fetching a datum stored in multiple locations is anycast
- Collecting information of multiple members is multiple unicast

## References

- Baran, Paul. On Distributed Communications Networks. Santa Monica, CA: RAND Corporation, 1962.
- DataCadamia. Distributed System - Network Partition. https://datacadamia.com/data/distributed/network_partition.
- Istio, Architecture. https://istio.io/latest/docs/ops/deployment/architecture, 2020.
