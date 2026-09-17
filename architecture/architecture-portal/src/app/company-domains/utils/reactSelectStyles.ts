/* istanbul ignore file */
import type { CSSObjectWithLabel, StylesConfig } from 'react-select'
import type { SelectOptions } from '@/app/company-domains/types'

export const getReactSelectStyles = <T>(
    theme: string | undefined
): StylesConfig<T, true> => ({
    control: base => ({
        ...base,
        backgroundColor: 'var(--bgColor-default)',
        borderColor: 'var(--chakra-colors-gray-300)',
        color: 'var(--fgColor-default)'
    }),
    menu: base => ({
        ...base,
        backgroundColor: 'var(--bgColor-default)'
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor:
            theme === 'dark' && (state.isFocused || state.isSelected)
                ? '#4A4A4A'
                : state.isFocused
                  ? 'var(--chakra-colors-gray-100)'
                  : 'var(--bgColor-default)',
        color: theme === 'dark' ? 'white' : 'var(--fgColor-default)'
    }),
    multiValue: base => ({
        ...base,
        backgroundColor:
            theme === 'dark' ? '#4A4A4A' : 'var(--chakra-colors-gray-200)'
    }),
    multiValueLabel: base => ({
        ...base,
        color: theme === 'dark' ? 'white' : 'var(--fgColor-default)'
    })
})

export const getDomainApiSelectStyles = (
    theme: string | undefined,
    domainId: string
): StylesConfig<SelectOptions, boolean> => ({
    control: (base: CSSObjectWithLabel) => ({
        ...base,
        backgroundColor: 'var(--bgColor-default)',
        borderColor: 'var(--chakra-colors-gray-600)',
        color: 'var(--fgColor-default)'
    }),
    menu: (base: CSSObjectWithLabel) => ({
        ...base,
        backgroundColor: 'var(--bgColor-default)'
    }),
    option: (
        base: CSSObjectWithLabel,
        state: { isFocused: boolean; isSelected: boolean }
    ) => ({
        ...base,
        backgroundColor:
            theme === 'dark' && (state.isFocused || state.isSelected)
                ? '#4a4a4a'
                : state.isFocused
                  ? 'var(--chakra-colors-gray-100)'
                  : 'var(--bgColor-default)',
        color: theme === 'dark' ? 'white' : 'var(--fgColor-default)'
    }),
    multiValue: (base: CSSObjectWithLabel, state: { data: SelectOptions }) => {
        return state.data.isFixed || state.data?.company_domain_id === domainId
            ? { ...base, backgroundColor: 'gray' }
            : {
                  ...base,
                  backgroundColor:
                      theme === 'dark'
                          ? '#4a4a4a'
                          : 'var(--chakra-colors-gray-200)'
              }
    },
    multiValueLabel: (
        base: CSSObjectWithLabel,
        state: { data: SelectOptions }
    ) => {
        return state.data.isFixed || state.data?.company_domain_id === domainId
            ? {
                  ...base,
                  fontWeight: 'bold',
                  color: 'white',
                  paddingRight: 6
              }
            : {
                  ...base,
                  color: theme === 'dark' ? 'white' : 'var(--fgColor-default)'
              }
    },
    multiValueRemove: (
        base: CSSObjectWithLabel,
        state: { data: SelectOptions }
    ) => {
        return state.data.isFixed || state.data?.company_domain_id === domainId
            ? { ...base, display: 'none' }
            : base
    },
    input: (base: CSSObjectWithLabel) => ({
        ...base,
        color: theme === 'dark' ? 'white' : 'var(--fgColor-default)'
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
        ...base,
        color: theme === 'dark' ? 'white' : 'var(--fgColor-default)'
    }),
    container: (provided: CSSObjectWithLabel) => ({
        ...provided,
        width: '100%'
    })
})
export const inputThemeProps = {
    _dark: {
        bg: 'var(--bgColor-default) !important',
        color: 'white !important'
    },
    _focusVisible: {
        borderColor: '#3b9eff',
        boxShadow: '0 0 0 1px #3b9eff'
    }
}
