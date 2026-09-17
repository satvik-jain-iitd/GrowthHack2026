/* istanbul ignore file */
'use client'
import React from 'react'
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    HStack,
    Stack,
    Badge,
    Text
} from '@chakra-ui/react'
import { IconEdit, IconInfo } from '@americanexpress/dls-icons'
import ExpandableText from '@/app/company-domains/components/LandingPage/ExpandableText'
import { Capability } from '@/app/business-architecture/types'

export function DetailsText({
    capabilityData,
    setIsOpenChangeModal
}: {
    capabilityData: Capability
    setIsOpenChangeModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
    /* l1s and l2s need to show these fields even if they are empty, otherwise, we only need to show if they have data */
    const isLevelOneOrTwo = Number(capabilityData?.capability_level) < 3
    const hasBeginsWith = Boolean(capabilityData?.begins_with_tx?.trim())
    const hasEndsWith = Boolean(capabilityData?.ends_with_tx?.trim())
    const hasIncludes = Boolean(capabilityData?.includes_tx?.trim())
    const showBeginsWith = isLevelOneOrTwo || hasBeginsWith
    const showEndsWith = isLevelOneOrTwo || hasEndsWith
    const showIncludes = isLevelOneOrTwo || hasIncludes
    const descriptorCount = [showBeginsWith, showEndsWith, showIncludes].filter(
        Boolean
    ).length
    const hasDescriptors =
        Boolean(capabilityData) &&
        (isLevelOneOrTwo || showBeginsWith || showEndsWith || showIncludes)

    return (
        <Box
            borderRadius='16px'
            border='2px solid var(--chakra-colors-gray-300, #E2E8F0)'
            backgroundColor={{ base: 'white', _dark: '#27272a' }}
            boxShadow='0 1px 1px 0 rgba(0, 0, 0, 0.10)'
            p={3}
            mt={5}
        >
            <Stack align='flex-end' marginRight={10} my={3}>
                <Badge variant='solid' colorPalette='orange'>
                    <IconInfo color='white' isFilled={false} />
                    Work In Progress
                </Badge>
            </Stack>
            <Box mx='auto' mt={1} px={6}>
                <HStack mb={6} justifyContent={'space-between'}>
                    <Text
                        font='Inter'
                        fontSize='32px'
                        fontWeight='300'
                        lineHeight='20px'
                        textAlign='left'
                        fontFeatureSettings='"liga" off, "clig" off'
                    >
                        {capabilityData?.capability_nm}
                    </Text>
                    <Button
                        colorPalette='blue'
                        variant='outline'
                        onClick={() => setIsOpenChangeModal(true)}
                        borderRadius={'8px'}
                    >
                        <IconEdit color='blue' isFilled={false} />
                        <Text fontWeight={'bold'}>Propose a Change</Text>
                    </Button>
                </HStack>
                {/* box for desc, begins with, ends with */}
                <Box my={5} borderRadius={3}>
                    <Flex>
                        <Box>
                            <Text
                                font='Inter'
                                fontSize='16px'
                                fontStyle={'normal'}
                                fontWeight='700'
                                lineHeight='20px'
                                textAlign='left'
                                fontFeatureSettings='"liga" off, "clig" off'
                            >
                                Description
                            </Text>
                            <Text
                                font='Inter'
                                fontSize='16px'
                                fontStyle={'normal'}
                                fontWeight='400'
                                lineHeight='20px'
                                textAlign='left'
                                fontFeatureSettings='"liga" off, "clig" off'
                            >
                                {capabilityData?.capability_desc_tx || '--'}
                            </Text>
                        </Box>
                    </Flex>
                    {hasDescriptors && (
                        <Grid
                            templateColumns={`repeat(${descriptorCount}, 1fr)`}
                            gap='6'
                            mt={5}
                            mx={2}
                        >
                            {showBeginsWith && (
                                <GridItem colSpan={1}>
                                    <Text
                                        font='Inter'
                                        fontSize='16px'
                                        fontStyle={'normal'}
                                        fontWeight='700'
                                        lineHeight='20px'
                                        textAlign='left'
                                        fontFeatureSettings='"liga" off, "clig" off'
                                    >
                                        Begins With
                                    </Text>
                                    <ExpandableText
                                        font='Inter'
                                        fontSize='16px'
                                        fontStyle={'normal'}
                                        fontWeight='400'
                                        lineHeight='20px'
                                        fontFeatureSettings='"liga" off, "clig" off'
                                        textAlign='left'
                                        whiteSpace='normal'
                                        wordWrap='break-word'
                                        overflowWrap='break-word'
                                        maxLines={6}
                                        textFontSize='16px'
                                        showMoreFontSize='16px'
                                    >
                                        {isLevelOneOrTwo
                                            ? capabilityData?.begins_with_tx ||
                                              '--'
                                            : capabilityData?.begins_with_tx}
                                    </ExpandableText>
                                </GridItem>
                            )}
                            {showEndsWith && (
                                <GridItem colSpan={1}>
                                    <Text
                                        font='Inter'
                                        fontSize='16px'
                                        fontStyle={'normal'}
                                        fontWeight='700'
                                        lineHeight='20px'
                                        textAlign='left'
                                        fontFeatureSettings='"liga" off, "clig" off'
                                    >
                                        Ends With
                                    </Text>
                                    <ExpandableText
                                        font='Inter'
                                        fontSize='16px'
                                        fontStyle={'normal'}
                                        fontWeight='400'
                                        lineHeight='20px'
                                        fontFeatureSettings='"liga" off, "clig" off'
                                        textAlign='left'
                                        whiteSpace='normal'
                                        wordWrap='break-word'
                                        overflowWrap='break-word'
                                        maxLines={6}
                                        textFontSize='16px'
                                        showMoreFontSize='16px'
                                    >
                                        {isLevelOneOrTwo
                                            ? capabilityData?.ends_with_tx ||
                                              '--'
                                            : capabilityData?.ends_with_tx}
                                    </ExpandableText>
                                </GridItem>
                            )}
                            {showIncludes && (
                                <GridItem colSpan={1}>
                                    <Text
                                        font='Inter'
                                        fontSize='16px'
                                        fontStyle={'normal'}
                                        fontWeight='700'
                                        lineHeight='20px'
                                        textAlign='left'
                                        fontFeatureSettings='"liga" off, "clig" off'
                                    >
                                        Includes
                                    </Text>
                                    <ExpandableText
                                        font='Inter'
                                        fontSize='16px'
                                        fontStyle={'normal'}
                                        fontWeight='400'
                                        lineHeight='20px'
                                        fontFeatureSettings='"liga" off, "clig" off'
                                        textAlign='left'
                                        whiteSpace='normal'
                                        wordWrap='break-word'
                                        overflowWrap='break-word'
                                        maxLines={6}
                                        textFontSize='16px'
                                        showMoreFontSize='16px'
                                    >
                                        {isLevelOneOrTwo
                                            ? capabilityData?.includes_tx ||
                                              '--'
                                            : capabilityData?.includes_tx}
                                    </ExpandableText>
                                </GridItem>
                            )}
                        </Grid>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default DetailsText
