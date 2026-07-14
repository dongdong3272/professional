---

title: "Tree Problems: Stop Thinking About Recursion, Start Thinking About the Return Value"

date: 2025-01-28

permalink: /posts/tree-recursion-return-value

tags:

  - algorithms
  - tree
  - recursion
  - leetcode
  - interview

---

## Motivation

After a mock interview, I realized that my weakness on tree problems was **not recursion itself**, but rather the lack of a clear mental model for designing recursive solutions.

I have solved many classical tree problems before:

* Inorder / Preorder / Postorder Traversal
* Lowest Common Ancestor
* Kth Smallest Element in BST
* Tree Depth
* ...

Yet when facing a new tree problem, I sometimes needed a surprisingly long time before writing the recursive function.

A good example was **LeetCode 1110 - Delete Nodes and Return Forest**.

The problem itself was not particularly difficult, but I didn't immediately recognize the recursive pattern behind it.

That led me to rethink a more fundamental question:

> **What actually makes someone "good" at tree recursion?**

---

## My Initial Thought Process

At first, I believed the core skill of tree problems was writing recursive code.

However, after reviewing several classical problems, I noticed something interesting.

Different categories of tree problems all use recursion, but they **return completely different things**.

For example:

### Maximum Depth

```python
def dfs(node):
    ...
```

returns

> the height of the subtree rooted at `node`.

---

### Lowest Common Ancestor

```python
def dfs(node):
    ...
```

returns

> the LCA found inside this subtree.

---

### Delete Nodes and Return Forest

```python
def dfs(node):
    ...
```

returns

> the new root of this subtree after deletion.

At this point I realized:

> **The recursion is never the difficult part. Defining the return value is.**

Once the return value becomes clear, the recursive implementation almost writes itself.

---

## The Most Useful Question

Instead of asking

> "How should I recurse?"

I should ask

> **"What should `dfs(node)` return?"**

This simple change completely changes the way I approach tree problems.

For almost every recursion problem, I now first write down:

```
dfs(node) returns ...
```

Only after that do I start writing code.

---

## Patterns Worth Memorizing

After reorganizing my notes, I found that most interview questions fall into only a handful of recursive templates.

### 1. Return a Value

Examples:

* Maximum Depth
* Diameter of Binary Tree
* Balanced Binary Tree

Typical template:

```python
def dfs(node):
    left = dfs(node.left)
    right = dfs(node.right)

    return ...
```

---

### 2. Return a TreeNode

Examples:

* Lowest Common Ancestor
* Binary Tree Pruning
* Delete Nodes and Return Forest

Typical template:

```python
node.left = dfs(node.left)
node.right = dfs(node.right)

if should_delete(node):
    return None

return node
```

This is exactly the pattern used in LeetCode 1110.

The key idea is:

> Process children first, then decide what to do with the current node.

---

### 3. Path Problems

Examples:

* Path Sum II
* Binary Tree Maximum Path Sum

These usually combine recursion with backtracking or global answers.

---

## An Equally Important Realization

Another thing I noticed is that:

> **Not every tree problem should be solved with recursion.**

Seeing a binary tree should not automatically trigger "DFS".

Instead, I should first classify the problem.

### If it asks for subtree information

Examples:

* height
* diameter
* balanced
* pruning

Think:

```
DFS
```

---

### If it asks for level information

Examples:

* level order traversal
* right side view
* average of levels
* maximum width

Think:

```
BFS
```

---

### If it is a BST problem

Examples:

* kth smallest
* successor
* predecessor

Think:

```
Inorder Traversal
```

before anything else.

---

### If it asks for distances

Examples:

* nodes distance K
* shortest path

Think:

```
Convert Tree -> Graph
BFS
```

instead of trying to force a recursive solution.

---

## Python Notes Along the Way

During this review, I also refreshed several small Python features that are surprisingly useful in interviews.

### Returning Multiple Values

Python functions can naturally return multiple values.

```python
return forest, deleted
```

which is actually

```python
return (forest, deleted)
```

The returned object is a tuple, and a tuple **can absolutely contain mutable objects like lists**.

For example:

```python
return left_list, right_list
```

is perfectly valid.

---

### Filtering

Python also provides

```python
filter(...)
```

However, for interview code, list comprehensions are usually cleaner.

Instead of

```python
list(filter(lambda x: condition(x), nums))
```

I would normally write

```python
[x for x in nums if condition(x)]
```

which is both shorter and easier to read.

---

## What I Will Practice Next

Rather than solving dozens of random tree problems, I want to master a small set of representative ones.

My current practice list is:

* Maximum Depth
* Diameter of Binary Tree
* Balanced Binary Tree
* Lowest Common Ancestor
* Binary Tree Pruning
* Delete Nodes and Return Forest
* Path Sum II
* Binary Tree Maximum Path Sum
* Construct Binary Tree from Preorder and Inorder
* Serialize and Deserialize Binary Tree

The goal is no longer:

> "Can I solve this problem?"

Instead, it is:

> **Can I identify what `dfs(node)` should return within 30 seconds?**

If I can answer that question quickly, the rest of the recursive solution usually follows naturally.
