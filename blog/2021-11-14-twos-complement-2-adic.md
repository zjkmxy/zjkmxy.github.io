---
title: 'Two''s complement and 2-adic number'
authors: kinu
tags:
  - math
  - algebra
---

This posts discusses the relation between two's complement and 2-adic integer in math.
I want to show what operations we can have if we ignore overflow.

<!-- truncate -->

## $p$-adic number

The *p-adic number* system is a different extension to the rational number field $\mathbb{Q}$.
Consider the $p$-radix representation of a fraction. Say $\frac{1}{7}$ in decimal:

$$
\frac{1}{7} = \frac{142857}{10^6-1} = \frac{0.142857}{1-10^{-6}}
= \sum_{j=1}^{\infty} 142857\times 10^{-6j} = 0.\overline{142857}\cdots
$$

This is a power series of $10^{-1}$. Here we use $\frac{1}{1-p} = \sum_{j=0}^{\infty}x^j$.
If we accept all possible power series:

$$
\sum_{j=-m}^{\infty} a_j\times 10^{-j}
$$

we get the real number $\mathbb{R}$. (Well, more strictly we need to make $0.\overline{9}=1$)

However, we can also expand the same number in power series of $10^1$:

$$
\frac{1}{7} = - \frac{142857}{1-10^{6}}
= - \sum_{j=0}^{\infty} 142857\times 10^{6j} = 1+\sum_{j=0}^{\infty} 857142\times 10^{6j}
= \cdots\overline{285714}3.0
$$

If we accept all possible power series:

$$
\sum_{j=-m}^{\infty} a_j\times 10^{j}
$$

we get 10-adic numbers.
This series does not converge under normal metric, but if we define
a new metric $\|10^ab\| = 10^{-a}$ with $b$ not divisible by $10$,
such power series converge.
Typically we only use prime $p$, so a $p$-adic number is represented in a reverse $p$-base numeral system,
where one can have infinite digits above the decimal point but finitely many after.
It is a field of characteristic $0$, denoted by $\mathbb{Q}_p$.
If we limit ourselves to those numbers without minus powers of $p$,
i.e. without digits after decimal point,
we have $p$-adic integer $\mathbb{Z}_p$.
Formally, we define it as the inverse limit $\mathbb{Z}_p:= \varprojlim_{n=1}^{\infty}\mathbb{Z}/p^n\mathbb{Z}$,
with projection $\mathbb{Z}/p^{n+1}\mathbb{Z}\to \mathbb{Z}/p^n\mathbb{Z}$.
That is, the limit of finite ring $\mathbb{Z}/p^n\mathbb{Z}$ when $n\to\infty$.
In a computer, we use finitely many bits to store an integer ($\mathbb{Z}/2^n\mathbb{Z}$).
Imagine that if we extend it to infinitely many bits, we get $2$-adic number $\mathbb{Z}_2$.

## Basic Operations

### Addition & Subtraction

The normal integer $\mathbb{Z}$ embeds in $\mathbb{Z}_2$. More specifically, we have

$$-1 = \frac{1}{1-2} = \sum_{j=0}^{\infty} 2^i = \cdots\overline{1}
$$

Thus, $-n$ is equal to $\overline{1}-(n-1)$, i.e. the binary complement of $n-1$.
This is exactly how we represent negative integers in 2's complement: take complement and add one.
In this sense, we can take 2's complement representation as *the last $n$ bits of 2-adic representation*.

2-adic representation works for every number in 2-adic ring.
The same bit-by-bit addition and subtraction algorithm works for both positive and negative numbers.
Therefore, 2's complement is in the same situation:
signed and unsigned integers are only about how humans interpret it;
there is no need to separate them when we perform operations.
That's why in x86 assembly we only have `ADD/ADC` and `SUB/SBB`.

But when we convert an integer of a small word size to a wider word,
we do need to tell whether it's negative or not.
For negative integers, we fill in higher bits with 1; for positive, 0.
Therefore, in x86 we have different instructions to extend an integer:
Sign extension `CBW/CWDE/CDQE/MOVSX/MOVSXD` for signed integers; zero extension `MOVZX` for unsigned integers.

### Multiplication & Euclidean Division

Since 2-adic ring is closed under multiplication, the 2-adic representation works for both positive and negative.
Therefore, signed and unsigned multiplication are the same.
In x86 assembly we have `IMUL` vs `MUL`,  but this is simply because x86 multiplication extends the result to a longer word.
If we ignore the extended part:

$$(2^na_h +a_l)\times(2^nb_h +b_l)
= 2^n(2^na_hb_h + a_hb_l + a_lb_h)  + a_lb_l
$$

which shows that $a\times b$ modulo $2^n$ is the product of each modulo $2^n$.

However, Euclidean division is a different story, because 2-adic numbers do not support comparison.
For example, if we divide $8$-bit $-37(=11011011_{2})$ by $-3(=11111101_2)$,
we get $12(=00001100_{2})$ with $-1(=11111111_{2})$.
But if we divide $219(=11011011_{2})$ by $253(=11111101_{2})$,
we get $0$ with remainder $219$.

### Inversion

In 2-adic number ring, any number not divisible by 2 has a unique multiplicative inverse.
For example,

$$
\frac{1}{45} = -\frac{91}{1-2^{12}} = - \sum_{j=0}^{\infty} 1011011_{2}\times 2^{12j}
= 1+\overline{111110100100}.0_{2} = \overline{011111010010}1.0_{2}
$$

This also works in finite word length if we multiply with overflow.
For example, in $32$-bit integer,
$1/45$ is truncated to $-1527099483(=10100100111110100100111110100101_{2})$,
and we have `(-1527099483) * 45 == 1` in C++ `int`.

Note that the binary fraction form of $1/45$ is

$$
\frac{1}{45} = \frac{91}{2^{12}-1} = \sum_{j=1}^{\infty} 1011011_{2}\times 2^{-12j}
= 0.\overline{000001011011}_{2}
$$

So the "flip and add one" rule somehow applies here.

## Multiplicative Group

An interesting fact is the multiplicative group of $\mathbb{Z}_2$ is
$\mathbb{Z}^{\times}_2 \cong \mathbb{Z}_2\times \mathbb{Z}/2\mathbb{Z}$,
which contains itself as a component.

To show this, let $U=\mathbb{Z}^{\times}$ and
$\varepsilon_n: U\to (\mathbb{Z}/2^n\mathbb{Z})^{\times}$ being the projection modulo $2^n$.
The kernal of this projection is $U_n = 1+2^n\mathbb{Z}_2$.
Clearly, we have $U_1 = U$ since every odd number is invertible.
Also, the map $1+2^nx\mapsto x\mod 2$ defines an isomorphism $U_n/U_{n+1} \cong \mathbb{Z}/2\mathbb{Z}$, because

$$(1+2^nx)(1+2^ny) \equiv 1+2^n(x+y) \mod 2^{n+1}
$$

Now, define $\theta_n: \mathbb{Z}/2^{n}\mathbb{Z}\to U_2/U_{n+2}$
be $x\mapsto 5^x$.
Note that:

$$
5^{2^n} = (1+2^2)^{2^n} = 1 + 2^{n+2} + \cdots \in U_{n+2}\setminus U_{n+3}
$$

$U_2/U_{n+2}$ is of order $2^n$. In this group we have $5^{2^{n-1}}\neq 1$ and $5^{2^n} = 1$.
Thus, $U_2/U_{n+2}$ is cyclic and generated by $5$.
Take the inverse limit and get

$$U_2 = \varprojlim_{n=1}^{\infty}U_2/U_{n+2} \cong \varprojlim_{n=1}^{\infty}\mathbb{Z}/2^{n}\mathbb{Z} = \mathbb{Z}_2$$

On the other hand, $U_1/U_2 \cong \mathbb{Z}/2\mathbb{Z}$
with $1+2(2z+1) = 3\times(1+2^2(z/3))$.
Thus, every invertible element $x\in \mathbb{Z}_2^{\times}$ can be written as
$x = 5^zt$, where $z\in\mathbb{Z}_2$ and $t\in \{1, 3\}$ or $t\in \{1, -1\}$.

Now let's move to the finite case $\mathbb{Z}/2^n\mathbb{Z}$.
We know that $\mathbb{Z}/p^n\mathbb{Z}$ ($n\geq 3$) has a primitive root if and only if $p$ is an *odd* prime.
From the argument above, we further learn that the multiplicative group
of $\mathbb{Z}/p^n\mathbb{Z}$ is actually of form $\{5^z, 3\times 5^z: 0\leq z< 2^{n-2}\}$ or
simply $\{\pm 5^z: 0\leq z< 2^{n-2}\}$, when $n\geq 3$.

### Square numbers

Every $2^px\in \mathbb{Z}_2$ is a square number if and only if $p$ is even and $x$ is a square number.
By the analysis above, the latter one is equivalent to $x\equiv 1\ (\mathrm{mod}\ 8)$.
The same condition applies to finite ring $\mathbb{Z}/2^n\mathbb{Z}$.

Note that this shows that every square number in $\mathbb{Z}/2^n\mathbb{Z}$ has **four** square roots.
For example, the square roots of $1$ are $\{\pm 1, \pm 5^{2^{n-3}} = 2^{n-1}\pm 1 \}$,
with two of them divisible by $3$.
For 32-bit unsigned int, they are $\{1, 2147483647, 2147483649, 4294967295\}$, which is exactly
$\{1, 2^{31}-1, -(2^{31}-1), -1\}$ as a signed int.

This does not give any contradiction to the theorem that
a polynomial of degree $d$ over a domain (e.g. $\mathbb{Z}_2$) can have at most $d$ distinct roots.
Because the two non-trivial roots of $1$ in $\mathbb{Z}/2^n\mathbb{Z}$ are
$2^{n-1}\pm 1$, which cannot be lifted to a real solution in $\mathbb{Z}_2$.

### Hilbert symbol

Define the Hilbert symbol $(a,b)$ to be $1$ if $ax^2+by^2=z^2$ has a non-trivial solution,
and $-1$ otherwise.
Let $(a,b) = (-1)^{ [ a , b ] }$.
Then, $[ a , b ]$ is a bilinear form on $\mathbb{Q}_2^{\times}/\mathbb{Q}_2^{\times 2}$.
Under basis $\{2, -1, 5\}$, its matrix is
$\begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ 1 & 0 & 0 \end{bmatrix}$.
The proof is omitted as it contains a lot of computation.

<!--Quadratic form
%======


%Anti-hash test for string
%======-->


## References

- Serre, J.-P. (1973). A course in arithmetic. Springer.
