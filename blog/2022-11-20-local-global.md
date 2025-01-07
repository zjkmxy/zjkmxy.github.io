---
title: 'Local and Global in Math'
date: 2022-11-20
permalink: /posts/2022/11/local-global/
tags:
  - misc
  - algebra
  - geometry
---

Local vs Global seems to be one of the most important philosophies behind math.
People in some fields call it "compactness", others don't.
In short, it says that *the property of an object is related to
the property of every smaller subobject*.

In this post, I list some results I know, basically for personal notes.
But there are way more theories related or inspired by this idea.

<!-- truncate -->

## Logic

### Compactness

Topological compactness is probably the first local-global relation
that one learns at university.
It is a generalization of a closed interval of $\mathbb{R}$.
A space is called **compact** if every open cover has a finite subcover.
Beside this, there is a concept called **sequential compactness**,
stating that every sequence has a convergent subsequence.
For a metric space, these two conditions are the same.
A subset of Euclidean space is compact if and only if
it is closed and bounded ([Heine-Borel Theorem](https://en.wikipedia.org/wiki/Heine%E2%80%93Borel_theorem)).
The product space of compact spaces is compact
([Tychonoff's theorem](https://en.wikipedia.org/wiki/Tychonoff%27s_theorem)).

To some degree, first-order logic (FOL) gives a compact space.
Hence comes the compactness theorem:
a theory has a model iff every finite subset of it has a model.
Intuitively, every proof is of finite length,
so an inconsistent result (evidence) must be proved using finitely many axioms in the theory.
And the completeness theorem shows that every consistent theory has a model.
Compactness and downward Löwenheim-Skolem theorem are used to characterize FOL.

Limit ordinals are the union of all ordinals below it,
so some properties automatically hold at $\lambda$
if it holds for all ordinals below $\lambda$.
This helps the transfinite induction.

König's lemma states that every infinite tree of finite width has an infinite branch.
Unfortunately this fails at $\omega_1$ ([Aronszajn tree](https://en.wikipedia.org/wiki/Aronszajn_tree)).

### Reflection Theorem

The [reflection theorem](https://en.wikipedia.org/wiki/Reflection_principle#In_ZFC) shows that for any
cumulative hierarchy $V_{\alpha}$, a formula is true in $V$ iff it is true in a club of $V_{\alpha}$.

### Forcing

It is possible for a (inner) model of set theory
to recognize every finite piece of an object,
but not understand this object itself.

Forcing injects this not existing object to make desired proposition true.

## Geometry

Without surprise, most of the local-global property usually comes from smoothness.
A manifold $M$ is defined to be a locally $\mathbb{R}^n$ topologic space,
so a smooth function on $M$ can be taken as a sum of smooth functions in $\mathbb{R}^n$.

### Residue Theorem

Let $C$ be a simple closed, positively oriented contour in the complex plane,
and $f$ a function analytic (differentiable) in $C$ except for some points.
Then, the contour integration of $f$ around $C$ is $2\pi i$ times the sum of
residues on those points.
We can take this as that being analytic is so strong a condition that most information about the function
is stored in exceptional points.

### Stokes Theorem

The Stokes theorem roughly says "boundary is the inverse operation of differential".
For an oriented $n$-dimensional manifold $M$ with boundary $\partial M$, and a $\omega\in\Omega^{n-1}(M)$
a $n-1$-form (with compact support), we have

$$
\int_{\partial M} \omega = \int_{M} d\omega
$$

#### Proof

We use the following convention: suppose in the local coordinate $x_1, \ldots, x_n$,
the boundary is given by $x_n \geq 0$.
For the orientation $x_1\wedge \cdots \wedge x_n$, we set the induced orientation to be
$- x_1\wedge \cdots \wedge x_{n-1}$.
Using a partition of unity, express $\omega = \sum_{\alpha}\omega_{\alpha}$,
where each $\omega_{\alpha}$ is within a local coordinate $U_{\alpha}$.
It suffices to prove the theorem for $\omega_{\alpha}$.
Suppose

$$
\omega_{\alpha} = a_1dx_2\wedge\cdots\wedge dx_n - a_2dx_1\wedge\cdots\wedge dx_n +
\cdots + (-1)^{n-1} a_ndx_1\wedge\cdots\wedge dx_{n-1}
$$

Then, we have

$$
d\omega_{\alpha} = \left( \frac{\partial a_1}{\partial x_1} + \cdots + \frac{\partial a_1}{\partial x_1} \right)
dx_1\wedge\cdots\wedge dx_{n}
$$

And thus

$$
\begin{darray}{rcl}
\int_{M} d\omega &=& \int_{x_n\geq 0}
\left( \frac{\partial a_1}{\partial x_1} + \cdots + \frac{\partial a_1}{\partial x_1} \right) dx_1\cdots dx_{n}
 \\
&=& \int_{x_n\geq 0}  a_n\mid^{\infty}_{0} dx_1\cdots dx_{n-1}  \\
&=& - \int_{x_n\geq 0} a_n(x_1,\ldots, x_{n-1},0) dx_1\cdots dx_{n-1}  \\
&=& \int_{\partial M} \omega
\end{darray}
$$

#### Application

The theorem is a generalization of the foundamental theorems of calculus as well as a set of similar formulas in
$\mathbb{R}^2$ and $\mathbb{R}^3$.

It can also be used to prove one version of the Brouwer fixed-point theorem:
on a closed ball $B=\{ x\in\mathbb{R}^n : |x|\leq 1 \}$, every smooth endomorphism
$F:B\to B$ has a fixed point.

Proof: suppose ab absurdo $F$ has no fixed point.
Then we can define a smooth map $f:B\mapsto \partial B$ by letting $f(x)$ be
the point lying on the ray from $x$ to $F(x)$.
$f$ is identity on the boundary $\partial B = S^{n-1}$.
Take the standard volume form $\omega$ on $\partial B$, so $\int_{\partial B}\omega = 1$.
Now pullback $\omega$ and apply the Stokes theorem

$$
1 = \int_{\partial B}\omega = \int_{\partial B}f^*\omega = \int_{B}d(f^*\omega)
= \int_{B}f^*(d\omega) = 0
$$

Contradiction.

<!--De Rham Cohomology
-----
In $\mathbb{R}^n$, closed forms are always exact forms. But it is not the case for an arbitrary manifold.
The de Rham cohomology basically measures how closed forms can fail to be exact.
TBD-->


<!--Chern class
------ -->

<!--TBD  Need to have more understanding on this -->

## Algebra

In algebra, primes are analogue to points, so "local" means to focus on one prime.

### Localization

Localization focuses on a selected set of primes of a ring by injecting inverse elements to kill other primes.
Specifically, given a multiplicative set $S$, $S^{-1}R$ injects $s^{-1}$ for all $s\in S$.
Usually, $S$ can be the complement of a prime ideal $R_{p} = (R-p)^{-1}R$.
Then, it does something similar to quotient but in a reverse direction:
$R/p$ kills all primes below $p$ and makes $p$ the minimal prime ($0$);
$R_{p}$ kills all primes above $p$ and makes $p$ the maximal prime ($p_p = pR_p$).
Both operations can be applied to modules via extension of scalars: $M/p = R/p\otimes_R M$, $M_p = R_p\otimes_R M$,
and both of them are exact functors.
But the amazing point is a lot of properties can be recovered from all localizations (called local properties):

- $M=0$ if and only if $M_p = 0$ for all (maximal) primes $p$.
- $M\to N$ is injective/surjective/bijective if and only if the induced map $M_p\to N_p$ is injective/surjective/bijective
  for all (maximal) primes $p$.
- $M$ is a torsion-free/flat module if and only if all $M_p$ are so for (maximal) primes $p$.
- Injectivity and projectivity are not local properties, but preserved after localization.
- $S^{-1}(M\otimes_R N)$ is isomorphic to $S^{-1}M \otimes_{S^{-1}R} S^{-1}N$.
- If $M$ is finitely presented, then $S^{-1}\operatorname{Hom}_{R}(M,N)$ is isomorphic to
  $\operatorname{Hom}_{S^{-1}R}(S^{-1}M,S^{-1}N)$.
  - When $R$ is noetherian, finitely presented can be replaced by finitely generated.
  - The proof sketch: if $M$ is free, take a base $\{m_1,\ldots, m_n \}$ of $M$.
    For any homomorphism $g: S^{-1}M\to S^{-1}N$, find the gcd $s$ of denominators of the images of the base elements,
    and $g$ is of form $f/s$ for some $f:M\to N$.
    If $M$ is not free, take its finite presentation and apply the five lemma.

### Ingetral extension

An integral extension of ring is an analogue of algebraic extensions but between rings.
In an $A$-algebra $B$, an element $x\in B$ is integral over $A$ if it is a root of a *monic* polynomial
with coefficients in $A$.
The ring $B$ is integral over $A$ if every element in $B$ is integral over $A$.
$x$ is integral over $A$ if and only if $A[x]$ is finite over $A$ (i.e. finite generated as an $A$-module).
Thus, an integral extension $B$ can be considered as a union of finite extensions.
If $B$ is both integral and of finite type over $A$ (i.e. finite generated as an $A$-algebra), then it is finite pver $A$.

Like every field extension can be separated into an algebraic part and a transcedental part,
an algebra over a field can also be separated into an integral part and an algebraically-indepenedent part.
Namely, the Noether's normalization lemma states that for every finitely generated $k$-algebra $A$,
we can find algebraically indepenedent elements $y_1,\ldots,y_d$ s.t. $A/k[y_1,\ldots,y_d]$ is integral,
where $d$ is exactly the dimension of $A$.
This leads to Hilbert's Nullstellensatz: for any ACF $k$, the algebraic sets of the affine space $\mathbb{A}^n_k$
are one-one corresponding to radical ideals of ring $k[X_1, \ldots, X_n]$,
and the algebraic varieties are one-one corresponding to prime ideals.
That is to say, the affine space is roughly the same thing as the spectrum of polynomial ring,
with points being maximal ideals and varieties being prime ideals.


### Dedekind domain

The concept of Dedekind domain arose from the research of algebraic integers in number theory.
A Dedekind domain is defined to be a noetherian, integrally closed domain of dimension one.
A local Dedekind domain is called a DVR, where exactly one prime number $p$ exists,
and every number can be valued by the power of $p$ in it.
Dedekind domain is a global version of DVR with multiple prime numbers.

### Hasse-Minkovski Theorem

If a quadratic form is solvable locally at every place (i.e. valuation), then it is solvable in rationals (integers).
More specifically, a quadratic form has an integer solution if and only if it has a real solution and
a $p$-adic solution for every prime $p$.
Since the integer ring of the $p$-adic field is corresponding to the localization of $\mathbb{Z}$ at prime $p$,
$p$-adic fields and the real numbers are considered as "local results".
The proof follows analyzing the equivalent classes of quadratic forms.

This does not work for cubic forms, such as $3x^3+4y^3+5z^3=0$ has no rational solution,
but it is solvable in all localizations.


## Combinatorics

### Euler's Circuit

A graph has an Euler circuit if and only if every node has an even degree.
To obtain an Euler circuit, one can simply start DFS from an arbitrary node and backtrack when it fails.

### Ulam's Reconstruction Conjecture

This conjecture says an graph can be reconstructed by all vertex-deleting subgraphs,
which are obtained by deleting one vertex of the original graph.
More specifically, if two graphs with $>2$ vertices have pair-wisely isomorphic vertex-deleting subgraphs,
then the two graphs are isomorphic.

## References

- https://math.stackexchange.com/questions/34053/list-of-local-to-global-principles
