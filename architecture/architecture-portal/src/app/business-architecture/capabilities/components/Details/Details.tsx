/* istanbul ignore file */
'use client'
import React, { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { Capability } from '@/app/business-architecture/types'
import {
    DetailsTabs,
    DetailsText
} from '@/app/business-architecture/capabilities/components/Details'
import { BAChangeModal } from '@/app/business-architecture/components/BAChangeModal'
import { useSubmitBAChangeModalRequest } from '@/app/business-architecture/hooks'
import Breadcrumbs from '@/app/docs/components/Breadcrumbs'

export const Details = ({
    breadcrumbs,
    capability_id,
    capabilityData
}: {
    breadcrumbs: { label: string; href: string }[]
    capability_id: string
    capabilityData: Capability
}) => {
    const [isOpenChangeModal, setIsOpenChangeModal] = useState(false)
    const { handleSubmitBAChangeModal, isSubmitting } =
        useSubmitBAChangeModalRequest('EBA')

    return (
        // page box
        <Flex
            width='100%'
            background='surface.white'
            justifyContent='center !important'
            minHeight='100vh'
        >
            <Flex
                width='100%'
                background='transparent'
                pt='25px'
                px='5vw'
                overflow='hidden'
                direction='column'
                zIndex='1'
            >
                <Breadcrumbs
                    breadcrumbs={breadcrumbs}
                    linkProps={{
                        color: 'brightBlue.shade600S92',
                        textAlign: 'center',
                        fontFeatureSettings: '"liga" off, "clig" off',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 510,
                        lineHeight: '24px'
                    }}
                />
                <DetailsText
                    capabilityData={capabilityData}
                    setIsOpenChangeModal={setIsOpenChangeModal}
                />
                <Box mt={10}>
                    <DetailsTabs
                        capability_id={capability_id}
                        applications={
                            capabilityData.applications === undefined
                                ? []
                                : capabilityData.applications
                        }
                    />
                </Box>
            </Flex>
            <BAChangeModal
                isOpen={isOpenChangeModal}
                setIsOpenChangeModal={setIsOpenChangeModal}
                onSubmit={handleSubmitBAChangeModal}
                isSubmitting={isSubmitting}
                capabilityKeyTx={capabilityData.capability_key_tx}
                capabilityName={capabilityData.capability_nm}
            />
        </Flex>
    )
}

export default Details
