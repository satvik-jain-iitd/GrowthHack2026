I need you to inspect this repository and the GitHub Enterprise environment available to me before we design a lightweight project/sprint management solution.

Do NOT build or modify anything yet.

Do NOT create files, branches, commits, pull requests, issues, workflows, or configuration.

Your task is only to inspect what you can safely determine from the repository, its configuration, available GitHub features, existing workflows, and my permissions, and then produce a structured technical assessment.

## Context

This repository is hosted on a company-managed GitHub Enterprise environment.

Approximately 8 engineers collaborate on this repository.

We want to build a very lightweight Agile/Sprint management experience for this team because Jira is not available to us.

The eventual goal is a simple Kanban-style system with Epics and Stories, minimal project-management overhead, GitHub integration, persistent shared state, and potentially some lightweight automation around pull requests and reviews.

We have approximately 7 days to build an MVP.

We should strongly prefer existing GitHub capabilities and repository-native solutions over introducing servers, databases, cloud services, or additional infrastructure.

Assume that company security restrictions may prevent GitHub Pages, GitHub Projects, third-party hosting, external databases, OAuth applications, GitHub Apps, or certain GitHub Actions unless you can verify otherwise.

Before choosing an architecture, I need you to investigate the environment.

## 1. Identify the GitHub Environment

Determine, where possible:

- Whether this is GitHub Enterprise Cloud, GitHub Enterprise Server, or another company-managed GitHub configuration.
- Any GitHub Enterprise version information you can safely determine.
- Whether this repository belongs to an organization.
- Relevant organization/repository policies visible to me.
- Whether repository visibility is private/internal.
- Any enterprise restrictions that appear relevant to the proposed solution.

Do not guess. Clearly label anything you cannot verify as `UNKNOWN`.

## 2. Repository Permissions

Determine what permissions I appear to have for this repository.

Specifically investigate whether I can:

- Read repository contents
- Push commits
- Create branches
- Create pull requests
- Merge pull requests
- Create/edit/close GitHub Issues
- Add/remove labels
- Create/manage milestones
- Assign issues to users
- Create or edit GitHub Actions workflows
- Manually trigger workflows
- Access repository secrets/variables configuration
- Access repository settings
- Create GitHub releases
- Use repository webhooks

If a permission cannot be safely determined without performing a destructive or state-changing action, do NOT test it by modifying the repository. Mark it `UNKNOWN` and explain how I can verify it manually.

## 3. GitHub Issues

Check whether GitHub Issues are enabled and usable for this repository.

Determine:

- Are Issues enabled?
- Can team members create Issues?
- Are assignees supported?
- Are labels available?
- Are milestones available?
- Are issue templates already configured?
- Are issue forms available?
- Are there existing conventions around Issues?
- Could Issues reasonably represent our Stories?
- Could labels, milestones, parent/child relationships, sub-issues, or another native mechanism represent Epics?

Also identify any GitHub Enterprise/version limitations that affect these capabilities.

## 4. GitHub Projects

Determine whether GitHub Projects is available to this repository or organization.

Specifically investigate:

- Is GitHub Projects accessible?
- Which Projects experience/version is available?
- Can I create a Project?
- Can Projects contain Issues from this repository?
- Are board views available?
- Are custom fields available?
- Are grouping and filtering available?
- Can project items be moved between statuses?
- Are project workflows/automations available?
- Can Projects represent Epics and Stories adequately?
- Can the project be linked prominently from the repository?

If Projects is available, explain whether building a custom Kanban application would provide meaningful value over simply configuring GitHub Projects.

Do not assume that Projects is available merely because GitHub normally supports it.

## 5. GitHub Actions

Inspect `.github/workflows/` and determine:

- Whether GitHub Actions are currently used
- What workflows already exist
- Whether Actions appear enabled
- Whether workflows can write repository contents
- Whether workflows can modify Issues
- Whether workflows can modify labels
- Whether workflows can interact with pull requests
- Whether workflows can use `GITHUB_TOKEN`
- What permissions the existing `GITHUB_TOKEN` appears to have
- Whether workflow permissions are restricted by organization policy
- Whether custom or third-party Actions are restricted
- Whether only company-approved Actions can be used

Determine whether Actions could safely support lightweight automation such as:

- Updating ticket metadata
- Updating generated dashboard data
- Linking Stories to pull requests
- Changing a Story's state based on PR events
- Requesting or notifying reviewers
- Marking a Story complete after a PR is merged

Do NOT create or execute a workflow as part of this investigation.

## 6. GitHub Pages / Static Hosting

Determine whether GitHub Pages is available for this repository or organization.

Check, where possible:

- Whether Pages is enabled
- Whether I have permission to configure it
- Whether internal/private Pages are supported in this environment
- Whether organization policy appears to block it

If Pages is unavailable, identify that clearly.

Also evaluate whether there are any existing company-approved static hosting mechanisms already referenced by this repository.

Do NOT enable Pages.

## 7. README Limitations

Confirm what interactive functionality can and cannot run directly inside this repository's `README.md` when viewed on GitHub Enterprise.

In particular, determine whether README rendering allows:

- JavaScript
- iframes
- arbitrary HTML applications
- drag-and-drop interfaces
- embedded interactive web applications
- forms that persist data
- custom scripts

Explain what is realistically possible inside README itself.

Then identify repository-native alternatives for making a project dashboard highly visible from the repository landing page.

## 8. Existing Development Workflow

Inspect the repository and infer the current development workflow.

Look for:

- Branch naming conventions
- Protected branches
- PR templates
- CODEOWNERS
- Review requirements
- CI workflows
- Commit conventions
- Issue references in commits/PRs
- Existing labels
- Existing project-management files
- Existing YAML/JSON/Markdown files that track work
- Contribution documentation

Describe the likely workflow, but distinguish verified facts from inference.

## 9. Branch Protection and PR Workflow

Determine, where possible:

- Whether the default branch is protected
- Whether direct pushes are allowed
- Whether PRs are required
- Number of required reviewers
- Whether CODEOWNERS approval is required
- Whether status checks must pass
- Whether squash/rebase/merge policies are configured

This matters because the future ticket-management solution should fit naturally into the team's existing workflow rather than creating another parallel process.

## 10. Current Ticket / Planning Data

Search this repository for anything currently being used to represent:

- Tasks
- Stories
- Epics
- Sprint plans
- TODO lists
- Roadmaps
- Backlogs
- Feature tracking
- Story points
- Owners/assignees

Inspect Markdown, YAML, JSON, issue templates, documentation, and relevant configuration.

Report what already exists and whether any of it could be reused.

## 11. Feasibility of Repository-Based Persistence

Evaluate these possible persistence mechanisms WITHOUT implementing them:

### Option A: GitHub Issues as the database

Stories are GitHub Issues and metadata is represented through labels, assignees, milestones, issue fields, or native relationships.

### Option B: Repository file as the database

For example:

`project-board.json`

or

`project-board.yaml`

Changes to ticket state eventually become commits to the repository.

### Option C: GitHub Projects as the database/UI

Use native GitHub Projects instead of building a custom Kanban interface.

### Option D: Static UI + GitHub API

A static frontend displays a Kanban board and writes updates through GitHub APIs, assuming authentication and enterprise policy allow it.

### Option E: Hybrid solution

For example:

GitHub Issues = source of truth
GitHub Actions = automation
README = summary/dashboard entry point
Optional static UI = enhanced visualization

For each option evaluate:

- Feasibility in THIS environment
- Required permissions
- Security implications
- Authentication requirements
- Concurrent update risks
- Maintenance burden
- Implementation effort
- User experience
- Whether additional infrastructure is required
- Suitability for an MVP that must be built within 7 days

## 12. Third-Party / External Infrastructure Restrictions

Look for evidence of organization policies or repository conventions concerning:

- External SaaS
- Firebase
- Supabase
- Vercel
- Netlify
- External databases
- OAuth applications
- GitHub Apps
- PATs/personal access tokens
- External API calls
- Third-party GitHub Actions

Do NOT recommend introducing any of these unless there is evidence that they are permitted.

Our preferred architecture should require no external infrastructure.

## 13. Authentication

Determine whether we can design the solution so that GitHub itself remains the only authentication/authorization mechanism.

The ideal state is:

- No separate user accounts
- No passwords managed by our application
- No custom identity system
- Repository permissions determine who can modify project state

Explain whether this is realistic with the available features.

## 14. Proposed Minimum Ticket Data Model

Do not implement this yet, but assess whether the environment can support a Story with approximately these fields:

- ID
- Title
- Description
- Epic
- Assignee
- Status
- Priority
- Created date
- Updated date
- Linked branch
- Linked pull request
- Optional story points / effort

And an Epic with approximately:

- ID
- Title
- Description
- Owner
- Status
- Stories
- Progress

Identify which fields GitHub could manage natively and which would require custom metadata.

## 15. Kanban Requirements

The eventual MVP should support approximately:

- 3 primary workflow columns
- Epic → Story hierarchy
- Moving Stories between statuses
- Assigning/claiming Stories
- Filtering by engineer
- Filtering by Epic
- Filtering by status
- Viewing work completed by each engineer
- Viewing active work
- Viewing Epic progress
- Linking Stories to branches/PRs
- Lightweight PR/review automation

We have not finalized whether the workflow should be:

`To Do → In Progress → Done`

or whether a separate review state is necessary.

Based on the repository's actual PR workflow, recommend the simplest state model.

## 16. American Express Design Constraints

The eventual UI must comply with the company's approved American Express/internal design standards.

Check whether this repository already contains or references:

- Internal design-system packages
- Shared component libraries
- CSS/design tokens
- UI frameworks
- Brand guidelines
- Internal npm packages
- Existing American Express UI components

Do not invent American Express design rules.

If no approved design system or guideline can be found, report:

`DESIGN SYSTEM REFERENCE REQUIRED FROM USER`

## 17. Seven-Day MVP Constraint

Evaluate everything from the perspective that one engineer needs to get a reliable MVP working within approximately 7 days.

Prioritize:

1. Reliability
2. Security/compliance
3. Minimal infrastructure
4. Minimal permissions required
5. Easy collaboration for ~8 engineers
6. Low maintenance
7. Simple UX
8. Automation where it genuinely reduces manual work
9. Visual polish only after the workflow works

Avoid unnecessary architecture.

## Required Output

Do not give me a long generic GitHub tutorial.

Return your findings using this exact structure:

### A. Environment Summary

A concise summary of the GitHub Enterprise environment and repository.

### B. Capability Matrix

Create a table:

| Capability | Available | Permission | Evidence | Notes |
|---|---|---|---|---|
| GitHub Issues | YES/NO/UNKNOWN | ... | ... | ... |
| GitHub Projects | YES/NO/UNKNOWN | ... | ... | ... |
| GitHub Actions | YES/NO/UNKNOWN | ... | ... | ... |
| GitHub Pages | YES/NO/UNKNOWN | ... | ... | ... |
| Repository write | YES/NO/UNKNOWN | ... | ... | ... |
| PR creation | YES/NO/UNKNOWN | ... | ... | ... |
| Issue management | YES/NO/UNKNOWN | ... | ... | ... |
| Workflow editing | YES/NO/UNKNOWN | ... | ... | ... |
| GitHub API usage | YES/NO/UNKNOWN | ... | ... | ... |

### C. Existing Repository Workflow

Describe how engineers currently appear to develop, review, and merge changes.

### D. Existing Project-Management Assets

List any Issues configuration, Projects, labels, templates, planning files, or other relevant assets already present.

### E. Restrictions / Blockers

List confirmed restrictions separately from assumptions.

Use:

- `CONFIRMED`
- `LIKELY`
- `UNKNOWN`

Do not present assumptions as facts.

### F. Persistence Options

Compare:

1. GitHub Issues
2. Repository JSON/YAML
3. GitHub Projects
4. Static frontend + GitHub API
5. Hybrid approach

Score each from 1–5 for:

- Implementation speed
- Reliability
- Security/compliance fit
- UX
- Automation potential
- Maintenance simplicity

### G. Recommended Architecture

Recommend the simplest architecture that appears feasible in THIS GitHub Enterprise environment.

Provide:

- Primary recommendation
- Why
- Source of truth
- UI approach
- Authentication approach
- Persistence mechanism
- Automation mechanism
- README integration
- Main limitations

### H. Fallback Architecture

Provide a fallback that still works if GitHub Pages, Projects, or advanced enterprise features are unavailable.

The fallback should preferably require only:

- Repository access
- Standard GitHub Issues and/or repository files
- Pull requests
- GitHub Actions, if available

### I. Suggested Kanban State Model

Recommend the minimum useful workflow states based on the repository's actual development process.

### J. Data Model

Recommend the minimum Epic and Story schema.

### K. Automation Opportunities

Identify only high-value, low-complexity automations suitable for the 7-day MVP.

For each automation specify:

Trigger → Action → GitHub mechanism

### L. Manual Verification Required

List everything you could not determine automatically.

For each unknown, give me very short step-by-step instructions for checking it manually in the GitHub UI.

### M. Final Verdict

End with these exact fields:

**Recommended MVP:**
**Source of Truth:**
**Kanban UI:**
**Persistence:**
**Authentication:**
**GitHub Actions Role:**
**README Role:**
**External Server Required:** YES/NO
**External Database Required:** YES/NO
**GitHub Pages Required:** YES/NO
**GitHub Projects Required:** YES/NO
**Estimated MVP Complexity:** LOW/MEDIUM/HIGH
**Biggest Technical Risk:**
**Biggest Permission Risk:**

Again: do not modify anything. This is a read-only discovery and architecture assessment.
