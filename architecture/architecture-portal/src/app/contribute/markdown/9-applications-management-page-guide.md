# Application Management

## Overview

The Application page gives you a complete view of a single application registered in the Architecture Portal. It shows details sourced from the enterprise application registry alongside architecture-specific classifications such as Company Domain, ADRs, Build vs. Buy decisions, and linked Initiatives. If you are listed as an owner, you can also edit the application's classifications directly from this page.

---

## Accessing an Application

Navigate to an application from the Applications directory. If an application is not yet part of the pilot program, the page will appear empty.

---

## What You'll See

### Application Details

A description of the application is shown at the top, followed by a grid of informational tiles covering:

| Field | Description |
|---|---|
| Central ID | The unique identifier for this application |
| Line of Business 2 | The associated line of business |
| Lifecycle Status | The current lifecycle stage of the application |
| Countries Support | The countries or regions the application serves |
| App Type | The type or category of the application |
| Business Units | Business units associated with this application |
| Business Capabilities | Enterprise business capabilities this application supports |
| Foundational Technologies | Core technologies underpinning the application |
| Markets | The markets this application operates in |
| Tech Stacks | Technology stacks in use |
| Tech Capabilities | Technical capabilities enabled by this application |
| Company Domain | The company domain this application belongs to |
| Proposed Company Domain | Shown with a caution indicator when a domain change has been proposed but not yet confirmed |
| Sub Domain | The sub-domain within the assigned company domain |
| ADR | Associated Architecture Decision Records, split into core and non-core |
| BvB | Associated Build vs. Buy decisions, split into core and non-core |
| Linked Initiative | Initiatives related to this application, split into core and non-core |

ADR, BvB, and Linked Initiative values are displayed as clickable tags that navigate to the relevant detail pages.

### Owners / SMEs

A grid listing the people responsible for this application, shown with their name and avatar. The following roles are displayed:

- Owner
- Business Owner
- Production Support Owner
- PMO
- VP 1
- VP 2
- SVP
- Unit CIO

---

## Editing an Application

### Who Can Edit

The **Edit** button appears if you are listed as one of the application's owners (Owner, Business Owner, Production Support Owner, PMO, VP 1, VP 2, SVP, or Unit CIO) 

### Editable Fields

When you click **Edit**, an inline form expands with the following fields:

- **Company Domain** — select from the list of available company domains
- **Sub Domain** — select from the sub-domains within the chosen company domain; only available after a company domain is selected
- **ADR** — add or remove Architecture Decision Records, classifying each as core or non-core
- **BvB** — add or remove Build vs. Buy decisions, classifying each as core or non-core
- **Linked Initiative** — add or remove related initiatives, classifying each as core or non-core

### Saving and Cancelling

Click **Save** to apply your changes. The page will reload with the updated information automatically.

Click **Cancel** to discard any changes and return to the read-only view.

---

## Navigation

Use the **"< Back to Applications"** button at the top of the page to return to the Applications directory.