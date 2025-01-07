---
title: 'Algebra Miscs'
authors: kinu
tags:
  - algebra
---

Misc things that are taught in class but not written in the note of MATH 210.

<!-- truncate -->

## Functors

### Functor as a Colimit

For any small category $\mathcal{C}$ and any functor $F: \mathcal{C}^{op}\to Sets$,
$F$ can be written as a colimit of representable functors $\hat{X} = \mathrm{Mor}_{\mathcal{C}}(-,x)$.

#### Proof

The trick here is to pick a diagram $\mathcal{I}$.

TA said "stop thinking and just write for category problems", so let's just write down what we can do.
By Yoneda lemma, there exists a natural transformation $\alpha: \hat{X}\Rightarrow F$
if and only if $F(X)$ is not empty.
Therefore, foreach nonempty $F(X)$ we can take an arbitrary $u_X\in F(X)$
To satisfy the commutativity requirements we need to have $u_X = Ff(u_Y)$ for $f: X\to Y$.
There is no guarentee that we can pick such elements for every $F(X)$, so let's just focus on the part we can pick.
Define a natural transformation $\lambda^X: \hat{X}\Rightarrow F$ as $\alpha^{u_X}$ in the Yoneda lemma:

$$
\begin{darray}{rrcl}
\lambda^X_Y:& \hat{X}(Y)&\to& F(Y)  \\
& f &\mapsto& Ff(u_X)
\end{darray}
$$

$F$ is a cocone. Because for all $g: X\to Y$, $\lambda^Y \circ g_* = \lambda^X$ as:

$$
\lambda^Y_Z\circ g_*(f) = \lambda^Y_Z(g\circ f) = Ff\circ Fg(u_Y) = Ff(u_X) = \lambda_Z^X(f).
$$

Clearly, $F$ is not a colimit:
- We did not handle every $F(X)$.
- We only picked one special element from each $F(X)$, which cannot represent the whole property of $F$.

So let's fix this.
What we do is picking **all possible** $u_X$, instead of one element.
(i.e. [Comma Category](https://ncatlab.org/nlab/show/comma+category))
Let $\mathcal{J}$ be the category of all pairs $(Y, x)$ s.t. $x\in F(Y)$,
with morphisms $(Y, x)\to (Y',x')$ for $f: Y'\to Y$ in $\mathcal{C}$ and $Ff(x) = x'$ in $\mathrm{Set}$.
Note that multiple objects in the diagram can be mapped to one in the category.
Therefore, we define this map $M: \mathcal{J}\to\mathrm{Fun}(\mathcal{C}^{op}, \mathrm{Set})$ as
$M(Y, x) = \hat{Y}$.
Then, there are $\|F(X)\|$ many pairs mapped to the same $\hat{X}$.
We need to specify a $\lambda_X: \hat{X}\Rightarrow F$ for each of this copy.
Naturally, just assign $\lambda_X = \alpha^{x}$ for $(X, x) \to \hat{X} \to F$.

Recall how we defined $\alpha^X: \hat{X}\Rightarrow F$ in the proof of Yoneda lemma:
$$
\begin{darray}{rcl}
\alpha^x_Y: \hat{X}(Y) &=& \mathrm{Mor}_{\mathcal{C}}(Y, X)\to F(Y)  \\
f &\mapsto& Ff(x)
\end{darray}
$$

There is another way of thinking this.
Let $\mathrm{Fun}(\mathcal{C}^{op}, \mathrm{Set}) / F$ denote this category of objects
$G\Rightarrow F$, with morphisms $G_1\to G_2$ if $G_1\Rightarrow G_2\Rightarrow F$ commutes with $G_1\Rightarrow F$.
Let $\mathcal{J}$ be the full subcategory of $\hat{X}\Rightarrow F$ for all $X\in\mathcal{C}$.
There are $|F(X)|$ many of them, as a natural transformation $\alpha$ is uniquely decided by $\alpha_X(\mathrm{id}_X)$,
which can be any element in $F(X)$.
Let $u: \mathcal{J}\to\mathrm{Fun}(\mathcal{C}^{op}, \mathrm{Set})$ be the forgetful functor:
$$
u(\hat{X}\Rightarrow F) = \hat{X}.
$$
Then, $u$ is the map from the diagram to representable functors.

$Y$ is a union of multiple cocones, so it is a cocone, which can be proved exactly as what we did at the beginning.
Now, we need to show that $Y$ is a colimit.

Suppose $F': \mathcal{C}^{op} \to \mathrm{Set}$ is another cocone, with natural transformations
$\lambda'^{X}: \hat{X}\Rightarrow F'$ for the diagram object $(X, x)$ in $\mathcal{J}$.
By Yoneda lemma, for all $X$ there exists an element $u'_X\in F'(X)$
(namely $u'_X = \lambda'^X_X(\mathrm{id}_X)$)
s.t. for all $f: Y \to X$, $\lambda'^X_Y(f) = Ff(u'_X)$.
Now, we can define a natural transformation $\beta: F \Rightarrow F'$ as:
$\beta_X(x) = u'_X$, i.e. mapping the deciding element to the deciding element.
Note that $u'_X$ depends on the pair $(X, x)$ and there is one for each $x\in F(X)$.
Since for any $X,Y\in\mathcal{C}$ and $f: Y\to X$,

$$
\beta_Y\circ Ff(x) = u'_Y = F'f(u'_X) = F'f\circ \beta_X(x)
$$

$\beta$ is natural. Clearly $\beta$ is unique. Thus, $F$ is a colimit.

### Adjoint Functor Theorem

Given a small-complete category $\mathcal{D}$ with small morphism sets,
a functor $R:\mathcal{D}\to\mathcal{C}$ has a left joint if and only
if it preserves all small limits and satisfying the following solution set condition.

*Solution Set Condition*: For each $X\in\mathcal{C}$ there is a small set $I$ and
$g_i: X\to R(Y_i)$ s.t. every $h: X\to R(Y)$ can be written as $h = R(f)\circ g_i$
for some $f: Y_i\to Y$.

#### Proof

If $R$ has a left adjoint $L:\mathcal{C}\to\mathcal{D}$, it must preserve all limits and
the natural transformation $\eta: \mathrm{Id}_{\mathcal{C}}\Rightarrow RL$
satisfies the solution set condition, with $I$ the one-point set.
This is because for all $h: X\to R(Y)$, we can find a unique $\alpha_{X,Y}^{-1}(h) = f: L(X)\to Y$
s.t. $h = R(f)\circ \eta_X$.

Conversely, given those conditions, it suffices to construct for each $X\in\mathcal{C}$
a universal arrow $\eta_X: X\to R(Y_X)$,
where universality means for each $h: X\to R(Y)$, we can find a unique $f: Y_X\to Y$ s.t.
$h = R(f)\circ \eta_X$.
to $R$.
Then, $R$ has a left adjoint $L$, by $L(X) = Y_X$ and $L(h)$ being the unique $f$.
In other words, we need to find a initial object $\langle\eta_X, Y_X\rangle$ in the comma category $(X\downarrow R)$
for all $X$.

Here, given $X\in\mathcal{C}$ and $F:\mathcal{D}\to\mathcal{C}$,
the comma category $(X\downarrow F)$ is defined as a category with
objects $\langle f, Y\rangle$ s.t. $f: X\to F(Y)$.
Morphisms $h: \langle f, Y\rangle\to\langle f', Y'\rangle$ are
$h: Y\to Y'$ s.t. $f'= F(h)\circ f$.

*Lemma*: If $F:\mathcal{D}\to\mathcal{C}$ preserve all small limits,
then for each $X\in\mathcal{C}$, the projection:

$$
\begin{darray}{rcl}
Q_X: (X\downarrow F) &\to& \mathcal{D}  \\
(X\to F(Y)) &\mapsto& Y
\end{darray}
$$

creates all small limits in the comma category.

*Proof of Lemma*: Suppose $f_i: X\to F(Y_i)$ is an $I$ indexed family of objects in the comma category.
Let $(\lim_I Y_i, \lambda)$ be a limit in $\mathcal{D}$, and $\theta: Y_j\to Y_k$ s.t. $f_k = F(\theta)\circ f_j$.
Since $F$ preserves limits, $F(\lim_I Y_i)$ is a limit of
$F(Y_j)$ and $F(\lambda_k) = F(\lambda_j)\circ F(\theta)$.
Then, there is a unique $f: X\to F(\lim_I Y_i)$ s.t. $f_i = F(\lambda_i)\circ f$ for all $i\in I$.
Thus, $f = \lim_I f_i$.

Now, $(X\downarrow R)$ is a small-complete category satisfying the solution set condition:
there is a small set $I$ and $g_i \in (X\downarrow R)$, s.t. for every $h\in (X\downarrow R)$
there exists a morphism $g_i\to h$ for some $i\in I$.
It suffices to prove $(X\downarrow R)$ has an initial object.
This is true because $(X\downarrow R)$ is small complete,
we can construct a product of all $g_i$ and then construct an equalizer of all endomorphisms of it.
Then, the equalizer is an initial object.

Actually this is what we did in the class to construct the free group functor.
Check MacLane p123.

## Sylow Theorem and Finite Groups

### Notations

- ${}^{g}h = ghg^{-1}$: conjugation &mdash; 共軛(やく)
- $\mathrm{orb}_G(x) = G\cdot x = \{ g\cdot x: g\in G \}$: orbit &mdash; 軌道
- $\mathrm{stab}_G(x) = \{g\in G: g\cdot x = x\}$ &mdash; 固定部分群
- $X^G = \{ x\in X: g\cdot x = x, \forall g\in G \}$ &mdash; 不変元
  - If $G$ is a finite $p$-group, $\|X\| \equiv \|X^G\| \text{ modulo } p$
- $Z(G) = \{ g\in G: xg = gx, \forall x\in G\}$: center &mdash; 中心
  - If $G$ is a finite $p$-group, $p\| Z(G)$ and thus $Z(G) > 0$.
- $n = v_p(\|G\|)$: the highest power of $p$ that divides the order $G$ &mdash; $G$の位数に於ける$p$の重複度

### Cauchy's Lemma

If $p$ divides $\|G\|$, then $G$ contains an element of order $p$.

### Sylow Theorems

- *Existence*: $p$-Sylow always exists.
- *(a)* Every $p$-subgroup is contained in a $p$-Sylow subgroup.
- *(b)* Two Sylow subgroups are conjugate in $G$.
- *(c)* The number of Sylow subgroups is congruent to $1$ modulo $p$.
- *Corollary*: A $p$-Sylow is unique if and only if it is normal in $G$.

#### Proof

**Existence**:

*Inductive Proof*: Prove by mathematical induction on the order.
If there exists a proper subgroup $H < G$ of index prime to $p$, then by induction $H$ has a $p$-Sylow.
If all proper subgroups have index divisible by $p$, then

$$
|Z(G)| = |G^G| \equiv |G| \equiv 0\ (\text{mod }p)
$$

Here actions are conjugations.
Thus, there exists an element $x$ of order $p$.
If $v_p(\|G\|) = 1$, then $\langle x\rangle$ is a Sylow.
If $v_p(\|G\|) > 1$, then $G / \langle x\rangle$ has a $p$-Sylow $\bar{P} = P / \langle x\rangle$,
which gives $P$ is a Sylow.

*Constructive Proof*: Consider $Y$ being the set of all subsets of size $p^{n}$ of $G$, where $n = v_p(\|G\|)$.
Consider $G$ acts on $Y$ via left multiplication (coset).
By [Lucas theorem](https://en.wikipedia.org/wiki/Lucas%27s_theorem),

$$
|Y| = {|G| \choose p^n} \equiv {|G|/p^n \choose 1}{0 \choose 0}^{n-1} = |G|/p^n \not\equiv 0 \ (\text{mod } p)
$$

Since $\|Y\| = \sum_{X\in Y}[G : \mathrm{stab}_G(X)]$, there exists some $X$ s.t. $[G : \mathrm{stab}_G(X)]$ is not divided by $p$.
Let $H = \mathrm{stab}_G(X)$.
Since $[G : \mathrm{stab}_G(X)] = \frac{\|G\|}{\|H\|}$, $H$ is divided by $p^n$.
By the definition of stablizer, $Hx\subseteq X$ for all $x\in X$.
Then, $\|H\| = \|Hx\| \leq \|X\| = p^n$. Thus, $\|H\| = p^n$.

**Key Remark**: If $H\leq G$ is a $p$-group and $P\leq G$ is a $p$-Sylow s.t. $H$ normalizes $P$, then $H\leq P$.

Consider $\left\langle H\cup P \right\rangle = HP$.
By second isomorphism theorem, $[HP: P] = [H: H\cap P]$ is a power of $p$.
Thus, $HP$ is a $p$-subgroup containing $P$.
Since $P$ is $p$-Sylow, $HP = P$, which gives $[H: H\cap P] = 1$ and $H\leq P$.

**(a) & (b)**:

Let $P_0$ be one Sylow subgroup and $X = \{ {}^gP_0: g\in G\}$ be the set of its conjugates.
Clearly, $X$ is a set of $p$-Sylow subgroups.
Suppose $H\leq G$ is a $p$ group and let $H$ acts on $X$ via conjugation.

$$
|X^H| \equiv |X| = [G : \mathrm{stab}_G(P_0)] = [G: N_G(P_0)] \ (\text{mod } p)
$$

Since $P_0\leq N_G(P_0)$, $[G: N_G(P_0)]$ is a factor of $[G: P_0]$, and thus prime to $p$.
Then, $\|X^H\|$ is prime to $p$.
Thus, there exists $P\in X^H$ which is conjugate to $P_0$ and normalized by $H$.
Note that $P$ is a $p$-Sylow subgroup, so by the key remark, $H\leq P$.

**(c)**:

Consider the action $P_0$ on $X$ by conjugation.
By the key remark, $P_0$ is a subgroup of any fixed point, so the only fixed point is $P_0$ itself.
Hence, $\|X\| \equiv \|X^{P_0}\| = 1\ (\text{mod } p)$.
By (b), $X$ contains all Sylow groups.

**Corollary**:

$X = \{ P \}$ iff. $P$ is normal in $G$.

**Remark**:

$\|X\|$ divides $\|G\|$, because it's the index of a stablizer.

### Schur–Zassenhaus theorem

Suppose $N\to G \to H$ is a short exact sequence (s.e.s., 短完全系列) s.t. $\|N\|$ and $\|H\|$ are coprime.
Then, the s.e.s. is a split; i.e. $G\cong N\rtimes H$.
Moreover, any two subgroups in $G$ of order $\|H\|$ are conjugate to each other.

A general case is $N\unlhd G$ and $H = G / N$ s.t. $\|N\|$ and $\|G / N\|$ are coprime.

*The general proof (especially part 2) is difficult and thus omitted here.*

For a special case, refer to Prop. 2.7.20 in Math210 Notes, case (ii).

### Application: Groups of Order 30

#### Any group of prime order is cyclic

By the fact that any subgroup generated by a non-trivial element is the whole group.

#### The only group of order 15 is cyclic

Since $15 = 3\times 5$ and $5$, $3$ is not congruent to 1 modulo each other,
$G_{15}$ contains exactly one $5$ subgroup and one $3$ subgroup, which are all normal in $G_{15}$.
Thus, $G_{15}\cong C_3 \times C_5 = C_{15}$.

#### The number of automorphisms of a cyclic group is its order's Euler function

Since $C_n = \{ 1, c, \ldots, c^{n-1} \}$ is gnerated by $c$,
an automorphism $\varphi$ on it should be decided by $\varphi(c)$.
Given that every $c^k$ where $k$ is coprime to $n$ is a generator,
there are $\phi(n)$ automorphisms.
Actually, $\mathrm{Aut}(C_n) \cong C_n^{\times}$, with the latter one denotes the reduced residue system group of $n$.
(i.e. unit group of ring $\mathbb{Z}/n$)

When $n$ is prime, by the existence of primitive root, $\mathrm{Aut}(C_n) \cong C_{n-1}$.

#### There are 4 isomorphic types for 30

Let $n_p$ denote the number of $p$-Sylow subgroups.
By Sylow, $n_2\in \{1, 3, 5, 15\}$, $n_3\in \{1, 10\}$, $n_5\in \{1, 6\}$.
It is impossible for $n_3 = 10 \wedge n_5 = 6$, because otherwise there will be
$(3-1)\times 10$ elements of order $3$ and $(5-1)\times 6$ elements of order $5$.

Then, at least one of the Sylow subgroup $P_3$ and $P_5$ will be normal in $G$.
Thus, by Second Isomorphism Theorem, $N = P_3P_5\leq G$.
By $\rm{gcd}(3, 5) = 1$, $P_3\cap P_5 = \{1\}$ and thus $\|N\| = 15$, $N\cong C_{15}$.
$[G: N] = 2$, so $N$ is normal.

Thus, by S-Z theorem, $G\cong C_{15} \rtimes C_2$.
Now consider the group action $\alpha$ of $C_2$ on $C_{15}$.
We have $\mathrm{Aut}(C_{15}) \cong C_3^{\times}\times C_5^{\times}\cong C_2\times C_4$.
Since $1$ in $C_2$ has order 2, its image's order should divide 2.
There are only 4 elements: $\{(0,0),(1,0),(0,2),(1,2)\}$ or equivalently $\{[1 ], [11 ], [4 ], [14 ]\}$
Thus, there are 4 isomorphic types.
By the definition of $\rtimes$, for $a, b\in C_{15}$ and $h\in C_2$, we have
- $(a, 0)\cdot (b, h) = (a+b, h)$;
- $(a, 1)\cdot (b,h) = (a+\alpha(b), h) = (a+\alpha(1)b, h)$.

Now let's inspect these four types:

- For $\alpha(1) = [1 ]$, we have $C_{15} \rtimes C_2\cong C_{15} \times C_2 \cong C_{30}$.
  - If $n, m$ coprime, then $(1,1)\in C_n\times C_m$ is of order $nm$ and thus $C_n\times C_m\cong C_{nm}$.
- For $\alpha(1) = [14 ] = [-1 ]$, $C_{15} \rtimes C_2\cong D_{15}$.
  - $D_n \cong C_n\rtimes_{-1} C_2$, with $(p,q)$ mapping to $r^ps^q$.
- For $\alpha(1) = [4 ]$, the element $(1,1)$ has order $6$ ($(1,1)\to(5,0)\to(6,1)\to(10,0)\to(11,1)\to(0,0)$).
  Thus, we have $C_{15} \rtimes C_2\cong C_3\times D_{5}$.
  - With $(0,0)\mapsto (0,e)$, $(0,1)\mapsto (0,s)$, $(1,0)\mapsto (1,r)$, $(6,0)\mapsto (0,r), (10,0)\mapsto (1,e)$.
- For $\alpha(1) = [11 ] = [-4 ]$, the element $(1,1)$ has order $10$.
  We have $C_{15} \rtimes C_2\cong C_5\times S_3$.
  - With $(0,0)\mapsto(0,())$, $(6,0)\mapsto(1,())$, $(0,1)\mapsto(0,(12))$, $(0,1)\mapsto(0,(23))$,
    $(5,1)\mapsto(0,(23))$, $(10,0)\mapsto(0,(123))$, $(5,0)\mapsto(0,(123))$.

## Misc on Group

### Five Lemma (5項補題)

It's hard to show without figure (＞_＜)
Let $G_1 \to G_2 \to G_3 \to G_4 \to G_5$ and $H_1 \to H_2 \to H_3 \to H_4 \to H_5$ be exact (完全) at 2,3,4.
Let homomorphisms $f_i: G_i \to H_i$ be commutative in the square diagram.
Then, if $f_1, f_2, f_4, f_5$ are isomorphisms, so is $f_3$.

#### Proof
Prove by chasing on two 4-squares.
Let $\alpha_i: G_i\to G_{i+1}$ and $\beta_i: H_i\to H_{i+1}$ denote those exact homomorphisms.

Claim: $f_3$ is onto:
- Arbitrarily pick $h_3\in H_3$.
- Since $f_4$ is surjective, there exists $g_4\in G_4$ s.t. $f_4(g_4) = \beta_3(h_3)$.
- By exactness at $H_4$, $\beta_5\circ\beta_4(h_3) = 1$.
- By commutativity, $f_5\circ\alpha_4(g_4) = \beta_4\circ f_4(g_4) = \beta_5\circ\beta_4(h_3) = 1$.
- Since $f_5$ is injective, $\alpha_4(g_4) = 1$; thus, $g_4\in\mathrm{Im}(\alpha_3)$.
- Pick $g_3\in G_3$ s.t. $\alpha_3(g_3) = g_4$.
- Let $z = f_3(g_3)^{-1}h_3$.
- Then, $\beta_3(z) = f_4(g_4)^{-1}\beta_3(h_3) = 1$.
- By the exactness at $H_3$, $z\in \mathrm{Im}(\beta_2)$.
- Since $f_2$ is surjective, there exists $g_2\in G_2$ s.t. $\beta_2\circ f_2(g_2) = z = f_3\circ\alpha_3(g_2)$.
- Thus, $f_3(g_3\cdot\alpha_3(g_2)) = h_3$.

Similarly, $f_3$ is one to one.
Thus, $f_3$ is an isomorphism.

## References

- Saunders Mac Lane, Categories for the working mathematician, Springer Science & Business Media, 2013.
- Paul Balmer, UCLA MATH210A, Fall 2020.
