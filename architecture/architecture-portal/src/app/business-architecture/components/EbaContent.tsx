/* istanbul ignore file */
import {
    Box,
    Highlight,
    Text,
    VStack,
    Collapsible,
    Grid,
    GridItem,
    Card,
    Avatar,
    Button,
    HStack,
    List,
    useCollapsible,
    Dialog
} from '@chakra-ui/react'
import {
    IconBusiness,
    IconChevronRight,
    IconHelp,
    IconSendAndSplit
} from '@americanexpress/dls-icons'
import Image from 'next/image'
import { HowItConnects } from './HowItConnects'
import { ModelCardView } from './ModelCardView'
import { useState } from 'react'
import { NoPrefetchLink } from '@/components/ui'
import { BAChangeModal } from '@/app/business-architecture/components/BAChangeModal'
import { useSubmitBAChangeModalRequest } from '@/app/business-architecture/hooks'

export const EbaContent = () => {
    const [enlargeImage, setEnlargeImage] = useState<string | null>(null)
    const collapsible = useCollapsible()

    const [isOpenChangeModal, setIsOpenChangeModal] = useState(false)
    const { handleSubmitBAChangeModal, isSubmitting } =
        useSubmitBAChangeModalRequest('EBA')

    const scrollToEBCM = () => {
        const ebcmElement = document.getElementById('EBCM')
        if (ebcmElement) {
            ebcmElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }

    return (
        <>
            <Box
                backgroundColor={{
                    base: 'surface.white',
                    _dark: 'surface.default.offwhite'
                }}
                width='100%'
                maxH='500px'
                height='100%'
                px={{ base: '10px', md: '5%', xl: '10vw' }}
            >
                <HStack justifyContent='space-between'>
                    <Box maxWidth={{ base: '100%', md: '40%' }} marginY={10}>
                        <Text fontSize='20px'>
                            <Highlight
                                query='Enterprise Business Capability Model (EBCM)'
                                styles={{
                                    fontWeight: 'bold',
                                    color: 'text.brand'
                                }}
                            >
                                Enterprise Business Capability Model (EBCM)
                            </Highlight>{' '}
                            is the enterprise blueprint defining what AXP does -
                            independent of organization, processes, or systems.
                            Business capabilities are stable, outcome-driven
                            building blocks that power products, platforms, and
                            customer experiences across the enterprise.
                        </Text>
                        <HStack gap={4} marginBottom={0} marginTop={5}>
                            <Button
                                borderRadius={7}
                                bg='interactive.primary.default'
                                fontWeight={505}
                                _hover={{
                                    bg: 'interactive.primary.hover',
                                    color: 'white'
                                }}
                                onClick={event => {
                                    event?.preventDefault()
                                    scrollToEBCM()
                                }}
                            >
                                Explore The Model
                            </Button>
                            <NoPrefetchLink href='/enterprise-business-architecture/business-architecture-modeling-standards'>
                                <Button
                                    borderRadius={7}
                                    fontWeight={505}
                                    color='text.brand'
                                    borderColor='border.brand'
                                    variant='outline'
                                    _hover={{
                                        bg: 'interactive.tertiary.hover'
                                    }}
                                >
                                    EBC Standards
                                </Button>
                            </NoPrefetchLink>
                        </HStack>
                    </Box>
                    <Box
                        alignItems='flex-end'
                        maxW='680px'
                        paddingY={3}
                        marginRight={8}
                    >
                        <video
                            src='https://cdaas.aexp.com/enterprise-architecture/EBCM_Training.mp4'
                            controls
                            style={{
                                width: '100%',
                                height: 'auto'
                            }}
                        />
                    </Box>
                </HStack>
            </Box>
            <Box
                px={{ base: '10px', md: '5%', xl: '10vw' }}
                paddingBottom={collapsible.open ? 3 : 12}
                paddingTop={3}
                width='100%'
                borderBottom='4px solid #FDB92D'
                alignItems='center'
                bg={{
                    _dark: 'surface.white',
                    base: 'surface.default.offwhite'
                }}
            >
                <Collapsible.Root width='100%' defaultOpen>
                    <Collapsible.Trigger
                        paddingY='3'
                        display='flex'
                        gap='2'
                        alignItems='center'
                        onClick={() => collapsible.setOpen(!collapsible.open)}
                        _hover={{ cursor: 'pointer' }}
                    >
                        <Collapsible.Indicator
                            transition='transform 0.2s'
                            _open={{ transform: 'rotate(90deg)' }}
                            paddingBottom={1}
                        >
                            <IconChevronRight
                                isFilled
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    fontSize: '24px'
                                }}
                            />
                        </Collapsible.Indicator>
                        <Text
                            font='BentonSans'
                            fontSize='24px'
                            fontWeight={500}
                            marginLeft={2}
                        >
                            Learn More about EBCM
                        </Text>
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                        <Grid
                            templateColumns={{
                                base: 'repeat(1, 1fr)',
                                md: 'repeat(3, 1fr)'
                            }}
                            gap={{ base: 5, lg: 10 }}
                            maxWidth='2070px'
                            alignSelf='center'
                        >
                            <GridItem colSpan={1}>
                                <Card.Root
                                    borderRadius='17px'
                                    borderColor='none'
                                    width='100%'
                                    maxW='585px'
                                    height='100%'
                                    backgroundColor={{
                                        base: 'white',
                                        _dark: 'surface.default.offwhite'
                                    }}
                                >
                                    <Card.Body gap='2'>
                                        <Card.Title mt='2'>
                                            <HStack>
                                                <Avatar.Root
                                                    size='lg'
                                                    backgroundColor='status.informationSubtle'
                                                >
                                                    <IconHelp
                                                        color='brand'
                                                        style={{
                                                            width: '31px',
                                                            height: '31px',
                                                            fontSize: '31px'
                                                        }}
                                                        isFilled={false}
                                                        title='Example description applied to icon'
                                                        titleId='unique-id-for-IconHelp-title'
                                                    />
                                                </Avatar.Root>
                                                <Text fontSize='24px'>
                                                    Why It Matters
                                                </Text>
                                            </HStack>
                                        </Card.Title>
                                        {/* <Card.Description
                                            paddingX='4rem'
                                            paddingTop={3}
                                        > */}
                                        <List.Root
                                            font='bentonSans'
                                            textStyle={{
                                                base: 'lg',
                                                lg: 'xl',
                                                xl: '2xl'
                                            }}
                                            lineHeight='24px'
                                            color='text.regular'
                                            paddingX={{
                                                base: '4rem',
                                                lg: '2rem'
                                            }}
                                            paddingTop={3}
                                        >
                                            <List.Item marginBottom={3}>
                                                {`EBCM creates a single, stable
                                                view of our enterprise
                                                capabilities, eliminating
                                                fragmentation and enabling
                                                faster, clearer decisions.`}
                                            </List.Item>
                                            <List.Item marginBottom={3}>
                                                {`EBCM unlocks High-Value
                                                Enterprise Transformation -
                                                powering capability-driven API
                                                and platform strategy, developer
                                                experiences, M&A integration, long-term
                                                funding and modernization.`}
                                            </List.Item>
                                        </List.Root>
                                        {/* </Card.Description> */}
                                    </Card.Body>
                                </Card.Root>
                            </GridItem>
                            <GridItem colSpan={1}>
                                <Card.Root
                                    borderRadius='17px'
                                    borderColor='none'
                                    width='100%'
                                    maxW='585px'
                                    height='100%'
                                    onClick={() => setEnlargeImage('connects')}
                                    _hover={{ cursor: 'pointer' }}
                                    backgroundColor={{
                                        base: 'white',
                                        _dark: 'surface.default.offwhite'
                                    }}
                                >
                                    <Card.Body gap='2'>
                                        <Card.Title mt='2'>
                                            <HStack>
                                                <Avatar.Root
                                                    size='lg'
                                                    backgroundColor='status.informationSubtle'
                                                >
                                                    <IconSendAndSplit
                                                        color='brand'
                                                        style={{
                                                            width: '31px',
                                                            height: '31px',
                                                            fontSize: '31px'
                                                        }}
                                                        isFilled={false}
                                                    />
                                                </Avatar.Root>
                                                <Text fontSize='24px'>
                                                    How It Connects
                                                </Text>
                                            </HStack>
                                        </Card.Title>
                                        {/* <Card.Description
                                        > */}
                                        <HowItConnects />
                                        <Text
                                            color='text.link'
                                            width='fit-content'
                                            onClick={() =>
                                                setEnlargeImage('connects')
                                            }
                                            alignSelf='flex-end'
                                            marginTop={3}
                                            marginLeft={3}
                                            _hover={{ cursor: 'pointer' }}
                                            fontSize='14px'
                                        >
                                            Click To Enlarge
                                        </Text>
                                        {/* </Card.Description> */}
                                    </Card.Body>
                                </Card.Root>
                            </GridItem>
                            <GridItem colSpan={1}>
                                <Card.Root
                                    borderRadius='17px'
                                    borderColor='none'
                                    width='100%'
                                    maxW='585px'
                                    height='100%'
                                    onClick={() =>
                                        setEnlargeImage('governance')
                                    }
                                    _hover={{ cursor: 'pointer' }}
                                    backgroundColor={{
                                        base: 'white',
                                        _dark: 'surface.default.offwhite'
                                    }}
                                >
                                    <Card.Body gap='2'>
                                        <Card.Title mt='2' mb={6}>
                                            <HStack>
                                                <Avatar.Root
                                                    size='lg'
                                                    backgroundColor='status.informationSubtle'
                                                >
                                                    <IconBusiness
                                                        color='brand'
                                                        style={{
                                                            width: '31px',
                                                            height: '31px',
                                                            fontSize: '31px'
                                                        }}
                                                        isFilled={false}
                                                    />
                                                </Avatar.Root>
                                                <Text fontSize='24px'>
                                                    Governance & Stewardship
                                                </Text>
                                            </HStack>
                                        </Card.Title>
                                        {/* <Card.Description paddingTop={6}> */}
                                        <Image
                                            alt='Governance Model'
                                            width={0}
                                            height={0}
                                            sizes='100vw'
                                            style={{
                                                width: '100%',
                                                height: 'auto'
                                            }}
                                            src='/business-architecture/governance-model.png'
                                        />
                                        <Text
                                            color='text.link'
                                            width='fit-content'
                                            onClick={() =>
                                                setEnlargeImage('governance')
                                            }
                                            alignSelf='flex-end'
                                            marginTop={3}
                                            marginLeft={3}
                                            _hover={{ cursor: 'pointer' }}
                                            fontSize='14px'
                                        >
                                            Click To Enlarge
                                        </Text>
                                        {/* </Card.Description> */}
                                    </Card.Body>
                                </Card.Root>
                            </GridItem>
                        </Grid>
                    </Collapsible.Content>
                </Collapsible.Root>
            </Box>
            <Box
                bg='surface.white/black'
                width='100%'
                className='flex-item-growmargin-3-t'
                paddingLeft='10vw'
                paddingRight='10vw'
                id='EBCM'
                display='flex'
                flexDirection='column'
                alignItems='center'
            >
                <Box position='relative' marginY={3} width='fit-content'>
                    <VStack alignItems='flex-start'>
                        <Text
                            style={{
                                whiteSpace: 'nowrap',
                                paddingTop: '10px',
                                font: 'BentonSans',
                                fontSize: '32px',
                                fontWeight: 400,
                                lineHeight: '44px',
                                textAlign: 'center'
                            }}
                        >
                            Enterprise Business Capability Model
                        </Text>
                        <Text
                            fontSize='16px'
                            fontWeight='400'
                            lineHeight='24px'
                            textAlign='left'
                            width={{ base: '100%', md: '80%' }}
                            marginBottom={2}
                        >
                            Click any Enterprise Business Capability to see
                            more.
                        </Text>
                    </VStack>
                    <ModelCardView />
                </Box>
                <Box
                    paddingTop={3}
                    width='100%'
                    borderTop='4px solid'
                    borderColor='border.subtle'
                    marginTop={5}
                >
                    <Button
                        borderRadius={7}
                        fontWeight={505}
                        color='text.brand'
                        borderColor='border.brand'
                        variant='outline'
                        _hover={{ bg: 'interactive.tertiary.hover' }}
                        marginBottom={5}
                        marginLeft={3}
                        marginTop={3}
                        onClick={() => setIsOpenChangeModal(true)}
                    >
                        Contact EBA
                    </Button>
                </Box>
            </Box>

            <BAChangeModal
                isOpen={isOpenChangeModal}
                setIsOpenChangeModal={setIsOpenChangeModal}
                onSubmit={handleSubmitBAChangeModal}
                isSubmitting={isSubmitting}
            />

            <Dialog.Root
                size={enlargeImage === 'governance' ? 'cover' : 'xl'}
                placement='center'
                open={!!enlargeImage}
                // onOpenChange={e => setEnlargeImage(e.open)}
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content width='100%'>
                        <Dialog.Header marginBottom={1}>
                            <Dialog.CloseTrigger asChild>
                                <Button
                                    bg='interactive.primary.default'
                                    fontWeight={505}
                                    _hover={{
                                        bg: 'interactive.primary.hover',
                                        color: 'white'
                                    }}
                                    onClick={() => setEnlargeImage(null)}
                                >
                                    Close
                                </Button>
                            </Dialog.CloseTrigger>
                        </Dialog.Header>
                        {enlargeImage === 'connects' && (
                            <Box marginBottom={7}>
                                <HowItConnects enlarged={true} />
                            </Box>
                        )}
                        {enlargeImage === 'governance' && (
                            <Image
                                alt='Governance Model'
                                width={0}
                                height={0}
                                sizes='100vw'
                                style={{
                                    width: '100%',
                                    height: 'auto'
                                }}
                                src='/business-architecture/governance-model.png'
                            />
                        )}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    )
}
