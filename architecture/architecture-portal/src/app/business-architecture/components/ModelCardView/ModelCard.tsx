/* istanbul ignore file */
import React, { ReactNode, useState } from 'react'
import { Text, Flex, Box, Heading, Card, GridItem } from '@chakra-ui/react'
import {
    IconBarChart,
    IconBusiness,
    IconCard,
    IconChange,
    IconDesktop,
    IconDollar,
    IconFaceid,
    IconPieChart,
    IconRefer,
    IconSavings,
    IconSecurity
} from '@americanexpress/dls-icons'
import Image from 'next/image'
import { capabilityIcons, colors } from '../../constants'
import { NoPrefetchLink } from '@/components/ui/NoPrefetchLink'

const icons: Record<number, (filled: boolean) => ReactNode> = {
    0: (filled: boolean) => (
        <IconCard
            style={{ fontSize: '38px', height: '38px' }}
            color='brand.primary'
            isFilled={filled}
        />
    ),
    1: (filled: boolean) => (
        <IconChange
            style={{ fontSize: '38px', height: '38px' }}
            color='brand.primary'
            isFilled={filled}
        />
    ),
    2: (filled: boolean) => (
        <IconBusiness
            style={{ fontSize: '38px', height: '38px' }}
            color='brand.primary'
            isFilled={filled}
        />
    ),
    3: (filled: boolean) => (
        <Image
            alt={`Logo`}
            className='image-light'
            width={35}
            height={35}
            src={`data:image/png;base64, ${filled ? capabilityIcons['lending'].filled : capabilityIcons['lending'].outline}`}
        />
    ),
    4: (filled: boolean) => (
        <IconSavings
            style={{ fontSize: '38px', height: '38px' }}
            color='brand.primary'
            isFilled={filled}
        />
    ),
    5: (filled: boolean) => (
        <Image
            alt={`Logo`}
            className='image-light'
            width={35}
            height={35}
            src={`data:image/png;base64, ${filled ? capabilityIcons['loyalty'].filled : capabilityIcons['loyalty'].outline}`}
        />
    ),
    6: (filled: boolean) => (
        <Image
            alt={`Logo`}
            className='image-light'
            width={35}
            height={35}
            src={`data:image/png;base64, ${filled ? capabilityIcons['servicing'].filled : capabilityIcons['servicing'].outline}`}
        />
    ),
    7: (filled: boolean) => (
        <IconPieChart
            style={{ fontSize: '38px', height: '38px' }}
            color='brand.primary'
            isFilled={filled}
        />
    ),
    8: (filled: boolean) => (
        <IconDollar
            style={{ fontSize: '38px', height: '38px' }}
            color='brand.primary'
            isFilled={filled}
        />
    ),
    9: (filled: boolean) => (
        <IconBarChart
            style={{ fontSize: '38px', height: '38px' }}
            color='brand.primary'
            isFilled={filled}
        />
    ),
    10: (filled: boolean) => (
        <IconRefer
            style={{ fontSize: '38px', height: '38px' }}
            color='brand.primary'
            isFilled={filled}
        />
    ),
    11: (filled: boolean) => (
        <IconDesktop
            style={{ fontSize: '38px', height: '38px' }}
            color='brand.primary'
            isFilled={filled}
        />
    ),
    12: (filled: boolean) => (
        <IconFaceid
            style={{ fontSize: '38px', height: '38px' }}
            color='brand.primary'
            isFilled={filled}
        />
    ),
    13: (filled: boolean) => (
        <IconSecurity
            style={{ fontSize: '38px', height: '38px' }}
            color='brand.primary'
            isFilled={filled}
        />
    ),
    14: (filled: boolean) => (
        <IconDollar
            style={{ fontSize: '38px', height: '38px' }}
            color='brand.primary'
            isFilled={filled}
        />
    )
}

interface Props {
    title: string
    description: string
    capId: string
    index: number
}

export function ModelCard({ title, description, capId, index }: Props) {
    const [isFilled, setFilled] = useState(false)

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
                _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl'
                }}
                id={`capability-card-${index}`}
            >
                <Card.Body>
                    <NoPrefetchLink
                        href={`/business-architecture/model/${capId}`}
                    >
                        <Flex flexDirection='column' width='100%'>
                            <Box
                                borderTop={`4px solid ${colors[capId][0] ?? '#ccc'}`}
                                mb={4}
                            />
                            <Box>
                                <Flex>{icons[index](isFilled)}</Flex>
                                <Heading
                                    size='md'
                                    height='45px'
                                    fontSize='20px'
                                    color='fg.info'
                                    marginTop={3}
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
                            {/* <Box
                            borderTop={`4px solid ${colors[capId][0] ?? '#ccc'}`}
                            mb={3}
                            mt={3}
                        /> */}
                            <Text
                                marginBottom='5px'
                                marginTop='15px'
                                height='60px'
                                lineClamp={3}
                                fontSize='14px'
                                fontWeight='400'
                                lineHeight='20px'
                                color='var(--domains-desc-text-color)'
                            >
                                {description}
                            </Text>
                        </Flex>
                    </NoPrefetchLink>
                </Card.Body>
            </Card.Root>
        </GridItem>
    )
}
