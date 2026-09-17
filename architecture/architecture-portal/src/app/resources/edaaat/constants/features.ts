/*istanbul ignore file */
import { Feature } from '@/app/resources/edaaat/utils/interfaces'

const features: Feature[] = [
    {
        id: 'L0_DFD',
        imageSrc: '/edaaat/l0-dfd-sample.png',
        descriptionLabel: 'What is Data Flow Diagram?',
        descriptionContent:
            'A Data Flow Diagram represents how data moves between source and target systems, including the type of data transmitted. The scope depends on your selected company domain, subdomain, other company domain, foundation technologies or external third party.'
    },
    {
        id: 'L1_DFD',
        imageSrc: '/edaaat/l1-dfd-sample.png',
        descriptionLabel: 'What are Level 0 & Level 1 Data Flow Diagram?',
        descriptionContent:
            'Level 0 – Company Domain-level data flows for the selected company domain. Level 1 – Subdomain-level data flows within the selected company domain and data flow between subdomains of selected company domain and other company domain, foundation technologies and external third party.'
    },
    {
        id: 'L2_DFD',
        imageSrc: '/edaaat/l2-dfd-sample.png',
        descriptionLabel: 'What is Level 2 Data Flow Diagram?',
        descriptionContent:
            'Level 2 – Detailed subdomain-level data flows, showing interactions both within the selected subdomain and with other subdomains of the same company domain, other company domain, foundation technologies, and external third party.'
    },
    {
        id: 'CDM',
        imageSrc: '/edaaat/l1-cdm.png',
        descriptionLabel: 'What is Conceptual Data Model?',
        descriptionContent:
            'A Conceptual Data Model represents high-level conceptual entities and their relationships. This provides an aggregated view of the data landscape.'
    }
]

export default features
