---
layout: archive
title: "Research & Projects"
permalink: /research_expr/
classes: wide
author_profile: true
---

#### 1. **Fault-tolerant & Scalable SurfStore** _(Mar. 2024 - Jun. 2024)_

*Tech Stack: Go, Raft, gRPC*

- Implemented a cloud-based file storage service with client-server architecture using gRPC, enabling seamless file
synchronization across multiple clients.

- Designed and integrated a scalable block mapping algorithm to distribute data efficiently across thousands of
simulated block servers, ensuring scalability, availability, and performance.

- Enhanced metadata consistency by implementing a fault-tolerant metadata server based on the RAFT consensus
protocol, enabling leader election and log replication for robust failure recovery

#### 2. **VisualNeo: Bridging Visual Query Interfaces and Graph Query Engines** _(June. 2022 - May. 2023)_

##### _(Supervisor: [Prof. ZHOU Xiaofang](https://cse.hkust.edu.hk/admin/people/faculty/profile/zxf), Otto Poon Professor of Engineering and Chair Professor, Head of Department)_

*Tech Stack: Java, Neo4j, Cypher*

- Designed VisualNeo, a visual query interface for Neo4j that enables non-expert users to construct complex graph queries and explore results, bridging visual query interfaces and graph query engines.

- Published at the 49th International Conference on Very Large Data Bases (VLDB’23 / PVLDB). Access the paper [here](https://www.vldb.org/pvldb/vol16/p4010-huang.pdf).

- Source code: [GitHub](https://github.com/C1rF/VisualNeo).

{% comment %}
#### Cohabit – Social Habit Tracking and Focus Group App _(Jan. 2025 - Mar. 2025)_

*Tech Stack: React Native, Node.js, Firebase*

- Designed and developed a cross-platform mobile app using React Native to help UCSD students reduce stress by tracking habits, forming focus groups, and fostering peer accountability.
- Implemented core features including habit creation, streak tracking, weekly calendar view, and push notifications for reminders using React Native APIs.
- Built secure authentication and user management with UCSD SSO, account registration, and data persistence via Firebase backend services.
- Developed social features such as friend requests, blocking, privacy settings, and group discovery to enhance community engagement and user retention.
- The project source code can be accessed [here](https://github.com/broad-well/social-habits).

#### JMatch Android App _(Feb. 2023 - Jun. 2023)_

*Tech Stack: Java, Android Studio, WeChat Cloud Database*

- Engineered a job-seeking mobile application that leverages Natural Language Processing (NLP) to align job descriptions with cover letters, providing a tailored platform for both candidates and recruiters.
- Utilized WeChat Cloud Database and WeChat Cloud Function to construct backend functionalities, including CRUD operations and email verification, ensuring a robust and secure application.
- Utilized multi-threading to guarantee UI rendering within 16ms, maintaining smooth and responsive interactions.
- The project source code can be accessed [here](https://github.com/dongdong3272/JMatch).

#### Frontend Development of HKUST Path Advisor Project _(Feb. 2022 - Jun. 2022)_

##### _(Supervisor: [Prof. Raymond Wong](https://seng.hkust.edu.hk/about/people/faculty/raymond-chi-wing-wong))_

- [HKUST Path Advisor](https://pathadvisor.ust.hk/) is a system which could help users to find locations in our UST map easily. Currently, HKUST Path Advisor Version 2.0 is being operated.
- Enhanced search engine algorithms for a venue-finding platform, implementing error correction and utilizing edit distance metrics to improve searching accuracy and relevance.
- This work significantly increased the searching accuracy from 37% to 89%, enhancing the platform’s effectiveness.

#### OurDeal Shopping Platform _(Jan. 2022 - May. 2022)_

- Developed a second-hand trading platform using PHP for college students, featuring full CRUD database operations, responsive web design, and a user-friendly interface.
- The website, which is currently hosted on 000webhost, is operational and can be accessed [here](http://mydeal-dongdong.000webhostapp.com/home/home.php).
- The project source code can be accessed [here](https://github.com/dongdong3272/ITP303Project).

#### Research on Front-end Web Design and Improvement of T-Music Web System _(Sep. 2020 - Dec. 2020)_

##### _(Supervisor: [Prof. Raymond Wong](https://seng.hkust.edu.hk/about/people/faculty/raymond-chi-wing-wong))_

- T-Music is an algorithm that composes a series of musical notes from input lyrics using frequent pattern mining and other data mining techniques. T-Music Web System is a maintainable and scalable system that deploy the usage of the algorithm. However, the implementation of the web system has not been completed yet and there is some future work to do. This project aims to equip us the basic front-end web design skills as well as to implement some new features based on the original web system.
{% endcomment %}
