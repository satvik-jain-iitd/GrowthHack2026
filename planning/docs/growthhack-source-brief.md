# Growth Hack 2026 — Source Brief (converted from GrowthHack.docx)

> **Provenance:** Converted verbatim (reformatted, not rewritten) from [`GrowthHack.docx`](../../GrowthHack.docx) at the repo root on 2026-09-14, so the content is reliably readable/searchable by humans and agents going forward. The original `.docx` is left in place as the source of record; treat this file as the canonical *readable* copy. If the two ever disagree, the `.docx` wins unless this file is later updated deliberately.
>
> **2026-09-14 correction:** the initial conversion pass extracted only the `.docx`'s two raster images (via a `word/media/` zip scan) and missed additional graphical content (the judging-process pages, likely SmartArt/grouped shapes not captured by that scan). The user first supplied [`GrowthHack.pdf`](../../GrowthHack.pdf) — an export of the same document with that content readable — then **directly pasted the live Square page itself** (`https://thesquare.americanexpress.com/sites/business-unit/technology/growthhack/documents/759914/judging-process-1`), confirming the `.pdf`'s judging content verbatim against the authoritative source. Both are now merged in below (see "Judging Process (Two Rounds)" and "Judging Criteria (Weighted)" in Section 1) — the judging section is now **verified against the live Square page**, not just an offline export.
>
> This is raw source material (event rules, a meeting recap, the full EASE product-vision writeup, and team structure) — it has not yet been triaged into the BMad `docs/product/`, `docs/research/`, `docs/plans/` taxonomy described in [`docs/README.md`](./README.md). Treat it as Discovery-phase input to mine from, not a finished planning artifact.

## Table of Contents

1. [Growth Hack 2026 — Program Overview](#1-growth-hack-2026--program-overview)
2. [Business Unit Opportunity Themes](#2-business-unit-opportunity-themes)
3. [Submitting Your Hack](#3-submitting-your-hack)
4. [FAQ](#4-faq)
5. [Resy Onboarding Process — Meeting Recap (with Meagan McCallum)](#5-resy-onboarding-process--meeting-recap-with-meagan-mccallum)
6. [Satvik's Suggestions / Product Naming](#6-satviks-suggestions--product-naming)
7. [EASE — Product Vision (60 sections)](#7-ease--product-vision)
8. [Architecture & Governance References](#8-architecture--governance-references)
9. [Team EASE — Operating Structure](#9-team-ease--operating-structure)
10. [GitHub Repos for Inspiration](#10-github-repos-for-inspiration)

---

## 1. Growth Hack 2026 — Program Overview

### What is Growth Hack?

Growth Hack is an annual, global hackathon in which ETS colleagues gather in teams to collaboratively engineer innovative concepts. The event is held over a two-day period and often involves colleagues from other areas of the company, including Product and the Business. The goal is to focus on improving the experience for our Customers, Colleagues, Marketers, CCPs, etc. Improving these experiences will lead to many positive outcomes for Amex including building and fostering our work culture, which ultimately drives organizational success for Amex.

Growth Hack culminates in a showcase event featuring top hacks as voted upon by a global group of judges.

### What is changing for Growth Hack 2026?

Growth Hack 2026 is expanding cross-functional enterprise participation by bringing together colleagues from business, product, and technology functions. Amex partnered with six Business Units (Lines of Business) to identify key opportunity headlines/themes, to help teams think creatively, spark new solutions, and turn those opportunities into meaningful outcomes.

In addition, Growth Hack 2026 continues to emphasize **responsible, enterprise-safe AI experimentation**. Teams are encouraged to develop sustainable, compliant, scalable solutions that leverage AI to solve business challenges and create measurable value for customers and colleagues.

**NEW! Recognition for Cross-Functional Collaboration:** teams that include representation from ETS, product, and business teams earn bonus points during judging and receive a special Growth Hack 2026 digital badge.

**2026 Theme:** *Think Bigger. Move Faster. Build with AI.*

### Judging Process (Two Rounds)

The 2026 event follows the same two-round process as previous years, with a 1-week gap between rounds.

**Round 1 — Preliminary Global Judging (September 28 – October 9)**
- All projects reviewed by 5 judges.
- With AI support, judges assess the hack's innovation, enterprise value, completeness, durability, and scalability.
- Each judge force-ranks their hacks, scoring between 100 and 1,000 points.

**Round 2 — Semifinal Judging (October 19 – October 23)**
- ~25 projects progress from Round 1 into this round, selected by score plus representation across business units.
- Judges apply the same scoring criteria across the narrower field to reach the top.

**Goal:** ensure all LOBs/Business Units are represented through every phase of judging.

### Judging Criteria (Weighted)

Judges score against four weighted criteria; they can also leave written feedback on every scorecard, shared with teams after finalists are selected. In addition to the criteria below, judging also considers "what makes a winning hack" qualitative elements: **recognizing the environment we're in, using storytelling to convey the vision, partnering with business and product colleagues, and scaling to meet enterprise demand.**

| Criteria | Weight | Judges ask |
|---|---|---|
| **Hack Feasibility and Scalability** | 30% | Is the hack solution feasible for Production Rollout? Can it scale to Amex volumes? Will it adhere to Amex's increasing control/compliance requirements? Does it protect and enhance the Amex brand? |
| **Innovation** *(only some need apply)* | 30% | Has the hack identified a new experience-improvement opportunity that was previously unknown? Does it re-invent an existing solution in a novel manner? Does it create value through reduction or elimination? Does it use existing capabilities in an expanded way? |
| **Business Unit Value** | 30% | Does the solution align with an enumerated BU theme and solve a known business need? Were business partners/process owners consulted or on the hack team? How much does it improve code, products, or processes? Can it be leveraged by multiple applications or domains? |
| **Hack Completeness** | 10% | How complete is the hack — real working prototype, PoC, partially coded, or animation/mockup? How much effort remains post-hack? Does Amex have (or could it easily procure) the skills/assets/dependencies for production implementation? |

> **Source:** [Verified live](https://thesquare.americanexpress.com/sites/business-unit/technology/growthhack/documents/759914/judging-process-1) against The Square's judging-process page on 2026-09-14 — content matches the `.docx`/`.pdf` verbatim. Square landing page: http://go.aexp.com/hack · Slack: `#growthhack`.

---

## 2. Business Unit Opportunity Themes

Six Business Units/LOBs, each with its own opportunity headlines:

### GCS (Global Commercial Services — Raymond Joabar)
- Transform Customer Data Exploration and Insights — conversational, self-service data exploration for business teams.
- Modernize Business Travel Account Reconciliation — simplify BTA reconciliation via data accessibility and automation.
- Accelerate Supplier Enablement and Growth — streamline supplier enablement for operational efficiency.
- Transform the Complaints Management Experience — simplify end-to-end complaints handling.
- Reimagine the Small Business Digital Experience — connect the end-to-end digital journey.
- Transform Payroll Operations with AI — streamline payroll operations with AI capabilities.

### GMNS (Global Merchant & Network Services — Anna Marrs)
- Optimize Merchant Pricing Decisions.
- Streamline MSB Remediation & Exception Management.
- Strengthen Pricing Governance & Transparency.
- Strengthen Regulatory Intelligence.
- Unlock Merchant Growth Opportunities.
- Simplify Sponsorship Program Management.

### GS (Global Servicing — Mohammed Badi)
- Deliver Hyper-Personalized Customer Servicing Experiences.
- Modernize Operational Decision Support.
- Accelerate New Customer Care Professional Readiness.

### USCS (U.S. Consumer Services — Howard Grosfield)
- Reimagine Digital Membership with AI.
- **Reimagine Travel Partner & Restaurant Onboarding and Enablement** — simplify onboarding/enablement for travel and restaurant partners to reduce manual effort, accelerate time to value, and create a more seamless partner experience. *(This is the theme EASE targets.)*
- Transform the Premium Digital Banking Experiences.
- Strengthen Restaurant Health Insights.
- Transform Restaurant Innovation Through Virtual Simulation.

### ICS (International Card Services — Rafael Marquez)
- Personalize International Customer Acquisition.
- Optimize Sales Lead Prioritization.
- Simplify Global Customer Onboarding.
- Strengthen Referral Integrity and Anti-Gaming Controls.
- Modernize KYC/KYB Data Management.
- Improve Customer Growth Targeting.
- Accelerate Sales Knowledge Access.
- Build a Trusted Business Community & Peer Matching Ecosystem.

### ETS (Enterprise Technology Services — Ravi Radhakrishnan)
- Reimagined Ways of Working.
- Transformational AI — enterprise-wide AI and agentic intelligence for step-change.
- Differentiated Experiences — design-led, human-centered, intelligent experiences.
- Adaptive Ecosystem — modern & trusted platforms, data, security, and infrastructure enabling AI-driven transformation.

---

## 3. Submitting Your Hack

- Submit verified recording before **7:00 PM (local time) on September 24**.
- Recordings can **NOT** be more than **5 minutes** long.
- Recordings can **NOT** be larger than **25 MB**.
- Square: http://go.aexp.com/hack · Slack: `#growthhack`

---

## 4. FAQ

### General

**Q: What is GrowthHack?**
A: GrowthHack is a two-day global hack event where ETS, Product and business colleagues gather to collaborate and engineer innovative concepts. The GrowthHack event highlights the innovation that makes our company special.

**Q: Why do we run GrowthHack?**
A: The event gives colleagues the opportunity for healthy competition along with fun — learning new skills/technologies, collaborating with peers, and encouraging innovation and new feature/product development.

**Q: What is the 2026 GrowthHack theme?**
A: *Think Bigger. Move Faster. Build with AI.* Participants are challenged to use AI and other emerging technologies to develop solutions that enhance customer and colleague experiences, create enterprise value, and accelerate growth.

**Q: When and where will this year's event be held on my campus?**
A: In 2026, GrowthHack aligns with Amex Flex guidelines — colleagues can participate in person or virtually on **September 23–24, 2026**.

**Q: How is the judging handled?**
A: Visit the judging process page on The Square for complete information.

**Q: Where can I find more information about GrowthHack?**
A: The GrowthHack Square page, or the `#growthhack` Slack channel.

### Registration

**Q: Where do I register for GrowthHack?**
A: Registration is open via the GH Portal (individual or team), or see the Registration and Preparation Square page.

**Q: How do I register a team? The portal only lets me register myself.**
A: Complete individual registration first. After selecting "Register," you'll be taken to a screen to create a team, find a team to join, or edit your registration. Use "Team Builder" to create one.

**Q: Why did I get 2 confirmation IDs when registered on a team?**
A: You get a unique Attendee ID (prefix "A") for your individual registration, and your team gets a shared Team ID (prefix "T").

**Q: Can a team submit more than one idea?**
A: No — one idea per team.

**Q: How many team members can I have on a team?**
A: **4 to 8 members**, with at least **50% engineers**.
- *Business Colleague Exception:* in 2026, teams can add up to **two** extra members from the business (outside ETS/Product), on top of the 4–8 range.
- Team must still be ≥50% engineers, with a maximum of 8 ETS/Product members — more than 8 ETS/Product members disqualifies the team.
- *Engineer* = someone with access to Amex development tools who will actively contribute code.

**Q: How do I determine whether a colleague is ETS, Product, or Business?**
A: ETS colleagues report through Ravi Radhakrishnan's org. For Product/Business, classification can be less clear — use the Amex Departments list, or ask the GrowthHack team. A colleague's title and reporting BU can help.

**Q: Do I have to select a category when registering my team?**
A: Yes — you select the Line of Business and opportunity statement/theme you're hacking against (see the 2026 Information page).

**Q: Can I participate as an individual?**
A: No — this is a team event. You can register as an individual initially, but must join/form a team of 4–8 to complete registration.

**Q: How do I find others to form a team?**
A: View the interested-individuals list once registration opens, use `#growthhack-findateam` on Slack, or the Portal's new matching feature.

**Q: I am not an ETS colleague. Can I participate?**
A: Yes — GrowthHack is open to all Amex colleagues.

**Q: Does a team need to be on one campus?**
A: No — it's virtual/hybrid; teams can span campuses, but must designate one primary campus (determines the team's time zone).

**Q: How is team location determined with an even split across locations?**
A: The team captain selects the nearest location where the majority of members reside.

**Q: Can virtual-coded colleagues participate?**
A: Yes.

**Q: Can contractors participate?**
A: No — only full-time Amex colleagues (see Terms of Participation).

**Q: Can I add/change/remove team members after registering?**
A: Yes, until the day before the event, via the GrowthHack Portal (needs the team confirmation ID).

**Q: Is there a list of previous hack submissions to check for duplicate ideas?**
A: No archive available after the recent portal uplift, but 2025 winners are posted separately.

**Q: When do we have to provide our team's hack idea?**
A: Registration closes September 4 (later extended — see below); refine and submit a brief hack description in the Portal by **September 22**.

**Q: When does registration close?**
A: Extended to **September 11**.

### Gen AI FAQ

**Q: Do we have to use Gen AI as part of our hack in 2026?**
A: Not mandatory — it's your hack; it can be built without an LLM.

**Q: What is Launchpad?**
A: A sandbox-type environment for Gen AI experimentation within American Express.

**Q: Is there support for Gen AI before/during the event?**
A: Yes — InfoShare kickoff info, a setup video, an Integration Guide (being finalized; interim reference: *Launchpad - Needs*), and office-hours sessions scheduled in early September.

**Q: What models are supported?**
A:
- **Open Source:** LLAMA 3.2, LLAMA 3.3
- **Closed Source:** Azure GPT 5.2, Gemini-3.1-flash-lite
- **Embedding Models:** BGE-Large, ADA02

**Q: When will I receive my credentials?**
A: 2 days before the event.

**Q: Can team members share credentials?**
A: No — scope differs in 2026; details on scope and EAG endpoints provided 2 days before the event.

**Q: Where can I find the registered agents / registered MCPs?**
A: Portal not available yet.

**Q: What capabilities are available to use?**
A: Redaction, Substitution, Safechain, Local Memory.

**Q: What should I do if I encounter issues with LLMs?**
A: Office-hours sessions, an integration guide + video, and `#genai-sre-support` on Slack for tech issues.

### Hackstack / Upskilling

**Q: Where can I find information on Amex systems/tools available for our hack?**
A: The Amex Way Library — enterprise tools plus "hack-ready" frameworks and APIs.

### Volunteering

**Q: I would like to volunteer to help, who should I contact?**
A: Email GrowthHack, Slack `#growthhack`, or reach out to your local Campus contact.

---

## 5. Resy Onboarding Process — Meeting Recap (with Meagan McCallum)

**Meeting:** Resy Onboarding Process — with Meagan McCallum, Director of Implementation, Resy.
**Status:** In progress (meeting transcript available).

### Key Takeaways

**1. Current Resy Onboarding Model**
Meagan explained the onboarding flow used for Resy and Tock partners. After contract signing, implementation specialists guide partners through setup and launch. Sales teams are expected to determine product fit before onboarding begins, although onboarding teams sometimes identify that a partner's needs may align better with another product. The primary objective of onboarding is to help partners successfully launch and adopt the platform rather than sell additional services.

**2. Restaurant-Focused Implementation Approach**
Unlike traditional enterprise implementations, restaurant owners/managers generally have limited time for structured discovery activities. Partners are guided through a phased onboarding process and encouraged to configure much of the platform themselves. Typical setup activities:
- Building floor plans
- Configuring schedules and operating hours
- Creating reservations, events, and offerings
- Completing POS integrations
- Running required payment/POS test transactions before launch

**3. Variability in Onboarding Duration**
Onboarding timelines vary considerably based on partner engagement and motivation. Some partners complete onboarding very quickly ("quick flip" scenarios), while others require significantly more support.

**4. Strategic Focus Areas Identified**
- Simplifying and automating partner onboarding.
- Improving partner engagement, health monitoring, and retention.
- Scaling operations while maintaining a good partner experience.

**5. Large-Scale Platform Migration Opportunity**
Resy plans to move partners to a common backend platform. An internal "Resy Importer" initiative is being explored to migrate configuration data (floor plans, shifts, offerings, etc.) automatically rather than rebuilding setups manually. This migration affects a large partner population and is viewed as a major efficiency opportunity.

**6. AI and Self-Service Opportunities**

- *Gamified Onboarding* — Meagan proposed embedding onboarding guidance directly within the product experience: step-by-step checklists, progress tracking, incentives for milestone completion, recognition tiers tied to onboarding success/adoption.
- *Embedded AI Assistant* — Ajay suggested embedding an AI assistant ("AI Genie") within the platform to answer onboarding questions and guide restaurant owners through setup; received positive discussion as a way to reduce onboarding friction.
- *In-Product Guidance* — participants noted the platform currently lacks walkthroughs or guided tours for new users; a guided in-product onboarding experience was viewed as potentially impactful.

**7. Data and Knowledge Challenges**
Meagan described challenges connecting multiple systems/data sources: Resy backend data, Tock backend data, Salesforce, Looker reporting, internal AI systems. Goal: better visibility into partner behavior, onboarding progress, and churn-risk indicators.

**8. Post-Onboarding Support Gap**
Tier 1/strategic partners receive dedicated Partner Success support, goal reviews, and engagement tracking. Tier 2/Tier 3 partners primarily rely on support channels without the same proactive engagement — identified as a potential area for AI-driven assistance.

**9. Relevant Stakeholders Mentioned**
- Anuj (Partner Success leadership)
- Aaron Ginsburg (Partner Success)
- Mary Mapes (Support leadership)

These teams reportedly have more visibility into engagement metrics, partner success reporting, and retention strategies.

### Action Items

| Action Item | Owner |
|---|---|
| Share any available onboarding documentation/materials to help the team understand the Resy onboarding process | Meagan |
| Explore a gamified onboarding experience embedded directly within the Resy platform | Team (Meagan/Satvik/Ajay) |
| Evaluate feasibility of an embedded AI assistant to support restaurant owners during onboarding | Team (Ajay's proposal) |
| Investigate knowledge repositories, backend systems, and data sources that could support AI-driven onboarding | Meagan and Team |
| Follow up with Partner Success contacts (Anuj, Aaron Ginsburg) on engagement monitoring, retention metrics, AI opportunities | Satvik / Team |
| Assess AI opportunities for Tier 2/Tier 3 partner support where dedicated success management is limited | Team |

### Emerging Opportunities Discussed

- AI-powered onboarding assistant embedded in product.
- Gamified onboarding dashboard with progress tracking and incentives.
- Automated migration/configuration tooling for backend consolidation.
- Churn-risk detection using behavioral and onboarding signals.
- AI support and engagement capabilities for non-strategic partners.
- In-product walkthroughs and guided tours for first-time users.

*Source: meeting transcript of "Resy Onboarding Process" (transcribed meeting, in progress at time of writing).*

---

## 6. Satvik's Suggestions / Product Naming

> When you get a chance over the weekend, I suggest you guys try out this Google Chrome extension called **Scribe**. It's good for generating how-to videos — I'm taking inspiration from that.
>
> One way we can make onboarding faster: instead of giving a "long" step-by-step instruction as the answer to a restaurant owner's query, we can generate a small video/walkthrough showing exactly where they need to click, what they need to fill, what they need to select — like the prototypes we have in Figma. Kind of like generating WalkMe's for the process automatically.

**Product Name:** EASE — Experience Assistance for Simplified Execution — *"This became easy."*

---

## 7. EASE — Product Vision

> **EASE**
> Experience Assistance for Simplified Execution
> *Complex journeys, made easy.*

### 1. Vision

EASE is an intelligent experience and execution layer that helps customers, partners, and colleagues accomplish complex tasks without needing to understand the complexity of the systems underneath.

Enterprise applications are traditionally organized around: products, screens, menus, workflows, policies, systems, teams, documentation. But users do not think that way — they think:

- "I want to get my restaurant live."
- "I need to onboard this merchant."
- "I need to resolve this customer issue."
- "Why did this process fail?"
- "What am I supposed to do next?"
- "Am I doing this correctly?"
- "How much is left?"

EASE changes the interaction model from:

```
Learn the system → Find instructions → Navigate the application → Complete the process
```

to:

```
Express intent → Get contextual assistance → Execute with guidance → Validate completion → Learn from the journey
```

The long-term ambition: **people should not need to understand our systems to accomplish their goals. EASE should make the complexity underneath feel simple on top.**

### 2. Why the Name EASE

EASE — Experience Assistance for Simplified Execution. The name represents both the user emotion and the platform purpose.

The user should feel: less overwhelmed, more confident, more informed, more in control, able to make progress, certain about what comes next.

The enterprise should gain: simpler execution, fewer repetitive support interactions, better process visibility, measurable friction, fresher knowledge, more consistent execution, scalable human oversight.

Core promise: **Complex underneath. EASE on top.**

### 3. The Problem EASE Solves

The fundamental problem is *not* "we don't have enough documentation." The problem is: **"I know what I want to accomplish, but I don't know what to do next."**

Even when documentation exists, users still need to determine: which article applies, which instructions are current, where the relevant setting is, which button to click, what information is required, whether the previous step worked, what remains, whether they are ready to finish. This creates friction for both users and the people supporting them.

### 4. The EASE Experience

Imagine a user says: **"Help me create a floor plan."**

EASE understands the intent and identifies the appropriate approved process. Instead of returning a long article, EASE begins assisting the user inside the application where the work is happening. The relevant UI component is highlighted; other elements can be visually de-emphasized. A persistent EASE panel shows:

```
Create Floor Plan
✓ Open Floor Plans
✓ Create New Layout
● Add Dining Area
○ Add Tables
○ Configure Capacity
○ Review & Save
Step 3 of 6
```

The user always knows: what they are trying to accomplish, where they currently are, what they have completed, what they need to do now, what remains. The experience should feel closer to a guided tutorial in a modern application or game than a traditional help center.

### 5. EASE Is Not Just a Chatbot

A chatbot can answer "How do I do this?" EASE should understand:

- What are you trying to accomplish?
- Where are you currently?
- What have you already completed?
- What should happen next?
- Did the action actually succeed?
- Where did you struggle?
- How can the next user's journey be easier?

**The EASE operating loop:**

```
Intent
  ↓
Context
  ↓
Journey State
  ↓
Approved Knowledge + Rules
  ↓
Next Best Action
  ↓
Contextual Guidance
  ↓
Validation
  ↓
Progress
  ↓
Telemetry
  ↓
Human Quality Assurance
  ↓
Continuous Improvement
```

### 6. EASE Assistance Modes

EASE should not force every problem into a chatbot response — it dynamically chooses the most useful assistance mode:

- **EASE Answer** — simple questions ("What does this setting mean?") → concise contextual explanation.
- **EASE Guide** — procedural tasks ("How do I create a floor plan?") → interactive walkthrough. EASE highlights the correct menu, button, field, and next required action.
- **EASE Journey** — longer processes; EASE maintains progress, e.g.:
  ```
  Restaurant Setup
  ✓ Business Information
  ✓ Operating Hours
  ● Floor Plan
  ○ Reservation Inventory
  ○ POS Integration
  ○ Test Transaction
  ○ Launch Review
  Overall Progress: 43%
  ```
  This reduces uncertainty and cognitive load.

### 7. EASE Capture

While users complete journeys, EASE captures structured events: journey started, step viewed, step completed, validation failed, repeated attempt, backtracking, help requested, escalation, abandonment, journey completed. Every interaction can become product and process intelligence.

### 8. EASE-generated Micro-Guides

When a user successfully completes a process, EASE can automatically create a visual representation of that journey — think of it as a Scribe-like artifact generated from successful execution. Instead of maintaining only "How to Create a Floor Plan — 17-step article," EASE can create a verified visual journey showing how the task was successfully completed. Over time these could become: interactive walkthroughs, screenshot guides, short visual tutorials, training simulations, onboarding exercises, micro-videos.

### 9. EASE Studio

The human specialist needs a place to manage and improve these journeys. **EASE Studio** is the workspace for: journey creation, journey review, knowledge generation, versioning, testing, approval, publishing. Example specialist review:

```
Create Floor Plan
Journey Version: 4
Completion Rate: 78%
Median Completion Time: 7m 42s
Highest Friction:
  Step 4 — Configure Capacity
  Repeated Attempts: 24%
  Help Requested: 18%
  Abandonment: 11%
```

### 10. EASE Control

Human oversight is fundamental to the concept. Specialists can: approve journeys, edit guidance, reject generated changes, flag incorrect guidance, flag product friction, review exceptions, inspect confidence, manage versions, control publication.

Philosophy: **AI can identify opportunities. Humans remain responsible for quality and governance.**

### 11. The Human-in-the-Loop Model

EASE is not designed to eliminate specialists — it changes *where* specialist expertise is spent. Instead of repeatedly explaining "Click here. Now go there. Select this. Then come back," specialists increasingly become: journey designers, quality reviewers, exception handlers, process experts, knowledge approvers, friction investigators, experience optimizers.

For Resy, this means the Implementation Specialist can evolve from being the primary navigation mechanism for every restaurant toward becoming the quality controller of the onboarding system.

### 12. EASE Signals

EASE identifies behavioral signals indicating friction: unusually long dwell time, repeated clicks, repeated validation failures, backtracking, repeated questions, inactivity, abandonment, escalation, unexpected navigation. Instead of waiting for the user to say "I'm stuck," EASE can eventually recognize "This user may be stuck."

### 13. EASE Insights

EASE aggregates journey telemetry into actionable intelligence. Instead of only knowing "Users dropped off on Page 4," EASE could eventually tell us "Users trying to accomplish Goal X repeatedly struggle at Step 4 because Action Y is difficult to locate or understand." This creates a new form of analytics: **Outcome-oriented Journey Intelligence**.

### 14. EASE and Product Improvement

Sometimes users struggle because the guidance is wrong — EASE should improve the guidance. Sometimes users struggle because the product itself is confusing — EASE should help identify that too.

```
Potential Product Friction
Journey: Create Floor Plan
Step: Configure Capacity
Signals:
  • 31% retry
  • 18% request help
  • 14% navigate backward
  • 2.8x normal dwell time
```

Product teams can then ask: *should we improve the guidance — or simplify the product?* This makes EASE valuable not only to users and support teams, but also to Product and UX teams.

### 15. The EASE Knowledge Loop

One of the largest future opportunities: a self-improving knowledge system.

**Traditional model:**
```
Process changes → Someone notices → Documentation ticket → Article updated → Users eventually discover it
```

**EASE model:**
```
Journey happens → Outcome validated → Friction observed → Candidate improvement generated
  → Specialist reviews → Approved version published → Future journeys improve
```

Principle: **knowledge should increasingly become a governed by-product of successful work.**

### 16. Self-Healing Knowledge

EASE should eventually understand whether its guidance still matches the underlying experience. Example: "Create Floor Plan" used to be under one menu; a product release moves it. EASE detects that the expected component is missing, users are failing, another likely component exists, and successful users are taking a different path. EASE generates a "Potential Journey Update Detected" for specialist review — only after approval does the new journey become canonical.

Self-healing does **not** mean uncontrolled self-modification. It means: **Observe → Detect → Recommend → Human Validate → Improve**.

### 17. EASE Maturity Model

Long-term evolution: **GUIDE → ADAPT → PREDICT → ASSIST → ACT**

**Stage 1 — EASE Guide:** *"Show me what to do."* Capabilities: contextual answers, UI highlighting, walkthroughs, progress, validation, visual guidance. **This is the GrowthHack MVP.**

### 18. Stage 2 — EASE Adapt

*"Show me what I should do based on my situation."* Guidance becomes personalized using: role, market, product, configuration, permissions, previous actions, journey stage, experience level. Instead of "Here are 17 onboarding steps," EASE says "Based on your setup, you have five things remaining."

### 19. Stage 3 — EASE Predict

*"Help me before I need to ask."* EASE begins detecting likely friction, e.g.: "You're almost ready to launch. One required validation remains. Would you like me to guide you through it?" Interaction shifts from *user gets stuck → user asks* to *EASE detects risk → EASE intervenes*.

### 20. Stage 4 — EASE Assist

*"Don't just show me. Help me do it."* Example: "Set my weekday operating hours from 5 PM to 11 PM." EASE prepares the change set (Monday–Friday, 5 PM–11 PM) and asks: *"I've prepared these changes. Review and confirm."* The user remains in control.

### 21. Stage 5 — EASE Act

*"Complete approved work for me."* For carefully selected low-risk actions, EASE could eventually execute through enterprise systems. Progression:

```
Tell me → Show me → Guide me → Recommend to me → Prepare it for me → Do it with me → Do it for me
```
— with appropriate controls at every stage.

### 22. Initial GrowthHack Use Case — Resy

The first implementation proves EASE through restaurant onboarding. A restaurant owner says: "Help me create a floor plan." EASE: understands the intent, identifies the approved journey, understands the current screen, highlights the correct UI, shows progress, validates each action, detects errors, helps the owner recover, records journey telemetry, generates a visual guide, sends the journey to EASE Studio, and allows the Implementation Specialist to approve or flag improvements.

This proves the complete EASE loop: **Ask → Guide → Complete → Observe → Learn → Approve → Improve**

### 23. Future Application — Merchant Onboarding

A merchant asks: "Why did my onboarding submission fail?" EASE could understand merchant type, market, onboarding stage, required information, validation errors, current system state. Instead of sending documentation: "Three fields require correction. Let's fix them." Future capabilities: field-level validation, persona-specific onboarding, status transparency, error explanation, resubmission guidance, proactive blocker detection, prefill.

### 24. Future Application — Supplier Enablement

A supplier asks: "Why can't I complete registration?" EASE could identify missing information, mismatches, incomplete verification, pending actions, required documentation, then guide the supplier through resolution. Potential value: fewer abandoned registrations, fewer manual interventions, faster activation, better visibility into friction.

### 25. Future Application — Customer Servicing

A customer or servicing colleague says: "Help me resolve this issue." EASE could combine customer context, product state, current workflow, approved knowledge, previous actions. The experience becomes **Question → Diagnose → Guide → Validate → Resolve** rather than *Search → Article → Try → Search Again → Escalate*.

### 26. Future Application — Complaints

A colleague handling a complaint needs to understand: what information is required, how the complaint should be categorized, where it should be routed, what evidence is missing, what remains before closure. EASE could provide contextual assistance while deterministic rules validate mandatory requirements. Potential value: more consistent execution, reduced missing information, reduced rework, better auditability, improved root-cause intelligence.

### 27. Future Application — Complex Implementations

Implementation journeys often span multiple teams, multiple systems, prerequisites, approvals, testing, errors, reconciliation, sign-off. EASE could maintain one shared implementation state:

```
Implementation
✓ Requirements Confirmed
✓ Technical Specification
✓ Connection Established
● Test Validation
○ Reconciliation
○ Client Sign-off
```

Each participant sees "What do I need to do next?" rather than needing to understand the entire implementation process.

### 28. Future Application — Platform Migration

Migration is a particularly strong EASE use case. Instead of asking users to rebuild everything:

```
Migration Complete: 87%
Needs Your Attention
1. Review configuration mapping
2. Confirm weekend settings
3. Reconnect integration
```

EASE guides users only through the exceptions. Model: **automate what we know, EASE what requires human attention.**

### 29. Future Application — Feature Adoption

EASE should not disappear after onboarding. Months later: "How do I create a special event?" — EASE launches the appropriate journey. Eventually it can proactively identify relevant capabilities: "You haven't configured this feature yet. Would you like a quick walkthrough?" EASE evolves from an onboarding capability into an *adoption* capability.

### 30. Future Application — Partner Success

Not every partner can economically receive dedicated human relationship management. EASE could provide scalable proactive assistance, e.g.: "Your onboarding has been inactive for five days." / "One required launch step remains. Would you like help completing it?" Future capabilities: onboarding health, engagement signals, adoption opportunities, proactive education, next-best actions, risk indicators.

### 31. Future Application — Colleague Onboarding

A new colleague often has the same question: "What am I supposed to do next?" EASE could maintain:

```
Your First Week
✓ Identity Setup
✓ Mandatory Training
● System Access
○ Team Introduction
○ Role Learning
○ First Workflow
```

EASE could detect blockers and route them appropriately.

### 32. Future Application — Colleague Enablement

After onboarding, EASE can continue helping colleagues with infrequent workflows, complex servicing processes, new product launches, policy changes, operational procedures, unfamiliar systems. Instead of "search for how to do the work," the colleague receives "assistance while doing the work."

### 33. Future Application — Controlled and Regulatory Workflows

Complex controlled processes often require sequencing, mandatory evidence, approvals, documentation, traceability. EASE could convert complex procedures into role-specific executable journeys. Instead of "Read this procedure," EASE says: "You are at Step 4 of 7. These two pieces of evidence are required before this can proceed." For higher-risk workflows, EASE should remain primarily in Guide or Assist mode, with appropriate human decision-making.

### 34. Future Application — Troubleshooting

Traditional troubleshooting: *Search → Article → Try → Search Again → Support.* EASE: **Error → Context → Diagnosis → Guided Resolution → Validation.** The system can understand what the user was trying to do, current state, previous attempts, error messages, known resolution paths.

### 35. Future Application — Cross-System Orchestration

Possibly one of EASE's largest opportunities. A user may say "Onboard this merchant," but underneath that goal may be CRM, onboarding, screening, document management, APIs, servicing, approvals, notifications. The user should not need to understand that architecture. EASE can eventually become **one intelligent experience across many enterprise systems.**

### 36. EASE Next Best Action

As EASE learns from journeys, it can increasingly answer: *"Given this person's goal, current state, permissions, history and business rules — what should happen next?"* This creates a reusable Next Best Action capability across onboarding, servicing, implementation, support, adoption, migration, operations, colleague enablement.

### 37. EASE Proactive Assistance

Today: user becomes stuck → user asks for help. Future: EASE detects likely friction → EASE offers help, e.g.: "It looks like you're having difficulty completing this step. Would you like me to guide you?" Signals: dwell time, repeated clicks, validation failures, backtracking, inactivity, repeated questions, approaching deadlines.

### 38. EASE Personalization

Different users should not receive identical assistance. EASE can adapt based on: experience, role, market, product, configuration, accessibility needs, language, previous behavior. A first-time user may receive detailed guidance; an experienced user may simply see "Three actions remain. Take me to them."

### 39. EASE Voice

Users should not need to know product terminology. Instead of "Where is reservation inventory configuration?" they can say "I want customers to be able to book Saturday evening." EASE translates business intent into system actions. Future interaction can include voice, text, screenshots, visual understanding, contextual UI understanding.

### 40. EASE Accessibility

EASE can also reduce barriers created by complex enterprise software: voice-first interaction, keyboard guidance, screen-reader-compatible instructions, simplified explanations, multilingual assistance, visible progress, reduced cognitive load. Principle: **the user should not need to adapt to the complexity of the system — EASE should adapt the experience to the user.**

### 41. EASE Journey Simulation

Eventually EASE could help teams evaluate workflows before release: can a first-time user complete this? Where might they hesitate? Are instructions missing? Are required actions visible? Are there unnecessary steps? Does the journey contain dead ends? This extends EASE from user assistance into experience quality assurance.

### 42. EASE Journey Optimization

EASE can compare successful journeys against failed journeys and identify patterns — e.g., successful users complete Step 3 in 40 seconds, failed users spend four minutes there and frequently navigate backward. That becomes actionable intelligence for Product, UX, Operations, Implementation, Support.

### 43. EASE Knowledge Freshness

Every approved journey could eventually have: owner, version, last successful execution, product version, confidence, approval status, last review date. If the underlying experience changes, EASE can flag "This journey may no longer be valid." Knowledge freshness becomes measurable.

### 44. EASE Process Intelligence

As EASE expands, it can reveal: unnecessary process variation, better-performing paths, redundant steps, recurring exceptions, missing controls, inconsistent guidance. Human process owners can use this evidence to improve the process itself.

### 45. EASE Operational Intelligence

Eventually EASE can answer: which steps generate the most support contacts? Which processes require the most human intervention? Which knowledge becomes stale most frequently? Where are users abandoning? Where would automation create the greatest value? This makes EASE an **operational intelligence platform**, not merely an assistance tool.

### 46. EASE Flywheel

The long-term value compounds:

```
More journeys use EASE
  ↓
More behavior is observed
  ↓
More friction becomes visible
  ↓
Better guidance is created
  ↓
Specialists validate improvements
  ↓
Knowledge becomes fresher
  ↓
More users self-serve successfully
  ↓
Fewer repetitive human interactions
  ↓
More specialist capacity for complex work
  ↓
Products and processes improve
  ↓
More journeys can move to EASE
```

**The EASE Flywheel:** every journey should make the next journey easier.

### 47. Why EASE Is Different From Search

Search answers "Where is the information?" EASE answers "What should happen next?"

### 48. Why EASE Is Different From a Chatbot

A chatbot says "Here are the steps." EASE says "You're on Step 3. This is the action you need to take. I'll know when you've completed it correctly."

### 49. Why EASE Is Different From Traditional Digital Adoption

Traditional digital-adoption tooling primarily helps users navigate applications. EASE's larger ambition is to understand user intent, business context, journey state, system state, business rules, completion criteria, friction, outcome. The objective is not "help the user adopt this interface" — it is **"help the user successfully accomplish their goal."**

### 50. Build vs. Buy

EASE should not attempt to rebuild every technology component. Commodity capabilities can be bought or reused: foundation models, speech-to-text, UI overlays, session replay, generic analytics, workflow capture, documentation generation.

The differentiated enterprise intelligence is: journey models, business context, validation rules, system-of-record integrations, permissions, cross-system state, proprietary friction telemetry, completion definitions, next-best-action intelligence, human governance.

Strategy: **buy the rails, build the intelligence.**

### 51. EASE Platform Architecture

- **EASE Intent** — understands what the person wants to accomplish.
- **EASE Context** — understands user, role, product, market, permissions, current screen, journey state.
- **EASE Journey** — determines the approved path toward completion.
- **EASE Guide** — provides contextual assistance inside the experience.
- **EASE Validate** — determines whether required actions were completed correctly.
- **EASE Signals** — detects friction, hesitation, errors and abandonment.
- **EASE Insights** — transforms journey telemetry into actionable intelligence.
- **EASE Studio** — maintains journey knowledge, versions, testing and generated guidance.
- **EASE Control** — provides human review, approval, governance and auditability.
- **EASE Assist** — prepares recommendations and future prefill.
- **EASE Agent** — eventually performs approved actions through enterprise systems.

### 52. EASE Product Family

The name naturally supports a serious enterprise product architecture:

| Product | Purpose |
|---|---|
| EASE Guide | Contextual guidance and walkthroughs |
| EASE Journey | Progress, milestones and orchestration |
| EASE Signals | Friction and behavioral signals |
| EASE Insights | Journey and operational analytics |
| EASE Studio | Journey creation, knowledge generation, testing and versioning |
| EASE Control | Human QA, approvals and governance |
| EASE Assist | Recommendations, preparation and prefill |
| EASE Agent | Governed execution |

### 53. GrowthHack MVP

The GrowthHack should prove **one complete EASE loop**, not attempt to build the entire platform.

**Hero Journey:** "Help me create a floor plan." The working prototype demonstrates: a realistic mocked application, real LLM-backed intent understanding, contextual UI guidance, exact component highlighting, progress transparency, deterministic validation, error recovery, journey telemetry, an automatically generated visual guide, specialist review, friction identification, and approval of improved journey knowledge.

The MVP proves: **Ask → Guide → Complete → Observe → Learn → Approve → Improve**

### 54. North-Star Metrics

EASE should ultimately measure successful execution, not chatbot engagement.

- **Journey Metrics:** completion rate, abandonment, time to completion, time per step, retries, backtracking.
- **Assistance Metrics:** questions asked, repeated questions, escalation, self-service completion.
- **Operational Metrics:** human touches, specialist handling time, exception rate, rework, support contacts.
- **Knowledge Metrics:** knowledge freshness, broken guidance, journey version age, approval turnaround.
- **Product Metrics:** friction hotspots, repeated validation failures, confusing components, unnecessary steps.
- **Business Metrics** (depending on use case): time to launch, time to activation, time to resolution, implementation duration, adoption, readiness, engagement.

### 55. The Ultimate EASE Vision

**Today —** User: "How do I do this?" EASE: "I'll show you."

**Tomorrow —** User: "Help me finish this." EASE: "You have three things remaining. Let's complete them."

**Future —** User: "I want this outcome." EASE: "I understand your current state. I can complete two actions with your confirmation, guide you through another, and route one exception for specialist review."

### 56. The Bigger Enterprise Idea

EASE is not ultimately an onboarding tool, a chatbot, a knowledge base, a walkthrough engine, an analytics platform, or an AI agent. **It is the experience and intelligence layer connecting human intent with enterprise execution.**

Underlying philosophy: **enterprise systems can remain complex underneath while the human experience becomes dramatically simpler on top.**

### 57. One-Sentence Product Definition

EASE is an intelligent experience and execution layer that understands what a person is trying to accomplish, guides them through the right actions, validates progress, learns from every journey, and progressively enables governed execution.

### 58. Short Executive Definition

EASE transforms complex enterprise processes into simple, contextual and continuously improving experiences.

### 59. GrowthHack Pitch Definition

EASE — Experience Assistance for Simplified Execution — helps users stop learning how systems work and start accomplishing what they came to do.

### 60. Core Brand Promise

> **EASE**
> Experience Assistance for Simplified Execution
> *Complex underneath. EASE on top.*

Long-term product philosophy in one line: **every interaction should be easier than the one before it.**

---

## 8. Architecture & Governance References

At American Express, technology standards, approved tech stacks, and architecture compliance are governed centrally through two primary hubs: the Architecture Portal and The Amex Way Library.

### 1. Architecture Portal (Central Governance & Enterprise Compliance)

The central, authoritative platform for enterprise architecture, standards compliance, and governance workflows across Amex: https://aexp.atlassian.net/wiki/spaces/ARCPENG/overview

Key capabilities:
- **EA Design Playbooks** — enterprise-approved templates and architectural design blueprints.
- **Permit to Build (PtB)** — architectural readiness/compliance gate required throughout the SDLC.
- **API Governance & Certification** — rules and certification for registering Type A and Type B APIs.
- **Architecture Decision Records (ADRs)** — centralized repository for capturing and reviewing key architectural choices.
- **Company Domains & Traceability** — mapping of business capabilities, applications, APIs, and data.

### 2. The Amex Way Library (Engineering Standards & Paved Roads)

The single InnerSource platform for software engineering principles and tech-stack guidance, designed by developers for developers: https://aexp.atlassian.net/wiki/spaces/EADE/pages/1175394178/About+The+Amex+Way+Library

- **Engineering Elements** — agreed-upon building blocks and recommendations (required practices, smart defaults, deprecated approaches) covering security, API design, secrets management, etc.
- **Paved Roads** — prebuilt, tech-stack-specific blueprints and automation pipelines so teams don't have to reinvent security scanning, deployment, or infrastructure configuration.

### 3. Key Stack Selection & Platform Guidance

- **Engineering & Tech Stack Selection:** https://aexp.atlassian.net/wiki/spaces/TOK/pages/1764307341/Engineering+Guidelines
- **Database Standards:** https://aexp.atlassian.net/wiki/spaces/ETPDBPE/pages/220299290/Database+Technology+Selection+Guidelines+Operational+Models
- **Onboarding Platforms Summary** (GO2/Unify, eApply, Apply Platform Excellence): https://aexp.atlassian.net/wiki/spaces/GTJK/pages/2059446460/AMEX+Active+Platforms+Summary

> **Note:** this repo's binding architecture reference is the vendored [`architecture/architecture-portal/`](../../architecture/architecture-portal) clone (see root [`AGENTS.md`](../../AGENTS.md)) — the live Atlassian links above require corporate SSO/VPN and are not reachable from the coding-agent environment.

---

## 9. Team EASE — Operating Structure

> **Team-design principle:** organize around a single end-to-end proof: business-defined requirements → user-centered experience → integrated technology → business validation → reliable demonstration. Ownership below reflects verified roles, observable project context, and provided specialization. It is not an employee-performance assessment, ranking, formal reporting structure, or a claim that one person is more capable than another.

### 1. Verified current roster

The GrowthHack registration confirmation lists exactly these ten people under Team EASE: **Sachin Kumar Wadhwani, Katelyn Winter, Ajay Kumar, Meagan McCallum, Satvik Jain, Akshat Dhingra, Santanu Anand, Shweta Jha, Rachel Talentino, and Yashwant.** *(Sakshi Sahni is not on this confirmed roster and should not be treated as a current core member.)*

| Member | Directory-verified current role and context |
|---|---|
| Satvik Jain | Sr Assoc-Digital Product Mgmt, Network Capability Delivery, GRC Platforms and Capabilities |
| Ajay Kumar | Mgr-Tech Project Mgmt, Global Servicing Tech; Gurugram; manager Daniel S Swanson |
| Akshat Dhingra | Software Engineer III, GRC Technology; Gurugram; manager Rose R Chakkoria |
| Katelyn Winter | Sr Assoc-Digital Product Mgmt, Ent Digital Experiences; New York; manager Sanum Sheikh |
| Sachin Kumar Wadhwani | Software Engineer II, GRC Technology; Gurugram; manager Lalit Mohan Tewari |
| Santanu Anand | Assoc-Digital Product Mgmt, Servicing Product Experiences, SC&I; Gurugram; manager Saikat Chakraborty |
| Yashwant | AI Engineer II, GRC Technology; Bengaluru Urban; manager Rose R Chakkoria |
| Shweta Jha | Software Engineer II, GRC Technology; Gurugram; manager Manish Gandhi |
| Meagan McCallum | Director-Implementation, Global Dining, Membership Portfolio Services; Lansing (virtual); manager Roberta Meo |
| Rachel Talentino | Dir I-Operations, Global Dining, Membership Portfolio Services; Salem (virtual); manager Mary Young Mapes |

**Roster caveat:** the official confirmation proves membership, not attendance, activity level, or contribution. Allocations below combine formal role evidence, documented project associations, and pragmatic GrowthHack design.

### 2. Concise factual member profiles

**Satvik Jain**
- *Verified experience/context:* Product role in Network Capability Delivery. Authored/modified `GrowthHack.docx`, the EASE Mural export, and the build-vs-buy analysis. The EASE material defines the product architecture, MVP, telemetry, scalability story and complete operating loop.
- *Observable EASE context:* Resy discovery, product definition, GrowthHack pitch framing, and the "buy the rails, own the enterprise intelligence" position. The build-vs-buy paper distinguishes commodity guidance technology from Amex-owned journey state, validators, permissions, telemetry and orchestration.
- *EASE project lens:* **Product Lead and Pitch Integrator** — scope, problem framing, product decisions, business case, executive narrative and judge Q&A.

**Ajay Kumar**
- *Verified experience/context:* Technology project-management role in Global Servicing Tech. Authored `GrowthHack_eRally GenAI.pptx`, identified as Product Owner for an eRally GrowthHack concept (Slack, Rally, Python, Slack API Gateway).
- *Observable EASE context:* Current confirmed member; "GrowthHack Channel Manager" is a project responsibility, not a formal directory title.
- *EASE project lens:* **Program and Delivery Lead** — workplan, dependency management, integration checkpoints, risks, demo run-of-show and submission readiness.

**Akshat Dhingra**
- *Verified experience/context:* Software Engineer III in GRC Technology. Accessible EASE material records participation in the GrowthHack ideation context but doesn't establish a specific production technology specialization.
- *Observable EASE context:* Confirmed roster member, associated with the EASE ideation artifact (text extraction partly corrupted — supports participation, not detailed attribution).
- *EASE project lens:* **Technical Architecture and Integration Lead** — a pragmatic project-role recommendation based on the verified software-engineering role and the need for one integration owner.

**Katelyn Winter**
- *Verified experience/context:* Product-management role in Ent Digital Experiences. Organized the Resy Onboarding Process connection with Meagan McCallum and included GrowthHack colleagues in the thread.
- *Observable EASE context:* Direct involvement in Resy discovery coordination and current roster confirmation.
- *EASE project lens:* **Experience Product and Story Design** — requirements articulation, UX acceptance criteria, journey coherence and pitch support.

**Sachin Kumar Wadhwani**
- *Verified experience/context:* Software Engineer II in GRC Technology. EASE ideation record associates his contributions with feasibility, documentation availability, SaaS overlap, and extension to other portals (underlying PDF extraction imperfect — topic associations, not quotations).
- *Observable EASE context:* Confirmed member, included in the Resy onboarding meeting thread.
- *EASE project lens:* **Backend, Validators and Technical Feasibility** — state model, APIs/mocks, deterministic completion checks, error handling and build-vs-buy technical inputs.

**Santanu Anand**
- *Verified experience/context:* Product role in Servicing Product Experiences — factual functional context around post-onboarding servicing (no established exclusive ownership of a specific servicing product/feature).
- *Observable EASE context:* Confirmed roster member, recipient of the shared EASE package.
- *EASE project lens:* **Journey Metrics and Lifecycle Product Support** — metric definition, downstream servicing scenarios and test-case design (a pragmatic allocation, not a verified specialist claim).

**Yashwant**
- *Verified experience/context:* Identity resolves to the AI Engineer II account in GRC Technology, Bengaluru Urban, reporting to Rose R Chakkoria.
- *Observable EASE context:* EASE material associates his work topics with graph-based topic modelling, operational-risk themes, interpretability and data-quality monitoring, plus ideation around AI-supported onboarding scalability (topic descriptions from an authored team artifact, not an independent skills credential).
- *EASE project lens:* **AI Intent and Context Lead** — intent classification, contextual-response logic, AI evaluation, confidence/fallback behavior, interface with deterministic validators.

**Shweta Jha**
- *Verified experience/context:* Software Engineer II in GRC Technology, Gurugram.
- *Observable EASE context:* Included in the current confirmed registration; Sakshi Sahni is absent from that roster.
- *User-provided specialization:* Full-Stack Developer and UI Specialist (no retrieved artifact independently proves additional frontend frameworks or design-tool expertise beyond this stated specialization).
- *EASE project lens:* **Full-Stack Experience and UI Lead** — contextual guidance UI, visual hierarchy, responsive demo flows, frontend-to-backend integration, visual polish.

**Meagan McCallum**
- *Verified experience/context:* Director-Implementation in Global Dining. Accessible footprint includes implementation working sessions, Global Dining go-live forecasting, implementation timelines/strategy, specialist discussions and escalation materials (access/sharing associations don't prove sole authorship).
- *Observable EASE context:* Business counterpart for Resy Onboarding Process and confirmed Team EASE member.
- *EASE project lens:* **Resy Implementation and Journey Validation** — validate onboarding sequence, specialist workflows, launch-readiness meaning, exception handling.

**Rachel Talentino**
- *Verified experience/context:* Dir I-Operations in Global Dining. Enterprise materials shared with/associated with her include Global Dining hospitality scorecards, support inputs, unified monthly scorecards, incident partner outreach, customer-impact materials (demonstrates functional proximity, not individual authorship).
- *Observable EASE context:* Confirmed business-side member.
- *EASE project lens:* **Operational Validation and Pilot Outcomes** — define useful operational measures, validate support/escalation implications, review partner-impact assumptions, challenge whether telemetry demonstrates operational value. No software-development allocation.

### 3. Recommended operating model

EASE's internal design separates intent/context, approved journeys, deterministic validation, telemetry, human review and controlled improvement. The MVP is explicitly one complete floor-plan journey rather than an attempt to build the entire platform.

*Figure 1: Team EASE operating model — product and Resy business inputs feed three parallel build lanes, with program coordination and integrated validation converging on a reliable demo and pitch.*

**Workstream ownership matrix**

| Workstream | Primary Owner | Supporting Members | Allocation rationale |
|---|---|---|---|
| Product Vision & Scope | Satvik Jain | Katelyn Winter, Santanu Anand, Meagan McCallum | Product vision and authored EASE framing; product and business partners prevent solution-first scope |
| Pitch / Storytelling | Satvik Jain | Katelyn Winter, Ajay Kumar, Rachel Talentino | One integrated narrative connecting user problem, proof, feasibility and operations value |
| Resy Business Discovery | Meagan McCallum | Katelyn Winter, Satvik Jain, Rachel Talentino | Implementation process validation must come from the relevant business function |
| Business Validation & Pilot Metrics | Rachel Talentino | Meagan McCallum, Santanu Anand, Satvik Jain | Operations-led outcome definitions; product converts them into testable success measures |
| UX/UI & Demo Experience | Shweta Jha | Katelyn Winter, Satvik Jain | Uses the user-provided Full-Stack/UI specialization plus product journey support |
| Full-Stack Prototype | Shweta Jha | Akshat Dhingra, Sachin Kumar Wadhwani | Clear owner for the executable experience and frontend/backend integration |
| Backend/API/Validation | Sachin Kumar Wadhwani | Akshat Dhingra, Shweta Jha, Meagan McCallum | Pragmatic technical allocation: engineering implements validators; implementation validates business truth |
| AI/Intent/Context | Yashwant | Sachin Kumar Wadhwani, Satvik Jain | Formal AI role aligns with intent handling; product defines semantics; backend enforces deterministic boundaries |
| Architecture & Integration | Akshat Dhingra | Sachin Kumar Wadhwani, Shweta Jha, Yashwant | A single technical integrator is needed across experience, AI and validation lanes |
| Telemetry/Data/Journey Insights | Santanu Anand | Sachin Kumar Wadhwani, Rachel Talentino, Yashwant | Product defines events/metrics; engineering instruments them; operations validates interpretation |
| Program/Delivery Management | Ajay Kumar | Satvik Jain, Akshat Dhingra | Formal technology-project-management role and prior GrowthHack Product Owner context |
| Demo Reliability/Testing | Ajay Kumar | Akshat Dhingra, Shweta Jha, Sachin Kumar Wadhwani | Ajay owns readiness and run-of-show; engineers own defect correction |
| Judge Q&A / Build-vs-Buy | Satvik Jain | Sachin Kumar Wadhwani, Ajay Kumar, Katelyn Winter | Existing evidence-led build-vs-buy analysis plus technical, delivery and experience support |
| Executive/Stakeholder Alignment | Ajay Kumar | Satvik Jain, Meagan McCallum, Rachel Talentino | Delivery lead coordinates; product and business members supply decision content and credibility |

### 4. Decision rights

*(These are GrowthHack project decision rights, not enterprise reporting authority.)*

| Decision | Accountable project role | Required consultation |
|---|---|---|
| Product proposition, MVP boundary, prioritization | Satvik Jain | Katelyn Winter, Meagan McCallum, Ajay Kumar |
| Technical architecture and final integration | Akshat Dhingra | Sachin Kumar Wadhwani, Shweta Jha, Yashwant |
| AI behavior, evaluation and fallback | Yashwant | Satvik Jain, Sachin Kumar Wadhwani |
| Resy implementation/process accuracy | Meagan McCallum | Rachel Talentino, Katelyn Winter |
| Operational measures and business interpretation | Rachel Talentino | Meagan McCallum, Santanu Anand |
| Delivery sequencing and dependency escalation | Ajay Kumar | All workstream owners |
| Demo experience acceptance | Shweta Jha | Katelyn Winter, Satvik Jain |
| Go/no-go for demo readiness | Ajay Kumar | Akshat Dhingra, Shweta Jha, Satvik Jain |
| Final pitch integration | Satvik Jain | Ajay Kumar, Meagan McCallum, Rachel Talentino |

### 5. Required handoffs and dependencies

- **Business truth:** Meagan McCallum documents the selected onboarding journey, mandatory steps, exceptions and launch condition. Rachel Talentino adds operational outcomes and escalation expectations.
- **Product specification:** Satvik Jain, Katelyn Winter and Santanu Anand convert that input into a bounded story, acceptance criteria, event taxonomy and success measures.
- **Experience contract:** Shweta Jha converts the journey into screens, component identifiers, UI states, recovery behavior and demo transitions.
- **Technical contract:** Akshat Dhingra defines shared interfaces between UI, AI, journey state, validators and telemetry.
- **Intelligence and validation split:** Yashwant interprets intent/context; Sachin Kumar Wadhwani owns deterministic evidence of completion. The LLM should not declare business completion independently, consistent with the documented EASE architecture.
- **Integration and test:** Akshat Dhingra integrates; Shweta Jha validates the user flow; Meagan McCallum validates process fidelity; Rachel Talentino validates operational meaning; Ajay Kumar manages defect closure and fallback readiness.
- **Pitch closure:** Satvik Jain integrates evidence, demo, business value, build-vs-buy and scaling logic into one narrative.

### 6. Lightweight execution cadence

- **Daily 15-minute sync:** owners state completed evidence, next integrated deliverable, blocker and required decision. Ajay Kumar facilitates.
- **Twice-weekly workstream checkpoint:** Product/Business, Experience, Platform and AI each demonstrate an artifact, not a status presentation.
- **Every-other-day integration checkpoint (during active build):** Akshat Dhingra verifies the current UI, intent response, validator and telemetry event work together.
- **Weekly Resy validation:** focused review with Meagan McCallum and Rachel Talentino — send only process questions, assumptions, metrics and the latest demo slice.
- **Demo rehearsals:** first for flow, second for timing and handoffs, final with failure scenarios, backup recording and Q&A transitions.
- **Judge-Q&A preparation:** Satvik Jain owns the response bank; each workstream owner answers only within their decision domain.

### 7. Single points of dependency and backup coverage

| Dependency | Primary | Backup/support mechanism |
|---|---|---|
| Product narrative | Satvik Jain | Katelyn Winter maintains current pitch outline; Ajay Kumar maintains run-of-show |
| Resy process truth | Meagan McCallum | Rachel Talentino validates operations implications; unresolved implementation questions explicitly marked open |
| Operations metrics | Rachel Talentino | Santanu Anand maintains metric definitions and test scenarios |
| UI/full-stack integration | Shweta Jha | Akshat Dhingra maintains integration contract; Sachin Kumar Wadhwani supports backend mocks |
| Architecture | Akshat Dhingra | Written API/state contracts allow Sachin Kumar Wadhwani and Shweta Jha to continue independently |
| Intent intelligence | Yashwant | Maintain a deterministic intent fallback and preconfigured demo prompts |
| Validation services | Sachin Kumar Wadhwani | Akshat Dhingra reviews validator contracts; mocked validation as fallback |
| Delivery coordination | Ajay Kumar | Shared plan, RAID log, owners and demo checklist visible to Satvik Jain and Akshat Dhingra |

### 8. Final "who does what" matrix

| Member | Primary EASE Role | Core Responsibilities | Key Deliverables | Supporting / Backup Areas | Key Collaborators |
|---|---|---|---|---|---|
| Satvik Jain | Product Lead & Pitch Integrator | Vision, scope, product decisions, business case, Q&A | MVP charter, pitch, judge responses | Metrics, stakeholder alignment | Katelyn, Ajay, Meagan, Rachel |
| Ajay Kumar | Program & Delivery Lead | Plan, dependencies, risks, submission, rehearsals | Integrated plan, RAID, run-of-show, readiness checklist | Stakeholder coordination | Satvik, Akshat, all owners |
| Akshat Dhingra | Architecture & Integration Lead | Architecture, interfaces, integration, technical readiness | Architecture view, contracts, integrated build | Reliability, validator review | Shweta, Sachin, Yashwant |
| Katelyn Winter | Experience Product Lead | Journey requirements, UX criteria, storytelling | Journey spec, acceptance criteria, pitch support | Product backup | Satvik, Shweta, Meagan |
| Sachin Kumar Wadhwani | Backend & Validation Lead | APIs/mocks, journey state, validators, error handling | Backend services, completion checks, technical Q&A | Architecture, demo recovery | Akshat, Shweta, Yashwant |
| Santanu Anand | Metrics & Lifecycle Product Lead | Event definitions, pilot measures, servicing scenarios | Metric dictionary, test scenarios, insight requirements | Product and business validation | Rachel, Sachin, Satvik |
| Yashwant | AI Intent & Context Lead | Intent logic, contextual responses, evaluation, fallback | AI service, prompt/evaluation set, confidence handling | Telemetry interpretation | Sachin, Akshat, Satvik |
| Shweta Jha | Full-Stack Experience & UI Lead | UX/UI, contextual overlays, frontend, visual polish, integration | Working interface, responsive demo, frontend integration | Demo reliability | Katelyn, Akshat, Sachin |
| Meagan McCallum | Resy Implementation Validator | Onboarding truth, specialist workflow, exceptions, launch readiness | Validated journey, exception map, business sign-off inputs | Business narrative | Satvik, Katelyn, Rachel |
| Rachel Talentino | Operations & Pilot Outcomes Lead | Operations impact, support/escalation lens, metrics validation | Outcome framework, operational acceptance questions | Stakeholder and pilot support | Santanu, Meagan, Satvik |

**Bottom line:** run Team EASE as a product-and-business-led requirements loop feeding three parallel delivery lanes: Experience, Platform and Intelligence. Ajay Kumar coordinates the whole system; Akshat Dhingra owns technical convergence; Satvik Jain owns product and final narrative integration; Meagan McCallum and Rachel Talentino validate that the prototype represents a meaningful Resy implementation and operations outcome rather than only a polished technology demonstration.

---

## 10. GitHub Repos for Inspiration

Publicly available code referenced as inspiration/reference material:

- https://github.com/DietrichGebert/ponytail
- https://github.com/thedotmack/claude-mem
- https://github.com/vercel-labs/agent-browser
- https://github.com/abhigyanpatwari/GitNexus
- https://github.com/gastownhall/beads
- https://github.com/upstash/context7s
- https://github.com/JuliusBrussee/caveman
- https://github.com/docker/mcp-gateway
- https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- https://github.com/VectifyAI/PageIndex
- https://github.aexp.com/amex-archives
- https://github.com/amex-eng/architecture-portal/
- https://github.com/amex-eng
- https://aexp.atlassian.net/wiki/spaces/CTOS/pages/1973518564/LaunchPad+-+Needs
- https://aexp.atlassian.net/wiki/spaces/CTOS/pages/1973521625/Gen+AI+LaunchPad+for+GrowthHack
- https://github.aexp.com/pages/amex-eng/amexway/docs/quadrants/languages/Frameworks/one-app
- https://github.aexp.com/pages/amex-eng/amexway/docs/quadrants/languages/Frameworks/one-data
- https://github.aexp.com/pages/amex-eng/amexway/docs/quadrants/culture/growthhack
