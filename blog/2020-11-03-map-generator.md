---
title: 'POJ3557 Map Generator'
authors: kinu
hide_table_of_contents: false
format: md
tags:
  - algorithm
  - combinatorics
---

Discuss [POJ3557 Map Generator](http://poj.org/problem?id=3557) and its variants.

<!-- truncate -->

## Problem Statement

Given $N$ nodes (labeled). For each pair of node, the probability that there is an edge is $p$.
Ask the probability to get a connected graph.

## Solution - DP

Let $G_n$ denote the probability that the graph of $n$ nodes is **not** connected.
Fix a node $1$. Consider the component $1$ is in.
Assume the size is $k$.
Then, this component should have no edges with any other node out of this component.
Which means:

$$
G_n = \sum_{k=1}^{n-1} {n-1 \choose k-1}(1 - G_k)(1-p)^{k(n-k)}
$$

Use DP to calculate in $O(n^2)$. The answer is $1-G_n$.

## Variant

Ask the probability to get a graph with $K$ components.

### Solution - DP

Let $P_{n,c}$ denote the probability that a graph of size $n$ have $c$ components.
Now we try to split the graph into two disconnected parts:
one has $k$ nodes and $l$ components,
the other has $n-k$ and $c-l$.
Note that we will double count some cases.
The number of times a graph is counted is equal to twice of the number of ways we put $c$ components into $2$ non-empty sets,
i.e. $2S(c, 2) = 2^c - 2$.
Here, $S(c,2)$ denote the second kind of Stirling number, and we double it because we count on each side.
(Another way to consider this is the number of all subsets, except for the empty and full).
Thus,

$$
P_{n,c} = \frac{1}{2^c -2}\sum_{k=1}^{n-1}\sum_{l=1}^{\min(c-1,k)} {n \choose k}P_{k,l}P_{n-k,c-l}(1-p)^{k(n-k)}
$$

This can be solved by DP in $O(n^4)$.

## Discussion

Clearly, $1 - G_n = P_{n,1}$.

Now let's get rid of the probability $P$ and consider the total number of graphs.
Let $p_{n,c}$ denote the number of labeled graphs of size $n$ with $c$ components.
Then,

$$
\sum_{a_1+\cdots+a_k = n} \frac{1}{k!}{n \choose a_1, a_2, \ldots, a_k} p_{a_1,1}p_{a_2,1}\cdots p_{a_k,1} = 2^{n(n-1)/2}
$$

Let $h_n = p_{n,1}$ and $H$ be the exponential generating function (e.g.f.) of $h_n$.
We have:

$$
\begin{darray}{rcl}
\frac{2^{n(n-1)/2}}{n!} &=& \sum_{a_1+\cdots+a_k=n} \frac{1}{k!} \frac{h_{a_1}}{a_1!}\cdots \frac{h_{a_k}}{a_k!} \\
&=& [t^n ]\sum_{k=0}^{\infty}\frac{1}{k!}\prod_{i=1}^{k}\left( \frac{h_1}{1!} + \frac{h_2}{2!} + \cdots \right) \\
&=& [t^n ]\sum_{k=0}^{\infty}\frac{(H-1)^k}{k!} \\
&=& [t^n ]e^{H-1}
\end{darray}
$$

Thus, the e.g.f. is:

$$
H = 1 + \ln\left( \sum_{n=1}^{\infty}\frac{2^{n(n-1)/2}}{n!}t^n \right)
$$

which is not elementary. See also [OEIS A001187](https://oeis.org/A001187).

Now consider the original DP.
Let $p= 1/2$.
Then, $h_n = 2^{n(n-1)/2}(1-G_n)$ and

$$
\begin{darray}{rcl}
2^{n(n-1)/2} - h_n &=& \sum_{k=1}^{n-1} {n-1 \choose k-1}h_k 2^{(n-k)(n-k-1)/2}  \\
2^{n(n+1)/2} &=& \sum_{k=0}^{n} {n \choose k} h_{k+1} 2^{(n-k)(n-k+1)/2}
\end{darray}
$$

This looks similar to a binomial inversion, but we cannot separate $n$ from the right hand side, so it does not work.
