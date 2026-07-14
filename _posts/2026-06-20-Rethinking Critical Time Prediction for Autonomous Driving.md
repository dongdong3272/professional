---

title: "From XGBoost to Video Understanding: Rethinking Critical Time Prediction for Autonomous Driving"

date: 2026-06-20

permalink: /posts/from-xgboost-to-video-understanding

tags:

  - autonomous-driving
  - machine-learning
  - llm
  - vlm
  - xgboost
  - feature-engineering

---

## Background

Recently I spent quite a bit of time thinking about one seemingly simple question:

> **How can we automatically identify the critical moment of an autonomous driving incident?**

Initially I thought this was simply a multi-class classification problem. Given a timestamp, collect all available sensor data, feed them into an ML model, and predict the incident category or whether this timestamp is critical.

However, after digging deeper, I realized that the real challenge is **not choosing a better model**, but understanding **what information is actually needed** for the model to make the right decision.

This post summarizes my thought process from beginning to end.

---

# Step 1. Is this a Survival Analysis problem?

The first concept I explored was **Survival Model (Survival Analysis)**.

At first glance it sounded relevant because it also deals with time.

However, after understanding it better, I realized it solves a completely different problem.

Survival Analysis answers:

> *When will an event happen?*

Typical examples include:

* Time until a patient relapses
* Time until a machine fails
* Time until a user churns

In contrast, my problem is

> *The incident has already happened. Which timestamp should an engineer look at?*

These are fundamentally different.

What I am trying to solve is much closer to

* Temporal Localization
* Key Frame Detection
* Evidence Retrieval
* Learning-to-Rank

rather than Time-to-Event prediction.

This helped narrow down the research direction considerably.

---

# Step 2. Traditional ML: Which model should I use?

Our current pipeline extracts structured features around a timestamp.

For example,

* vehicle speed
* acceleration
* planner status
* localization status
* perception outputs
* etc.

We experimented with several traditional ML models.

* Logistic Regression
* Random Forest
* XGBoost

Among them, **XGBoost consistently achieved the best performance**, although the overall accuracy is still only around **60%**.

Naturally, the next question became:

> Should I keep searching for a better model?

Candidates worth trying include:

* LightGBM
* CatBoost
* TabNet
* FT-Transformer

However, after thinking more carefully, I became less convinced that the model itself is the bottleneck.

---

# Step 3. Maybe the problem is Feature Engineering

This became the turning point of my thinking.

Our current features are mostly **hand-crafted**.

Questions immediately came to mind:

* Are these features actually useful?
* Are we missing the truly informative signals?
* Are the timestamps aligned correctly?

Suppose a pedestrian suddenly appears.

The actual cause may occur at

```
t = -0.8 s
```

while the takeover happens at

```
t = 0 s
```

If all features are extracted at exactly `t = 0`, the model is effectively learning from the consequence rather than the cause.

No matter how powerful the model is, it may never learn the real pattern.

This shifted my attention from

> "Which model?"

to

> "Which information?"

---

# Step 4. What about Camera Images?

Another question arose.

Suppose at a timestamp we have

* Speed (3 numbers)
* Acceleration (3 numbers)
* Planner outputs
* ...

but also

```
10 Camera Images
1024 × 1024 × 3
```

Should these images simply be flattened and concatenated into XGBoost?

The answer is obviously no.

Instead, images should first be transformed into compact representations.

Typical pipelines are

```
Image
    ↓
Vision Encoder
    ↓
Embedding (256~1024 dims)
    ↓
XGBoost
```

Possible encoders include

* ResNet
* CLIP
* DINOv2
* ViT

This is how structured ML models are typically combined with high-dimensional visual data.

---

# Step 5. But then I realized an even bigger issue

Our task is **not understanding one frame**.

It is understanding

> **what happened during one second.**

A single image rarely tells the whole story.

For example,

A vehicle cutting into the ego lane.

The key information is

```
Frame 1
Vehicle in adjacent lane

↓

Frame 5
Vehicle begins merging

↓

Frame 10
Vehicle enters ego lane
```

The event is encoded in the **motion**, not in any individual frame.

This realization completely changed how I viewed the problem.

Instead of Image Understanding,

the task is actually

> **Video Understanding.**

---

# Step 6. Could VLMs solve this better?

Once the problem became "understanding one second of driving," modern Vision-Language Models suddenly became very attractive.

Instead of manually engineering hundreds of visual features,

a VLM can directly summarize the event.

For example,

Input:

```
10 consecutive frames
```

Output:

> "A vehicle suddenly cuts into the ego lane from the right."

or

> "A pedestrian emerges from behind a parked vehicle."

This kind of semantic understanding is much closer to how human triagers reason about incidents.

Rather than predicting directly,

I started thinking about a pipeline like

```
Video Window
        ↓
Video VLM
        ↓
Natural Language Summary
        ↓
Classifier
```

or even

```
Video Window
        ↓
Video VLM
        ↓
Embedding
        ↓
Prediction
```

The model would first understand **what happened**, and only then determine **whether it is critical**.

This decomposition feels much more natural.

---

# Step 7. Transcript may already contain high-level semantics

Another important realization came from our existing data.

Each incident already contains a driver transcript.

The driver's speech is converted into text automatically.

For example,

> "The vehicle drifted toward the curb."

or

> "The perception missed the cone."

These transcripts are essentially human-written summaries of the incident.

Instead of treating them as auxiliary information,

they might actually provide the strongest semantic signal available.

A simple experiment immediately came to mind.

Compare

```
Sensor Features
```

vs

```
Transcript Embedding
```

vs

```
Sensor Features
+
Transcript Embedding
```

This experiment could quickly reveal how much information the transcript contributes beyond structured sensor data.

---

# Final Thoughts

This discussion gradually changed my perspective.

Initially, I believed the problem was

> finding a stronger classifier.

Now I think the real challenge is

> finding a better representation of the event.

The bottleneck is probably **not XGBoost**.

Instead, it may lie in

* incomplete feature engineering,
* temporal misalignment,
* insufficient event-level representation,
* or missing semantic information.

In hindsight, the evolution of my thinking looked something like this:

```
Survival Analysis?
        ↓
No.

Traditional ML?
        ↓
XGBoost works best.

Need a stronger model?
        ↓
Maybe not.

Need better features?
        ↓
Probably.

Static image?
        ↓
Still insufficient.

Need temporal understanding?
        ↓
Yes.

Need event-level semantics?
        ↓
Video VLM + Transcript.
```

Perhaps the ultimate problem is not

> **Critical Time Classification**

but rather

> **Event Understanding for Autonomous Driving Incident Triage.**

That subtle shift in problem formulation may be more important than any model improvement itself.
