import React, { useState } from 'react'
import { DomainStatusBadge } from '../DomainStatusBadge'
import {
    Text,
    Flex,
    Box,
    Heading,
    Circle,
    Card,
    HStack,
    GridItem
} from '@chakra-ui/react'
import { VERSION_1_DOMAINS_UUIDS } from '../../constants'
import { Tooltip } from '@/components/ui'
import Image from 'next/image'
import { useNavigation } from '@/hooks'

interface Props {
    title: string
    imgSrcLM: string
    imgSrcDM: string
    imgSrcFilledLM: string
    imgSrcFilledDM: string
    noContributions: boolean
    description: string
    domainId: string
    playbookId: string
    EARBApproved: boolean
}

export function DomainsCard({
    title,
    imgSrcLM,
    imgSrcDM,
    imgSrcFilledLM,
    imgSrcFilledDM,
    noContributions,
    description,
    domainId,
    playbookId,
    // eslint-disable-next-line
    EARBApproved
}: Props) {
    const [isFilled, setFilled] = useState(false)
    const router = useNavigation()

    return (
        <GridItem key={title}>
            <Card.Root
                onMouseEnter={() => setFilled(true)}
                onMouseLeave={() => setFilled(false)}
                backgroundColor={{ base: 'white', _dark: '#27272a' }}
                flex={{ base: '0 0 20%', md: '0 0 25%', sm: '0 0 33%' }}
                height='auto'
                minH='231px'
                margin='10px'
                borderRadius='10px'
                boxShadow='md'
                cursor='pointer'
                transition='transform 0.3s, box-shadow 0.3s'
                onClick={() => router.push(`/docs/${playbookId}`)}
                _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl'
                }}
            >
                <Card.Body>
                    <Flex flexDirection='column' width='100%'>
                        <HStack justifyContent='space-between'>
                            <Image
                                alt={` ${title} Logo`}
                                className='image-light'
                                width={35}
                                height={35}
                                src={`data:image/png;base64, ${isFilled ? imgSrcFilledLM : imgSrcLM}`}
                            />
                            <Image
                                alt={` ${title} Logo`}
                                className='image-dark'
                                width={35}
                                height={35}
                                src={`data:image/png;base64, ${isFilled ? imgSrcFilledDM : imgSrcDM}`}
                            />
                            <HStack>
                                {VERSION_1_DOMAINS_UUIDS.has(domainId) ? (
                                    <>
                                        <Tooltip showArrow content='Version 1'>
                                            <Circle
                                                size='32px'
                                                border=' 2px solid var(--chakra-colors-fg-info)'
                                                color='#FFFFFF'
                                                marginRight='5px'
                                            >
                                                <Text
                                                    fontSize='15px'
                                                    fontWeight='800'
                                                    color='fg.info'
                                                    marginTop='2px'
                                                >
                                                    V1
                                                </Text>
                                            </Circle>
                                        </Tooltip>
                                        {/* Keep, will render at later date */}
                                        {/* {EARBApproved ? (
                                        <Tooltip hasArrow label='EARB Approved'>
                                            <Circle
                                                size='32px'
                                                bg='#43A34C'
                                                color='#43A34C'
                                                marginRight='5px'
                                                padding='6px'
                                            >
                                                <IconCheck className='platform-card-approved-icon' />
                                            </Circle>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip
                                            hasArrow
                                            label='Pending EARB Approval'
                                        >
                                            <Box height='35px'>
                                                <IconTime
                                                    className='platform-card-pending-icon'
                                                    filled
                                                />
                                            </Box>
                                        </Tooltip>
                                    )} */}
                                    </>
                                ) : (
                                    ''
                                )}
                            </HStack>
                        </HStack>
                        <Box>
                            <Heading
                                size='md'
                                height='45px'
                                fontSize='18px'
                                color='fg.info'
                                marginTop='5px'
                                css={{
                                    display: '-webkit-box',
                                    lineClamp: 2,
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            >
                                {title}
                            </Heading>
                        </Box>
                        <Text
                            marginBottom='5px'
                            height='60px'
                            lineClamp={3}
                            fontSize='12px'
                            fontWeight='400'
                            lineHeight='20px'
                            color='var(--domains-desc-text-color)'
                        >
                            {description}
                        </Text>
                        <Flex
                            marginTop='10px'
                            alignItems='center'
                            className={'platformCard'}
                        >
                            <Box
                                fontSize='12px'
                                lineHeight='8px'
                                className='platform-page-stat-text'
                            >
                                <DomainStatusBadge
                                    playbookId={playbookId}
                                    noContributionStatus={noContributions}
                                />
                            </Box>
                        </Flex>
                    </Flex>
                </Card.Body>
            </Card.Root>
        </GridItem>
    )
}
