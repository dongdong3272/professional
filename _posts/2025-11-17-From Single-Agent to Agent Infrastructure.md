---

title: 'From Single-Agent to Agent Infrastructure: A Mental Model Shift'

date: 2025-11-17

permalink: /posts/from-single-agent-to-agent-infrastructure

tags:

  - ai-agent
  - ai-infrastructure
  - distributed-systems
  - system-design
  - interview

---

## Background

This post summarizes one of the most valuable takeaways from a recent AI Infrastructure interview.

Interestingly, I did **not** leave the interview thinking that I lacked Agent knowledge. Instead, I realized that **the interviewer and I were reasoning about two completely different definitions of "Multi-Agent System."**

This misunderstanding eventually led us to discuss entirely different topics throughout the interview.

Looking back, this mental model shift is probably much more valuable than simply memorizing concepts like CAP theorem or Raft.

---

## My Original Understanding of Multi-Agent

For the past year, most of my work has focused on solving **real production problems** using LLMs.

My mental picture of a multi-agent system has always been something like:

```
                Planner Agent
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
 Research Agent             Coding Agent
        │                         │
        └────────────┬────────────┘
                     ▼
                Final Answer
```

All agents:

* live inside the same runtime
* share the same workspace
* communicate by function calls or shared state
* have different system prompts and responsibilities

This is exactly how I naturally think about LangGraph, CrewAI, AutoGen, and my own production system.

The "multi-agent" part simply means **multiple specialized roles**.

Deployment is almost irrelevant.

---

## The Interviewer's Understanding

During the interview, however, I gradually realized the interviewer was talking about something completely different.

His mental model was closer to:

```
              Planner Service
                    │
      ┌─────────────┴─────────────┐
      ▼                           ▼
 Research Service          Coding Service
      │                           │
      └─────────────┬─────────────┘
                    ▼
             Evaluation Service
```

Now each "Agent" is actually:

* an independent service
* an independent deployment
* potentially an independent Kubernetes Pod
* communicating through RPC, message queues, or future Agent protocols

Suddenly, the discussion naturally shifts toward:

* Agent communication
* Network failures
* Distributed state
* Scheduling
* Fault tolerance
* Consistency
* Knowledge synchronization

This is no longer an Agent Design problem.

It becomes a **Distributed Systems** problem.

---

## Why We Were Not On The Same Page

This explains almost every confusing moment during the interview.

When discussing multi-agent systems:

My brain:

```
Planner.run()
Research.run()
Reviewer.run()
```

Interviewer:

```
Planner Service
      │
   gRPC / Kafka
      │
Research Service
```

When discussing agent communication:

I thought:

> Why is communication difficult? They're just function calls.

The interviewer thought:

> What if the remote service crashes?
>
> What if messages arrive twice?
>
> What if two planners schedule the same task simultaneously?

Those are completely different conversations.

---

## An Interesting Realization

After the interview I started looking at today's successful Agent products.

Examples include:

* Cursor
* Claude Code
* OpenAI Codex

Surprisingly, they are **much closer to my mental model**.

Most of them are essentially:

```
One Runtime

↓

One Context

↓

Many Tools

↓

Long-Horizon Execution
```

rather than:

```
100 Distributed Agents
```

This was actually reassuring.

The industry's most successful Agent products today are still primarily **single-runtime agent systems**.

---

## Single-Agent vs Multi-Agent

While digging deeper, I found several recent papers arguing that:

> A strong single agent with better context often outperforms multiple collaborating agents.

This initially felt counter-intuitive, but the reasoning makes sense.

Suppose we have:

```
Planner

↓

Backend Agent

↓

Reviewer
```

Every handoff requires:

* summarization
* prompt construction
* context compression

Each step introduces information loss.

Instead of passing information around, it may be better for one sufficiently capable agent to simply keep the complete context.

This reminds me of software engineering.

A senior engineer who understands:

* architecture
* implementation
* debugging

often performs better than three people constantly synchronizing information.

Of course, there are scenarios where multiple agents are valuable:

* naturally parallel tasks
* different security permissions
* different execution environments
* long-running asynchronous workflows

The key insight is:

> More agents are not automatically better.

The real tradeoff is:

```
Context Sharing

vs.

Agent Coordination
```

---

## Where My Own Work Fits

Another important realization:

My project is fundamentally a **domain-specific AI application**.

Its goal is very clear:

```
Real Triage Problems

↓

Agent Workflow

↓

Higher Accuracy

↓

Lower Cost

↓

Production Impact
```

I have always optimized for:

* accuracy
* latency
* business value
* production reliability

The interviewer's work, however, is much more platform-oriented.

Their focus is on:

* Agent Runtime
* Agent Harness
* Agent Communication
* Agent Scheduling
* Distributed Execution

One is not necessarily better than the other.

They simply optimize different objectives.

---

## The Biggest Gap I Discovered

Ironically, I don't think my biggest weakness is Agent Design.

Instead, it is the lack of understanding of **Agent Infrastructure**.

Questions that repeatedly appeared during the interview include:

* How should knowledge evolve over time?
* How should skills continuously improve?
* How do agents communicate?
* How should multiple agents synchronize state?
* How do we guarantee consistency?
* How do we recover from failures?

Looking back, all of these are essentially asking the same question:

> How do you build an Agent **Platform**, rather than just an Agent application?

This is exactly where Distributed Systems knowledge starts becoming extremely valuable.

---

## Next Learning Goals

Rather than abandoning application development, I want to build upon it.

The next stage of learning should include:

### Agent Runtime

* Claude Code architecture
* OpenAI Codex
* Context Engineering
* Skill management
* Agent Harness

### Agent Infrastructure

* Distributed Systems fundamentals
* RPC and Message Queues
* Scheduling
* State management
* Consistency
* Fault tolerance

The goal is **not** to stop building useful Agent applications.

Instead, it is to understand how those applications eventually evolve into large-scale Agent platforms.

That perspective shift was probably the biggest takeaway from this interview.
