'use client'
import React from 'react'
import { usePlaybook } from '@/hooks/usePlaybooks'
import { useParams, useRouter } from 'next/navigation'
import {
    Box,
    Text,
    Grid,
    GridItem,
    Flex,
    Button,
    Center
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useSubmitAcceptance } from '@/hooks/useWorkflowActions'

export default function BvBApprovalPage() {
    const params = useParams()
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = (params as any)?.id
    const router = useRouter()

    const { data: playbook, isLoading } = usePlaybook(id)

    /*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
    const safeAddDa = (playbook?.add_da ?? {}) as any
    const safeWorkflowData = safeAddDa.workflowData || {}
    const safeBvbId = safeWorkflowData?.bvbId || ''

    const approveMutation = useSubmitAcceptance(
        safeBvbId,
        playbook?.playbook_id || '',
        'APPROVED'
    )
    const rejectMutation = useSubmitAcceptance(
        safeBvbId,
        playbook?.playbook_id || '',
        'REJECTED'
    )

    if (isLoading || !playbook) {
        return <div>Loading...</div>
    }

    /*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
    const add_da = playbook.add_da as any
    const workflowData = add_da.workflowData || {}
    const bvbId = workflowData?.bvbId || ''

    const handleApprove = async () => {
        if (!bvbId) {
            return
        }
        try {
            await approveMutation.mutateAsync()
            router.back()
        } catch (err) {
            console.error(err)
        }
    }

    const handleReject = async () => {
        if (!bvbId) {
            console.error('BvB ID is missing')
            return
        }
        try {
            await rejectMutation.mutateAsync()
            router.back()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Center>
            <Box p={8} mx={8}>
                <Text
                    color='blue.500'
                    cursor='pointer'
                    fontWeight='semibold'
                    onClick={() => router.back()}
                    _hover={{ textDecoration: 'underline' }}
                >
                    Go Back
                </Text>
                <Text fontSize='2xl' fontWeight='bold' mb={4}>
                    {playbook.playbook_nm}
                </Text>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                    <GridItem>
                        <Text fontWeight='semibold'>Date Onboarded:</Text>
                        <Text>
                            {dayjs(playbook.creat_ts).format('MM/DD/YYYY')}
                        </Text>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>
                            Point of Contact Email:
                        </Text>
                        <Text>{playbook.ctc_email_ad_tx}</Text>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>ETP / ECMI Impacting:</Text>
                        <Text>{add_da.etpImpacting ? 'Yes' : 'No'}</Text>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>Overall Risk:</Text>
                        <Text>{add_da.overallRisk}</Text>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>Estimated Cost:</Text>
                        <Text>{add_da.estimatedCost}</Text>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>Description:</Text>
                        <Text>{add_da.description}</Text>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>Deciders:</Text>
                        <Box pl={4}>
                            {Array.isArray(add_da.deciders) ? (
                                add_da.deciders.map((d: string) => (
                                    <Text key={d}>- {d}</Text>
                                ))
                            ) : (
                                <Text>- {add_da.deciders}</Text>
                            )}
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>Owner:</Text>
                        <Box pl={4}>
                            {Array.isArray(add_da.owner) ? (
                                add_da.owner.map((o: string) => (
                                    <Text key={o}>- {o}</Text>
                                ))
                            ) : (
                                <Text>- {add_da.owner}</Text>
                            )}
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>Requester:</Text>
                        <Box pl={4}>
                            {Array.isArray(add_da.requester) ? (
                                add_da.requester.map((r: string) => (
                                    <Text key={r}>- {r}</Text>
                                ))
                            ) : (
                                <Text>- {add_da.requester}</Text>
                            )}
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>Stake Holders:</Text>
                        <Box pl={4}>
                            {Array.isArray(add_da.stakeHolders) &&
                                add_da.stakeHolders.map((s: string) => (
                                    <Text key={s}>- {s}</Text>
                                ))}
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>EA Architect:</Text>
                        <Box pl={4}>
                            {Array.isArray(add_da.eaArchitect) &&
                                add_da.eaArchitect.map((a: string) => (
                                    <Text key={a}>- {a}</Text>
                                ))}
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>Reviewers:</Text>
                        <Box pl={4}>
                            {Array.isArray(add_da.reviewers) &&
                                add_da.reviewers.map((r: string) => (
                                    <Text key={r}>- {r}</Text>
                                ))}
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>Targeted End Date:</Text>
                        <Text>
                            {dayjs(add_da.targetedEndDate).format('MM/DD/YYYY')}
                        </Text>
                    </GridItem>
                    <GridItem>
                        <Text fontWeight='semibold'>Primary Platform:</Text>
                        <Text>{playbook.prim_pfrm_nm}</Text>
                    </GridItem>
                </Grid>
                <Flex mt={8} justify='flex-start'>
                    <Button
                        colorPalette={'blue'}
                        mr={4}
                        onClick={handleApprove}
                        loading={approveMutation.isPending}
                    >
                        Approve
                    </Button>
                    <Button
                        colorPalette={'blue'}
                        variant={'outline'}
                        onClick={handleReject}
                        loading={rejectMutation.isPending}
                    >
                        Reject
                    </Button>
                </Flex>
            </Box>
        </Center>
    )
}
