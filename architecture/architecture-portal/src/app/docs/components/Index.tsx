/* istanbul ignore file */
'use server'
import {
    BVB_ONBOARDING_FORM_PLAYBOOK_ID,
    BVB_ASSESSMENTS_PLAYBOOK_ID
} from '@/constants'
import GeneratedIndex from '@/app/docs/components/GeneratedIndex'
import BvBOnboarding from '@/app/build-vs-buys/components/BvBOnboarding'
import DomainApiContainer from '@/app/company-domains/components/DomainAPIs/DomainApiContainer'
import CompanyDomainLanding from '@/app/company-domains/components/LandingPage/CompanyDomainLanding'
import { BvBIndex } from '@/app/build-vs-buys/components/bvb-index/BvBIndex'
import { Domain } from '@/app/company-domains/types'
import { Workproduct } from '@/types/Workproduct'
import { PrevNext } from '@/types/PrevNext'
import { ConsumerApi } from '@/app/initiatives/components/consumer-api/ConsumerApi'

export default async function Index({
    uuid,
    playbookId,
    workproduct,
    domain,
    prevNext,
    isDomain,
    isAdrs,
    isBvB,
    repo,
    isInitiativeConsumerApi
}: {
    uuid?: string
    playbookId?: string
    workproduct?: Workproduct
    domain?: Domain
    prevNext?: PrevNext
    isDomain?: boolean
    isAdrs?: boolean
    isBvB?: boolean
    repo?: string
    isInitiativeConsumerApi?: boolean
}) {
    const { index } = workproduct || {}
    if (index === '2.3' && isDomain) {
        return <DomainApiContainer playbook_id={playbookId} />
    }

    if (isInitiativeConsumerApi) {
        return (
            <>
                <ConsumerApi playbookId={playbookId} />
            </>
        )
    }

    if (!!domain) {
        return (
            <CompanyDomainLanding
                domain={domain}
                prevNext={prevNext!}
                repo={repo}
            />
        )
    }

    if (isBvB && playbookId && !isAdrs) {
        if (playbookId === BVB_ONBOARDING_FORM_PLAYBOOK_ID) {
            return <BvBOnboarding />
        }

        if (playbookId !== BVB_ASSESSMENTS_PLAYBOOK_ID) {
            return <BvBIndex playbookId={playbookId} repo={repo} />
        }
    }

    return (
        <GeneratedIndex
            uuid={uuid}
            isAdrs={isAdrs}
            playbookId={playbookId}
            repo={repo}
        />
    )
}
