import React from 'react'

export type LayoutRenderProps = {
    firstField: React.ReactNode
    restFields: React.ReactNode
    onSubmit: React.FormEventHandler
}

export type LayoutRenderer = (props: LayoutRenderProps) => React.ReactNode
