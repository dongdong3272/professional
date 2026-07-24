---
title: "About Modern RAG Pipelines"

date: 2026-07-23

permalink: /posts/modern-rag-pipeline

tags:
  - ai
  - rag
  - retrieval
  - search
  - context-engineering

---

# Why I Wrote This

In my previous post, I argued that RAG is fundamentally a search system for language models.

That raises a much more interesting question.

> **If RAG is really a search system, what does a production search pipeline actually look like?**

Initially I imagined RAG as a single retrieval step.

In reality, modern RAG systems look much more like a funnel.

Every stage removes noise, keeps useful information, and prepares better context for the language model.

---

# Step 1: Thinking in Funnels Instead of Algorithms

When people first learn RAG, they often ask questions like:

- Which embedding model should I use?
- Which Vector Database is best?
- Should I use HNSW?

These are useful questions.

But I think they miss the bigger picture.

A production RAG system is not one algorithm.

It is a pipeline.

Every stage exists to progressively narrow an enormous search space.

```
Entire Knowledge Base

↓

Relevant Documents

↓

Better Candidates

↓

Useful Context

↓

LLM
```

Thinking in terms of funnels immediately made the entire architecture much easier to understand.

---

# Step 2: Query Understanding

Everything starts with the user's question.

Surprisingly, the first step often isn't retrieval.

It is understanding what the user is actually asking.

That may include:

- Query rewriting
- Intent classification
- Keyword expansion
- Multi-query generation
- Routing

For example,

```
How much does it cost?

↓

Claude Code Pricing
```

The goal isn't to answer the question.

The goal is to make retrieval easier.

A better query almost always produces better search results.

---

# Step 3: Recall

Once the query is understood, retrieval begins.

The objective of Recall is simple.

> **Don't miss anything important.**

At this stage, precision isn't the priority.

Coverage is.

Production systems often combine multiple retrieval methods.

For example,

- Keyword Search (BM25)
- Semantic Search
- Metadata Filters
- Graph Traversal

Each method retrieves documents from a different perspective.

The union of those results becomes the candidate set.

Notice that this stage intentionally returns more documents than necessary.

Missing useful information here is much more expensive than retrieving a few extra documents.

---

# Step 4: Fusion

Multiple retrieval methods produce multiple ranked lists.

Now we need to merge them.

This is the purpose of Fusion.

Instead of trusting only one retrieval strategy, Fusion combines evidence from multiple sources.

One common technique is Reciprocal Rank Fusion (RRF).

Instead of comparing similarity scores—which often aren't directly comparable across retrieval methods—RRF combines rankings.

A document that consistently appears near the top across multiple retrieval strategies is probably more relevant than one that ranks highly in only a single list.

Fusion is often where hybrid retrieval becomes significantly more robust than relying on a single retriever.

---

# Step 5: Reranking

After Fusion, the system may still have hundreds of candidate documents.

This is where Reranking begins.

The retrieval stage focuses on speed.

Reranking focuses on accuracy.

A common architecture looks like this:

```
Dual Encoder

↓

Fast Retrieval

↓

Cross Encoder

↓

Accurate Ranking
```

The expensive model is only applied to a relatively small candidate set.

This keeps the overall system efficient while significantly improving ranking quality.

---

# Step 6: Context Assembly

At this point, retrieval is finished.

Now we need to prepare information for the language model.

This stage surprised me the most.

Initially I assumed another Transformer would assemble the context.

Most of the time, it doesn't.

Instead, Context Assembly is largely an engineering pipeline.

Typical operations include:

- Deduplication
- Ordering
- Neighbor chunk expansion
- Merging adjacent chunks
- Citation generation
- Token budgeting

For example,

Duplicate chunks may be removed using hashes or embedding similarity.

Adjacent chunks can be merged to preserve continuity.

Relevant neighboring chunks may be included to recover missing context.

Finally, everything is ordered according to importance until the token budget is exhausted.

The output of this stage is simply a carefully constructed prompt.

---

# Step 7: Generation

Only now does the language model begin reasoning.

Everything before this point has been preparing context.

Everything after this point is generation.

That separation completely changed how I think about RAG.

The retrieval system finds knowledge.

The language model reasons over knowledge.

Those are fundamentally different responsibilities.

---

# My Mental Model

Today, I think about a production RAG system like this.

```
User Query

↓

Query Understanding

↓

Recall

↓

Fusion

↓

Rerank

↓

Context Assembly

↓

LLM

↓

Answer
```

Each stage narrows uncertainty.

Each stage prepares better information for the next.

By the time the language model starts generating, most of the hard retrieval work has already been completed.

---

# Final Thought

One thing surprised me after studying production RAG systems.

The language model isn't doing most of the work.

Most of the engineering happens before the model ever sees a prompt.

Query understanding improves retrieval.

Retrieval improves candidates.

Fusion improves robustness.

Reranking improves precision.

Context Assembly improves the prompt.

The language model is simply the final consumer of that carefully prepared context.

Perhaps that's the biggest shift in my understanding.

I no longer think of RAG as "retrieving documents."

I think of it as **progressively transforming a massive knowledge base into exactly the information the model needs to answer one specific question.**