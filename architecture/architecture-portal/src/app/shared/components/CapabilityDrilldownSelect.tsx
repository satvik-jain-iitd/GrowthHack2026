import { Box, Button, Field, Flex, Text } from '@chakra-ui/react'
import Select, { SingleValue } from 'react-select'
import { useMemo, useState } from 'react'
import { useCapabilities } from '@/app/business-architecture/hooks/useGetCapabilities'
import { useCapabilityHierarchy } from '@/app/business-architecture/tbm-mapping/hooks/useCapabilityHierarchy'
import { getCapabilityPathsForIds } from '@/app/business-architecture/tbm-mapping/utils/capabilityTree'
import type { CapabilityNode } from '@/app/business-architecture/types'

interface Option {
    label: string
    value: string
}

const selectStyles = {
    control: (base: Record<string, unknown>) => ({
        ...base,
        border: '1px solid #8C8C8C',
        borderRadius: '5px',
        minHeight: '40px',
        width: '500px'
    })
}

const toOptions = (nodes: CapabilityNode[]): Option[] =>
    nodes.map(node => ({
        label: node.capability_nm,
        value: node.capability_id
    }))

/**
 * Drill-down capability picker: choose an L1, then an L2 within it, then an L3
 * (and optionally an L4). Only once an L3 (or deeper) capability is selected can
 * it be added to the list. Added capabilities are shown as removable chips with
 * their full L1 › L2 › L3[ › L4] breadcrumb path.
 *
 * `value`/`onChange` operate on the flat list of selected capability ids.
 */
export default function CapabilityDrilldownSelect({
    value,
    onChange,
    label = 'Business Capabilities'
}: {
    value: string[]
    onChange: (ids: string[]) => void
    label?: string
}) {
    const { capability, loading } = useCapabilities()
    const hierarchy = useCapabilityHierarchy(capability)

    const [l1, setL1] = useState<Option | null>(null)
    const [l2, setL2] = useState<Option | null>(null)
    const [l3, setL3] = useState<Option | null>(null)
    const [l4, setL4] = useState<Option | null>(null)

    const nodeById = useMemo(() => {
        const map = new Map<string, CapabilityNode>()
        const walk = (node: CapabilityNode) => {
            map.set(node.capability_id, node)
            node.children?.forEach(walk)
        }
        hierarchy.forEach(walk)
        return map
    }, [hierarchy])

    const l1Options = useMemo(() => toOptions(hierarchy), [hierarchy])
    const l2Options = useMemo(
        () => (l1 ? toOptions(nodeById.get(l1.value)?.children ?? []) : []),
        [l1, nodeById]
    )
    const l3Options = useMemo(
        () => (l2 ? toOptions(nodeById.get(l2.value)?.children ?? []) : []),
        [l2, nodeById]
    )
    const l4Options = useMemo(
        () => (l3 ? toOptions(nodeById.get(l3.value)?.children ?? []) : []),
        [l3, nodeById]
    )

    const selectedId = l4?.value ?? l3?.value ?? null
    const canAdd = selectedId !== null && !value.includes(selectedId)

    const selectedPaths = useMemo(
        () => getCapabilityPathsForIds(value, hierarchy),
        [value, hierarchy]
    )

    const handleAdd = () => {
        if (!selectedId || value.includes(selectedId)) return
        onChange([...value, selectedId])
        setL3(null)
        setL4(null)
    }

    const handleRemove = (id: string) => {
        onChange(value.filter(existing => existing !== id))
    }

    return (
        <Field.Root>
            <Field.Label>
                <Text textStyle='sm' fontWeight='bold'>
                    {label}
                </Text>
            </Field.Label>
            <Box>
                <Flex direction='column' gap={3}>
                    <Select
                        styles={selectStyles}
                        isLoading={loading}
                        isClearable
                        placeholder='Select L1 capability'
                        aria-label='Select L1 capability'
                        options={l1Options}
                        value={l1}
                        onChange={(option: SingleValue<Option>) => {
                            setL1(option ?? null)
                            setL2(null)
                            setL3(null)
                            setL4(null)
                        }}
                    />
                    <Select
                        styles={selectStyles}
                        isClearable
                        isDisabled={!l1}
                        placeholder='Select L2 capability'
                        aria-label='Select L2 capability'
                        options={l2Options}
                        value={l2}
                        onChange={(option: SingleValue<Option>) => {
                            setL2(option ?? null)
                            setL3(null)
                            setL4(null)
                        }}
                    />
                    <Select
                        styles={selectStyles}
                        isClearable
                        isDisabled={!l2}
                        placeholder='Select L3 capability'
                        aria-label='Select L3 capability'
                        options={l3Options}
                        value={l3}
                        onChange={(option: SingleValue<Option>) => {
                            setL3(option ?? null)
                            setL4(null)
                        }}
                    />
                    <Select
                        styles={selectStyles}
                        isClearable
                        isDisabled={!l3 || l4Options.length === 0}
                        placeholder='Select L4 capability (optional)'
                        aria-label='Select L4 capability'
                        options={l4Options}
                        value={l4}
                        onChange={(option: SingleValue<Option>) =>
                            setL4(option ?? null)
                        }
                    />
                    <Button
                        alignSelf='flex-start'
                        size='sm'
                        colorPalette='blue'
                        disabled={!canAdd}
                        onClick={handleAdd}
                    >
                        Add capability
                    </Button>
                </Flex>

                <Flex mt={3} gap={2} wrap='wrap'>
                    {value.length === 0 ? (
                        <Text fontSize='sm' color='gray.500'>
                            No capabilities linked yet.
                        </Text>
                    ) : (
                        value.map(id => {
                            const path = selectedPaths.find(p => p.id === id)
                            const displayLabel = path
                                ? path.path.join(' › ')
                                : (nodeById.get(id)?.capability_nm ?? id)
                            return (
                                <Flex
                                    key={id}
                                    align='center'
                                    gap={2}
                                    borderRadius='full'
                                    bg='blue.50'
                                    px={3}
                                    py={1}
                                >
                                    <Text fontSize='sm'>{displayLabel}</Text>
                                    <Button
                                        size='2xs'
                                        variant='ghost'
                                        aria-label={`Remove ${displayLabel}`}
                                        onClick={() => handleRemove(id)}
                                    >
                                        ✕
                                    </Button>
                                </Flex>
                            )
                        })
                    )}
                </Flex>
            </Box>
        </Field.Root>
    )
}
