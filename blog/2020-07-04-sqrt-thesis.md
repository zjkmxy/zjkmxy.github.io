---
slug: sqrt-thesis
title: The sqrt thesis of mixing strategies
authors: kinu
tags:
  - algorithm
  - data-structure
hide_table_of_contents: false
---

When solving a problem, it is common that we have two different strategies that fit in different cases.
For example, one algorithm may have a better time complexity but uses more memory than the other.
Or, one is fast when there are only a few of large objects, but the other works better when there are many small objects.
However, I found that there usually exists a solution which is a naive mixture of the two strategies, and its performance will be the sqrt of the two.

<!-- truncate -->

## Introduction

It is common that we have tow different strategies solving a problem.

One example is that we want a data structure which supports 2 operations, and we have two candidates:

| Operation   | Candidate 1 | Candidate 2 |
| ----------- | ----------- | ----------- |
| Operation 1 |     Slow    |     Fast    |
| Operation 2 |     Fast    |     Slow    |

And we have both operation 1 and 2, so we want a data structure which is *not so slow* in either case.

Another example is that the scale of input has two arguments: $$M$$ and $$N$$.
One algorithm is fast when $$M$$ is large, like $$O(MN^3)$$;
another is the reverse, suitable to the case when $$N$$ is large, like $$O(M^3N)$$.
But we don't know the number of $$M$$ and $$N$$ before it runs, so we want a balanced algorithm.

Sometimes we want to balance two different indicators, like time complexity and memory complexity.

A naive way to get a balanced algorithm is mixing two candidates together.
In my undergraduate years, I observed that there always exists such a mixture,
and the complexity of it is always the sqrt of two.
I call it *the sqrt thesis*.
Since its statement is too vague (without definitions of "strategies" and "mixture"),
I have no way to prove it.
Neither do I know if someone else has already discovered it.
But I can share the examples I observed where this thesis works.

## Examples

The problems listed here are somehow *famous* among algorithm competitors.
No one knows to whom we should give credit.
Therefore, I think it's safe to omit the authors.

### Unrolled Linked List

There are so many "versions" or "names" of this simple data structure: unrolled linked list, chunked array, STL rope, etc.
The problem is trivial: we want to maintain a linear list which supports insertion and random query.
More formally,
- Data: Objects (= empty interface)
- Operation: Random Query
  * input: an integer $$i$$
  * output: the object at position $$i$$
- Operation: Insertion
  * input: an integer $$i$$ and an object $$A$$
  * output: a list, where $$i$$-th object is $$A$$. All objects before $$i$$ remained untouched;
    objects after $$i$$ is shifted right by $$1$$ place.
- Restrictions: size of list = number of operations = $$N$$.

It is obvious that array and linked list are two candidates. Complexities are:

| Operation    |    Array    | Linked List |   Unrolled Linked List   |
| ------------ | ----------- | ----------- | ------------------------ |
| Random Query |    $O(1)$   |    $O(N)$   | $O\left(\sqrt{N}\right)$ |
| Insertion    |    $O(N)$   |    $O(1)$   | $O\left(\sqrt{N}\right)$ |

Observe that array is easy to index but hard to move.
Thus, a naive mixture is using linked list to store small pieces of arrays:
- Each element of a linked list is a "block", i.e. an array of length $$B$$, s.t. $$\frac{1}{2}\sqrt{N}\leq L \leq\sqrt{N}$$.
- The length of linked list is $$L$$, where $$\sqrt{N}\leq B \leq2\sqrt{N}$$.
- When query, go over a block once a time, and jump to the element when we meet the block containing $$i$$-th element.
- When insert, copy the block containing $$i$$ and insert $$A$$ into it.
  - If the block oversize, split it into two.
- Easy to show that both operation has complexity $$O(\sqrt{N})$$.

Unrolling linked list works better in general cases.
For example, when half of operations are queries and the other half are insertions,
both array and linked list degenerate to $$O(N^2)$$,
but unrolled linked list works in $$O(N\sqrt{N})$$.

### Three Range Problems

Give a fixed list of integers, every time query the three averages (*mean*, *median* and *mode*) of a given range.
It is easy to figure out the *mean* problem suffices to *sum* and the *median* suffices to $$K$$-th least.

- Data: Integers. (Use $$x_i$$ denote $$i$$-th integer).
- Operation: Query
  - input: two indices $$L$$, $$R$$ s.t. $$0\leq L < R < N$$; (a number $$K<R-L$$)
  - output: a number, which is the *sum* (*K-th smallest* or *mode*) of all numbers $$x_i$$ where $$L\leq i\leq R$$.
- Operation: Modification
  - input: one index $$i$$ and a number $$v$$
  - output: a modified list, where the $$i$$-th element is changed to $$v$$, as $$x_i=v$$.
- Restrictions: size of list = $$N$$; number of query = $$Q$$.

#### Sum
Two naive methods are array and prefix sum:
- Array stores every element individually.
- Prefix sum stores all cumulative sums $$\sum_{k=0}^{i}{x_k}$$.
  We can get every range sum by a substraction, but we need to change $$O(N)$$ elements each time we modify one element.

| Operation    |    Array    | Prefix Sum  |   Unrolled Linked List   |
| ------------ | ----------- | ----------- | ------------------------ |
| Range Query  |    $O(N)$   |    $O(1)$   | $O\left(\sqrt{N}\right)$ |
| Modification |    $O(1)$   |    $O(N)$   | $O\left(\sqrt{N}\right)$ |

So, the naive mixture is applying the idea of unrolling linked list:
- Store the sum of every block $$\sum_{k=js}^{j(s+1)}{x_k}$$, with $$s=\sqrt{N}$$.
- When querying, collect the sum of every block covered entirely ($$\sqrt{N}$$),
  and add up elements in the block which is not covered entirely ($$2*\sqrt{N}$$).
- When modifying, change the element as well as the sum of the block it belongs to.
So we get an algorithm which works in $$O(1)$$ for modification and $$O(N)$$ for query.
A good news is that it even works for ranged addition, i.e. add $$k$$ to every number $$x_i$$ between $$L$$ and $$R$$.
This can be handled by assigning a label for every block, meaning the number added to the entire block.

A better algorithm is segment tree which works $$O(\log{N})$$ for both, but it is not a naive mixture.


#### Mode
It will be very difficult, though solvable, if we consider modifications, so let's ignore it.

The first strategy is always the brute force one, which takes $$O(N^2)$$ for a query.

The second strategy is to preprocess all numbers' occurrence in all ranges.
Similar to the idea of prefix sum, it is enough to maintain an array $$f$$ containing prefix frequencies of each number:

$$
f_{i,j} = \sum_{k=0}^{i}{\mathbb{1}_{=}(x_k, x_j)} .
$$

Then, we can get the mode of every range by DP: let $$m_{i,j}$$ denote the mode among $$x_i,\ldots,x_j$$;
then $$m_{i,j+1}$$ is either $$m_{i,j}$$ or $$x_{j+1}$$, which can be decided in $$O(1)$$.
After all, we can handle each query in $$O(1)$$.
However, this needs $$O(N^2)$$ for the two-step initialization.

Now it's the time for chunked array.
Let $$f'_{i,j}$$ denote the prefix frequencies of each number, but at a coarse granularity &mdash; $$i$$ indicates a block.
Let $$m'_{i,j}$$ denote the mode from $$i$$-th to $$j$$-th block.
Now, given a query, we have some ($$<\sqrt{N}$$) blocks and some ($$<2\sqrt{N}$$) uncovered elements.
The result can be either the mode of the range &mdash; we need to get its correct frequency by going over those uncovered elements;
or an uncovered element &mdash; we need to enumerate each such number and count its occurrence.

This may be a little difficult to describe verbally. The pseudo-code looks like this:
```python
lblock, rblock = start_pos_of_block(l, r)
# chain means to concatenate two ranges
for i in chain(range(l, lblock), range(rblock, r)):
  cnt[x[i]] = 0
m = m[lblock, rblock]
cnt[m] = 0

candidates = [x[i] for i in chain(range(l, lblock), range(rblock, r))]
candidates.append(m)
candidates = unique(candidates)

for i in chain(range(l, lblock), range(rblock, r)):
  cnt[x[i]] += 1
for v in candidates:
  # Actually we may need to +1/-1 with some indices
  cnt[v] += f[rblock, v] - f[lblock, v]
# We pick the one with maximum cnt[y] for y in candidates
```

Hence, we can handle the query in $$O(\sqrt{N})$$.
The initialization seems to be $$O(N^2)$$, but can be $$O(N\sqrt{N})$$ if we implement it with care.
Thus, we get a mixed algorithm with sqrt init time and sqrt query time.

|   Operation    |    Array    | Prefix Freq | Chunked Array  |
| -------------- | ----------- | ----------- | -------------- |
|  Ranged Query  |    $O(N)$   |    $O(1)$   |  $O(\sqrt{N})$ |
| Initialization |    $O(1)$   |   $O(N^2)$  | $O(N\sqrt{N})$ |

Since mode is not statistically mergable, segment tree does not work here.
Also, the best complexity considering modification seems to be $$O(N^\frac{5}{3})$$. (I'm not sure)

#### K-th smallest

I'm not sure if there is a sqrt algorithm for this.
Leader Mo's Algorithm contains an extra $$O(\log N)$$
The "standard" solutions are persistent segment tree, splitting & merging tree, and divide and conqour,
which are all $$\log^2{N}$$ algorithms.

### Leader Mo's Algorithm

If we are allowed to handle queries offline, then a lot of problems have a sqrt solution.
The original thinking, proposed by Leader Tao Mo, comes from the fact that
we can calculate the minimal spanning tree in Manhattan distance in $$O(N\log{N})$$,
and the size of this tree is bounded by $$O(N\sqrt{N})$$.
Here I want to provide a different path towards this algorithm.

Let's use the range mode question as an example.
Consider the two cases:
- **All ranges are small $$R_i-L_i < T$$**.
  Then, the complexity of brute force algorithm is $$QT$$, which may be acceptable if $$T$$ is really small.
- **All ranges are large $$R_i-L_i > T$$, with $$T$$ near $$N$$**.
  Then, the distances between ranges $$|L_j-L_i|+|R_j-R_i|$$ is small.
  Thus, we can move from a range to another, fixing the counts of numbers.
  The complexity of this algorithm is the sum of all distances, $$N+Q(N-T)$$.

Looking at $$N$$ versus $$N-T$$, you might think the mixing strategy will fall into something like $$\frac{1}{2}N$$.
However, the good news is that we can still get $$O(\min(\sqrt{T(N-T)})) = O(\sqrt{N})$$.
Just like how we group *elements* into blocks in previous examples, this time we group *queries*:
- Queries with in a group are *near* (i.e. the pairwise distances are short).
- The number of groups is *small* (so we do not need to count from scratch many times)

Assume we have $$G$$ groups and the distance within a group is $$D$$, then
- For each group, we need to calculate the count of each number from scratch once, which is $$O(GN)$$ totally.
- We wander from one query to another within a group, which takes $$O(QD)$$.

Assuming $$Q$$ has the same order as $$N$$, the ideal case would be $$D=G=\sqrt{N}$$.
But how can we achieve this?
Note that we can sort the queries in any order, for example, in ascending order by $$R$$.
Then the right boundary will be monotonically increasing, and the real distance &mdash; that we need to go back and forth --
is made up with the $$L$$ part only.
Therefore, we can do as follows:
1. Group queries by the *left* boundary, $$L$$, into $$\sqrt{N}$$ groups.
2. With in a group, sort the queries in ascending order by the *right* boundary, $$R$$.
3. For each group, we start from $$l=r=(i+1)\sqrt{N}$$, which is the rightmost element of group $$i$$.
  Initialize an array containing the count of all numbers. They are all 0 at this time.
4. Assume the next query in the group is $$[L_j, R_j]$$. Note that we always have $$l=(i+1)\sqrt{N}$$ at this step.
  We first move $$r$$ to $$R_j$$ and count all numbers in the path.
5. Move $$l$$ to $$L_j$$ and count all numbers in the path. Now we have the result for $$[L_j, R_j]$$.
6. Move $$l$$ back to the left point of the group, $$(i+1)\sqrt{N}$$.
7. If we have more queries in group $$i$$, go back to step 4.
8. If we have more groups, go back to step 3.

We need to move the right endpoint $$r$$ up to $$N$$ for each group,
and the left endpoint upto $$\sqrt{N}$$ for each query.
Thus, the total complexity is $$O((N+Q)\sqrt{N})$$.

Leader Mo's Algorithm is really a brilliant idea and can be applied to lots of scenarios.
However, the two major constraints are:
- Queries are offline.
- Ability to not only count new elements, but also undo this operation.
  (We need to move $$l$$ back to the starting position at step 6)

### Triangle Counting

Give an undirected graph, we want to count how many triangles are in this graph.
- Input: an undirected graph $$G=(V,E)$$ of $$\|V\| = N$$ nodes and $$\|E\| = M$$ edges.
- Output: the number of triangles in this graph.
  - A *triangle* is a tuple of three nodes $$(x,y,z)\in V^3$$ s.t. there is an edge between any two nodes
    $$\{\{x,y\},\{y,z\},\{x,z\}\}\subseteq E$$.
- Restrictions: $$N$$ and $$M$$ are of the same order.

By the way, before we start looking at it,
I want to correct a general misunderstanding that "we need $$O(N^2)$$ to enumerate two adjacent nodes".
The fact is when edges are given in the form of adjacent list, enumerating nodes are equivalent to enumerating edges.
A similar (and wider) misunderstanding happens when we apply this to a kind of convolutional DP on a rooted tree:
```python
# Sorry I forget the exact problem ...
def dfs(self)
  self.dp = [1 for i in range(N)]
  self.dp[0] = 1
  for c in self.children:
    c.dfs()
    tmp = [0 for i in range(N)]
    for i in range(N):
      for j in range(i):
        tmp[i] += self.dp[j] * c.dp[i-j]
        if self.dp[j] == 0:
          break
    self.dp = tmp
```
This seems to be $$O(N^4)$$, but it's actually $$O(N^3)$$, as we only go over $$N$$ for each pair of ancestor-descendant relation.

Go back to the problem. Let's forget the fact that the result is the trace of cubed adjacent matrix over six.
A naive solution, that we enumerate an edge $$\{x, y\}$$ and then enumerate a third node adjacent to $$y$$,
takes $$O(MN)$$, which is the number of edges times the sum of all degrees.
(If you have question on how we can decide whether $$z$$ is adjacent to $$x$$ in $$O(1)$$, try to implement it yourself.)

Observe that
1. We meet each triangle 3 times.
2. The time used depends on how many nodes $$y$$ is adjacent to.
3. However, the total number of edges is $$M$$, of the same order as $$N$$. (i.e. sparse)
  This fact indicates that there is a chance to optimize the latter $$N$$ in the time complexity.
4. Can we solve 2 by taking the node with lower degree as $$y$$?

Let's analyze how the $$N$$ comes.
Some nodes have a large degree $$>D$$, the others are small.
The number of those nodes with a large degree is at most $$L = \frac{2M}{D}$$.
We have at most $$\min(\frac{1}{2}L^2, M)$$ edges among those "large" nodes.
Thus, we need $$O(L^3)$$ or $$O(ML)$$ to enumerate triangles among those nodes.

For those triangles which has a "small" node, we assume the "small" node is $$y$$.
Then, the complexity is $$O(MD)$$.

Finally, by $$L = \frac{2M}{D}$$ we have $$O(ML+MD) \leq O(M\sqrt{M})$$,
which shows that our strategy in 4, always start from the smaller end of an edge, actually works.

In this example, we implicitly mix up two cases, where they meet at a sqrt point.
In the following example, we have to do this explicitly.

### Rectangles Counting

Given a set of points with integer coordinates on a plane,
we want to know how many axis-aligned rectangles can they form.

- Input: an set of $$N$$ points, with their coordinates $$(x_i, y_i)$$ are integers. No overlapped points.
- Output: the number of axis-aligned rectangles.
  - An *axis-aligned square* is made up with four points with their coordinates in the form of
  $$\{(x, y), (x+a, y), (x, y+b), (x+a,y+b)\}$$.

First, replace coordinate numbers with their ranks,
which enables us to operate on the range, such as to allocate arrays subscripted by values.
Then, sort those points by lexical order, so we have several *columns*, sets of points with the same x-coordinate.

#### Method 1: Enumerate Column Pairs
We can enumerate pairs of columns, and count rectangles made up with points in each column pairs.
Assume column $$i$$ and $$j$$ overlap at $$O_{i,j}$$ rows, then the number of rectangles is $${O_{i,j} \choose 2}$$.
There are many ways to calculate $$O_{i, j}$$:
- Use a meet-in-the-middle algorithm, sliding two indices on two columns and count how many times they overlap.
- Use an array $$mark$$ subscripted by range.
  For each column $$i$$, set $$mark[y]$$ to be true iff point $$(i, y)$$ exists in column $$j$$.
  The for each other column $$j$$, enumerate points $$(j, y')$$ in it and see how many times $$mark[y']$$ hits.

If we have $$C$$ columns, the complexity is $$O(NC)$$.

#### Method 2: Enumerate Points per Row
Another way is to forget about combinations and list points one by one,
keeping an eye on how many rectangles a point can form with points examined before.

1. Iterate over points in lexical order. Use $$p_i = (x_i, y_i)$$ to denote current one.
2. Iterate points before $$p_i$$ but in the same **row**: $$p_j = (x_j, y_i)$$, $$x_j < x_i$$.
3. Count how many points in the same row with $$p_i$$ hit $$x_j$$.
  That is, how many $$p_k = (x_i, y_k)$$ s.t. $$y_k < y_i$$, where $$(x_j, y_k)$$ exists.
  This can be done $$O(1)$$ if we use an array $$cnt$$ to keep counting.
4. Since $$p_i$$ hits $$x_j$$, we need to increase $$cnt[x_j]$$ by 1.
5. Every time after we go over points in a whole **column** in step 1, we need to clear $$cnt$$.

The complexity depends on the average size of a row.
Let $$S = \frac{N}{R}$$ denote it and we end up with an $$O(NS)$$ algorithm.

#### Mix them up
$$S$$ seems to be the inverse of $$R$$, which is irrelevant with $$C$$.
However, we can exchange two coordinates before for method 2.
Then, we have the complexity $$O(NC)$$ versus $$O(N\frac{N}{C})$$.
Now, if the sqrt thesis applies here, we should get an algorithm of $$O(\sqrt{NC\cdot N\frac{N}{C}})=O(N\sqrt{N})$$

The idea is actually quite straight forward.
Similarly to the last question, observe that:
- The large columns, whose $$S' > \sqrt{N}$$, are not many, $$C' < O(\sqrt{N})$$.
- Most columns $$C'' > O(\sqrt{N})$$ are small $$S'' < \sqrt{N}$$.

Thus, we can just separate large and small columns and apply the two algorithms respectively:
- Large-large column: apply method 1.
- Small-small column: apply method 2.
- Large-small column: we can apply either. Method 1 is easier.
  (If you have questions, try yourself and you will know why)

### Two Index Weighted Ranking

This is a problem I proposed for a programming contest in my undergraduate university.
This time, we do have a sqrt algorithm, but it does not perfectly follow the formula.

Suppose our boss ask us to write an algorithm for a mini search engine.
In the frontend, the user input was decomposed to some keywords with weights, which are inputs to our algorithm.
In the database, we already have a set of webpages; each of them is assigned with some keywords and a likeliness score to each keyword.
The output of the algorithm is the search result &mdash; a list of webpages sorted by the weighted average of likeliness scores.

He wants the algorithm to be super fast, but he only gives us a single core machine, which makes it impossible.
However, we know his unit tests are very weak: all queries have two keywords; queries on the same dataset share same weights.
More specifically,
- There are $$N$$ webpages and $$K$$ keywords.
- The likeliness score of website $$i$$ for keyword $$j$$ is $$L_{i,j}$$, a real number between $$0$$ and $$1$$.
  - The likeliness relation is sparse, so only $$C=O(N)$$ numbers are non-zero.
- There are $$Q$$ queries.
  - Each query has exact 2 keywords $$a$$ and $$b$$, with their weights $$x$$ and $$y$$ respectively, and an index $$K$$.
  - We should output the $$K$$-th website in the list sorted by $$W_i = x L_{i,a} + y L_{i,b}$$.
  - For each dataset, all queries share $$x$$ and $$y$$.
  - Queries are given offline.
- Restrictions: $$N,K<10^4$$, $$Q<10^5$$, $$C<3 \times 10^4$$.

Now, can we hack here &mdash; passing all test cases in time *without sorting those pages*?

#### Analysis
$$x$$ and $$y$$ do not make the game more difficult than two $$0.5$$, if they are always the same.
Also, $$C < 3N$$ is not so different from that every website has exactly 3 keywords.

#### Method 1: nth-element
If we do sort, then the complexity is $$O(QN\log N)$$
*nth-element* does not save much time than *sorting*, we have $$O(QN)$$ at the worst case, which won't pass.

#### Method 2: sort every pair of keywords
We need $$O(KC\log N)$$ to sort every pair of keywords, but after that we can query in $$O(Q)$$.

#### Mix
Look at the $$KC$$ part of the complexity.
We have $$K^2$$ pairs of keywords, and at most $$N$$ webpages for each keyword.
Here, $$KN$$ becomes a $$C$$ because likeliness is sparse.
However, if we do sort every query,
which is equivalent to only processing those keywords pairs occurring in queries,
then we will have $$QN$$.
We cannot reduce $$QN$$ to something smaller.
This is because *not every keyword has few pages*.

Recall the idea we used before and apply here:
- Some keywords are large, some are small
- If we handle them differently, we can have $$\operatorname{sqrt}({KCQN})$$ by the sqrt thesis.
  - An extra $$\log N$$ is needed for something like sort or BST.
- If we are lucky, $$KN$$ in the former formula can be reduced to another $$C$$ and we get $$C\sqrt{Q}$$

Well, though the story does not go exactly as we planned, we can still get a sqrt algorithm.
It works like this:
- Build a BST of pages for each keyword.
- Sort all queries by $$(a, b)$$
- When we meet a new $$(a, b)$$, we insert pages of the smaller keyword into the bigger keyword's BST.
- After all $$(a, b)$$ queries, remove those inserted elements.

The question is *how many webpage-keyword relation we need to insert*.
The worse case seems to be $$CQ$$, however, we only have $$K$$ keywords and $$C=O(K)$$ relations.
Thus, we have at most $$\sqrt{C}$$ "big" keywords, and "small" keywords have at most $$\sqrt{C}$$ pages.
Thus, the number of insertions is $$\sqrt{C}Q$$

#### Variant
One variant is to allow modifications &mdash; change the likeliness score $$L_{i,j}$$ to an input number.
This forces us using online algorithms.

This variant can be solved as follows:
- Let $$G=\sqrt{C}$$. A keyword is called big if it contains more than $$G$$ pages.
- Build BSTs for not only single keywords but also pairs of big keywords, in $$O(CG\log{N})$$
- When we deal with a query
  - If it is between big keywords, look it up in $$O(\log{N})$$
  - Otherwise, insert small keyword's pages into big keyword's BST, in $$O(G\log{N})$$
- When we deal with an insertion, we need to update at most $$G$$ BSTs.
- Thus, the total time complexity is $$O((C+Q)G\log{N})$$.

## Conclusion

No matter the thesis is precise or not, the trick of balancing a trade-off with a sqrt works in a wide range of areas.

## References?

- Alon, N., Yuster, R. & Zwick, U. Finding and counting given length cycles. Algorithmica 17, 209–223 (1997).
  [link](https://www.tau.ac.il/~nogaa/PDFS/ayz97.pdf).
  - Someone said the origin of the triangle enumerating algorithm is this paper. I haven't read it.
- Anonymous. Stars in Your Window II. Peking University Programming Contest #15, Problem J (2015).
  [link](http://poj.openjudge.cn/practice/C15J).
  [solution](https://github.com/zjkmxy/algo-problems/blob/master/%E5%B9%B3%E6%88%9027%E5%B9%B4/PKUC15J-%E6%AD%A3%E6%96%B9%E5%BD%A2%E8%AE%A1%E6%95%B0.cpp).
  - The rectangle counting problem.
  - My solution code does not follow this post exactly and thus is unnecessarily complicated and slow.
