---

title: "Thinking About Agent Skills: What Makes a Good Skill?"

date: 2026-01-27

permalink: /posts/thinking-about-agent-skills

tags:

  - ai
  - llm
  - ai-agent
  - research

---

## Why I Started Looking into Agent Skills

Recently I found myself thinking about a seemingly simple question:

> *What actually makes an Agent Skill "good"?*

At first, I assumed there must already be a research direction called **Skill Optimization**. My original goal was simply to collect a few papers discussing how to design better reusable skills for LLM agents.

However, after digging into the literature, I realized something interesting:

> There are many papers about planning, memory, tool use, and reasoning, but surprisingly few directly study **how skills themselves should be defined and evaluated**.

That changed the direction of my reading entirely.

---

## My Original Mental Model

Initially, I viewed a skill almost like a function.

```python
search_web()
book_flight()
summarize_pdf()
```

A skill performs one task, and the agent simply calls it whenever necessary.

Naturally, I thought the quality of a skill should simply depend on:

- execution success rate
- robustness
- correctness

In other words,

> better implementation = better skill.

But this assumption quickly became questionable.

---

## The First Surprise: Voyager

The first paper that changed my thinking was **Voyager**.

Instead of focusing on planning algorithms, Voyager treats the entire learning process as continuously building a **Skill Library**.

Every completed task becomes a reusable skill.

The important observation is that:

> A reusable skill is often more valuable than a highly specialized one.

For example,

```python
mine_iron()
```

is much more useful than

```python
mine_iron_from_this_exact_location()
```

This immediately raises a new question:

> Maybe "reusability" is actually one of the most important dimensions of skill quality.

---

## Then I Realized Skill Granularity Matters

The next idea came from hierarchical planning papers.

Suppose our skill library contains only primitive actions:

```
move_left
move_right
jump
```

Planning becomes extremely expensive because the search space explodes.

On the other hand, if the library only contains

```
build_house
```

then almost nothing can be reused for new tasks.

This led me to another question:

> How large should a skill be?

The answer is clearly somewhere in between.

Finding the right level of abstraction suddenly felt much more important than simply writing better implementations.

---

## Skills Are Actually "Options"

Reading older reinforcement learning literature revealed that this problem is not entirely new.

The classic **Options Framework** defines a skill as three components:

```
Initiation Set
↓

Policy
↓

Termination Condition
```

In other words, a skill is not just *what to do*.

It also specifies:

- when it can be invoked;
- how it behaves internally;
- when it should stop.

Interestingly, many modern LLM Agent tools fit this definition almost perfectly.

---

## Execution Is Only Half of the Story

One realization stood out to me.

Imagine two functions with identical implementations.

```python
search_flights()
```

Skill A:

> Search flights.

Skill B:

> Find available flights between cities, compare prices, and return candidate itineraries.

Although the code is exactly the same, an LLM is much more likely to retrieve the second one.

This means:

> A skill's quality depends not only on execution, but also on discoverability.

The description, naming, and documentation may be just as important as the implementation itself.

---

## A Possible Way to Evaluate Skills

At this point, I started wondering whether success rate is even the right evaluation metric.

Perhaps a skill should instead be evaluated by several different dimensions.

For example:

- **Reusability** — How many different tasks can use it?
- **Coverage** — How much of the problem space can it solve?
- **Planning Compression** — How much reasoning does it eliminate?
- **Discoverability** — How likely is an LLM to retrieve it correctly?
- **Composability** — How easily can it be combined with other skills?

Rather than asking

> "Did the skill execute successfully?"

perhaps we should ask

> "Does this skill make future agents smarter?"

---

## Where I Think This Research Could Go

The more I thought about it, the more I felt that the bottleneck of future Agent systems may not be planning itself.

Instead, it may be the design of the **Skill Library**.

When an agent owns

- 10 skills,

almost anything works.

When it owns

- 100 skills,

organization becomes important.

When it owns

- 1,000 or even 10,000 skills,

retrieval, abstraction, naming, and composition may become the real research challenges.

Perhaps the next generation of Agent research will spend less effort teaching agents **how to execute**, and more effort defining **what a good skill actually is**.

That feels like a surprisingly open research question.