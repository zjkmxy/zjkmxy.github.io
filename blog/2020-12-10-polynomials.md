---
title: 'Polynomial Algorithms'
authors: kinu
tags:
  - algorithm
  - algebra
---

This post introduces some tricks on polynomials widely used in ICPC.
I will try to practice algebraic knowledge as well.

<!-- truncate -->

## Polynomial Inverse

**Prop**: Let $R$ be a commutative ring and $I$ be an ideal.
Then $[p ]_I$ is a unit in $R/I$ if and only if $\langle p\rangle$ is coprime with $I$.

*Proof*: $1\in Rp+I$ is equivalent to $\langle p\rangle+I = R$.

**Cor**: For $R$ UFD, $f\in R[ X]/\langle X^n\rangle$ is a unit if and only if $f(0)$ is a unit in $R$.

*Proof*: $R$ being a domain implies $X^a$ ($a< n$) are the only factors of $X^n$.
Suppose $f(0)$ is a unit, then $f$ is coprime with $X^n$ in $K[ X]$, where $K$ is the fractional field of $R$.
Suppose $fg = 1$ in $K[ X]$.
Since the content of $f$ is associated to $1$, by Gauß's lemma, $C(f\hat{g})$ is also associated to $1$.
Since $f\hat{g} = h\cdot X^n + f(0)\hat{g}(0)$, $[ f(0)\hat{g}(0)]^{-1}\hat{g}$ is the inverse of $f$ modulo $X^n$.
The "only if" part is trivial.

**Prop**: If $fg = h\cdot X^n + 1$, then $(2-fg)g\cdot f = -h^2\cdot X^{2n} +1$.

This proposition gives a binary lifting algorithm to calculate $f^{-1}$ modulo $X^n$,
in $O(n\log n)$.


## Newton's Method

Let $R$ be a commutative ring and $f:= \sum_{i=0}^{\infty} b_iX^i \in R[[ X]]$ be a power series.
Suppose $f(a)\in Rp$ for some $a,p\in R$, i.e. $a$ is a root to $f$ modulo $p$.
Then, use the substitution $X = a+Yp$ we have

$$
\begin{darray}{rcl}
f(X) &=& \sum_i b_i(a+Yp)^i \\
&=& \sum_i b_ia^i + \sum_i ib_{i+1}a^iYp + p^2Y^2\left(\ldots\right) \\
&=& f(a) + Ypf'(a) + p^2Y^2\left(\ldots\right)
\end{darray}
$$

Therefore, we have $f(a+Yp)\in Rp^2$ iff $f(a) + f'(a)pY \in Rp^2$.
Since $p\mid f(a)$, if $f'(a)$ is invertible in $R/p^2R$, we have $p\mid f(a)f'(a)^{-1}$.
Thus, $Y = a - f(a)f'(a)^{-1}$ is a root to $f$ modulo $p^2$ in this case.
Furthermore, if $R$ is a UFD then $f'(a)$ is invertible in $R/p^2R$ iff $p \nmid f'(a)$.

Now, substitute $R$ with $R[ X]$ and $p$ with $X^m$.
Consider $g\in R[ X, Y]$, but it can have infinite terms on $Y$.
If there is some $a\in R$ s.t. $g(0, a) = 0, \frac{\partial g}{\partial Y}(0, a)\in R^{\times}$,
then we can calculate the "root" of $g(X, f(X))$ in $R[ X]/\langle X^n\rangle$ for any $n$:
- Let $f_0(X) = a$ and $n_0 = 1$
- Let $f_i(X) = a - g(X, f_{i-1}) \left(\frac{\partial g}{\partial Y}(0, f_{i-1})\right)^{-1}$ and $n_i = 2n_{i-1}$.
  - Note that $X\mid g(X, f_{i-1})$. Thus, if the first derivative is invertible, all derivatives are invertible.

### Examples

- Inverse $h(X)$: let $g(X, Y) = \frac{1}{Y} - h(X)$. Get $f_{i+1} = 2f_{i} - f_i^2h$.
  - Condition: $h(0)$ is invertible.
- Sqrt of $h(X)$: let $g(X, Y) = Y^2 - h(X)$. Get $f_{i+1} = \frac{1}{2}(f_i^2+h)f_i^{-1}$.
  - Condition: there exists $a$ s.t. $a^2 = h(0)$ and $2a\in R^{\times}$.
  - For exmaple, let $R = \mathbb{Z}/9\mathbb{Z}$ and $h(X) = X+1$.
    Starting from $f_0 = 1$ and $2\times 5 = 1$, we can get $f_2(X)= -5X^3+X^2+5X+1$ is the solution modulo $X^4$.
    - Well, $R$ is not a domain, but it works.
- Exp of $h(X)$: let $g(X, Y) = \ln Y - h(X)$. Get $f_{i+1} = f_i(X)(1 - \ln {f_i(X)} + h(X))$.
  - Log can be calculated by integral on $\frac{f'(X)}{f(X)}$.
  - Condition: $h(0)=0$

## Polynomial Modulus

Let $K$ be a field.
For $f\in K[ X]$ of degree $d$, let $f^T(X) := X^df(1/X)$ be the reverse of coefficients of $f$.
Suppose $f = gq + r$, where $f, g$ are of degree $n, m$ resp.
Then, $f^T(X) = g^T(X)q^T(X) + X^nr(1/X)$.
Since $r$ is of degree at most $m-1$, $X^{n-m+1}\mid X^nr(1/X)$.
Also, $q(X)$ is of degree $n-m < n-m+1$.
Thus, $q = [ f^T\cdot (g^T)^{-1}]^T (\text{mod }X^{n-m+1})$ and $r = f - gq$.

## FFT

Let $A$ be an $R$-algebra, and $g\in A^{\times}$ of order $n$.
Suppose $\sum_{i=0}^{n-1}g^{ik} = 0$ for all $1\leq k < n$ (generally true if $g^k-1$ is not a zero divisor).
For a sequence $a = (a_0, \ldots, a_{n-1})\in R^n$, its discrete Fourier transform
is $F(a) = (F_0(a), \ldots, F_{n-1}(a))\in A^n$ where

$$
F_k(a) = \sum_{i=0}^{n-1}a_ig^{ik}
$$

If $n$ is invertible in $A$, the inverse of DFT is

$$
a_i = \frac{1}{n}\sum_{k=0}^{n-1} F_k(a)g^{-ik}
$$

This is given by the zero sum condition.

The DFT of the cyclic convolution $a * b$ is the pointwise product of their DFT:

$$
\begin{darray}{rcl}
F_k(a*b) &=& F_k(a)F_k(b) \\
(a*b)_i &=& \sum_{j=0}^{n-1} a_j b_{(i-j)\mod n}
\end{darray}
$$

Thus, DFT can be used to compute convolution.
However, directly computing the sum does not reduce the time complexity.
Now we try to accelerate this. Suppose $n = 2^m$.

$$
\begin{darray}{rcl}
F_k(a) &=& \sum_{i=0}^{2^m-1}a_ig^{ik} \\
&=& \left(\sum_{i=0}^{2^{m-1}-1}a_{2i}g^{i\cdot 2k}\right) + g^k\left(\sum_{i=0}^{2^{m-1}-1}a_{2i+1}g^{i\cdot 2k}\right) \\
&=& F_k'(a_{even}) + F_k'(a_{odd})
\end{darray}
$$

where $F_k'$ is the DFT of length $n/2$ using $g^2$ as the primitive root instead of $g$.
Repeating this, we get $O(n\log n)$ fast Fourier transform (FFT) algorithm.

### Common settings

- $R=\mathbb{Z}$, $A=\mathbb{C}$, $g = e^{\frac{2\pi i}{n}}$
- $R=A=\mathbb{Z}/p$, for some prime number $p = c\cdot 2^m + 1$.
  - $p = 0\text{x}\text{C}0000001$, $g = 5$, $m = 30$
  - $p = 0\text{x}78000001$, $g = 22$, $m = 27$
  - $p = 0\text{x}3\text{B}800001$, $g = 3$, $m = 23$
  - $p = 0\text{x}0\text{A}000001$, $g = 3$, $m = 25$

## Lagrange polynomial

Let $K$ be a field and $f\in K[ X]$ is of degree $d$.
If we know its value on $d+1$ different points $x_0, \ldots, x_d\in K$ and $f(x_0), \ldots, f(x_d)\in K$,
then we can recover the coefficients of $f$.

Let $l_i\in K[ X]$ be defined as:

$$
l_i(X) := \prod_{j\neq i}\frac{X - x_j}{x_i - x_j}
$$

Then, $l_i$ is $1$ at $x_i$ and $0$ at other points $x_j\neq x_i$.
Let $l := \sum_{i=0}^{d} y_il_i$, then $f = l$.
Because otherwise, $f-l$ will be a polynomial of degree $d$ but have $d+1$ disjoint roots.

To evaluate $f(x)$, we can directly substitute $x$ into $l_i$, and get an $O(d^2)$ algorithm.

### Example: sum of powers

Let $f_k(n) = \sum_{i=1}^{n} i^k$.
By induction we can prove $f_k$ is a polynomial of degree $k+1$.
To calculate $f_k(n)$, it suffices to compute $f_k(0), \ldots, f_k(k+1)$ and then interpolate.

## Multipoint Evaluation

Let $R$ be an commutative ring, $f\in R[ X]$ be a polynomial with degree less than $n$, $x_1,\ldots, x_n\in R$ be points.
Compute $f(x_1), \ldots, f(x_n)$.

Let $p_0(X) = \prod_{i=1}^{\lfloor n/2 \rfloor} (X - x_i)$ and $p_1(X) = \prod_{i=\lfloor n/2 \rfloor+1}^{n} (X - x_i)$.
Define $r_0(X) = f\mod p_0$ and $r_1(X) = f\mod p_1$.
Then it suffices to evaluate $r_0$ on $x_1,\ldots, x_{\lfloor n/2 \rfloor}$ and $r_1$ on $x_{\lfloor n/2 \rfloor+1},\ldots, x_{n}$,
as $f(x) = r_0(x)$ for all $x\in \{x_1, \ldots, x_{\lfloor n/2 \rfloor} \}$.
This divide-and-conquer algorithm works in $O(n\log^2 n)$.

In special case there are algorithms that run faster, e.g. $O(n\log n)$, but need more memory.

### Example: factorial

Let $f(X) := \prod_{i=1}^{n}(X+i)$. Then, $n! = f(0)$.
Let $g(X) := \prod_{i=1}^{v}(X+i)$, where $v = \lfloor\sqrt{n}\rfloor$.
Then,

$$
n! = \left( \prod_{i=0}^{v-1}g(vi) \right)\cdot \prod_{i=v^2+1}^{n}i
$$

Thus, it is enough to calculate $g(X)$ on $0, v, \ldots, v(v-1)$.

## Recursive Sequence

Suppose $\{a_i\}_ {\infty}$ is a sequence s.t. $a_i = \sum_{j=1}^{d} c_ja_{i-j}$.
Then, the array is decided by its first $n$ elements.

### Matrix Exponentiation

Clearly, we have

$$
\begin{pmatrix}
a_{n+d-1} \\
a_{n+d-2} \\
a_{n+d-3} \\
\vdots \\
a_n
\end{pmatrix} =
\begin{pmatrix}
c_1 & c_2 & \cdots & c_{d-1} & c_d \\
1 & 0 & \cdots & 0 & 0 \\
0 & 1 & \cdots & 0 & 0 \\
\vdots & \vdots & \ddots & \vdots & \vdots \\
0 & 0 & \cdots & 1 & 0
\end{pmatrix}^n
\cdot
\begin{pmatrix}
a_{d-1} \\
a_{d-2} \\
a_{d-3} \\
\vdots \\
a_0
\end{pmatrix}
$$

Thus, we can let $M$ denote the recurrenc matrix and calculate $M^n$ in $O(d^3\log n)$:
- $M^{2m} = (M^m)^2$
- $M^{2m+1} = (M^m)^2\cdot M$

### Polynomial Modulus

By Hamilton-Cayley theorem, the characteristic polynomial of $M$ is an annihilator of $M$.
Let $p(X) := X^d - \sum_{i=1}^{d}c_iX^{d-i}$ and $r_n(X) := X^n\mod p$.
Then, $A^n = r_n(A)$.
Thus, if $r_n(X) = \sum_{i=0}^{d-1} s_iX^i$,
then $a_n = \sum_{i=0}^{d-1} s_ia_i$.


However, there is a much cleaner way to view this.
Recall that given $c\in R$, we have $R[ X]/\langle X-c \rangle\cong R$ via $X\mapsto c$.
This somehow gives an solution for $a_i = ca_{i-1}$ as $a_i = c^i$.
We want to generalize this, but $a_1 \times a_1 \neq a_2$.
This inspires us that we should **forget the multiplication**.

Consider $R[ X]$ as a abelian group.
Then, define $f: R[ X]\to R$ as $f(uX^i) = u\cdot a_i$ for all $u\in R$ and $i\in\mathbb{N}$.
By the distributivity of $R$, $f$ is a well-defined *group* homomorphism.
Let $I = \langle p \rangle$ be the ideal generated by $p$.
We claim that $I$ is in the kernel of $f$.
Since $f$ preserves the addition, so it suffices to show that $f(uX^ip) = 0$ for all $u\in R$ and $i\in\mathbb{N}$.
This is clearly true since

$$
u(a_{i+d} - c_1a_{i+d-1} - \ldots - c_da_{i}) = u\cdot 0 = 0
$$

Observe that now $R$ becomes a cocone of the diagram $1\leftarrow I \hookrightarrow R$.
And $R/I$ is exactly the coproduct of this diagram, with canonical map $\pi: R\to R/I$ via $f\mapsto (f\mod p)$.
By the universality, $f = f\restriction_{R/I}\circ \pi$.
Hence, $a_n = f(X^n\mod p) = \sum_{i=0}^{d-1} s_ia_i$, with $s_i$ defined above.


### Berlekamp-Massey Algorithm

This is the inverse problem: given a recurrence sequence $\\{a_i\\}_ {\\infty}$ (first $2d$ elements are enough),
can we compute its recurrence relation $a_i = \sum_{j=1}^{d} c_ja_{i-j}$?

Again we use a polynomial to represent the recurrence relation.
Suppose $p_i\in R[ X]$ s.t. $p_i$ works for $a_j$, $0\neq j < i$.
Formally, this means $f(X^j\mod p_i) = a_j$ and $f(X^{j-\deg p_i}p_i) = 0$.
Let the error

$$
e_i = a_i + \sum_{j=1}^{\deg p_i} [ X^{\deg p_i-j}]p_i\cdot a_{i-j}
= f(X^{i-\deg p_i}p_i)
$$

- If $e_i = 0$, we can keep it $p_{i+1} = p_i$.
- If $e_i \neq 0$, we need to fix it.
  - Suppose $p_k\neq p_i$ is *some* polynomial we have different from $p_i$.
    Let $p_{i+1} = p_i + \frac{e_i}{e_k}p_kX^{i-k}$.

Clearly, $f(X^{i-\deg p_{i+1}} p_{i+1})=0$, so $p_{i+1}$ works for $a_{i}$.
One can verify it works for all $a_j$, $0\leq j\leq i$.

Now we want to minimize the degree of final $p$.
The flexibility we have is $p_k$ when fixing the error.
Massey argues that we can use the last $p_k$ s.t. $\deg p_{k+1} > \deg p_k$.

## References

- OI Wiki. [Polynomials](https://oi-wiki.org/math/poly/intro/).
- Wikipedia. [Lagrange polynomial](https://en.wikipedia.org/wiki/Lagrange_polynomial).
- [Factorial modulo Prime Numbers](https://min-25.hatenablog.com/entry/2017/04/10/215046).
- Chandan Saha. Computational Number Theory and Algebra. [Lecture 6](https://www.csa.iisc.ac.in/~chandan/courses/CNT/notes/lec6.pdf).
