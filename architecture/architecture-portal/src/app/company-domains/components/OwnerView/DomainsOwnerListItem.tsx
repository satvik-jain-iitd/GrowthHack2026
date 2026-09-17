import { Center, Text, Image, Table } from '@chakra-ui/react'
import React, { useState } from 'react'
import styles from '../../domains-page.module.scss'
import { useNavigation } from '@/hooks'
import { AvatarTableRow } from '@/components/ui'
import { DOMAIN_TEST_IDS } from '../../test-ids'

interface Props {
    group: string
    title: string
    playbookId: string
    imgSrcDM: string
    imgSrcLM: string
    imgSrcFilledDM: string
    imgSrcFilledLM: string
    unitCIO: string
    techOwner: string
    principalArchitect: string
    enterpriseArchitect: string
    headEngineer: string
    unitCIODelegate: string
}

export const DomainsOwnerListItem = ({
    group,
    title,
    playbookId,
    imgSrcDM,
    imgSrcLM,
    imgSrcFilledDM,
    imgSrcFilledLM,
    unitCIO,
    techOwner,
    principalArchitect,
    enterpriseArchitect,
    headEngineer,
    unitCIODelegate
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
                    className='image-light'
                    height='35px'
                    width='35px'
                    src={`data:image/png;base64, ${isFilled ? imgSrcFilledLM : imgSrcLM}`}
                />
                <Image
                    alt={`${title} Logo`}
                    className='image-dark'
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
                        data-testid={DOMAIN_TEST_IDS.ownerTableItemTitle}
                    >
                        {title}
                    </Text>
                </Center>
            </Table.Cell>
            <Table.Cell whiteSpace='normal' wordWrap='break-word'>
                <Text lineClamp='3'>{group}</Text>
            </Table.Cell>
            <Table.Cell>
                <AvatarTableRow
                    nameWidth='120px'
                    email={unitCIO}
                    showOpen
                    bgColor='gray.emphasized'
                />
            </Table.Cell>
            <Table.Cell>
                <AvatarTableRow
                    nameWidth='120px'
                    email={techOwner}
                    showOpen
                    bgColor='gray.emphasized'
                />
            </Table.Cell>
            <Table.Cell>
                <AvatarTableRow
                    nameWidth='120px'
                    email={headEngineer}
                    showOpen
                    bgColor='gray.emphasized'
                />
            </Table.Cell>
            <Table.Cell>
                <AvatarTableRow
                    nameWidth='120px'
                    email={principalArchitect}
                    showOpen
                    bgColor='gray.emphasized'
                />
            </Table.Cell>
            <Table.Cell>
                <AvatarTableRow
                    nameWidth='120px'
                    email={enterpriseArchitect}
                    showOpen
                    bgColor='gray.emphasized'
                />
            </Table.Cell>
            <Table.Cell>
                <Text
                    fontStyle='italic'
                    whiteSpace='normal'
                    wordWrap='break-word'
                >
                    {unitCIODelegate?.toString().toLowerCase() === 'open' ||
                    unitCIODelegate?.toString().toLowerCase() === ''
                        ? 'Open'
                        : unitCIODelegate}
                </Text>
            </Table.Cell>
        </Table.Row>
    )
}
