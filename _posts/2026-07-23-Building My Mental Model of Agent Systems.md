---
title: "Building My Mental Model of Agent Systems"

date: 2026-07-23

permalink: /posts/building-my-agent-system-mental-model

tags:
  - ai
  - llm
  - agent
  - rag
  - context-engineering
  - harness

---

# Why I Wrote This

Over the past few months, I realized that I had been learning AI agents in a very fragmented way.

One week I was studying RAG.

The next week I was reading about Context Engineering.

Then I started exploring Agent Harnesses, Coding Agents, and Claude Code.

Every topic made sense on its own.

But I couldn't answer one simple question:

> **How do all of these pieces fit together into one complete Agent System?**

Instead of learning more individual concepts, I wanted to build a mental model.

The same way I previously built a mental model for AI Infrastructure, I wanted one for modern AI agents.

---

# Step 1: Everything Started With RAG

Like many engineers, my journey started with RAG.

Initially, my mental model was surprisingly simple.

```
LLM

+

Vector Database

=

RAG
```

The more I learned, the more I realized that wasn't really true.

A Vector Database is only one possible implementation of retrieval.

RAG isn't about Vector Databases.

RAG is about deciding **what information the model gets to see before it starts reasoning.**

That realization completely changed how I viewed retrieval.

Instead of thinking about databases, I started thinking about context.

---

# Step 2: RAG Is Really About Context

This led me to another realization.

The model itself doesn't know what documents to read.

It only sees whatever is placed inside its context window.

That means RAG isn't improving the model.

It is improving the model's input.

In other words,

> **RAG is one way of engineering context.**

Eventually I realized that retrieval is only one part of a much larger problem.

Other systems also shape the model's context:

- Memory
- Conversation history
- Retrieved documents
- Tool descriptions
- System prompts
- Context compression

Together, these form what people now call **Context Engineering**.

The question Context Engineering tries to answer is surprisingly simple:

> **What should the model see before it starts thinking?**

---

# Step 3: Context Still Isn't Enough

For a while, I thought Context Engineering explained everything.

Then I started looking at coding agents like Claude Code, Cursor, and Codex.

These systems weren't just retrieving documents.

They were:

- Running code
- Calling tools
- Reading files
- Fixing errors
- Trying again
- Managing long conversations
- Keeping track of permissions

Suddenly I realized something important.

The model wasn't acting alone anymore.

There was an entire execution system surrounding it.

The model reasoned.

The surrounding system executed.

The model observed the result.

Then it reasoned again.

The real workflow looked much more like this:

```
Reason

↓

Act

↓

Observe

↓

Reason

↓

Act

↓

...
```

This wasn't simply RAG anymore.

It wasn't even just Context Engineering.

It was an entire execution environment built around the model.

---

# Step 4: The Bigger Picture Finally Clicked

At some point I realized that I had been learning different parts of the same system.

Instead of viewing them separately, I started organizing them into layers.

```
                    Agent

              ┌────────────────────┐

                  Foundation Model

              └────────────────────┘
                         ▲
                         │
              ┌────────────────────┐

                 Agent Harness

              ├────────────────────┤

              Prompt Engineering

              Context Engineering
                  ├── RAG
                  ├── Memory
                  ├── Prompt Assembly

              Tool Orchestration

              Execution Environment

              Guardrails

              Feedback Loops

              Observability

              └────────────────────┘
```

That picture suddenly explained almost everything I had been learning.

Prompt Engineering wasn't competing with Context Engineering.

Context Engineering wasn't replacing Agent Harnesses.

Instead, they were solving different parts of the same problem.

---

# Step 5: The Question Each Layer Answers

Looking back, I realized every concept I had learned was answering a different question.

**Prompt Engineering**

> How should I communicate with the model?

**Context Engineering**

> What information should the model see?

**Agent Harness**

> How can the model reliably interact with the real world?

Those questions build on one another.

Better prompts help the model reason.

Better context helps the model reason about the right information.

A better harness allows the model to turn reasoning into reliable action.

---

# What Changed My Thinking

Originally, I thought building better AI agents mostly meant finding a better model.

Then I thought it meant building better RAG.

Now I think both ideas are incomplete.

Modern AI agents aren't just models.

They are systems.

The model provides intelligence.

Context Engineering determines what the model knows.

The Harness gives the model the ability to act.

Once I started viewing everything through that lens, concepts that once felt unrelated suddenly became parts of the same picture.

That mental model has probably been more valuable than learning any individual framework or technique.