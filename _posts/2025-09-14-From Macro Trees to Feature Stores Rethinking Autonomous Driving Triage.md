---

title: 'From Macro Trees to Feature Stores: Rethinking Autonomous Driving Triage'

date: 2025-09-14

permalink: /posts/feature-store-for-autonomous-driving-triage

tags:

  - autonomous-driving
  - machine-learning
  - decision-tree
  - xgboost
  - ai-agent
  - system-design

---

# Background

Recently I have been thinking about a new direction for improving our autonomous driving triage system.

Originally, the system is based on a **Macro Tree**. Every node in the tree invokes one or more Macro Functions, receives structured or semi-structured information, and asks an LLM to decide which branch to follow. Eventually, the Macro fills the tagging form for an incident.

The original long-term vision was to build a **Macro Trainer Agent**, allowing an LLM to automatically improve:

* Macro Tree
* Macro Functions
* Node Prompts

through benchmark feedback.

However, after thinking through the problem from multiple angles, I gradually realized that this might not be the right abstraction.

This post records that thought process.

---

# Step 1. Can Decision Trees Learn Our Macro?

The first idea was surprisingly straightforward.

Suppose every Macro Function produces some information.

Can we simply collect all these outputs from historical incidents and train a Decision Tree?

If successful, the learned tree could potentially replace or improve the manually designed Macro Tree.

At first this looked promising.

Decision Trees naturally produce branching rules:

```text
if max_cost > 10:
    ...
else:
    ...
```

which is conceptually very similar to our Macro nodes.

---

# Step 2. The First Major Concern

Very quickly I realized something didn't fit.

Many Macro Functions don't return simple numbers.

Instead, they return huge pieces of structured text.

For example:

* prediction trajectories
* negotiation summaries
* interaction logs
* multiple candidate predictions

One function may return two predictions.

Another incident may contain six.

The number of points is completely different.

Traditional Decision Trees expect every sample to have exactly the same feature space.

Obviously this data doesn't.

At first I thought this was a blocker.

---

# Step 3. The Realization: Macro Functions Are Not Features

This eventually led me to a much more important realization.

I had been treating:

```text
Macro Function Output
=
Feature
```

But that's actually wrong.

The Macro Function output is only **raw information**.

It still needs another layer that converts it into a fixed feature space.

For example:

Instead of storing the entire prediction trajectory, we could extract:

* current prediction count
* previous prediction count
* prediction count difference
* max NE
* average NE
* minimum NE
* whether new predictions appeared

Now every incident has exactly the same feature schema.

In other words,

```text
Raw Output
    ↓
Feature Adapter
    ↓
Structured Features
```

This "Feature Adapter" becomes a much more important component than I originally thought.

---

# Step 4. A Bigger Shift

While discussing this idea, another realization appeared.

Originally my goal was always:

```text
Decision Tree
    ↓
Improve Macro
```

But then I asked myself:

Why does the Decision Tree have to improve the Macro?

If it performs better than the Macro, why not deploy it directly?

Eventually I realized that our architecture naturally separates into two layers.

```text
Incident
    ↓
Macro Functions
    ↓
Feature Store
    ↓
Classifier
    ↓
Label
```

The classifier can be:

* Macro Tree
* Decision Tree
* Random Forest
* XGBoost
* Future ML models

The Macro Tree is simply **one possible consumer of the feature store**.

It is no longer the center of the system.

---

# Step 5. What Is the Real Asset?

This completely changed how I viewed the project.

Originally I thought our asset was the Macro.

Now I believe the real asset is the Macro Functions.

Why?

Because they encode our domain knowledge.

They decide:

* what information to collect;
* what autonomous driving signals matter;
* what observations humans actually use when making decisions.

Tree structures may change.

Models will certainly change.

But high-quality feature extraction remains valuable regardless of what classifier is used.

Eventually I started thinking of the project as building a:

> Driving Incident Feature Store

rather than building a better Macro.

---

# Step 6. The First Scientific Question

Once the Feature Store perspective became clear, the project objective also changed.

Instead of asking:

> How do we optimize the Macro?

the first question should be:

> Does our current Feature Store already contain enough information to predict the ground truth?

This becomes the first experiment.

Collect around 100–200 labeled incidents.

For each incident, save:

* Ground Truth
* Macro Prediction
* Raw Feature Dump

Then train several baselines:

* Decision Tree
* Random Forest
* XGBoost

The goal is not necessarily to beat the Macro.

The goal is to measure **how much information the current feature set already contains**.

---

# Step 7. Two Types of Errors

One particularly useful insight came from comparing Macro predictions and ML predictions.

There are only two interesting cases.

## Case 1

```text
Macro ❌
ML ✅
```

This means:

The feature already exists.

The Macro simply failed to utilize it correctly.

The problem lies in:

* tree structure;
* prompt design;
* decision logic.

---

## Case 2

```text
Macro ❌
ML ❌
```

This means something much deeper.

Neither the Macro nor the ML model could solve it.

Most likely,

the required information never existed in the feature space.

The next iteration should therefore improve the Feature Store itself instead of modifying the decision logic.

This simple classification provides a very systematic way to guide future iterations.

---

# Final Thoughts

Perhaps the biggest takeaway from this discussion is that I no longer see the Macro as the center of the system.

Instead, I now think of the architecture as:

```text
Incident
    ↓
Feature Extraction
    ↓
Driving Incident Feature Store
    ↓
Classifier
    ↓
Prediction
```

The classifier is replaceable.

The Feature Store is not.

Once this perspective clicked, many previously confusing design decisions suddenly became much clearer.
