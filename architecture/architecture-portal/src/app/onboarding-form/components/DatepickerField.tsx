/* istanbul ignore file */
'use client'
import { Field, GridItem, GridItemProps, Text } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui'
import { IconInfo } from '@americanexpress/dls-icons'
import {
    useController,
    Control,
    FieldValues,
    Path,
    RegisterOptions
} from 'react-hook-form'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { useEffect } from 'react'

export interface DatepickerFieldProps<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
> {
    /** Label & placeholder text */
    label?: string
    required?: boolean
    tooltip?: string

    /** RHF / controlled field props */
    name: TName
    control: Control<TFieldValues>
    rules?: RegisterOptions<TFieldValues, TName>
    colSpan?: GridItemProps['colSpan']
    inputWidth?: number
    border?: string
    borderRadius?: string
    disabled?: boolean
}

export function DatepickerField<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    label = 'Date',
    name,
    control,
    required,
    tooltip,
    colSpan,
    rules,
    inputWidth,
    border,
    borderRadius,
    disabled
}: DatepickerFieldProps<TFieldValues, TName>) {
    // RHF controller
    const { field, fieldState } = useController({ name, control, rules })
    useEffect(() => {
        console.log('Datepicker fieldstate.invalid: ' + fieldState.invalid)
        console.log('Datepicker fieldstate.error: ' + fieldState.error)
    }, [fieldState])
    useEffect(() => {
        console.log('Datepicker field.value: ' + field.value)
    }, [field])

    return (
        <GridItem colSpan={colSpan}>
            <Field.Root
                key={name}
                invalid={fieldState.invalid}
                required={required}
            >
                <Field.Label>
                    <Text textStyle='sm' fontWeight='bold'>
                        {label}
                    </Text>
                    {required && <Field.RequiredIndicator />}
                    {tooltip && (
                        <Tooltip
                            showArrow
                            content={tooltip}
                            contentProps={{
                                css: { '--tooltip-bg': 'grey' }
                            }}
                        >
                            <IconInfo size='xl' />
                        </Tooltip>
                    )}
                </Field.Label>
                <SingleDatepicker
                    triggerVariant='input'
                    name={`${name}-date-input`}
                    date={field.value}
                    disabled={disabled}
                    onDateChange={date => {
                        field.onChange(date)
                    }}
                    propsConfigs={{
                        inputProps: {
                            width: inputWidth,
                            border: border || undefined,
                            borderRadius: borderRadius || undefined,
                            disabled: disabled,
                            readOnly: disabled
                        }
                    }}
                />
                <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
            </Field.Root>
        </GridItem>
    )
}
