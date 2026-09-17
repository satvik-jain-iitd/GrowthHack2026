import { useState, useRef, useEffect } from 'react'
import { Text, Button, Box } from '@chakra-ui/react'

const ExpandableText = ({
    children,
    maxLines = 2,
    textFontSize = 'var(--apiFontSizeBase)',
    showMoreFontSize = '11px !important',
    ...props
}) => {
    const [expanded, setExpanded] = useState(false)
    const [showButton, setShowButton] = useState(false)
    const textRef = useRef(null)

    useEffect(() => {
        const recalculate = () => {
            if (!textRef.current) return
            const hasOverflow =
                textRef.current.scrollHeight > textRef.current.clientHeight
            setShowButton(expanded || hasOverflow)
        }

        recalculate()
        window.addEventListener('resize', recalculate)

        return () => {
            window.removeEventListener('resize', recalculate)
        }
    }, [children, maxLines, textFontSize, expanded])

    return (
        <Box>
            <Text
                as={'div'}
                ref={textRef}
                {...props}
                style={
                    expanded
                        ? {}
                        : {
                              display: '-webkit-box',
                              WebkitLineClamp: maxLines,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontSize: textFontSize
                          }
                }
            >
                {children}
            </Text>
            {showButton && (
                <Button
                    variant='link'
                    size='sm'
                    onClick={() => setExpanded(prev => !prev)}
                    cursor='pointer'
                    p={0}
                >
                    <Text
                        color='blue.500'
                        textDecoration='underline'
                        fontSize={showMoreFontSize}
                    >
                        {expanded ? 'Show less' : 'Show more'}
                    </Text>
                </Button>
            )}
        </Box>
    )
}

export default ExpandableText
