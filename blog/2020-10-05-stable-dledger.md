---
title: 'Stability of DLedger'
authors: kinu
hide_table_of_contents: false
tags:
  - math
---

In this post I want to analyze the stability of [Dledger](https://arxiv.org/abs/1902.09031), a DAG-based distributed logging system.

<!-- truncate -->

## Brief Introduction

In Dledger, every record can refer to some existing records by putting the name of those records into its content.
This is done for 2 reasons:
- Keep a causal ordering among records.
- Make the whole system be directly or indirectly referred to by a small set of records, so we can synchronize on this set.

The **tailing records** are the records that have not been referred to by any other record.
One thing we need to confirm is that the number of tailing records $$T$$ is small.
Therefore we need to study the stability of $$T$$.

We may assume that record generation is a Poisson procedure,
that is, in a unit of time the number of records each node generate have a Poisson distribution with argument $$\lambda$$.
Assume the system has $$n$$ nodes and the number does not change.
Thus, total number of records generated is a Poisson distribution of $$n\lambda$$.

Since each record cannot be immediately received by another node after its generation,
we assume that there is a propagation time $$\Delta t$$,
so a record is invisible to all nodes before this time interval, and visible to all after it.

## Case 1: Refer to All

The easiest case is that each new record refers to all tailing records the node knows.
Then, the number of tailing records in the system will be this record,
plus all records generated in the past $$\Delta t$$ time.
The average is $$T_{mean} = 1 + n\lambda\Delta t$$.

This system is stable, since the value of $$T$$ at one time point is not affected by its previous value.
However, if $$T$$ is large enough, it may be not feasible to refer to all known tailing records in a single record.

## Case 2: Refer to $$r$$

In this case, a new record randomly pick $$r>1$$ records from the tailing records to refer to.
To simplify the calculation, we may assume that those $$r$$ records are sampled *with replacement*.
We also assume that the stable value of $$T$$ is larger than $$n$$, because otherwise it's degenerated to Case 1:
$$r < n\lambda\Delta t$$.

### Equilibrium

In this section, we assume the point of equilibrium $$T$$ is reached, and calculate its value.

Suppose a new record is generated.
At this time, the new record may see $$T$$ tailing records.
But they are really tailing only before $$\Delta t$$, since some records are generated during this time, but not visible yet.
There are $$n\lambda\Delta t$$ new records generated,
so by the assumption of equilibrium,
there will be the same number $$n\lambda\Delta t$$ of tailing records that are referred to and not tailing any more.
Therefore, if we randomly pick a record from the $$T$$ records, the probability of picking a record that is still tailing is

$$
p = \frac{T-n\lambda\Delta t}{T}
$$

$$T$$ is large, so the number of tailing records that this new record refers to is approximately $$rp$$.
By the assumption of equilibrium, whenever we add 1 new tailing record, on average 1 tailing record should be removed.
Thus, we have $rp = 1$ and

$$
T = \frac{r}{r-1}n\lambda\Delta t
$$

### With $$\Delta t$$ small

To show the dynamics of $$T$$, let's remove the assumption of equilibrium and take continuous approximation.

Suppose there are $$T'$$ tailing records.
Then, $$n\lambda\mathrm{d}t$$ records are generated, each of which makes $$r$$ references.
Therefore, if we assume that $$T'$$ records are visible to these newly generated records,
for one record, the probability of not being referred to is

$$
\left( 1 - \frac{1}{T'} \right)^{rn\lambda\mathrm{d}t}
$$

Hence, the number of current tailing records will be

$$
T = T'\left( 1 - \frac{1}{T'} \right)^{rn\lambda\mathrm{d}t} + n\lambda\mathrm{d}t
$$

Omit infinitesimals of higher order (by Taylor expansion) and get the dynamic equation:

$$
\mathrm{d}T = n\lambda\left[1 + rT\ln{\left(1 - \frac{1}{T}\right)}\right]\mathrm{d}t
$$

In the formula above, $$\mathrm{d}T$$ is always negative, which may come from the assumption that $$\Delta t$$ is small.

### With batched generation

Here we use a different model: we don't assume $$\Delta t$$ is small,
but records generation time is aligned with $$\Delta t$$ instead.
That is, all records generated from $$[t, t+\Delta t]$$ will be considered as generated at $$t+\Delta t$$.
Similarly, we have

$$
T = T'\left( 1 - \frac{1}{T'} \right)^{rn\lambda\Delta t} + n\lambda\Delta t
$$

Let $$\alpha=n\lambda\Delta t$$, which is the number of record generated after the dissemination time.
Then, the condition when $$T$$ increase after $$\Delta t$$ is

$$
\left( 1-\frac{1}{T} \right)^{r\alpha} + \frac{\alpha}{T} > 1
$$

Look at the left hand side.
When $$T < \alpha$$, the 2nd term will dominate and it will be greater than 1.
After that, the 1st term will dominate, which is always less than 1.
So the moving tread of $$T$$ is
- When $$T$$ is less than the equilibrium point, $$T$$ will increase.
- When $$T$$ is greater than the equilibrium point, $$T$$ will decrease.
- As $$T$$ get larger, the decreasing speed will become slower.
  This is because as $$T$$ goes to infinity, we remove a fixed number $$(r-1)\alpha$$ of tailing records each time,
  which is relatively smaller compared to $$T$$.

## Conclusion

The number of tailing records will be stable in Dledger.
The point of equilibrium is approximately proportional to the number of peers, the record generation rate,
and the dissemination time.
If the record generating speed is $$\lambda = 300/s$$, and $$\Delta t = 100 ms$$,
then $$n=20$$ will lead to $$ 600 $$ tailing records.
If the speed is $$ \lambda = 1/min $$, we can have $$ n= 360000 $$.
This level of scalability can support a lot of applications.
