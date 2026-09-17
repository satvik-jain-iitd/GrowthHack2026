/* istanbul ignore file */

import { VStack, NativeSelect, Field, HStack } from '@chakra-ui/react'

type SelectOption = {
    label: string
    value: string
}

export function SelectField({
    id,
    name,
    label,
    value,
    placeholder,
    options,
    onChange,
    required = false,
    disabled = false,
    title
}: {
    id: string
    name: string
    label: string
    value: string
    placeholder: string
    options: SelectOption[]
    onChange: (value: string) => void
    required?: boolean
    disabled?: boolean
    title?: string
}) {
    return (
        <Field.Root
            required={required}
            display='flex'
            flexDirection='row'
            gap={1}
            maxW={'500px'}
            disabled={disabled}
            title={title}
        >
            <VStack align='start' gap={1} w='100%'>
                <HStack>
                    <Field.Label htmlFor={id} fontWeight='500'>
                        {label}
                    </Field.Label>
                    {required ? <Field.RequiredIndicator /> : null}
                </HStack>
                <NativeSelect.Root disabled={disabled}>
                    <NativeSelect.Field
                        name={name}
                        placeholder={placeholder}
                        id={id}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                    >
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                </NativeSelect.Root>
            </VStack>
        </Field.Root>
    )
}
