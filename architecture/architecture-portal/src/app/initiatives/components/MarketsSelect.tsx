/* istanbul ignore file */

import { countryOptions } from '@/app/company-domains/constants'
import {
    Markets,
    SelectedOptionAction,
    SelectOptions
} from '@/app/company-domains/types'
import { SafeFlag } from '@/components/ui'
import Select, { components, MultiValue } from 'react-select'
import { toast } from 'react-toastify'

function MarketsSelect({
    marketFormValue,
    setMarketFormValue
}: {
    marketFormValue: MultiValue<Markets>
    setMarketFormValue: (markets: Markets[]) => void
}) {
    const formatOptionLabel = ({
        label,
        code
    }: {
        label: string
        code: string
    }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SafeFlag code={code} alt={label} />
            <span>{label}</span>
        </div>
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomMultiValueLabel = (props: any) => {
        const { data } = props

        return (
            <components.MultiValueLabel {...props}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <SafeFlag code={data.code || data.value} alt={data.label} />
                    <span>{data.label}</span>
                </div>
            </components.MultiValueLabel>
        )
    }

    const onChangeMarket = (
        newValue: SelectOptions[] | Markets[],
        actionMeta: SelectedOptionAction
    ) => {
        switch (actionMeta.action) {
            case 'remove-value':
            case 'pop-value':
                break
            case 'clear':
                break
        }

        const markets = marketFormValue || []
        // Check if the new value is global

        const isGlobal = newValue.some(
            item =>
                ('code' in item && item.code === 'GLOBAL') ||
                item.value === 'GLOBAL'
        )

        // Check if the current selection is global
        const hasGlobal = markets.some(
            (item: Markets) => item.code === 'GLOBAL' || item.value === 'GLOBAL'
        )
        if (hasGlobal && newValue.length > 1) {
            toast.error(
                'Global selection cannot be combined with other markets'
            )
            return
        } else if (isGlobal) {
            newValue = [
                {
                    label: 'Global',
                    value: 'GLOBAL',
                    code: 'GLOBAL'
                }
            ]
        }

        setMarketFormValue(newValue as Markets[])
    }

    return (
        <>
            <Select
                isMulti
                name='markets'
                value={marketFormValue}
                onChange={(a, b) =>
                    onChangeMarket(a as Markets[], b as SelectedOptionAction)
                }
                options={countryOptions}
                placeholder='Select countries'
                formatOptionLabel={formatOptionLabel}
                styles={{
                    container: provided => ({
                        ...provided,
                        width: '100%',
                        maxWidth: '500px'
                    })
                }}
                components={{
                    MultiValueLabel: CustomMultiValueLabel
                }}
                data-testid='actual-markets'
            />
        </>
    )
}

export default MarketsSelect
