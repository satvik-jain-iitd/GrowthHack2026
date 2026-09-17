/* istanbul ignore file */
'use client'
import {
    Field,
    GridItem,
    GridItemProps,
    NativeSelect,
    Spinner,
    Text
} from '@chakra-ui/react'
import { UseFormRegister, FieldValues, Path } from 'react-hook-form'
import { Tooltip } from '@/components/ui'
import { IconInfo } from '@americanexpress/dls-icons'
import { Option } from '@/app/onboarding-form/types'

interface NativeSelectFieldProps<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
> {
    name: TName
    label: string
    required?: boolean
    disabled?: boolean
    placeholder?: string
    tooltip?: string
    register?: UseFormRegister<TFieldValues>
    validation?: Record<string, unknown>
    // error message to show (if any)
    error?: string | undefined
    options?: Option[]
    colSpan?: GridItemProps['colSpan']
    className?: string
    labelClassName?: string
    selectRootClassName?: string
    selectFieldClassName?: string
    isFetchingOptions?: boolean
    defaultValue?: string | number
    border?: string
    borderRadius?: string
}

export function NativeSelectField<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    name,
    label,
    required,
    disabled,
    placeholder,
    tooltip,
    register,
    validation,
    error,
    options,
    colSpan,
    className,
    labelClassName,
    selectRootClassName,
    selectFieldClassName,
    isFetchingOptions,
    defaultValue,
    border,
    borderRadius
}: NativeSelectFieldProps<TFieldValues, TName>) {
    return (
        <GridItem colSpan={colSpan} className={className}>
            <Field.Root
                key={name}
                invalid={!!error}
                required={required}
                disabled={disabled}
            >
                <Field.Label>
                    <Text
                        fontWeight='bold'
                        textStyle={!labelClassName ? 'sm' : undefined}
                        className={labelClassName}
                    >
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
                <NativeSelect.Root
                    invalid={!!error}
                    className={selectRootClassName}
                    border={border || undefined}
                    borderRadius={borderRadius || undefined}
                >
                    <NativeSelect.Field
                        className={selectFieldClassName}
                        {...(register ? register(name, validation) : {})}
                        placeholder={
                            isFetchingOptions ? 'Loading...' : placeholder
                        }
                        value={
                            defaultValue !== undefined
                                ? defaultValue
                                : undefined
                        }
                    >
                        {!isFetchingOptions &&
                            (options ?? []).map(o => (
                                <option
                                    key={
                                        o.value
                                            ? String(o.value)
                                            : String(o.displayText)
                                    }
                                    value={String(o.value)}
                                    disabled={o.disabled}
                                >
                                    {o.displayText}
                                </option>
                            ))}
                    </NativeSelect.Field>
                    {isFetchingOptions ? (
                        <NativeSelect.Indicator>
                            <Spinner
                                size='xs'
                                borderWidth='1.5px'
                                color='fg.muted'
                            />
                        </NativeSelect.Indicator>
                    ) : (
                        <NativeSelect.Indicator />
                    )}
                </NativeSelect.Root>
                <Field.ErrorText>{error}</Field.ErrorText>
            </Field.Root>
        </GridItem>
    )
}
