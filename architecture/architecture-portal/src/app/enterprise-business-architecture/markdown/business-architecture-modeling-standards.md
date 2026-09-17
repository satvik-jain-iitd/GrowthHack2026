# Business Architecture Modeling Standards

**Author:** Dana Baer  
**Document date:** 3/18/2026

## Overview

This document outlines the standards that must be followed by the Business Architecture team, stewards, and other partners when creating and maintaining Business Architecture Models at American Express (AXP). These standards are intended to ensure consistency and uniformity throughout all AXP Business Architecture-related models, and they are based on industry knowledge and the expertise of the Business Architecture (BA) team.

The standards in this guide must be followed for all new and existing BA models.

The standards help the Business Architecture Team create models that are accurate, consistent, and valuable to the organization. The standards are subject to change as the needs of the organization evolve.

> Note: In Business Architecture, “Business Architecture Model” refers to a representation used to visualize components and relationships between components. This term differs from the word “Models” as defined in AEMP 55, which outlines models in relation to model risk management.

## Contents

- Overarching Standards
- Business Architecture Standards
  - Business Architecture Definition
  - Business Architecture Frameworks
  - Alignment to Enterprise Architecture Frameworks
- Enterprise Business Capability Model Purpose and Primary Use Cases
- Enterprise Business Capability Model (EBCM) Standards
  - Enterprise Business Capability Model (EBCM) Definition
  - EBCM Governance and Change Management
- Business Capability (EBC) Definition
  - Business Capability Documentation
  - Business Capability Naming Convention
  - Business Capability Definition Requirements
  - Business Capability Model Structural Conditions
  - Business Capability Leveling Standards
  - Business Capability Ecosystem
  - Business Capability Assessments
    - Business Capability Stratification
    - Business Capability Criticality
    - Business Capability Maturity
- References
- Document Revision History

## Overarching Standards

The following standards serve as the foundation of the AXP approach for generating and managing Business Architecture Models. The BA models at AXP must:

1. Be stable, but evolve with oversight as the future AXP enterprise business model changes.
2. Be comprehensive, but non-overlapping. Each element in a Business Architecture model is distinct and unique.
3. Be able to connect to key components, such as process, data, and systems.
4. Be reusable. The models are used more than once and are useful in more than one use case.
5. Be refined iteratively. The models are living, breathing documents, and are continuously reviewed and refined.
6. Not be prescriptive. Business Architecture models do not impose rules or imply order of operations in any way.
7. Be objective. The model structure, names, and definitions of each element are not influenced by personal feelings or opinions. Naming should align with business terminology.
8. Be only defined once for AXP. Each element in a model is non-redundant regardless of how many business units, systems, processes, etc. are related to it.
9. Be ability-based. All Business Capabilities must represent stable enterprise abilities expressed as actions, independent of organization, process, technology, or domain constructs.

## Business Architecture Standards

### Business Architecture Definition

Business Architecture is explicitly representing an organization’s desired state and as-is state, through a set of independent, non-redundant artifacts, defining how these artifacts relate with each other and developing a set of prioritized, aligned initiatives needed to meet the organization’s goals, communicating this understanding to stakeholders, and advancing the organization from its as-is state to its desired state. (Definition from the BACOE)

1. It centers around an end-to-end view of Business Capabilities and their enabling components to unlock strategic opportunities and drive an enterprise mindset for operating and delivering solutions.
2. It is a discipline that represents holistic, multidimensional business views of “what” the business does to deliver business outcomes and user experiences.

### Business Architecture Frameworks

A Business Architecture Framework is an essential component of any Business Architecture practice and serves as the central frame of reference for the team.

1. A Framework is a structure that organizes a set of related artifacts or data. (BACOE)
2. A Framework is a frame of reference.
3. It is a thinking tool and does not tell you what to do or how to do something.
4. It is a logical structure that organizes, for a specific subject, a set of artifacts, shows the relationships of the artifacts of the chosen area, and brings a total perspective to otherwise individual ideas. (BACOE)
5. It has a consistent naming convention.
6. Each component is fully defined.
7. Each element is represented by a consistent set of graphical representations.

### Alignment to Enterprise Architecture Frameworks

The Enterprise Business Capability Model aligns to American Express’s Enterprise Architecture framework and supports capability-based planning principles consistent with Enterprise Architecture frameworks such as TOGAF.

1. Level 1 Capabilities represent enterprise value domains aligned to Architecture Vision.
2. Level 2 Capabilities serve as anchors for capability-based planning and investment alignment.
3. Capability maturity and target state assessments support roadmap development and transformation sequencing.
4. The EBCM functions as Business Architecture content within the Architecture Repository.
5. Governance of Level 1–3 capabilities aligns to enterprise architecture governance standards.

This alignment ensures the EBCM integrates with broader architecture planning without introducing additional process overhead.

## Enterprise Business Capability Model Purpose and Primary Use Cases

The Enterprise Business Capability Model (EBCM) serves as a strategic management instrument for American Express and is designed to enable enterprise alignment, transparency, and informed decision-making.

The EBCM is used to:

1. Provide a common enterprise taxonomy to reduce redundancy and fragmentation across business units.
2. Align enterprise strategy to execution by mapping strategic objectives to business capabilities.
3. Enable capability-based planning to inform investment prioritization and roadmap development.
4. Increase investment transparency by linking applications and processes to capabilities.
5. Support rationalization efforts across processes, applications, and organizational constructs.
6. Identify enterprise risk concentrations and control dependencies through capability mapping.
7. Assess current and target capability maturity states to guide transformation planning.

The EBCM is not an organizational model, process hierarchy, product taxonomy, funding construct, or transformation roadmap. It is a stable representation of what the enterprise does, independent of how it is implemented.

## Enterprise Business Capability Model (EBCM) Standards

### Enterprise Business Capability Model (EBCM) Definition

The Enterprise Business Capability Model (EBCM) is the common taxonomy for business activities designed to be an enterprise-wide, business-focused blueprint that enables a common language and connective tissue for what the business does to deliver value.

1. It is the foundational blueprint for American Express.
2. It reflects AXP value delivery across the business model – “what” we do.
3. It does not represent “how” AXP delivers or is organized.
4. The EBCM is independent of individual organizational units, such as business units or legal entities, and represents the holistic enterprise. A capability may be performed by several organizations and each organization may perform several capabilities.
5. There is only one Enterprise Business Capability Model for American Express. However, different views or derivations of a Capability Model can be provided for business units or projects, as required.
6. Levels 1–3 of the Enterprise Business Capability Model are managed by the Business Architecture team. As the model is defined at a more granular level (levels 4 and beyond), individual business units may oversee the formation and build of these with direction from the Business Architecture team.

### EBCM Governance and Change Management

The integrity and stability of the EBCM are maintained through formal governance and oversight by the Business Architecture team.

1. Level 1 and Level 2 capabilities are governed and approved by the Enterprise Business Architecture function.
2. Structural changes to Level 1 or Level 2 capabilities require formal review to assess enterprise impact.
3. Level 3 and lower-level capabilities may be proposed by business units but must adhere to enterprise standards and receive Business Architecture validation.
4. New capability proposals must demonstrate non-duplication, clear differentiation, and alignment to enterprise strategy.
5. The EBCM is reviewed periodically to ensure alignment with the evolving enterprise business model.

Changes to the EBCM must preserve stability, mutual exclusivity, and enterprise applicability.

## Business Capability (EBC) Definition

An Enterprise Business Capability (EBC), also referred to as a Business Capability, represents a stable, outcome-oriented ability that American Express must possess to deliver value. A Business Capability defines what the enterprise does, independent of organizational structure, process design, or technology implementation.

A Business Capability represents an enterprise ability. An ability is inherently action-oriented and describes what the organization is able to do, not a thing it owns, a domain it operates in, or a structure it maintains. For this reason, capabilities must be expressed as actions to ensure the model consistently represents enterprise abilities rather than organizational constructs, data domains, products, or assets.

1. Business Capabilities are the activities performed by the business to achieve its goals.
2. Business Capabilities provide business-centric views of an organization.
3. Business Capabilities are key components of business architecture and an expression of “what” a business does and can do.
4. Business Capabilities provide a holistic inventory as enabled by the coordination of effort of people, processes, information, and technology. For example, a technical capability describes a platform’s functionality whereas a capability is automated or enabled by a platform.
5. Business Capabilities do not address “who” in the organization does something, or “how” it is accomplished.

### Business Capability Documentation

EBCs must be fully documented in accordance with established requirements, facilitating consistent understanding and implementation.

1. Level 1 and 2 EBCs must have four parts: Definition, Begins With, Ends With, and Includes.
2. Level 3+ do not require a Begins With, Ends With, or Includes, but this is encouraged.
3. EBCs are mutually exclusive, collectively exhaustive – they are defined only once. A child capability can only belong to one and only one parent capability.
4. Each capability requires a source to be complete. Sources may be individuals, documents, or any other entities from which information is derived.

### Business Capability Naming Convention

Business Capability names must reflect enterprise abilities, not domains, organizations, systems, or objects. Naming consistency is critical to preserving architectural integrity and preventing overlap with data taxonomies, organizational models, process hierarchies, or product constructs. The verb-noun convention ensures that each capability clearly expresses an action the enterprise performs and avoids ambiguity about whether the element represents a team, system, asset, or subject area.

To ensure uniformity and consistency, all Business Capabilities follow the same naming convention regardless of level.

1. Each Capability is an action, not a noun or a thing. It must represent an action and describe an enterprise ability.
2. Capabilities are named in a business object/action-based naming convention. Each action must be repeatable upon any instance of the named object.
3. Proper nouns should be avoided in Capability names unless referencing a legally defined construct, regulatory framework, or externally mandated classification.
4. The first letter of each word in the name should be capitalized.
5. Do not use a compound phrase in the name — no “and”, “or”, or lists with commas.
6. When suggesting a new EBC name or reviewing existing ones, ensure:
   - Alignment of the Business Capability name and its action.
   - A qualifier is added to any Business Capability that is unique to a business unit and not used across the enterprise.

### Business Capability Definition Requirements

A complete EBC definition requires adherence to the formal definition requirements.

1. There is a definition for each capability. The definition also outlines the capability’s beginning, end, and included elements.
2. Write a Capability definition to focus on actions involved in the Capability, not its results.
3. The definition for each Capability starts with “The ability to”.
4. Describe capabilities using the following template to describe a specific activity: “The ability to managing-type-verb + noun-phrase.” Example: “The ability to detect and prevent potential acts of misrepresentation and/or unauthorized activities or transactions across the prospect and customer lifecycle.”
5. Do not reuse the terms within the capability name as part of the definition.
6. Use Oxford comma for lists within a capability definition.
7. Keep definitions to one sentence and end them with a period.
8. Use terms such as “for example” and “such as” instead of “e.g.” or “i.e.” in definitions.
9. The “Begins With” section outlines the triggers that initiate a capability.
10. The “Ends With” section outlines the triggers that conclude a capability.
11. The “Includes” section outlines extra details to clarify the nature of a capability.
12. Use the following review questions to ensure the definition adequately describes a capability:
   - Does the description focus on the actions?
   - Are the actions clearly and concisely described?
   - Does the capability describe what is done, not how it is done?

### Business Capability Model Structural Conditions

Structure is essential for human consumability as it allows for information to be digestible and understandable more quickly and easily.

1. Structure is human consumable. The structure offers a visual representation that clarifies complexity and improves understanding.
2. When practical, structure should follow the 7±2 rule (Miller’s Law) to maintain human consumability. Target 5–9 child capabilities per parent where possible, balancing clarity with completeness.
3. Capabilities occur once in the model and are non-overlapping.
4. Capabilities are mutually exclusive and should not be repeated.
5. There is no chronological sequence to how the capabilities are structured.

### Business Capability Leveling Standards

The EBCM decomposes Business Capabilities from highest executive (L1) capabilities into Strategic (L2) and Operational (L3) capabilities to assess, plan, and enable components at the required levels.

1. Executive Capabilities are represented in Level 1.
   - They are the highest level of capabilities that describe what American Express does across the enterprise.
   - Level 1 reflects executive focal points for strategy and direction setting.
   - These are the foundational capabilities.
2. Strategic Capabilities are represented in Level 2.
   - They are a grouping of capabilities that the business performs in order to deliver business outcomes.
   - They can be used to align to strategy, understand outcomes, plan portfolio, and monitor strategic risks.
   - Level 2 reflects the core capabilities — the heart of what we do.
   - They are usually groups of capabilities.
3. Operational Capabilities are represented in Level 3.
   - They are specific capabilities executed via people, process, information, and technology to deliver a specific business outcome.
   - They can be used to understand dependency, monitor maturity, and relate to policy, risk, and controls.
   - Each Level 2 capability may temporarily include a default Level 3 capability numbered .0 when a specific decomposition has not yet been defined. This placeholder is transitional and must be reviewed and refined through formal decomposition. The .0 designation should not persist beyond governance review cycles without documented rationale.
4. All lower-level (child) capabilities can inherit characteristics, such as scope, resources, and purpose, of their higher-level (parent) capability.
5. Each capability has a unique identifier assigned by the Business Architecture team based on its position within the EBCM. This allows for easy navigation throughout the EBCM and a way to reduce complexity in understanding by organizing capabilities in a logical way.
   - Level 1 capabilities are identified by a whole number, starting with 1.
   - Level 2–4 capabilities are numbered by appending a decimal and a sequential number to their parent’s number.
   - Example:
     - 1 – Level 1 Capability
     - 1.1 – Level 2 Capability (child of 1.0)
     - 1.1.1 – Level 3 Capability (child of 1.1)
     - 1.1.1.1 – Level 4 Capability (child of 1.1.1)

## Business Capability Ecosystem

The Business Capability ecosystem provides a “one-stop shop” for understanding enabling components of a business capability and how they coordinate together to deliver a business outcome.

The enabling components reflect the people, process, information, and technology (PPIT) that enable a business capability. When connecting these to Business Capabilities through integrations with key repositories such as Central, Archer, Jira, and Collibra, the ability to understand usage, assess maturity, and identify opportunities improves.

To understand how a Capability relates to something else in the ecosystem, that is called a relationship. When that occurs, a mapping or Relationship Model is generated and utilized. The meaning of the relationship to a component is dependent on the element analyzed.

### Systems

A system is “an organized and correlated set of components that support one or more of an organization’s capabilities.” (BACOE)

1. A Business Capability may be performed or automated by an identified system(s).
2. Systems are synonymous with Applications.
3. They are tools such as software used to perform a Capability.
4. Examples of Systems are Capsifi (Jalapeno) and E-Oscar.

### Data

Data is “a building block of common business things and is the foundation for determining how capabilities and systems relate and how they can share data.” (BACOE)

1. Data is the tangible and intangible things of interest to the business we need to accomplish the action described within a capability definition.
2. Data is assessed from a business perspective.
3. The related Data is critical in accomplishing a Business Capability.
4. Data includes the data sets located in the Data Taxonomy and can be transformed into more granularity if necessary.
5. Examples of Data are Individual Customers and Card Accounts.

### Processes

Processes are procedures, programs, and practices that impose order on a company’s pursuit of its objectives. (2024 PRSA Standards - Effective 11.22.2024)

1. The capability requires the following activities to accomplish the action described within a capability definition.
2. Processes identify how a Capability is performed.
3. They are a set of tasks, performed in a certain order, to ensure completion.
4. Examples of Processes are PR-000954 Global Card Issuance and PR-001683 Global Compensation.

### Roles

Roles describe “the skills of the business and its stakeholders that perform various business activities.” (BACOE)

1. The capability is the responsibility of the identified role(s) and/or the identified role(s) is/are required to perform the capability.
2. Roles are the skills of the business that perform activities.
3. Roles can be both internal and external.
4. Examples of internal roles are American Express business units, organizations, specific job titles, and legal entities.
5. Examples of external roles are third parties or vendors.

## Business Capability Assessments

### Business Capability Stratification

Stratification categorizes business capabilities based upon a defined criterion. It can help provide a deeper understanding of the scope and impact a Capability has on AXP’s strategy and objectives.

1. Stratification is a concept leveraged to categorize capabilities based on their impact to the Enterprise.
2. Stratification is completed at Level 2 with the sub-capabilities inheriting the typing of its parent.
3. Examples of categories may include:
   - Customer-Facing: The Business Capability generates value for AXP customers.
   - Differentiating: The Business Capability differentiates AXP from its competitors.
   - Support: The Business Capability are directly involved in core, day-to-day functions but may not be unique to AXP as an enterprise.

### Business Capability Criticality

Criticality is a measure to assess the degree of significance of a Business Capability within an organization.

1. Criticality is defined as a measure of dependency on a certain element such as business operations, goals and objectives, or business initiatives.
2. The scale for criticality is a 5-point scale:
   - 5 = negligible impact, rarely occurs, almost no internal visibility, no external visibility
   - 4 = limited impact, occurs infrequently, limited internal visibility, no external visibility
   - 3 = moderate impact, occurs occasionally, moderate internal visibility, limited external visibility
   - 2 = noticeable impact, occurs frequently, extensive internal visibility, noticeable external visibility
   - 1 = significant impact, occurs very frequently, pervasive internal visibility, definite external visibility
3. When assessing criticality, use the following hints to determine its level:
   - How the Business Capability plays a critical role in achieving a goal or objective.
   - How many business units are involved in the execution of the capability.

### Business Capability Maturity

The Business Capability Maturity Assessment provides a mechanism for measuring and improving key behaviors and components that enable business capabilities.

Understanding the maturity of a capability will help:

1. Identify key gaps and opportunities to improve ability of capability to deliver value
2. Understand risks posed by immature capabilities to enterprise programs
3. Benchmark per industry maturity to leverage best practices
4. Establish maturity targets that can be tracked over time

The scale for maturity is a 5-point scale:

1. 5 = Optimal: Enabling business to deliver competitive differentiation
2. 4 = Advanced: Enabling business to deliver value and meet strategic imperatives
3. 3 = Effective: Enabling business to effectively operate
4. 2 = Emerging: Meeting basic business needs but not effective
5. 1 = Severely limiting the ability to meet business needs

## References

1. Business Architecture Center of Excellence. “The Four Pillars of Holistic Business Architecture.” 2024.
2. Holcman, Samuel B. *The Enabler of Business Strategy: A Methodology by the Business Architecture Center of Excellence (BACOE).* 2024.
3. Business Architecture Guild. *A Guide to the Business Architecture Body of Knowledge (BIZBOK Guide), Version 13.0.* 2024.

## Document Revision History

| Version | Date | Revised By | Comments |
|---|---|---|---|
| 1.0 | April 4, 2025 | Dana Baer | V1.0 published |
| 2.0 | February 27, 2026 | Dana Baer | Inserted a “revision history” into the document. |
| 3.0 | March 3, 2026 | Ikram Wadud | Added in alignment to Enterprise Architecture Frameworks, purpose and primary use cases, updated maturity. |
