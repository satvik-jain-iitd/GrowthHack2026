# ADR Workflow Guide

## Overview

An **Architecture Decision Record (ADR)** follows a structured workflow to ensure decisions are reviewed, approved, and documented consistently.

There are two types of ADRs:

- **Standard ADR** — follows the full review and approval workflow  
- **Build vs Buy (BvB) ADR** — skips the workflow and does not go through review/approval steps  

---

## Where to Find ADRs in the Portal

ADRs are accessible from two main areas of the Architecture Portal:

### ADRs Section

The **ADRs** section (found in the main navigation) lists all Architecture Decision Records across the organization. From here you can browse existing ADRs and click into any individual record to view its content and current workflow status.

### Within a Playbook or Initiative

ADRs can also live inside a **Playbook** or **Initiative**. When you navigate to a document that contains an ADR file, the workflow panel appears directly at the top of that page — above the document content — so you can see its current status at a glance.

---

## Adding a New ADR

There are two ways to add an ADR to the portal, depending on where you are.

### Option 1 — From a Playbook or Initiative index page

When viewing an index page inside a Playbook or Initiative, you can click the **Add ADR** button (shown with a + icon). This opens a form where you fill in:

- **ADR Name** — a short descriptive title for the decision  
- **ADR Type** — the category of the decision  
- **Reviewer(s)** — people who will provide feedback (search by email)  
- **Decider(s)** — people who will make the final approval decision (search by email)  
- **EA Architect(s)** — Enterprise Architects to include for visibility (search by email)  

Once submitted, the ADR is created in **In Progress** status and appears in the document list.

### Option 2 — From an existing ADR document page

If you navigate directly to an ADR document that has not yet been registered in the workflow, you will see a **Register ADR** button in place of the workflow panel. Clicking it opens a similar form with the same fields as above, plus an optional **Initial Status** and **Approved Date** (useful if the decision was already made before being recorded in the portal).

Registering an ADR links that document to the workflow so it can progress through the review and approval steps.

---

## Viewing Workflow Status on a Document

Once an ADR has been registered, opening its document page shows the **ADR workflow panel** near the top of the page. This panel displays:

- The **current status** (e.g. *In Progress*, *Under Review*, *Awaiting Approval*, *Approved*, or *Not Approved*)  
- A **progress stepper** showing where the ADR is in the overall workflow  
- A **View Details** link that expands to show the full breakdown including the list of reviewers, deciders, and an audit trail of all activity  
- **Action buttons** relevant to your role at the current stage (see below)  

---

## Taking Action on an ADR

The buttons you see in the workflow panel depend on your role and the ADR's current status.

| Your Role | ADR Status | Available Action |
|-----------|-----------|-----------------|
| Requester or Enterprise Architect | In Progress | **Submit for Review** |
| Reviewer | Under Review | **Agree**, **Disagree**, or **Abstain** |
| Decider | Awaiting Approval | **Approve** or **Reject** |

Each action opens a confirmation dialog where you can optionally provide written feedback before submitting.

### Editing an ADR

If you are the Requester or an Enterprise Architect, an **Edit** option is also available within the expanded workflow panel. This lets you update the ADR name, type, reviewers, deciders, and EA architects while the ADR is still in progress.

---

## Workflow States

An ADR moves through the following stages:

| State | Meaning |
|------|--------|
| **In Progress** | ADR is being created and edited |
| **Under Review** | ADR has been submitted for review |
| **Awaiting Approval** | Most reviewers have completed feedback; waiting on final decision |
| **Approved** | All decision-makers approved the ADR |
| **Not Approved** | At least one decision-maker rejected the ADR |

**State progression (in order):**

In Progress → Under Review → Awaiting Approval → Approved / Not Approved

---

## Roles

- **Requester**  
  The person who creates and owns the ADR  

- **Reviewers**  
  Provide feedback and indicate whether they support or reject the proposal  

- **Deciders (Approvers)**  
  Make the final decision to approve or reject the ADR  

- **Enterprise Architects**  
  Included in all notifications for visibility  

---

## Workflow Steps

### 1. Create ADR

- The Requester creates a new ADR using a standard template  
- The ADR starts in **In Progress**  
- A notification is sent to confirm creation  

---

### 2. Submit for Review

- The Requester submits the ADR for review  
- Status changes to **Under Review**  
- Reviewers are notified and asked to provide feedback  

---

### 3. Review Phase

- Reviewers submit:
  - **Approval** (they agree)  
  - **Rejection** (they disagree, with feedback)  

- Each reviewer can respond **once**  

#### Progression Rule

- Once **at least 75% of reviewers** have completed their reviews:
  - The ADR moves to **Awaiting Approval**  
  - Deciders are notified to make the final decision  

---

### 4. Approval Phase

- Deciders review the ADR and submit their decision:
  - **Approve**  
  - **Reject**  

- Each decider can respond **once**  

#### Decision Outcomes

- ❌ **If any decider rejects:**
  - ADR becomes **Not Approved**  
  - Process ends  

- ✅ **If all deciders approve:**
  - ADR becomes **Approved**  
  - Process completes successfully  

---

## Key Rules

- Only assigned reviewers and deciders can participate  
- Each person can submit **only one response**  
- **75% reviewer participation** is required to move forward  
- **100% approval from deciders** is required for approval  
- A **single rejection from a decider overrides all approvals**  
- Steps must happen in order — no skipping ahead  
- **Build vs Buy ADRs do not go through this workflow**  

---

## Notifications

Throughout the process, notifications are sent to keep everyone informed:

- When an ADR is created  
- When it is submitted for review  
- When it moves to approval  
- When approvals or rejections are submitted  
- When a final decision is reached  

Enterprise Architects are included in all notifications.  

---

## Integrations

- **GitHub**  
  ADRs are stored as documents for version tracking and collaboration  

- **Amex Actions**  
  Used to notify reviewers and deciders of tasks they need to complete

---

## Audit Trail

Every step in the process is recorded, including:

- Creation  
- Submission for review  
- Individual reviews  
- Transition to approval  
- Final decisions  
- Any updates made along the way  

This ensures transparency and accountability throughout the lifecycle of the ADR.  

---

## Summary

The ADR workflow provides a clear and structured way to:

- Capture architectural decisions  
- Gather meaningful feedback  
- Ensure proper approvals  
- Maintain transparency across teams  

Standard ADRs follow this full process, while **Build vs Buy ADRs are handled outside of the workflow since it has its own workflow**.