/* istanbul ignore file */
import { Table, Text } from '@chakra-ui/react'
import { useSidebarOpen } from '@/context'
import { NoPrefetchLink } from '@/components/ui'

interface Props {
    title: string
    description: string
    link: string
}

export const ECJTableRow = ({ title, description, link }: Props) => {
    const { sidebarOpen, toggleSidebar } = useSidebarOpen()
    return (
        <Table.Row
            backgroundColor={{ base: 'white', _dark: '#27272a' }}
            height='64px'
        >
            <Table.Cell height='64px' minW='15rem'>
                <NoPrefetchLink
                    href={link}
                    onClick={e => {
                        e.stopPropagation()
                        if (sidebarOpen) toggleSidebar()
                    }}
                >
                    <Text
                        whiteSpace='normal'
                        wordWrap='break-word'
                        fontSize={'md'}
                        color='text.link'
                        _hover={{
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        {title}
                    </Text>
                </NoPrefetchLink>
            </Table.Cell>
            <Table.Cell color='fg'>
                <Text whiteSpace='normal' wordWrap='break-word' fontSize={'md'}>
                    {description}
                </Text>
            </Table.Cell>
        </Table.Row>
    )
}
