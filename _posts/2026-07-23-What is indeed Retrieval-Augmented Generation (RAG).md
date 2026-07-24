---
title: "What is indeed Retrieval-Augmented Generation (RAG)?"

date: 2026-07-23

permalink: /posts/building-my-rag-mental-model

tags:
  - ai
  - llm
  - rag
  - retrieval
  - vector-db
  - search

---

# Why I Wrote This

When I first learned about RAG, I thought it was surprisingly simple.

```
LLM

+

Vector Database

=

RAG
```

Almost every tutorial started with embeddings, vector databases, and semantic search.

So naturally, I assumed that Vector Databases were what made RAG possible.

The more I learned, however, the more I realized that this mental model was backwards.

Vector databases are important.

But they are not what RAG fundamentally is.

Eventually I realized something much simpler.

> **RAG is not a Vector Database. RAG is a retrieval system whose consumer happens to be an LLM.**

That realization completely changed how I think about modern RAG systems.

---

# Step 1: RAG Doesn't Need a Vector Database

Imagine you only have ten documents.

The simplest implementation could look like this.

```
Documents

↓

Embedding

↓

Store vectors in memory

↓

User Query

↓

Embedding

↓

Cosine Similarity

↓

Top K Documents

↓

LLM
```

No Vector Database.

No HNSW.

No Approximate Nearest Neighbor search.

No indexing.

Just cosine similarity over ten vectors.

Technically, this is already a complete RAG system.

The only thing RAG really requires is:

1. Retrieve relevant information.
2. Put it into the model's context.
3. Let the model generate an answer.

Nothing in that definition requires a specialized database.

---

# Step 2: So Why Do Vector Databases Exist?

The answer has nothing to do with LLMs.

It has everything to do with scale.

Searching ten vectors is easy.

Searching one hundred vectors is still easy.

Searching one million vectors starts becoming expensive.

Searching one hundred million vectors by computing cosine similarity against every vector is simply impossible.

At that point, retrieval stops being an AI problem.

It becomes a search problem.

The challenge is no longer:

> Which document is the most similar?

The challenge becomes:

> How do we avoid comparing against every document?

That question has existed in Information Retrieval long before LLMs.

---

# Step 3: Retrieval Is Really Search

This was probably my biggest conceptual breakthrough.

For a long time I thought RAG introduced a completely new paradigm.

It didn't.

Search engines have been solving retrieval problems for decades.

The only thing that changed is who consumes the retrieved documents.

Previously:

```
Query

↓

Search

↓

Documents

↓

Human
```

Today:

```
Query

↓

Search

↓

Documents

↓

LLM
```

The retrieval system itself is still solving the same fundamental problem:

Find the most relevant information efficiently.

Once I started thinking this way, many RAG concepts suddenly looked very familiar.

---

# Step 4: Scaling Retrieval Changes Everything

Once retrieval becomes a search problem, the next challenge becomes efficiency.

Comparing against every vector is no longer practical.

Instead, retrieval systems try to quickly find a much smaller candidate set.

Instead of searching

```
100,000,000 vectors
```

they try to find perhaps

```
1000 candidates
```

and only perform more expensive similarity calculations on those.

This is exactly why Approximate Nearest Neighbor (ANN) algorithms exist.

They trade a tiny amount of accuracy for orders of magnitude better performance.

This is also where algorithms such as HNSW become important.

Notice something interesting.

Neither ANN nor HNSW exists because of LLMs.

They exist because efficient search is a classic systems problem.

---

# Step 5: A Modern RAG System Is Much More Than Retrieval

For a while I thought retrieval was the entire story.

Then I started reading how production RAG systems are actually built.

The retrieval step is only one stage inside a much larger pipeline.

A typical production workflow looks more like this:

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

Generation
```

This pipeline immediately explained why production RAG systems are much more complicated than simply calling a Vector Database.

Each stage solves a different problem.

Query Understanding determines what the user is really asking.

Recall tries to avoid missing useful information.

Fusion combines results from multiple retrieval methods.

Reranking improves precision.

Context Assembly prepares information for the model.

Only after all of those steps does the LLM begin generating an answer.

---

# Step 6: The Real Innovation Isn't Retrieval

One thing surprised me after looking at this pipeline.

Everything before Context Assembly is fundamentally an Information Retrieval problem.

Query understanding.

Retrieval.

Ranking.

Search.

These ideas have existed for many years.

The LLM doesn't even participate yet.

The model only enters the picture after retrieval has already finished.

That means RAG isn't replacing search.

It is connecting search to language models.

Search is no longer designed for humans.

It is designed for another AI system.

That perspective completely changed how I think about retrieval.

---

# My Mental Model of RAG

Today, this is the picture I keep in my head.

```
                User Query

                     │

          Information Retrieval

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

        Large Language Model

              ↓

         Generated Answer
```

The retrieval system is responsible for finding information.

The language model is responsible for reasoning over that information.

Those are two different systems solving two different problems.

---

# Final Thought

When people first learn RAG, it's easy to focus on Vector Databases.

I certainly did.

But today, I think that's one of the least interesting parts of the entire system.

The real breakthrough wasn't inventing a new database.

It was realizing that decades of Information Retrieval research could become the front-end of a language model.

Once I started viewing RAG as a search system instead of a database, everything else—from HNSW to reranking to context assembly—fell naturally into place.

That mental model has made every new RAG technique much easier to understand.