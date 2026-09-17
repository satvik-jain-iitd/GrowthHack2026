/* istanbul ignore file */
import { useEffect } from 'react'
import {
    Box,
    useClipboard,
    Popover,
    Portal,
    usePopoverContext,
    IconButton
} from '@chakra-ui/react'
import { IconShare, IconCheck } from '@americanexpress/dls-icons'

const Copied = ({ isOperation }: { isOperation: boolean }) => {
    const popOver = usePopoverContext()
    useEffect(() => {
        const timer = setTimeout(() => {
            popOver.setOpen(false)
        }, 2000)
        return () => clearTimeout(timer)
    }, [popOver])
    return (
        <Box p={4} borderRadius='md'>
            <IconCheck
                color='success'
                size='md'
                isFilled={true}
                style={{
                    marginRight: '5px'
                }}
            />
            {isOperation ? 'Operation URL' : 'API URL'} Copied to Clipboard!
        </Box>
    )
}

export function CopyApiUrlButton({
    apiUrl,
    operationUrl,
    isTableRow,
    isExpanded
}: {
    apiUrl?: string
    operationUrl?: string
    isTableRow?: boolean
    isExpanded?: boolean
}) {
    const clipboard = useClipboard({ value: operationUrl || apiUrl })

    const handleCopy = () => {
        clipboard.copy()
    }
    return (
        <Popover.Root
            positioning={{
                placement: 'right'
            }}
        >
            <Popover.Trigger asChild>
                <IconButton
                    onClick={handleCopy}
                    title={
                        !!operationUrl ? 'Copy Operation Link' : 'Copy API Link'
                    }
                    variant='ghost'
                    size='xs'
                    ml={isTableRow ? 'auto' : undefined}
                >
                    <IconShare
                        color={isExpanded ? 'brand-alt' : 'brand'}
                        size='xs'
                        isFilled={false}
                    />{' '}
                </IconButton>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content width='auto'>
                        <Popover.Arrow />
                        <Copied isOperation={!!operationUrl} />
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}
