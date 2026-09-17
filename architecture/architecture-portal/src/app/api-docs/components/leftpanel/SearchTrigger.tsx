/* istanbul ignore file */

import React from 'react'
import { HStack, Kbd, Text, chakra } from '@chakra-ui/react'
import { IconSearch } from '@americanexpress/dls-icons'
import styles from '@/app/api-docs/api-docs.module.scss'
import { APIDOCS_LEFT_NAV_WIDTH } from '@/constants'

const SearchTrigger = React.forwardRef<
    HTMLButtonElement,
    { onClick: () => void }
>(function SearchTrigger({ onClick }, ref) {
    return (
        <chakra.button
            type='button'
            ref={ref}
            onClick={onClick}
            aria-label='Search API documentation'
            aria-keyshortcuts='Meta+K Control+K'
            width='100%'
            maxW={APIDOCS_LEFT_NAV_WIDTH}
            minW={200}
            px={3}
            py={2}
            borderWidth='1px'
            borderColor='#D4DEE9'
            borderRadius='md'
            bg='white'
            _dark={{ borderColor: '#c8c9c7', bg: 'transparent' }}
            _hover={{ borderColor: '#006fcf' }}
        >
            <HStack gap={2} width='100%'>
                <IconSearch size='sm' className={styles.searchIcon} />
                <Text
                    fontSize='sm'
                    color='gray.500'
                    _dark={{ color: '#c8c9c7' }}
                    overflow='hidden'
                    textOverflow='ellipsis'
                    whiteSpace='nowrap'
                >
                    Search
                </Text>
                <Kbd size='sm' ml='auto'>
                    ⌘K
                </Kbd>
            </HStack>
        </chakra.button>
    )
})

export default SearchTrigger
