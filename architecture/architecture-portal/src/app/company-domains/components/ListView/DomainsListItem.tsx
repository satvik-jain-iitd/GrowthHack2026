import { Table, Center, Text, Circle, Box, Image } from '@chakra-ui/react'
import React, { useState } from 'react'
import { VERSION_1_DOMAINS_UUIDS } from '../../constants'
import { DomainCategory } from '../../types/domains'
import { Tooltip } from '@/components/ui'
import styles from '../../domains-page.module.scss'
import { IconTime, IconCheck } from '@americanexpress/dls-icons'
import { useNavigation } from '@/hooks'
import { DomainStatusBadge } from '../DomainStatusBadge'

interface Props {
    category: DomainCategory
    title: string
    imgSrcDM: string
    imgSrcLM: string
    imgSrcFilledDM: string
    imgSrcFilledLM: string
    noContributions: boolean
    description: string
    domainId: string
    EARBApproved: boolean
    playbookId: string
    isV1?: boolean
}

export const DomainsListItem = ({
    category,
    title,
    imgSrcDM,
    imgSrcLM,
    imgSrcFilledDM,
    imgSrcFilledLM,

    noContributions,
    description,
    domainId,
    EARBApproved,
    playbookId,
    //eslint-disable-next-line
    isV1
}: Props) => {
    const router = useNavigation()
    const [isFilled, setFilled] = useState(false)
    return (
        <Table.Row
            className={styles.domainListView__item}
            backgroundColor={{ base: 'white', _dark: '#27272a' }}
            onClick={() => router.push(`/docs/${playbookId}`)}
            onMouseEnter={() => setFilled(true)}
            onMouseLeave={() => setFilled(false)}
            height='64px'
        >
            <Table.Cell
                display='flex'
                flexDirection='row'
                height='64px'
                minW='15rem'
            >
                <Image
                    alt={`${title} Logo`}
                    className='margin-1-b image-light'
                    height='35px'
                    width='35px'
                    src={`data:image/png;base64, ${isFilled ? imgSrcFilledLM : imgSrcLM}`}
                />
                <Image
                    alt={`${title} Logo`}
                    className='margin-1-b image-dark'
                    height='35px'
                    width='35px'
                    src={`data:image/png;base64, ${isFilled ? imgSrcFilledDM : imgSrcDM}`}
                />
                <Center>
                    <Text
                        color='fg.info'
                        fontWeight='550'
                        marginLeft='20px'
                        whiteSpace='normal'
                        wordWrap='break-word'
                    >
                        {title}
                    </Text>
                </Center>
            </Table.Cell>
            <Table.Cell color='fg'>{category}</Table.Cell>
            <Table.Cell color='fg'>
                <Text whiteSpace='normal' wordWrap='break-word'>
                    {description}
                </Text>
            </Table.Cell>
            <Table.Cell justifyItems='center'>
                {VERSION_1_DOMAINS_UUIDS.has(domainId) ? (
                    <Tooltip showArrow content='Version 1'>
                        <Circle
                            size='32px'
                            border={{
                                base: '2px solid #006fcf',
                                _dark: '2px solid #61c5ff'
                            }}
                            color='#FFFFFF'
                        >
                            <Text
                                color={{ base: '#006fcf', _dark: '#61c5ff' }}
                                fontSize='15px'
                                fontWeight='800'
                            >
                                V1
                            </Text>
                        </Circle>
                    </Tooltip>
                ) : (
                    <Tooltip showArrow content='Evolving'>
                        <Circle
                            size='32px'
                            border='2px solid #8E9092'
                            color='#FFFFFF'
                        >
                            <Text
                                fontSize='15px'
                                fontWeight='800'
                                color='#8E9092'
                            >
                                E
                            </Text>
                        </Circle>
                    </Tooltip>
                )}
            </Table.Cell>
            {false && ( //TODO: Replace with isV1 when ready to display
                <Table.Cell justifyContent='center'>
                    {EARBApproved ? (
                        <Tooltip showArrow content='EARB Approved'>
                            <Circle
                                size='32px'
                                bg='#43A34C'
                                color='#43A34C'
                                marginRight='5px'
                                padding='6px'
                            >
                                <IconCheck
                                    className={styles.domainApprovedIcon}
                                />
                            </Circle>
                        </Tooltip>
                    ) : (
                        <Tooltip showArrow content='Pending EARB Approval'>
                            <Box height='35px'>
                                <IconTime
                                    isFilled
                                    className='pendingReviewIcon'
                                />
                            </Box>
                        </Tooltip>
                    )}
                </Table.Cell>
            )}
            <Table.Cell>
                <DomainStatusBadge
                    playbookId={playbookId}
                    noContributionStatus={noContributions}
                />
            </Table.Cell>
        </Table.Row>
    )
}
