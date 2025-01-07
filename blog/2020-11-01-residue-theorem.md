---
title: 'Residue Theorem and its Application'
authors: kinu
hide_table_of_contents: false
format: md
tags:
  - complex-analysis
  - combinatorics
---

This post makes notes on residue theorem and its application,
since most non-mathematicians only need to remember this after learning complex analysis.
Some definitions may be not defined very rigorously from a complex analysis view.

<!-- truncate -->

## Isolated Singularity

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

## Residue Theorem

The residue is the coefficient of $-1$ term of the Laurent expansion ($c\neq\infty$):

$$
\operatorname{res} f(c) = a_{-1} \quad\text{if}\ \ f(z) = \sum_{n=-\infty}^{+\infty}{a_n(z-c)^n}
$$

Let $U$ be a simply connected open set, $f$ be analytic in $U\setminus\{c_1,\ldots,c_m\}$ and continuous in $\bar{U}$,
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

## Sum of Infinite Series

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
If $f(z)$ satisfies all conditions above and all poles $\{c_1, \ldots, c_m\}$ are non-integer, then

$$
\sum_{n=-\infty}^{+\infty}f(n) = - \sum_{i=1}^{m}{\operatorname{res} \{\pi\cot{\pi z}f(z), z=c_i\} }
$$

**Proof**:
Take $N\to\infty$.
For any $n\in\mathbb{Z}$,

$$
\begin{darray}{rcl}
\operatorname{res} \{\pi\cot{\pi z}f(z), z=n\} &=& \lim_{z\to n}(z-n)\pi\cot{\pi z}f(z)  \\
 &=& \lim_{z\to n}\frac{\pi\cos {\pi z}}{(\sin {\pi z})'}f(z)  \\
 &=& f(n)
\end{darray}
$$

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

## Asymptotics of Generating Functions

**Principles of Coefficient Asymptotics**: For $[ z^n]F(z) = A^n\theta(n)$
- The *location* of a function’s singularities dictates the *exponential growth* ($A^n$) of its coefficients.
- The *nature* of a function’s singularities determines the associate *subexponential factor* ($\theta(n)$).

### Exponential Growth

**Def**: $\{a_n\}$ is of *exponential order* $K^n$ if for any $\epsilon>0$,
$|a_n|$ exceeds $(K-\epsilon)^n$ infinitely often and is dominated by $(K+\epsilon)^n$ cofinitely.

<!-- % \newcommand\bowtie{\mathrel\triangleright\joinrel\mathrel\triangleleft}   -->

$$
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

### Subexponential Factor

One can show that if singularities of $f(z)$ are polar, then $\theta(n)$ is a polynomial.

**Def**: If $f(z) = \frac{N(z)}{D(z)}$ with $N, D$ being polynomials, $f(z)$ is a *rational function*.

Coefficients of rational functions satisfy linear recurrence relations with constant coefficients:

$$
[z^n ]f(z)D(z) = \sum_{j=0}^{m}d_j f_{n-j} = 0 \qquad \text{for all}\  n>\mathrm{deg}(N)
$$

**Rational Function Case**: If $f(z) = \frac{N(z)}{D(z)}$ is a rational function that is analytic at 0 and
has poles at $a_1, \ldots, a_m$, then its coefficients are a sum of exponential–polynomials.
That is, for $n$ larger than $n_0:= \mathrm{deg}(N) - \mathrm{deg}(D)$:

$$
f_n := [z^n ]f(z) = \sum_{j=1}^{m}P_j(n)a_j^{-n}
$$

Furthermore, the degree of $P_j$ is equal to the order of the pole of $f$ at $a_j$ minus one.

**Proof**:
Apply the partial fraction expansion:

$$
f(z) = Q(z) + \sum_{j=1}^{m}\frac{c_j}{(z-a_j)^{r_j}}
$$

where $Q$ is of degree $n_0$.
Since

$$
[z^n ]\frac{1}{(z-a)^r} = \frac{(-)^r}{a^r}[z^n ]\frac{1}{(1-\frac{z}{a})^r} =
\frac{(-)^r}{a^r} {n+r-1 \choose r-1} a^{-n}
$$

The binomial coefficient is a polynomial of degree $r − 1$ in $n$.
Collect all terms.

**Cor**: If $f(z) = \frac{N(z)}{(z-a)^r}$ that has a single dominant pole $a$ with order $r$, then

$$
f_n = (-)^r\frac{C}{(r-1)!}a^{-r}a^{-n}n^{r-1}\left( 1+O\left(\frac{1}{n}\right) \right)
\quad \text{with} \quad C = \lim_{z\to a}(z-a)^r f(z)
$$

This is a direct result of the theorem. (The book has a typo)
For $r=1$, one can verifies:

$$
\frac{c}{x-a} = - \frac{\frac{c}{a}}{1 - \frac{x}{a}} = -\frac{c}{a}a^{-n}x^{n}
$$


*Example*: Fibonacci numbers have OGF $F(z) = \frac{z}{1 - z - z^2}$.
The poles are $a_1 = - \varphi = -\frac{\sqrt{5}+1}{2}$ and $a_2 = \psi = \frac{\sqrt{5} - 1}{2}$.
$\operatorname{res} F(\psi) = \frac{\sqrt{5} - 5}{10}$, $\operatorname{res} F(-\varphi) = \frac{-\sqrt{5} - 5}{10}$.
Thus,

$$
f_n \sim \frac{1}{\sqrt{5}}\psi^{-n}(1 + O(1/n)) = \frac{1}{\sqrt{5}}\varphi^{n}(1 + O(1/n))
$$

Actually,

$$
f_n = \frac{1}{\sqrt{5}} (\varphi^n - (-\varphi)^{-n})
$$

**Analytic Function Case**:
If $f(z)$ is analytic at $\|z\| \leq R$ except for poles $a_1, \ldots, a_m$.
Then, there exist $m$ polynomials $P_j$ s.t.

$$
f_n := [z^n ]f(z) = \sum_{j=1}^{m}P_j(n)a_j^{-n} + O(R^{-n})
$$

Furthermore, the degree of $P_j$ is equal to the order of the pole of $f$ at $a_j$ minus one.

**Proof**: (The 1st one by the book)
Take the Laurant expansion of $f(z)$ at $a$:

$$
f(z) = \sum_{k\geq r} c_{a,k}(z-a)^k = S_a(z) + H_a(z)
$$

where $S_a$ is the principal part and $H_a$ is the regular part.
Note that $S_a$ is polynomial.
Let $S = \sum_{j}S_{a_j}$.
Observe that and $f-S$ is analytic for $\|z\| \leq R$.
Then.

$$
f_n := [z^n ]f(z) = [z^n ]S(z) + [z^n ] (f-S)(z)
$$

The coefficient of $S$ is obtained by the polynomial theorem.
And, by saddle-point bound at $z=R$,

$$
|[z^n ] (f-S)(z)| = \frac{1}{2\pi}\left| \oint_{|z|=R} (f(z) - S(z))\frac{\mathrm{d}z}{z^{n+1}} \right|
\leq \frac{1}{2\pi} \frac{O(1)}{R^{n+1}} 2\pi R
$$

*example*: The EGF of the number of surjections $R(z) = \frac{1}{2 - e^z}$ has
a dominant pole $a = \ln 2$ of order $1$.
$\operatorname{res} R(a) = -\frac{1}{2}$.
Thus,

$$
\frac{r_n}{n!} \sim \frac{1}{2\ln 2}(\ln 2)^{-n} (1 + O(1/n))
$$


<!--Analytic Combinatorics p259-269-->

## References
- Wu Chongshi, Methods of Mathematical Physics, Peking University Press, 2003.
- Ph. Flajolet and R. Sedgewick, [Analytic Combinatorics](https://ac.cs.princeton.edu/home/), Cambridge University Press, 2009.
