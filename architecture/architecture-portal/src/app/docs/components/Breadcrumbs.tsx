/* istanbul ignore file */
import React from 'react'
import { NavLink } from '@/types/NavLink'
import { Box, Text, Breadcrumb } from '@chakra-ui/react'
import { NoPrefetchLink as Link } from '@/components/ui'
import { IconHome } from '@americanexpress/dls-icons'

type BreadcrumbsProps = {
    breadcrumbs: NavLink[]
    containerProps?: React.ComponentProps<typeof Box>
    rootProps?: React.ComponentProps<typeof Breadcrumb.Root>
    listProps?: React.ComponentProps<typeof Breadcrumb.List>
    linkProps?: React.ComponentProps<typeof Breadcrumb.Link>
    currentTextProps?: React.ComponentProps<typeof Text>
}

type BreadcrumbItemProps = NavLink & {
    linkProps?: React.ComponentProps<typeof Breadcrumb.Link>
}

function BreadcrumbItem({ href, label, linkProps }: BreadcrumbItemProps) {
    if (href === '/') {
        return (
            <Breadcrumb.Item>
                {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                <Breadcrumb.Link
                    as={Link}
                    href={href!}
                    color='fg.info'
                    whiteSpace='nowrap'
                    _focus={{
                        outline: 'none',
                        boxShadow: 'none'
                    }}
                    {...linkProps}
                >
                    <IconHome isFilled size='sm' color='information' />
                </Breadcrumb.Link>
            </Breadcrumb.Item>
        )
    }
    return (
        <Breadcrumb.Item>
            {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
            <Breadcrumb.Link
                as={Link}
                href={href!}
                fontSize={12}
                color='fg.info'
                whiteSpace='nowrap'
                _hover={{ textDecoration: 'underline' }}
                _focus={{
                    outline: 'none',
                    boxShadow: 'none'
                }}
                px={2}
                py={1}
                {...linkProps}
            >
                {label}
            </Breadcrumb.Link>
        </Breadcrumb.Item>
    )
}

export default function Breadcrumbs({
    breadcrumbs,
    containerProps,
    rootProps,
    listProps,
    linkProps,
    currentTextProps
}: BreadcrumbsProps) {
    const lastIndex: number = breadcrumbs.length - 1
    return (
        <Box
            display='flex'
            alignItems='flex-start'
            justifyContent='space-between'
            mt={2}
            {...containerProps}
        >
            <Breadcrumb.Root {...rootProps}>
                <Breadcrumb.List
                    flexWrap='wrap'
                    overflow='hidden'
                    {...listProps}
                >
                    {breadcrumbs.map((x, i) => (
                        <React.Fragment key={i}>
                            {x.href ? (
                                <BreadcrumbItem {...x} linkProps={linkProps} />
                            ) : (
                                <Breadcrumb.Item>
                                    <Text
                                        fontSize={12}
                                        color='fg.muted'
                                        whiteSpace='nowrap'
                                        px={2}
                                        py={1}
                                        {...currentTextProps}
                                    >
                                        {x.label}
                                    </Text>
                                </Breadcrumb.Item>
                            )}
                            {i < lastIndex && <Breadcrumb.Separator />}
                        </React.Fragment>
                    ))}
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </Box>
    )
}
