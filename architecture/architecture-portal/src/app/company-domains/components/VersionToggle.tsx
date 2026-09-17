'use client'
import React from 'react'
import { Button, HStack, Box } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui'
import styles from '../domains-page.module.scss'

interface Props {
    isV1: boolean
    handleVersionChange: () => void
}

export const VersionToggle = ({ isV1, handleVersionChange }: Props) => {
    return (
        <HStack
            position='relative'
            float='right'
            paddingRight='10vw'
            className={styles.domainToggleSwitch}
            paddingTop={{ base: '10px', md: '60px' }}
            paddingLeft='7vw'
        >
            <Tooltip showArrow content='Evolving Set of Company Domains'>
                <Button
                    color={isV1 ? 'fg.info' : 'white'}
                    background={isV1 ? '#ecedee' : 'fg.info'}
                    border='2px solid transparent'
                    _hover={{
                        border: '2px solid var(--chakra-colors-fg-info)',
                        cursor: isV1 ? 'pointer' : 'default',
                        transition: 'border 0.5s'
                    }}
                    _active={{
                        bg: isV1 ? '#ecedee' : 'fg.info'
                    }}
                    borderRadius='15px'
                    zIndex={isV1 ? '0' : '1'}
                    paddingRight={isV1 ? '35px' : '15px'}
                    left='35px'
                    fontWeight='600'
                    onClick={() => (isV1 ? handleVersionChange() : null)}
                >
                    Evolving
                </Button>
            </Tooltip>
            <Tooltip
                showArrow
                content='Domains Currently Pending EARB Approval'
            >
                <Button
                    background={isV1 ? 'fg.info' : '#ecedee'}
                    _hover={{
                        color: 'white',
                        cursor: isV1 ? 'default' : 'pointer'
                    }}
                    borderRadius='15px'
                    zIndex={isV1 ? '1' : '0'}
                    padding='0'
                    onClick={() => (isV1 ? null : handleVersionChange())}
                >
                    <Box
                        color={isV1 ? 'white' : 'fg.info'}
                        background={isV1 ? 'fg.info' : '#ecedee'}
                        border='2px solid transparent'
                        _hover={{
                            border: '2px solid var(--chakra-colors-fg-info)',
                            cursor: isV1 ? 'default' : 'pointer',
                            transition: 'border 0.5s'
                        }}
                        height='40px'
                        borderRadius='15px'
                        paddingY='10px'
                        paddingX='15px'
                        paddingRight={'15px'}
                        paddingLeft={isV1 ? '15px' : '32px'}
                        right={isV1 ? 0 : '90px'}
                        fontWeight='600'
                    >
                        Version 1
                    </Box>
                </Button>
            </Tooltip>
        </HStack>
    )
}
