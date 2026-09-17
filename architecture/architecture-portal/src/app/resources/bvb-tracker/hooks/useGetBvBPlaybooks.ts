/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query'
import { Playbook } from '@/types/Playbook'
import { API_ENDPOINTS, PLAYBOOK_TYPE_IDS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export const BVB_PLAYBOOKS_QUERY_KEY = ['bvb-playbooks']

export const fetchBvBPlaybooks = async (): Promise<Playbook[]> => {
    const apiUrl = API_ENDPOINTS.GET_PLAYBOOKS_BY_TYPE(
        PLAYBOOK_TYPE_IDS.BUILD_VS_BUY
    )
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch playbooks: ${res.status} ${res.statusText}`
        )
    }
    const json = await res.json()
    return Array.isArray(json.data) ? json.data : []
}

export const useGetBvBPlaybooks = (options?: { status: string }) => {
    const { data, isLoading, error } = useQuery<Playbook[]>({
        queryKey: BVB_PLAYBOOKS_QUERY_KEY,
        queryFn: fetchBvBPlaybooks
    })

    let playbooks: Playbook[] = []
    if (options?.status === 'PENDING') {
        playbooks = Array.isArray(data)
            ? data
                  .filter(
                      (playbook: Playbook) =>
                          playbook.req_aprv_sta_nm !== 'APPROVED' &&
                          //eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (playbook.add_da as any).workflowData?.currentTask
                              .step === 'WaitForBvBCriteriaMet' &&
                          //eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (playbook.add_da as any).workflowData?.status !==
                              'PROCESS_STATE_COMPLETED'
                  )
                  .sort(
                      (a, b) =>
                          new Date(b.creat_ts).getTime() -
                          new Date(a.creat_ts).getTime()
                  )
            : []
    } else {
        playbooks = Array.isArray(data)
            ? data.filter(
                  (playbook: Playbook) =>
                      playbook.req_aprv_sta_nm === 'APPROVED' &&
                      playbook.playbook_dply_in &&
                      //eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (playbook.add_da as any).title
              )
            : []
    }

    return { playbooks, loading: isLoading, error }
}
