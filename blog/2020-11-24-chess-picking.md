---
title: 'Chess Picking Problem'
authors: kinu
tags:
  - algorithm
  - combinatorics
  - algebra
---

Rephrase the chess picking problem in a more formal way.

<!-- truncate -->

## Problem Statement

Let $M$ be the set of $2n\times 2n$ 0-1 matrices such that
- All matrices have the same number of $1$'s
- Any $n\times n$ submatrix has at least one $1$
- The number of 1's, $k$, is the minimal possible value

Calculate $k$ and $\|M\|$.

## Solution

### Minimal Number of 1's

Let $A = S_{2n}\times S_{2n}$ act on $M$ by reordering the rows and columns.
Clearly, this group action is well-defined.
Now consider $\|M/A\|$, the number of different orbits.
We can use one $S_{2n}$ to make the diagonal all $1$'s, and still have the ability to reorder the column.

Define a graph $G = (N, M)$, where $N = \\{1,\ldots,n\\}$ and
there is an edge from $x$ to $y$ iff $(x,y)$ is $1$ in $M$.
We may assume there is a self loop on each node.
Removing those $2n$ self loops, we will get a simple graph with $k-2n$ edges.
Let the second $S_{2n}$ act as relabeling the nodes, so it suffices to consider unlabeled graphs.
Now, the submatrix condition becomes that:
- For any set of $n$ nodes, there exists an edge pointing out.

And $\|M/A\|$ is equal to the number of such simple graphs, up to isomorphism.

Clearly, $n$ edges does not work.
But there is a solution with $n+1$ edges: a $n+1$ cycle plus $n-1$ isolated nodes.
Thus, $k = 3n+1$.

### Number of Orbits

We can prove this is the only graph.
- If there is a cycle of length $c< n+1$, then the rest $2n-c$ elements will have only $n-c+1$ edges.
  Thus, there exists at least $n-1$ nodes that does not have an outgoing edge.
  Pick the $c$ nodes from the cycle and $n-c$ nodes with 0 outgoing degree, and we get a cut.
- If there is no cycle at all, e.g. forest, then we can simply sort nodes in the topological order and take the last $n$ ones.

Thus, $\|M/A\| = 1$. A (somehow) surprising result.

### Number of Matrices

Since there is only one orbit, $\|M\| = [A: \mathrm{stab}_{A}(x)]$, where $x$ is a solution.

Without loss of generality, let $x$ contain the cycle $1\to 2\to\cdots\to (n+1)$ plus isolated points $(n+2,n+2),\ldots,(2n,2n)$.
Consider $|\mathrm{stab}_{A}(x)|$:
- We can reorder the $n+2,\ldots,2n$ rows in any permutation, as long as we do the same to those columns: $(n-1)!$
- For the cycle part, the stablizer set size is equal to automorphisms of an *unlabeled* cycle: $2(n+1)$
  - It's hard to describe why verbally. But you can have a try: pick any row in the cycle to be the first row, and
    you'll find there are exactly 2 ways to do the rest.

Thus, the total number is $\|M\| = \frac{(2n)!^2}{2(n-1)!(n+1)}$.

We can also directly count this:
- For the $n-1$ isolated nodes, we can insert them into any columns & rows: ${2n \choose n-1}^2$
  - And then, we can choose the position to place 1 at each row: $(n-1)!$
- For the $n+1$ cycle, we can shuffle the rows as a free circular permutation: $\frac{1}{2}n!$
  - And then each row is different so we can shuffle them: $(n+1)!$

Thus, the total number is $\|M\| = \frac{1}{2}(n-1)!n!(n+1)!{2n \choose n-1}^2$.

## PS: Complexity

If the answer is $\|M\|$ modulo $p$, then we have a faster algorithm $O(\sqrt{n}\log n)$ via multipoint evaluation.
See the next post.


## Reference

- [Polynomial Algorithms](https://brooksj.com/2019/07/24/%E5%A4%9A%E9%A1%B9%E5%BC%8F%E7%9B%B8%E5%85%B3%E7%AE%97%E6%B3%95%E9%9B%86%E6%88%90/)
- [Factorial mod Prime in Rust](https://koba-e964.hatenablog.com/entry/2019/05/22/020912)
- [階乗 mod 素数 - memo](https://min-25.hatenablog.com/entry/2017/04/10/215046). Link is broken. Please use Wayback machine.
