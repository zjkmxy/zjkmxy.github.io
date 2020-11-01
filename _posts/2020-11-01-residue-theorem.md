---
title: 'Residue Theorem and its Application'
date: 2020-11-01
permalink: /posts/2020/11/residue-theorem/
tags:
  - complex analysis
---

This post makes notes on residue theorem and its application,
since most non-mathematicians only need to remember this after learning complex analysis.
Some definitions may be not defined very rigorously from a complex analysis view.

Isolated Singularity
======

There are 3 kinds of isolated singularities for a single-valued function $f(z)$,
- **removable singularities**: The limit $\lim_{z\to c}f(z)$ exists.
  - The function becomes analytic at $c$ if we define $f(c)$ to be this limit.
  - The Laurent expansion about $c$ does not contain negative terms (terms with negative degree).
- **poles**: The limit $\lim_{z\to c}f(z) = \infty$.
  - The Laurent expansion about $c$ contains finitely many negative terms (i.e. finite principal part)
  - The *order* of pole $c$ is the integer $n$ s.t. $(z-c)^nf(z)$ is analytic and non-zero at $z$.
- **essential singularities**: $\lim_{z\to c}f(z)$ diverges.
  - The Laurent expansion about $c$ contains infinitely many negative terms.

Liouville's theorem implies that any non-constant analytic function must have at least one pole or essential singularity.

Residue Theorem
======

The residue is the coefficient of $-1$ term of the Laurent expansion ($c\neq\infty$):

$$
\operatorname{res} f(c) = a_{-1} \quad\text{if}\ \ f(z) = \sum_{n=-\infty}^{+\infty}{a_n(z-c)^n}
$$

Let $U$ be a simply connected open set, $f$ be analytic in $U\setminus\\{c_1,\ldots,c_m\\}$ and continuous in $\bar{U}$,
$C$ be the boundary of $U$ which is a closed rectifiable curve.
Then,

$$
\oint_{C} f(z)\mathrm{d}z = 2\pi\mathrm{i}\sum_{k=1}^{m}{\operatorname{res} f(c_k)}
$$

If $c$ is a pole of order $m$, then the residue at $c$ is

$$
\operatorname{res} f(c) = \lim_{z\to c}\frac{1}{(m-1)!}\frac{\mathrm{d}^{m-1}}{\mathrm{d}z^{m-1}}(z-c)^{m}f(z)
$$

Especially, when $m=1$:

$$
\operatorname{res} f(c) = \lim_{z\to c}(z-c)f(z)
$$

**Proof (sketch)**:
Break $C$ into multiple loops that enclose a pole each.
By the coefficient of Laurent expansion:

$$
a_n = \frac{1}{2\pi\mathrm{i}}\oint_{C}{\frac{f(z)}{(z-c)^{n+1}}\mathrm{d}z}
$$

Another way to look at this is that $\frac{1}{z^n}$ is single-valued and goes to 0 along a loop.
But $\ln z$ increases by $2\pi\mathrm{i}$.

Sum of Infinite Series
======

Suppose the target series to calculate is $\sum_{n=-\infty}^{\infty}{f(n)}$, with $f(n) = O(\frac{1}{n})$.
Let $G(z) = \pi\cot{\pi z}$. Note that $G$ is analytic in $\mathbb{C}\setminus\mathbb{Z}$ and 
$\operatorname{res}G(n) = 1$ for all $n\in \mathbb{Z}$.
Take curve $C_N$ be the square $[-N-\frac{1}{2}, N+\frac{1}{2}]\times[(-N-\frac{1}{2})\mathrm{i}, (N+\frac{1}{2})\mathrm{i}]$.

**Theorem**:
If $f(z)$ has finitely many poles in $\mathbb{C}$ and analytic in the rest of the complex plane, then

$$
\lim_{N\to\infty}\oint_{C_N} G(z)f(z)\mathrm{d}z = 0
$$

**Proof**:
$|\pi\cot{\pi z}| \leq 2\pi$ on the curve $C_N$.

**Theorem**:
If $f(z)$ satisfies all conditions above and all poles $\\{c_1, \ldots, c_m\\}$ are non-integer, then

$$
\sum_{n=-\infty}^{+\infty}f(n) = - \sum_{i=1}^{m}{\operatorname{res} \{\pi\cot{\pi z}f(z), z=c_i\} }
$$

**Proof**:
Take $N\to\infty$.
For any $n\in\mathbb{Z}$,

$$\begin{eqnarray}
\operatorname{res} \{\pi\cot{\pi z}f(z), z=n\} &=& \lim_{z\to n}(z-n)\pi\cot{\pi z}f(z)  \nonumber \\
 &=& \lim_{z\to n}\frac{\pi\cos {\pi z}}{(\sin {\pi z})'}f(z)  \nonumber \\
 &=& f(n)
\end{eqnarray}$$

Apply the theorem above.

**Example**:

$$
\sum_{n=1}^{\infty} {\frac{1}{n^2}} = \frac{\pi^2}{6}
$$

**Proof**:
We cannot use the theorem directly, but we have

$$
\operatorname{res} \{\frac{\pi\cot{\pi z}}{z^2}, z=0\} = [z^1 ] (\pi\cot{\pi z})
$$

Suppose the Laurent expansion of $\cot z$ at $z=0$ is

$$
\cot z = \sum_{n=-1}^{+\infty} {b_{2n+1} z^{2n+1}}
$$

Then,

$$
\sum_{p=0}^{\infty}{\frac{(-)^p}{(2p)!}z^{2p}} = \cos z = \sin z\sum_{n=-1}^{+\infty} {b_{2n+1} z^{2n+1}}
 = \sum_{q=0}^{\infty}{\frac{(-)^q}{(2q+1)!}z^{2q}} \sum_{n=0}^{+\infty} {b_{2n-1} z^{2n-1}}
$$

Thus,

$$
\sum_{n=0}^{p}{\frac{(-)^n}{(2p-2n+1)!} b_{2n-1}} = \frac{1}{(2p)!}
$$

Solve it and get

$$
\cot z = \frac{1}{z} - \frac{1}{3}z - \frac{1}{45}z^3 - \frac{2}{945}z^5 - \cdots
$$

Substitute $- \frac{1}{3} \pi^2$ into the first equation for $[z^1 ] (\pi\cot{\pi z})$.

Asymptotics of Generating Functions
======

**Principles of Coefficient Asymptotics**: For $[ z^n]F(z) = A^n\theta(n)$
- The *location* of a function’s singularities dictates the *exponential growth* ($A^n$) of its coefficients.
- The *nature* of a function’s singularities determines the associate *subexponential factor* ($\theta(n)$).

**Def**: $\\{a_n\\}$ is of *exponential order* $K^n$ if for any $\epsilon>0$,
$|a_n|$ exceeds $(K-\epsilon)^n$ infinitely often and is dominated by $(K+\epsilon)^n$ cofinitely.

$$
% \newcommand\bowtie{\mathrel\triangleright\joinrel\mathrel\triangleleft}
a_n \bowtie K^n \qquad \text{iff} \qquad \lim \sup |a_n|^{1/n} = K
$$

This can be rephrased as $a_n = K^n\theta(n)$ where $\lim\sup \|\theta(n)\|^{1/n} = 1$.

**Exponential Growth Formula**: If the radius of convergence of the series $f_n = [z^n ]f(z)$ at 0 is
$\mathrm{R_{conv}}(f; 0) = R$, then

$$
f_n \bowtie \left( \frac{1}{R} \right)^n
$$

**Proof**:

- By the definition of radius of convergence, $ \| f_n \|(R-\epsilon)^n\to 0$.
- If $ \| f_n \|(R+\epsilon)^n$ were bounded, then $ \| f_n \|(R+\frac{1}{2}\epsilon)^n$ would converge.
  So $ \| f_n \|(R+\epsilon)^n$ is unbounded.

Note: for a complex series $f(z)$, $R$ is the modulus of a singularity nearest to the origin.

*Example*: The EGF of the number of surjections (surjections from $[ n]$ to $[ m]$ for some $m$),
and the EGF of the number of chains in Boolean lattice $B_n$, are

$$
R(z) = \frac{1}{2 - e^z}
$$

By the proposition, we have $\frac{r_n}{n!} \bowtie \frac{1}{(\ln 2)^{n}}$.

**Saddle-point bound**: Let $M(f; r) := \sup_{|z| = r}|f(z)|$ (the maximum modulus on a ring) for $r< R$.
Then, for any $r\in (0,R)$, the family of saddle point bounds

$$
[z^n ]f(z) \leq \frac{M(f; r)}{r^n} \qquad \text{implying} \qquad [z^n ]f(z) \leq \inf_{r\in(0,R)}\frac{M(f; r)}{r^n}
$$

If in addition $f(z)$ has non-negative coefficients, then

$$
[z^n ]f(z) \leq \frac{f(r)}{r^n} \qquad \text{implying} \qquad [z^n ]f(z) \leq \inf_{r\in(0,R)}\frac{f(r)}{r^n}
$$

The best $r$ can be obtained by the zero derivative:

$$
r\frac{f'(r)}{f(r)} = n
$$

**Proof**:

By the coeffcients of Laurent expansion:

$$
[z^n ]f(z) = \frac{1}{2\pi \mathrm{i}}\oint_{|z|=r} f(z)\frac{\mathrm{d}z}{z^{n+1}}
$$

*Example*: Apply this to $[ z^n]e^z$ we have

$$
\frac{1}{n!} \leq \frac{e^n}{n^n}
$$

To Be Continued ...

<!--Analytic Combinatorics p259-269-->

References
======
- Wu Chongshi, Methods of Mathematical Physics, Peking University Press, 2003.
- Ph. Flajolet and R. Sedgewick, [Analytic Combinatorics](https://ac.cs.princeton.edu/home/), Cambridge University Press, 2009.