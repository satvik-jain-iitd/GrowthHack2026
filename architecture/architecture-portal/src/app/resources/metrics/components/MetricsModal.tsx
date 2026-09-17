/* istanbul ignore file */
import { Dialog, Button, Flex, CloseButton, HStack } from '@chakra-ui/react'
import PieChartWithLegend from './PieChartWithLegend'

export default function MetricsModal({
    view,
    isOpen,
    onClose,
    chartData,
    selectedGroup
}: {
    view: string
    isOpen: boolean
    onClose: () => void
    chartData: Array<{ title: string; value: string | number; color: string }>
    selectedGroup: string
}) {
    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={e => !e.open && onClose()}
            size='cover'
            placement='center'
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content position='absolute'>
                    <Dialog.Header
                        fontSize='20px'
                        fontWeight='semibold'
                        backgroundColor={{ _dark: '#2D3748', base: '#FFFFFF' }}
                    >
                        {view === 'metric1'
                            ? '% of ECMI Applications Mapped'
                            : view === 'metric3'
                              ? 'Cross-Domain Type A / B APIs'
                              : 'Production Certified APIs'}
                    </Dialog.Header>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton onClick={onClose} size='xl' />
                    </Dialog.CloseTrigger>
                    <Dialog.Body
                        width='100%'
                        padding='2rem'
                        backgroundColor={{ _dark: '#2D3748', base: '#FFFFFF' }}
                    >
                        <Flex
                            width='100%'
                            backgroundColor={{
                                _dark: '#2D3748',
                                base: '#FFFFFF'
                            }}
                            height='100%'
                            gap={4}
                            direction='row'
                            borderRadius='8px'
                            position='relative'
                        >
                            <PieChartWithLegend
                                selectedGroup={selectedGroup}
                                view={view}
                                chartData={chartData}
                                isModal={true}
                            />
                        </Flex>
                    </Dialog.Body>
                    <Dialog.Footer
                        backgroundColor={{ _dark: '#2D3748', base: '#FFFFFF' }}
                    >
                        <HStack wrap='wrap' gap='6'>
                            <Button
                                fontSize='16px'
                                fontWeight='semibold'
                                onClick={onClose}
                                padding='0.75rem 1rem'
                                borderRadius='8px'
                                _hover={{
                                    backgroundColor: 'gray.200'
                                }}
                                _active={{
                                    backgroundColor: 'gray.400'
                                }}
                                backgroundColor={{
                                    _dark: '#FFFFFF',
                                    base: 'gray.200'
                                }}
                                color={{ _dark: 'black', base: 'black' }}
                            >
                                Close
                            </Button>
                        </HStack>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
