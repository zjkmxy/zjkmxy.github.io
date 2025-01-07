---
title: 'Authentication and Authorization'
authors: kinu
tags:
  - ndn
  - security
---

Authentication (AuthN, 認証) and authorization (AuthZ, 承認) are important pieces in system security.
In one word, AuthN verifies the identity of the requester,
and AuthZ decides whether a specific operation is allowed.

<!-- truncate -->

## Overview

Authentication is the process or action of verifying the identity of a user or process.
Current web services usually allow a user to use multiple ways to login:
username+password, email to reset password, Single-Sign-On (SSO), etc.
If 2-Factor Authentication (2FA) is enabled, the second factor can be
phone calls, SMS, USB secure key, or an authentication app.
This makes it complicated enough to be a standalone component.
Typically, there will be a login service that handles users login requests
and verifies their identities against a user database.
The login service passes a token to the authenticated user, which can be verified by other services.

Authorization is the process which an application determines if the accessing
user or service has the necessary permissions to access a resource or perform
a given operation.
This is the AM part of IAM (Identity and Access Management).
Typically people configure it in one of the two styles:
RBAC (Role-based access control) or ABAC (Attribute-based access control).

## OpenID Connect / OAuth 2.0

OpenID Connect (OIDC) is an authentication protocol built upon OAuth 2.0.
It enables verifying the identity of a user by an authorization server.

In abstract, the requester (called Relying Party, RP) and the authorization server (called OpenID Provider, OP)
interact as follows:

```mermaid
sequenceDiagram
  RP->>+OP: (1) AuthN Request
  OP-->>-RP: (3) AuthN Response
  OP->EndUser: (2) AuthN & AuthZ
  RP->>+OP: (4) UserInfo Request
  OP-->>-RP: (5) UserInfo Response
```

In this diagram, (1)-(3) is usually done by redirection, so the user is involved.
(4) and (5) only involve communication between RP and OP.

### (1) Authentication Request

This is usually done by a redirection.
The following example from OIDC doc is a request that `client.example.org`
wants `server.example.com` to verify the user.

```http
HTTP/1.1 302 Found
Location: https://server.example.com/authorize?
  response_type=code
  &scope=openid%20profile%20email
  &client_id=s6BhdRkqt3
  &state=af0ifjsldkj
  &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
```

In this request:

- `scope` specifies what fields are needed by RP.
- `client_id` is the ID of RP recognized by OP,
  so that OP can tell the user which service is requesting.
- `state` is a string opaque to OP. It will be bounced back in the response.
  It is said that RP can combine `state` with browser cookie to prevent Cross-Site Request Forgery.
- `redirect_uri` is where the response is sent to.
- `response_type` is the Authorization Flow used. This post will only introduce `code`.

### (3) Authentication Response

```http
HTTP/1.1 302 Found
Location: https://client.example.org/cb?
  code=SplxlOBeZQQYbYS6WxSbIA
  &state=af0ifjsldkj
```

- `code` is some keyword recognized by OP. It may include info about the user or be merely a database index,
  depending on the implementation.

### (4) UserInfo Request

```http
POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
  &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
```

- `Authorization` is an access token of RP, so OP can verify the identity of RP.
- `redirect_uri` and `code` are copied from the previous response.

### (5) UserInfo Response

OP will respond with an OAuth 2.0 token.

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache

{
  "access_token": "SlAV32hkKG",
  "token_type": "Bearer",
  "refresh_token": "8xLOxBtZp8",
  "expires_in": 3600,
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ.ewogImlzc
    yI6ICJodHRwOi8vc2VydmVyLmV4YW1wbGUuY29tIiwKICJzdWIiOiAiMjQ4Mjg5
    NzYxMDAxIiwKICJhdWQiOiAiczZCaGRSa3F0MyIsCiAibm9uY2UiOiAibi0wUzZ
    fV3pBMk1qIiwKICJleHAiOiAxMzExMjgxOTcwLAogImlhdCI6IDEzMTEyODA5Nz
    AKfQ.ggW8hZ1EuVLuxNuuIJKX_V8a_OMXzR0EHR9R6jgdqrOOF4daGU96Sr_P6q
    Jp6IcmD3HP99Obi1PRs-cwh3LO-p146waJ8IhehcwL7F09JdijmBqkvPeB2T9CJ
    NqeGpe-gccMg4vfKjkM8FcGvnzZUN4_KSP0aAp1tOJ1zZwgjxqGByKHiOtX7Tpd
    QyHE5lcMiKPXfEIQILVq0pc_E2DzL7emopWoaoZTF_m0_N0YzFC6g6EJbOEoRoS
    K5hoDalrcvRYLSrQAZZKflyuVCyixEoV9GfNQC3_osjzw2PAithfubEEBLuVVk4
    XUVrWOLrLl0nx7RkKU8NXNHq-rvKMzqg"
}
```

- `access_token` is a credential used to access protected resources.
  Usually opaque to RP.
- `expires_in` is the expiration time of `access_token`. In the example, it is 1 hour.
- `refresh_token` is the credential used to obtain a new access token when the current one expires.
  Usually opaque to RP.
  Unlike access tokens, refresh tokens are intended for use only with authorization servers and are never sent
  to resource servers.
  Then refresh token also expires, but the time is decided by the authorization server internally.
  It can vary from minutes to months.
- `id_token` is usually a JWT containing some info about the user.
  The example JWT contains the following info

```json
{
  "alg": "RS256",   // Encryption algorithm
  "kid": "1e9gdk7"  // Key ID
}
{
  "iss": "http://server.example.com",   // Issuer website, OP
  "sub": "248289761001",                // Subject, the user ID
  "aud": "s6BhdRkqt3",                  // Audience, referring to RP
  "nonce": "n-0S6_WzA2Mj",              // Nonce
  "exp": 1311281970,                    // Expiration time: 07/21/2011 13:59:30
  "iat": 1311280970                     // Issued time: 07/21/2011 13:42:50
}
// Signature Value ...
```

Google Cloud users can use [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
to go through this procedure.

## Google Cloud IAM (RBAC)

Google Cloud IAM is a RBAC system.

From the browser UI, we can see two tables: Member and Role.
The Role table contains all roles on the server.
A role is associated with a collection of permissions, which define what access to which resource.
The Member table contains all users that have access to the Google Cloud project.
A member is bound to one or more roles by policies.
One IAM policy binds one or more members to one role.

A member is usually of one of the following types:

- Google Account. Identified by its email address.
- Service Account. Identified by its name which looks like an email address.
  For example, `299987776666-compute@developer.gserviceaccount.com`.
  There is no email service for this address.
  Service accounts are used by machines on the server.
  They are always authenticated by key pairs and access tokens issued by the server.
  No login allowed.
- Google group. A group is a collection of Google accounts and service accounts.
  Identified by its email address.
  Groups is used to manage permissions when the number of users is large.
  They don't have login credentials.

## AWS IAM (ABAC)

In ABAC, attributes (tags) are attached to identities (users or roles) and resources.
ABAC policies can be designed to allow operations when the principal's tag matches the resource tag.
ABAC scales more rapidly because permissions to new resources are granted automatically
by the tags.

## Practice in Kubernetes

### Authentication

Kubernetes avoids authentication in a clever way: it does not provide an authentication server.
It has an API server that every request must go through.
There are two kinds of identities recognized by the API server: users and service accounts.
I only discuss the most common use case in this post.

#### Users

A Kubernetes cluster is built on some nodes, which are on-prem machines or virtual machines
that are under the control if the network operator.
It is reasonable to assume that there already exist some credentials to login to those nodes.
Therefore, Kubernetes asks human users be authenticated via the existing identity provider
and pass the token to the API server.

Google Cloud service accounts are considered as "human users" in a Kubernetes cluster.

```mermaid
sequenceDiagram
  User->>+IdentityProvider: 1. Login to IdP
  IdentityProvider->>-User: 2. Provide id_token
  User->>+Kubectl: 3. Call kubectl
  Kubectl->>+APIServer: 4. Authorization: Bearer
  APIServer->>APIServer: 5. JWT Sign valid?
  APIServer->>APIServer: 6. JWT expired?
  APIServer->>APIServer: 7. User authorized?
  APIServer->>-Kubectl: 8. Authorized: action
  Kubectl->>-User: 9. Return result
```

#### Service accounts

Service accounts are usually used internally by Kubernetes pods.
The API server will issue tokens to pods when it creates them.

There is also a signed JWT certificate associated with each service account,
stored as a secret in the cluster.
If a user want to use it outside the cluster, he can copy its text.
This is not that secure, because plain text secret may get leaked.
As far as I know, these JWTs have a very long expiration time,
so the operator needs to manually revoke leaked credentials.

### Authorization

Kubernetes supports both RBAC and ABAC.
By default it's RBAC on Google Cloud.
Kubernetes RBAC is very similar to Google Cloud IAM.

Cloud native Kubernetes clusters are also managed by Cloud IAM.
For example, a user need to be granted permissions by both K8s cluster and Google Cloud IAM.
Cloud IAM cannot see resources in the cluster, so it works only in the operations granularity.
For example, `container.pods.get` allows a user to query the state of all pods,
where we cannot specify which pod.
One has to use K8s RBAC to grant permissions on a specific pod or namespace.

## Designs in NDN

NDN requires every Data packet is signed, so authentication is
merely certificate management.
But authorization can be done in several styles:

1. Have a distributive database containing RBAC/ABAC bindings.
  Keys or certificates only represent identity.
2. A user must create a key pair and certificate for each role it is assigned to.
3. (Hybrid) A user has key pairs associated to the identity only.
  But when he wants to access some resource,
  he needs to get a short-lived certificate signed under the namespace of the role.

The trade-offs are obvious:

- (1) needs to maintain a distributive database. Sync is one problem.
  If there are constrained devices, storage is another problem.
- (2) needs to frequently issue and revoke certificates.
  Key management can be an issue.
- (3) requires the certificate manager server to have high availability.

One always pay a cost for distribution. It is a problem of how.

## References

- [OpenID Connect Core 1.0 incorporating errata set 1](https://openid.net/specs/openid-connect-core-1_0.html)
- [Kubernetes Authenticating](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)
- [RFC6749: The OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)
- [Google Cloud OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
