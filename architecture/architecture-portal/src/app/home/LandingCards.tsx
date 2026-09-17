'use client'
import React, { useState } from 'react'
import { Box, SimpleGrid, Text, Flex, Link } from '@chakra-ui/react'
import { useNavigation } from '@/hooks'
import { NoPrefetchLink as NextLink } from '@/components/ui'
import Image from 'next/image'
import { PLAYBOOK_TYPE_IDS } from '@/constants'

type ProductListItem = {
    title: string
    id?: string
    imgSrc: string
    filledImgSrc: string
    darkImgSrc: string
    darkFilledImgSrc: string
    link: string
    target?: string
    description: string
    links: {
        label: string
        link: string
        target?: string
    }[]
}

const products: ProductListItem[] = [
    {
        title: 'Initiatives',
        imgSrc: '/products/initiatives_icon.png',
        filledImgSrc: '/products/Initiatives_iconfilled.png',
        darkImgSrc: '/products/DarkInitiatives_icon.png',
        darkFilledImgSrc: '/products/DarkInitiatives_iconfilled.png',
        link: '/initiatives',
        description:
            'Architecture / Design of Enterprise Top Programs / Other initiatives.',
        links: [
            { label: 'View Initiatives', link: '/initiatives' },
            {
                label: 'Onboard Initiative',
                link: `/onboarding-form?type=${PLAYBOOK_TYPE_IDS.INITIATIVE}`
            }
        ]
    },
    {
        title: 'Company Domains',
        imgSrc: '/products/PlatformsLogo.png',
        filledImgSrc: '/products/domain_fillicon.png',
        darkImgSrc: '/products/darkdomain_icon.png',
        darkFilledImgSrc: '/products/darkdomain_fillicon.png',
        link: '/company-domains',
        description:
            'Architecture / Design of Subdomains within well defined company domains / boundaries.',
        links: [
            { label: 'View Company Domains', link: '/company-domains' },
            {
                label: 'Onboard Subdomain',
                link: `/onboarding-form?type=${PLAYBOOK_TYPE_IDS.COMPANY_SUBDOMAIN}`
            }
        ]
    },
    {
        title: 'Enterprise Business Capabilty Model',
        imgSrc: '/products/StandardsComplianceLogo.png',
        filledImgSrc: '/products/standard_fillicon.png',
        darkImgSrc: '/products/darkstandards_icon.png',
        darkFilledImgSrc: '/products/darkstandard_fillicon.png',
        link: '/business-architecture',
        description:
            'Enterprise-standardized business capability model that defines "WHAT" Amex does, independent of systems, organization, or data.',
        links: [
            {
                label: 'View EBCM v10',
                link: '/business-architecture'
            }
        ]
    },
    {
        title: 'Enterprise Customer Journeys',
        id: 'customer-journeys',
        imgSrc: '/products/CustomerJourneysLogo.png',
        filledImgSrc: '/products/customer_fillicon.png',
        darkImgSrc: '/products/darkcustomer_icon.png',
        darkFilledImgSrc: '/products/darkcustomer_fillicon.png',
        link: '/enterprise-customer-journeys',
        description:
            'Architecture inventory of top-level customer journeys and personas representing end-to-end experiences across the enterprise.',
        links: [
            {
                label: 'View Customer Journeys',
                link: '/enterprise-customer-journeys'
            }
        ]
    },
    {
        title: 'Foundational Technologies Catalog',
        imgSrc: '/products/FoundationalAssetsLogo.png',
        filledImgSrc: '/products/foundational_fillicon.png',
        darkImgSrc: '/products/darkfoundational_icon.png',
        darkFilledImgSrc: '/products/darkfoundational_fillicon.png',
        link: '/foundational-technologies',
        description:
            'Foundational Technologies and Reusable Components that scale across the Enterprise.',
        links: [
            {
                label: 'View Foundational Technologies',
                link: '/foundational-technologies'
            }
        ]
    },
    {
        title: 'Standards & Compliance',
        imgSrc: '/products/StandardsComplianceLogo.png',
        filledImgSrc: '/products/standard_fillicon.png',
        darkImgSrc: '/products/darkstandards_icon.png',
        darkFilledImgSrc: '/products/darkstandard_fillicon.png',
        link: '/standards-and-compliance',
        description:
            'Established guidelines, regulations, and best practices for the Enterprise.',
        links: [
            {
                label: 'View Standards & Compliance',
                link: '/standards-and-compliance'
            }
        ]
    },
    {
        title: 'Architecture Decision Records',
        imgSrc: '/products/EnterpriseAdrLogo.png',
        filledImgSrc: '/products/adr_fillicon.png',
        darkImgSrc: '/products/darkadr_icon.png',
        darkFilledImgSrc: '/products/darkadr_fillicon.png',
        link: '/adrs',
        description:
            'Collection of decision records that capture architectural decisions.',
        links: [
            {
                label: 'View Decision Records',
                link: '/adrs'
            }
        ]
    },
    {
        title: 'Architecture Governance',
        imgSrc: '/products/ArchitectureGovernance.png',
        filledImgSrc: '/products/GovernanceFilled.png',
        darkImgSrc: '/products/darkfile-protect.png',
        darkFilledImgSrc: '/products/darkfile-protect filled.png',
        link: `https://architecture.aexp.com/governance`,
        target: '_blank',
        description:
            'Measurements and Compliance to architecture standards and regulations.',
        links: [
            {
                label: 'Well-Architected Scorecards',
                link: `https://architecture.aexp.com/governance`,
                target: '_blank'
            },
            {
                label: 'Enterprise Architecture Review Board',
                link: `https://architecture.aexp.com/governance/enterprise-arb`,
                target: '_blank'
            }
        ]
    },
    {
        title: 'Reference Architecture',
        imgSrc: '/products/ReferenceArchitectureLogo.png',
        filledImgSrc: '/products/reference_fillicon.png',
        darkImgSrc: '/products/darkreference_icon.png',
        darkFilledImgSrc: '/products/darkreference_fillicon.png',
        link: '/reference-architecture',
        description:
            'Reference Architecture or Blueprint for a specific problem or concern.',
        links: [
            {
                label: 'View Reference Architecture',
                link: '/reference-architecture'
            }
        ]
    },
    {
        title: 'Build vs Buy',
        imgSrc: '/products/buildvsbuy_icon.png',
        filledImgSrc: '/products/buildvsbuy_filledicon.png',
        darkImgSrc: '/products/darkbuildvsbuy_icon.png',
        darkFilledImgSrc: '/products/darkbuildvsbuy_filledcon.png',
        link: '/build-vs-buys',
        description:
            'Framework and Decision Record for Building vs Buying vs Reusing in Amex.',
        links: [
            {
                label: 'View Build vs Buy',
                link: '/build-vs-buys'
            },
            {
                label: 'Onboard Build vs Buy',
                link: `/onboarding-form?type=${PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}`
            }
        ]
    }
]

export function LandingCards() {
    const router = useNavigation()
    const [filled, setFilled] = useState<string | undefined>(undefined)

    return (
        <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            gap={6}
            alignItems='stretch'
        >
            {products.map(product => (
                <Box
                    key={product.title}
                    width='100%'
                    minH='280px'
                    padding={6}
                    borderRadius='lg'
                    border='1px solid'
                    borderColor='border'
                    boxShadow='md'
                    cursor='pointer'
                    display='flex'
                    flexDirection='column'
                    transition='transform 0.3s, box-shadow 0.3s'
                    onMouseEnter={() => setFilled(product.title)}
                    onMouseLeave={() => setFilled(undefined)}
                    onClick={() => {
                        if (product.target === '_blank') {
                            window.open(product.link, '_blank', 'noopener')
                        } else {
                            router.push(product.link)
                        }
                    }}
                    bgColor={{
                        _dark: 'bg.emphasized'
                    }}
                    _hover={{
                        boxShadow: 'xl',
                        transform: 'translateY(-4px)'
                    }}
                >
                    <Box mb={2} display='flex' justifyContent='left'>
                        {filled === product.title ? (
                            <>
                                <Image
                                    src={product.darkFilledImgSrc}
                                    alt={`${product.title} filled icon`}
                                    className='image-dark'
                                    width={48}
                                    height={48}
                                />
                                <Image
                                    src={product.filledImgSrc}
                                    alt={`${product.title} filled icon`}
                                    className='image-light'
                                    width={48}
                                    height={48}
                                />
                            </>
                        ) : (
                            <>
                                <Image
                                    src={product.darkImgSrc}
                                    alt={`${product.title} icon`}
                                    className='image-dark'
                                    width={48}
                                    height={48}
                                />
                                <Image
                                    src={product.imgSrc}
                                    alt={`${product.title} icon`}
                                    className='image-light'
                                    width={48}
                                    height={48}
                                />
                            </>
                        )}
                    </Box>
                    <Text
                        fontSize='xl'
                        color='fg'
                        mb={1}
                        textAlign='left'
                        minH='64px'
                        css={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {product.title}
                    </Text>
                    <Text
                        fontSize='sm'
                        color='fg.muted'
                        mb={2}
                        textAlign='left'
                        minH='80px'
                        css={{
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {product.description}
                    </Text>
                    <Flex mt='auto' direction='column' align='left' gap={2}>
                        {product.links.map(linkObj => (
                            // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                            <Link
                                as={NextLink}
                                key={linkObj.label}
                                href={linkObj.link}
                                target={linkObj.target}
                                textDecoration='none'
                                color='fg.info'
                                width='fit-content'
                                _hover={{ textDecoration: 'underline' }}
                                _focus={{
                                    outline: 'none',
                                    boxShadow: 'none'
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                }}
                            >
                                {linkObj.label}
                            </Link>
                        ))}
                    </Flex>
                </Box>
            ))}
        </SimpleGrid>
    )
}
