import React from 'react'
import { useAccordionItemContext, Icon } from '@chakra-ui/react'
import { IconChevronRight } from '@americanexpress/dls-icons'

// Custom Arrow Icon that rotates when expanded
export default function AccordianArrowIcon() {
    const { expanded } = useAccordionItemContext()
    return (
        <Icon
            as={IconChevronRight}
            color='#006FCF'
            ml={1}
            style={{
                transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
            }}
        />
    )
}
