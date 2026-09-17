'use client'
import {
    Accordion,
    Box,
    Button,
    Center,
    Flex,
    HStack,
    IconButton,
    Text,
    useClipboard,
    VStack
} from '@chakra-ui/react'
import Image from 'next/image'
import { IconCheck, IconCopy } from '@americanexpress/dls-icons'
import {
    ARCH_PORTAL_ENTITLEMENT,
    ARCH_PORTAL_HELP_SLACK_URL
} from '@/constants'
import { NoPrefetchLink as Link } from '@/components/ui'

export function AccessRequired() {
    const clipboard = useClipboard({ value: ARCH_PORTAL_ENTITLEMENT })

    return (
        <Center className='page-content' px={8}>
            <Box
                maxW='xl'
                w='full'
                p={8}
                borderRadius='2xl'
                boxShadow='md'
                bg='bg.subtle'
                border='1px solid'
                borderColor='border'
            >
                <VStack gap={6} align='stretch'>
                    <HStack gap={2} justify='center'>
                        <Image
                            src='/ArchitecturePortalLogo.svg'
                            alt='Architecture Portal Logo'
                            width={28}
                            height={28}
                        />
                        <Text
                            color={{ base: '#00175a', _dark: '#1a88e9ff' }}
                            fontWeight='bold'
                            fontSize='2xl'
                        >
                            Architecture Portal
                        </Text>
                    </HStack>

                    <Text
                        fontSize='xl'
                        color='fg.info'
                        textAlign='center'
                        data-testid='access-required-heading'
                    >
                        Access to the Architecture Portal requires additional
                        authorization.
                    </Text>

                    <VStack gap={3} align='stretch'>
                        <Text color='fg.muted' fontSize='md'>
                            Additional authorization is required to access this
                            application. Please submit an access request through
                            IIQ for the required entitlement. Once the request
                            has been approved, return to the Architecture Portal
                            and{' '}
                            <Button
                                variant='plain'
                                height='auto'
                                padding={0}
                                fontSize='md'
                                color='fg.info'
                                onClick={() => window.location.reload()}
                                data-testid='access-required-signin'
                            >
                                sign in again
                            </Button>
                            .
                        </Text>
                    </VStack>

                    <Flex align='center' justify='space-between' gap={2}>
                        <Box>
                            <Text fontSize='sm' color='fg.muted'>
                                Access to request
                            </Text>
                            <Text
                                fontSize='sm'
                                fontFamily='mono'
                                wordBreak='break-all'
                                data-testid='access-required-entitlement'
                            >
                                {ARCH_PORTAL_ENTITLEMENT}
                            </Text>
                        </Box>
                        <IconButton
                            aria-label='Copy entitlement name'
                            title='Copy entitlement name'
                            variant='ghost'
                            size='xs'
                            onClick={() => clipboard.copy()}
                            data-testid='access-required-copy'
                        >
                            {clipboard.copied ? (
                                <IconCheck color='success' size='xs' />
                            ) : (
                                <IconCopy size='xs' />
                            )}
                        </IconButton>
                    </Flex>

                    <Accordion.Root collapsible>
                        <Accordion.Item value='why' border='none'>
                            <Accordion.ItemTrigger
                                display='inline-flex'
                                alignItems='center'
                                gap='4px'
                                padding='2px 0'
                                cursor='pointer'
                                fontSize='md'
                                color='fg'
                                _hover={{ color: 'fg.info' }}
                                data-testid='access-required-why-trigger'
                            >
                                Why is access restricted?
                                <Accordion.ItemIndicator />
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent pt={2} px={0}>
                                <Accordion.ItemBody p={0}>
                                    <Text
                                        fontSize='sm'
                                        color='fg.muted'
                                        data-testid='access-required-why-content'
                                    >
                                        In compliance with American Express Data
                                        Policy and to limit excessive visibility
                                        of sensitive architecture artifacts and
                                        reduce insider risk, access to
                                        Architecture Portal is now more governed
                                        based on the guidelines of &quot;need to
                                        know&quot; &quot;least privileged
                                        access&quot; principles.
                                    </Text>
                                </Accordion.ItemBody>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    </Accordion.Root>

                    <Text fontSize='sm' color='fg.muted' textAlign='center'>
                        Need help? Visit{' '}
                        <Link
                            target='_blank'
                            rel='noopener noreferrer'
                            href={ARCH_PORTAL_HELP_SLACK_URL}
                            data-testid='access-required-slack-link'
                            style={{ textDecoration: 'underline' }}
                        >
                            #arch-portal-help
                        </Link>
                    </Text>
                </VStack>
            </Box>
        </Center>
    )
}
