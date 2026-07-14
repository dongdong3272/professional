---

title: "Building My Mental Model of AI Infrastructure"

date: 2026-07-13

permalink: /posts/building-my-ai-infrastructure-mental-model

tags:

  - ai
  - ai-infrastructure
  - llm
  - distributed-systems
  - career

---

# Why I Wrote This

Recently I realized that I had been hearing the term **AI Infrastructure** everywhere, but everyone seemed to mean something different.

Some people called CUDA AI Infra.

Some people called LangGraph AI Infra.

Others referred to GPU scheduling, vLLM, or even Agent SDKs as AI Infrastructure.

I wanted to answer one question:

> **If I look at the entire AI stack, where does each technology belong?**

Instead of memorizing isolated concepts, I wanted to build a complete mental model.

---

# Step 1: AI Infrastructure Is Not One Thing

My first realization was that AI Infrastructure is not a single layer.

Instead, it is an entire stack.

```
AI Product
──────────────────────────
Agent Platform
──────────────────────────
Inference Platform
──────────────────────────
Training Platform
──────────────────────────
Model Research
──────────────────────────
Data Platform
```

Thinking in layers immediately made many previously confusing concepts much easier.

For example,

* LangGraph and OpenAI Agent SDK are platforms.
* Cursor and Claude Code are products.
* vLLM is inference infrastructure.
* Kubernetes belongs to the training platform.
* Transformer architecture belongs to model research.

This simple picture became the backbone for everything else.

---

# Step 2: Infrastructure vs Product

One of the most useful distinctions I learned was:

> **Does this solve a user's problem, or does it provide capabilities for others to build on?**

That single question separates many confusing concepts.

For example,

## Infrastructure

* LangGraph
* OpenAI Agent SDK
* Google ADK
* vLLM
* TensorRT-LLM
* Kubernetes

These provide reusable capabilities.

---

## Product

* Cursor
* Claude Code
* ChatGPT
* Coding Agents
* Research Agents

These solve real user problems.

This also helped me correctly classify my own work.

Building an Agent with LangGraph is still building a product.

Building LangGraph itself is building infrastructure.

---

# Step 3: Understanding Training Infrastructure

Initially I thought Training Platform sounded simple.

> "A job needs 4000 GPUs. Just give it 4000 GPUs."

But that is far from reality.

The real challenges include:

* GPU topology (which GPUs should be grouped together)
* Distributed communication
* Fault recovery
* Checkpointing
* Scheduling multiple large jobs
* Resource preemption
* Cluster utilization

Training Infrastructure is essentially the operating system for large-scale model training.

The researcher only writes

```python
train.py
```

Everything else is handled by the platform.

---

# Step 4: Understanding Inference Infrastructure

This was probably the biggest conceptual breakthrough.

Training and inference solve completely different problems.

Training asks:

> How do we make the model smarter?

Inference asks:

> How do we serve millions of users efficiently?

The interesting part is that many inference optimizations **never modify the model weights**.

Examples include:

* KV Cache
* Prefix Cache
* Continuous Batching
* Speculative Decoding
* Model Routing

None of these make the model "smarter."

They simply make the exact same model much faster and cheaper to serve.

---

## The Moment KV Cache Finally Clicked

The key insight was surprisingly simple.

Every generated token requires attention over previous tokens.

Without caching, earlier tokens would be repeatedly recomputed.

For example,

```
Hello

↓

Hello world

↓

Hello world today
```

The representation of "Hello" never changes.

So why compute it again?

The answer is:

Cache it.

This became my intuitive understanding of KV Cache.

Instead of thinking about complicated transformer equations, I started thinking about eliminating redundant computation.

---

# Step 5: AI Product Is Not "Lower Level"

I used to have an implicit assumption:

> AI Product sits at the bottom of the technical hierarchy.

After thinking through every layer, I realized that this isn't really true.

Different layers optimize different objectives.

Model Research optimizes model capability.

Training Platform optimizes training efficiency.

Inference Platform optimizes serving efficiency.

AI Product optimizes user value.

In fact, Product often has the clearest business metrics:

* User adoption
* Revenue
* Retention
* Accuracy improvement
* Workflow efficiency

Every layer has measurable impact.

They simply measure different things.

---

# Step 6: Finding My Own Direction

Perhaps the biggest takeaway from this discussion wasn't technical.

It was discovering what actually interests me.

I don't see myself becoming someone writing CUDA kernels.

That isn't where my curiosity naturally goes.

Instead, I found myself repeatedly asking questions like:

* Why is this system faster?
* Why does scheduling matter?
* How does vLLM work?
* Why does KV Cache reduce computation?
* Why do distributed systems become necessary?

Those are systems questions.

I realized that what really attracts me is the intersection between AI and distributed systems.

Something like:

* Inference Systems
* Training Platforms
* Distributed Scheduling
* Ray
* Kubernetes
* vLLM
* AI Runtime

This feels like a much more natural evolution from my current background than pure model research.

---

# My Learning Roadmap

Instead of trying to learn everything, I came away with a much clearer roadmap.

## Phase 1

Understand how a Transformer performs one forward pass.

Goal:

Know what happens internally during inference.

---

## Phase 2

Study modern inference systems.

Topics:

* KV Cache
* Continuous Batching
* vLLM
* Serving Architecture

---

## Phase 3

Study distributed AI systems.

Topics:

* Ray
* PyTorch Distributed
* NCCL
* Kubernetes

---

I intentionally excluded CUDA from this roadmap.

Not because it isn't important.

But because it isn't the layer I want to specialize in.

---

# Final Thought

The biggest thing I gained wasn't another list of technologies.

It was finally having a mental map.

Now, whenever I hear terms like

* vLLM
* Ray
* LangGraph
* TensorRT
* Kubernetes
* Transformer
* CUDA

I no longer see isolated buzzwords.

I immediately know **which layer they belong to, what problem they solve, and how they fit into the larger AI ecosystem.**

That mental model is probably much more valuable than memorizing any individual technology.
