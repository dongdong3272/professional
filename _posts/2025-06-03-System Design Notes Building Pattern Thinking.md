---

title: 'System Design Notes (1): Building Pattern Thinking'

date: 2025-06-03

permalink: /posts/System-Design-Pattern-Thinking

tags:

  - system-design
  - distributed-systems
  - backend
  - interview

---

## Why I Wrote This

When I first started learning System Design, I had a strange feeling:

I knew many buzzwords:

* Redis
* Kafka
* Flink
* Cassandra
* Elasticsearch

But I had absolutely no idea **when** to use them.

Whenever I saw a System Design question, my brain immediately jumped to components:

> Should I use Redis?

> Should I use Kafka?

> Should I use Flink?

This turned out to be the wrong way of thinking.

The biggest takeaway from this discussion was that **System Design is not about components. It is about recognizing patterns.**

This realization completely changed how I approach design questions.

---

# Step 1. A Like Counter Is Not About Likes

The first problem looked deceptively simple.

> Given a post id, return the number of likes in the last minute.

Then came two more queries:

* Global trending posts in the last minute
* Region-based trending posts

At first glance they seemed like three unrelated questions.

After breaking them down, they actually correspond to two different patterns.

```
Query 1
↓

Sliding Window Counter

----------------------

Query 2 / Query 3
↓

Top-K / Heavy Hitters
```

This was the first "aha" moment.

Instead of thinking about "likes", I should think about **what kind of computation this really is.**

---

# Pattern 1 — Sliding Window Counter

The key insight:

> Instead of computing everything when reading, continuously maintain the sliding window while new events arrive.

Eventually the read becomes almost constant-time.

Examples include:

* Rate Limiter
* Likes in the last minute
* Errors in the last minute
* Fraud detection (transactions in the last 5 minutes)

The core challenge isn't counting.

It's expiration.

For example,

```
12:00
100 million likes

12:01
0 likes
```

If we only keep increasing a counter,

the value will **never decrease**.

The real problem is:

> How do old events automatically leave the time window?

This completely changed my understanding of sliding windows.

A sliding window is really:

```
Count
+

Expiration
```

rather than simply counting.

Typical keywords:

* Sliding Window
* Time Bucket
* Expiration

---

# Pattern 2 — Top-K / Heavy Hitters

The next realization came naturally.

Trending posts are NOT point queries.

Instead,

they are continuously maintained rankings.

The key insight became:

```
Maintain the ranking all the time.

Do not compute rankings when users read.
```

Again,

the challenge is expiration.

If a topic was popular one hour ago,

but nobody mentions it now,

it must automatically disappear from the leaderboard.

Examples:

* Trending Posts
* Trending Hashtags
* Top Sellers

Keywords:

* Top-K
* Heavy Hitters
* Heap
* Approximation

---

# Pattern 3 — Search

This was another major mental shift.

Initially I thought search was about finding documents.

It isn't.

Search is really about building indexes.

The insight:

```
Search

↓

Index

↓

Lookup
```

Or more precisely,

> Search is an indexing problem, not a querying problem.

When a document arrives,

we tokenize it,

build the inverted index,

and future searches become efficient lookups.

Examples:

* Google Search
* Slack Search
* GitHub Code Search
* Log Search

Keywords:

* Inverted Index
* Tokenization
* Ranking

---

# Components Are Not Patterns

One thing that confused me was this:

Why does Flink appear in multiple places?

For example,

Top-K uses Flink,

Analytics also uses Flink.

Eventually I realized:

Components are implementations.

Patterns are problems.

```
Pattern
↓

Tool
```

instead of

```
Tool
↓

Pattern
```

For example,

Redis may implement:

* Cache
* Sliding Window Counters
* Leaderboards

Flink may implement:

* Sliding Window
* Top-K
* Analytics

Kafka may implement:

* Event Streaming
* Fanout
* Async Processing

The same tool can solve many patterns.

---

# Pattern Thinking

After this discussion,

I started organizing System Design by patterns instead of technologies.

Some examples:

| Pattern                | Typical Problems                 |
| ---------------------- | -------------------------------- |
| Sliding Window Counter | Rate Limiter, Last-Minute Likes  |
| Top-K / Heavy Hitters  | Trending Posts, Hot Topics       |
| Search                 | Google Search, GitHub Search     |
| Notification Fanout    | Twitter Timeline, Instagram Feed |
| Queue                  | Video Processing, Email Sending  |
| Cache                  | User Profile, Product Detail     |
| Analytics              | DAU, PV, UV                      |
| Recommendation         | TikTok, YouTube                  |

This felt surprisingly similar to LeetCode.

For example,

LeetCode trains pattern recognition:

```
Two Sum
↓

Hash Map

Top K Frequent
↓

Heap

Word Break
↓

DP
```

System Design is actually the same.

```
Rate Limiter
↓

Sliding Window

Trending
↓

Top-K

Search
↓

Inverted Index

Feed
↓

Fanout
```

Instead of memorizing architectures,

I should recognize patterns.

---

# One Unexpected Journey: Recommendation Systems

The conversation eventually moved into recommendation systems.

Initially I thought recommendation was simply:

```
User Tags

+

Video Tags
```

Later I realized the evolution of modern recommendation systems.

```
Tag-Based Recommendation

↓

Collaborative Filtering

↓

Embedding-Based Recommendation
```

The biggest insight was:

Recommendation is NOT primarily about ranking.

It is first about reducing the search space.

```
Millions of Videos

↓

Candidate Generation

↓

1000 Candidates

↓

Ranking

↓

Top 20
```

If candidate generation fails,

ranking cannot save the system.

This idea also connected surprisingly well with modern RAG systems.

```
Documents

↓

Embedding

↓

ANN Search

↓

Candidate Chunks

↓

LLM
```

Search,

Recommendation,

and RAG all follow remarkably similar architectures.

---

# Final Takeaway

This discussion completely changed my mental model.

Originally,

I thought System Design meant memorizing infrastructure.

Now,

I think it is much closer to recognizing reusable computational patterns.

The components may evolve.

Redis may one day be replaced.

Kafka may be replaced.

New vector databases may emerge.

But the underlying patterns remain the same.

```
System Design

=

Recognize the Pattern

+

Understand the Trade-offs

+

Choose the Right Tool
```

This is probably the biggest lesson I learned from this entire conversation.
