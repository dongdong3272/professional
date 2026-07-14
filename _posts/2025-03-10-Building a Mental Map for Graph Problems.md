---

title: 'From BFS/DFS to Graph Thinking: Building a Mental Map for Graph Problems'

date: 2025-03-10

permalink: /posts/graph-thinking-mental-map

tags:

  - algorithms
  - graph
  - leetcode
  - interview
  - job-seeking

---

## Why I Wrote This

For a long time, my understanding of graph problems was essentially a list of algorithms.

```
DFS
BFS
Dijkstra
Union Find
Topological Sort
```

Whenever I saw a graph question, I would first try to remember *which algorithm* might fit.

However, after discussing graph problems in depth, I realized this is actually the wrong abstraction.

Interviewers don't think in terms of algorithms.

Strong candidates don't either.

Instead, they first identify **what type of question is being asked**, and the algorithm naturally follows.

This post records the thinking process that helped me reorganize my understanding of graph algorithms.

---

## Step 1. Stop Thinking About Algorithms

My original mental model looked like this.

```
Graph
├── BFS
├── DFS
├── Dijkstra
├── Union Find
└── Topological Sort
```

The problem is that this organization is based on **solutions**, not **problems**.

When facing a new question, I still had to manually search through every algorithm.

A better question is:

> What is this problem really asking?

---

## Step 2. Most Graph Problems Only Ask a Few Fundamental Questions

Eventually I realized that almost every interview graph problem belongs to one of several categories.

### 1. Connectivity

Typical questions:

- Can I reach somewhere?
- How many connected components exist?
- Are two nodes connected?

Typical problems:

- Number of Islands
- Max Area of Island
- Clone Graph

Natural solution:

```
Connectivity
    ↓
DFS / BFS
```

---

### 2. Shortest Path

Typical questions:

- Minimum number of steps?
- Minimum cost?
- Fastest route?

Examples:

- Rotten Oranges
- Network Delay Time
- Maze
- Cheapest Flights Within K Stops

Decision process:

```
All edge weights equal
        ↓
       BFS

Different edge weights
        ↓
    Dijkstra
```

This immediately explains why Rotten Oranges is BFS while Network Delay Time becomes Dijkstra.

---

### 3. Dependency

Typical questions:

- What must happen first?
- Is there a cycle?
- Can everything be finished?

Examples:

- Course Schedule
- Alien Dictionary

Solution:

```
Dependency
      ↓
Topological Sort
```

---

### 4. Dynamic Connectivity

Whenever the problem repeatedly asks

> Are these two nodes in the same group?

or

> Merge these two groups.

the natural abstraction becomes

```
Union Find
```

Typical examples:

- Number of Provinces
- Accounts Merge
- Redundant Connection

---

### 5. Optimization

Sometimes the graph isn't asking about paths at all.

Instead, it asks for the cheapest way to connect everything.

Examples:

- Minimum Cost to Connect Points

Solutions:

- Kruskal
- Prim

---

## Step 3. Grid Problems Are Also Graph Problems

This was another realization.

Whenever I see

```python
grid = [
    [0,1,0],
    [1,0,1]
]
```

I should immediately translate it mentally into

```
Each cell
      ↓
    A graph node

Adjacent cells
      ↓
      Edges
```

Once I make this conversion, many seemingly different problems become identical.

| Problem | Graph Interpretation |
|----------|----------------------|
| Number of Islands | Connected Components |
| Max Area of Island | Connected Components |
| Walls and Gates | Multi-source BFS |
| Rotten Oranges | Multi-source Shortest Path |
| 01 Matrix | Multi-source BFS |

This explains why so many grid problems feel similar.

They're actually solving the same graph problem under different stories.

---

## Step 4. Binary Search Isn't Competing With Graph Algorithms

One question that always interested me is:

**Why does Swim in Rising Water have both Binary Search + BFS and Dijkstra solutions?**

The key insight is that these two methods solve different formulations.

Binary Search asks:

```
Assume the answer is T.

Can I reach the destination?
```

The BFS is only acting as a validator.

```
Binary Search
        ↓
 Feasibility Check
        ↓
    BFS / DFS
```

The graph traversal is not solving the optimization problem directly.

It only verifies whether a guessed answer works.

This pattern appears in many interview questions.

- Swim in Rising Water
- Capacity to Ship Packages
- Koko Eating Bananas
- Magnetic Force Between Balls

The common pattern is

```
Search the answer space

↓

Check feasibility
```

---

## Step 5. Why Dijkstra Feels Even More Natural

Another interesting observation is that Swim in Rising Water is actually a variant of Dijkstra.

Classic Dijkstra computes

```
dist[next]
=
dist[cur] + weight
```

Swim in Rising Water instead computes

```
dist[next]
=
max(dist[cur], grid[next])
```

Instead of minimizing the sum,

it minimizes

```
The maximum value encountered along the path.
```

This is often called a **Minimax Path** problem.

Once viewed this way, the algorithm is no longer mysterious.

Only the transition function changes.

The overall Dijkstra framework remains exactly the same.

---

## My Updated Mental Map

Instead of remembering algorithms individually, I now prefer remembering this map.

```
Graph Problems

├── Connectivity
│      ├── DFS
│      └── BFS
│
├── Shortest Path
│      ├── BFS
│      ├── Multi-source BFS
│      └── Dijkstra
│
├── Dependency
│      └── Topological Sort
│
├── Dynamic Connectivity
│      └── Union Find
│
├── Minimum Spanning Tree
│      ├── Kruskal
│      └── Prim
│
├── Answer Search
│      └── Binary Search + BFS/DFS
│
└── State Space Search
       ├── BFS
       ├── Dijkstra
       └── A*
```

The biggest change isn't that I learned another algorithm.

It's that I now ask a different first question.

Instead of

> Which algorithm should I use?

I first ask

> What kind of graph problem is this?

Once that question is answered, the algorithm often becomes obvious.