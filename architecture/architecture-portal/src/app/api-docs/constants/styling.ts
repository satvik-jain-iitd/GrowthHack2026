/* istanbul ignore file */

const PARAM_BOX_PROPS = {
    p: '0.75em',
    mb: '0.5em',
    border: '1px solid',
    borderColor: '#D4DEE9',
    borderRadius: 'md',
    _dark: { borderColor: 'gray.600' }
}
const PARAM_TEXT_PROPS = {
    color: 'gray.700',
    _dark: { color: 'gray.300' }
}
const PARAM_LABEL_PROPS = {
    ...PARAM_TEXT_PROPS,
    fontSize: 'xs',
    color: 'gray.600'
}
const PARAM_BADGE_PROPS = {
    mx: '0.25em',
    colorPalette: 'blue',
    float: 'right'
}

const PARAM_RIGHTPANEL_HEADER = {
    borderTopRadius: 'inherit',
    _dark: {
        color: '#c8c9c7',
        bg: '#21252c'
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 4,
    py: 2,
    width: '100%'
}
const PARAMS_SAMPLE_BOX = {
    width: '100%',
    height: '50%',
    backgroundColor: 'gray.50',
    _dark: { backgroundColor: '#1b1e25', borderColor: 'gray.600' },
    borderRadius: 'lg',
    minHeight: '300px',
    border: '1px solid',
    borderColor: '#D4DEE9'
}

export {
    PARAM_BOX_PROPS,
    PARAM_TEXT_PROPS,
    PARAM_LABEL_PROPS,
    PARAM_BADGE_PROPS,
    PARAM_RIGHTPANEL_HEADER,
    PARAMS_SAMPLE_BOX
}
