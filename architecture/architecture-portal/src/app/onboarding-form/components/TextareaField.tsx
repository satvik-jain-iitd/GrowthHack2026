/* istanbul ignore file */
'use client'
import React from 'react'
import {
    Field,
    GridItem,
    GridItemProps,
    Text,
    Textarea
} from '@chakra-ui/react'
import { Tooltip } from '@/components/ui'
import { IconInfo } from '@americanexpress/dls-icons'
import type {
    FieldValues,
    Path,
    UseFormRegister,
    UseFormTrigger
} from 'react-hook-form'

interface TextareaFieldProps<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
> {
    name: TName
    label: string
    required?: boolean
    placeholder?: string
    tooltip?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    height?: string | number
    width?: string | number
    resize?: string
    helperText?: string
    register: UseFormRegister<TFieldValues>
    validation?: Record<string, unknown>
    trigger: UseFormTrigger<TFieldValues>
    // setter used to toggle the small validating spinner in parent state
    setValidating: (name: string, v: boolean) => void
    // error message to show (if any)
    error?: string | undefined
    // whether to run the async trigger on blur
    runAsyncValidationOnBlur?: boolean
    colSpan?: GridItemProps['colSpan']
    className?: string
    labelClassName?: string
    textareaClassName?: string
}

export function TextareaField<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    name,
    label,
    required,
    placeholder,
    tooltip,
    size,
    height,
    width,
    resize,
    helperText,
    register,
    validation,
    trigger,
    setValidating,
    error,
    runAsyncValidationOnBlur = false,
    colSpan,
    className,
    labelClassName,
    textareaClassName
}: TextareaFieldProps<TFieldValues, TName>) {
    const reg = register(name, validation)
    return (
        <GridItem colSpan={colSpan} className={className}>
            <Field.Root key={name} invalid={!!error} required={required}>
                <Field.Label>
                    <Text
                        textStyle={!labelClassName ? 'sm' : undefined}
                        className={labelClassName}
                        fontWeight='bold'
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

                <Textarea
                    className={textareaClassName}
                    placeholder={placeholder}
                    size={size}
                    height={height}
                    width={width}
                    resize={resize}
                    {...reg}
                    onBlur={async e => {
                        try {
                            if (reg && typeof reg.onBlur === 'function')
                                reg.onBlur(e as unknown as Event)
                        } finally {
                            if (runAsyncValidationOnBlur) {
                                setValidating(name, true)
                                try {
                                    await trigger(name)
                                } finally {
                                    setValidating(name, false)
                                }
                            }
                        }
                    }}
                ></Textarea>
                <Field.HelperText>{helperText}</Field.HelperText>
                <Field.ErrorText>{error}</Field.ErrorText>
            </Field.Root>
        </GridItem>
    )
}
