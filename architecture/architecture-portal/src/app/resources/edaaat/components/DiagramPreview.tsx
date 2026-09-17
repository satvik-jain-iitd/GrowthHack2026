/* istanbul ignore file */
'use client'
import React, { useRef, useState } from 'react'
import {
    IconDownload,
    IconWarning,
    IconPlusCircle,
    IconMinusCircle,
    IconCancelCircle,
    IconChevronLeft,
    IconChevronRight
} from '@americanexpress/dls-icons'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import styles from '../edaaat.module.css'
import {
    Button,
    ProgressCircle,
    Alert,
    CloseButton,
    Box,
    HStack,
    IconButton
} from '@chakra-ui/react'
import features from '../constants/features'
import LevelInfoStack from './LevelInfoStack'
import Image from 'next/image'
import { DiagramPreviewProps } from '../utils/types'

const downloadImage = (imageBase64: string, fileName: string) => {
    return () => {
        const link = document.createElement('a')
        link.href = imageBase64
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

const DiagramPreview: React.FC<DiagramPreviewProps> = ({
    diagramArtifact,
    isLoading,
    errors,
    showNotification,
    setShowNotification
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const hasErrors = errors && errors.length > 0
    const images = [
        diagramArtifact?.diagramImage,
        diagramArtifact?.diagramDetailImage
    ]
    const fileNames = [
        diagramArtifact?.diagramFileName,
        diagramArtifact?.diagramDetailFileName
    ]

    const [currentImage, setCurrentImage] = useState(
        diagramArtifact?.diagramImage
    )
    const [currentImageFileName, setCurrentImageFileName] = useState(
        diagramArtifact?.diagramFileName
    )
    const [expandedItemId, setExpandedItemId] = useState(features[0].id)
    // Keep currentImage and currentImageFileName in sync with diagramArtifact changes
    React.useEffect(() => {
        setCurrentImage(diagramArtifact?.diagramImage)
        setCurrentImageFileName(diagramArtifact?.diagramFileName)
    }, [diagramArtifact])

    const handleCarouselChange = (index: number) => {
        setCurrentImage(images[index])
        setCurrentImageFileName(fileNames[index])
    }

    if (isLoading) {
        return (
            <div>
                <div className={styles.diagramPreviewLoadingContainer}>
                    <div className={styles.diagramPreviewLoadingContent}>
                        <ProgressCircle.Root value={null} size='lg'>
                            <ProgressCircle.Circle>
                                <ProgressCircle.Track />
                                <ProgressCircle.Range />
                            </ProgressCircle.Circle>
                        </ProgressCircle.Root>
                        <span className='font-weight-700 margin-top-2'>
                            Generating diagram...
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    if (!diagramArtifact?.diagramDetailImage && hasErrors) {
        return (
            <div>
                {hasErrors && (
                    <Alert.Root
                        id={styles.pageLevelMessageWarning}
                        status='error'
                    >
                        <IconWarning />
                        <Alert.Content>
                            <Alert.Title className={styles.errorMessage}>
                                Failed to generate the diagram
                            </Alert.Title>
                            {errors.map(err => {
                                if (typeof err === 'string') {
                                    return (
                                        <p key={`error-string-${err}`}>{err}</p>
                                    )
                                }
                                const errorObj = err
                                const errorKey =
                                    errorObj.error_code ||
                                    errorObj.error ||
                                    JSON.stringify(errorObj)
                                return (
                                    <div
                                        key={`error-block-${errorKey}`}
                                        className={styles.errorBlock}
                                    >
                                        {errorObj.error_code && (
                                            <div className={styles.errorHeader}>
                                                {errorObj.error_code}
                                                {errorObj.error
                                                    ? `: ${errorObj.error}`
                                                    : ''}
                                            </div>
                                        )}
                                        {!errorObj.error_code &&
                                            errorObj.error && (
                                                <div
                                                    className={
                                                        styles.errorHeader
                                                    }
                                                >
                                                    {errorObj.error}
                                                </div>
                                            )}
                                        {errorObj.error_description && (
                                            <div
                                                className={
                                                    styles.errorDescription
                                                }
                                            >
                                                {errorObj.error_description}
                                            </div>
                                        )}
                                        {errorObj.action && (
                                            <div
                                                className={styles.errorComment}
                                            >
                                                {errorObj.action}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </Alert.Content>
                    </Alert.Root>
                )}
            </div>
        )
    }

    if (!diagramArtifact?.diagramDetailImage) {
        return (
            <div>
                <LevelInfoStack
                    features={features || {}}
                    expandedItemId={expandedItemId}
                    setExpandedItemId={setExpandedItemId}
                />
            </div>
        )
    }

    return (
        <div>
            {showNotification && (
                <Alert.Root
                    id={styles.pageLevelMessageSuccess}
                    status='success'
                >
                    <Alert.Content className={styles.successMessage}>
                        <Alert.Indicator />
                        <Alert.Title>
                            Diagram Generated Successfully
                        </Alert.Title>
                    </Alert.Content>
                    <CloseButton onClick={() => setShowNotification(false)} />
                </Alert.Root>
            )}
            <div className={styles.diagramContent}>
                <Box position='relative' maxW='100%' mx='auto'>
                    <Box overflow='hidden'>
                        <HStack
                            ref={ref}
                            transform={`translateX(-${activeIndex * 100}%)`}
                            transition='transform 0.4s ease'
                        >
                            {images.map((image, i) => {
                                const fileName =
                                    fileNames[i] ?? `diagram-preview-item-${i}`
                                return (
                                    <Box key={i} flex='0 0 100%'>
                                        <TransformWrapper
                                            initialScale={0.8}
                                            initialPositionX={0}
                                            initialPositionY={0}
                                            limitToBounds={false}
                                        >
                                            {({
                                                zoomIn,
                                                zoomOut,
                                                resetTransform
                                            }) => (
                                                <>
                                                    <div
                                                        style={{
                                                            position:
                                                                'relative',
                                                            width: '100%',
                                                            height: '100%'
                                                        }}
                                                    >
                                                        <div
                                                            className={
                                                                styles.diagramTools
                                                            }
                                                        >
                                                            <Button
                                                                onClick={() =>
                                                                    zoomIn()
                                                                }
                                                            >
                                                                <IconPlusCircle
                                                                    size='sm'
                                                                    className={
                                                                        styles.zoomControlIcon
                                                                    }
                                                                />{' '}
                                                                Zoom In
                                                            </Button>
                                                            <Button
                                                                onClick={() =>
                                                                    zoomOut()
                                                                }
                                                            >
                                                                <IconMinusCircle
                                                                    size='sm'
                                                                    className={
                                                                        styles.zoomControlIcon
                                                                    }
                                                                />{' '}
                                                                Zoom Out
                                                            </Button>
                                                            <Button
                                                                onClick={() =>
                                                                    resetTransform()
                                                                }
                                                            >
                                                                <IconCancelCircle
                                                                    size='sm'
                                                                    className={
                                                                        styles.zoomControlIcon
                                                                    }
                                                                />{' '}
                                                                Reset
                                                            </Button>
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.downloadActions
                                                            }
                                                        >
                                                            <Button
                                                                onClick={
                                                                    currentImage &&
                                                                    currentImageFileName
                                                                        ? downloadImage(
                                                                              currentImage,
                                                                              currentImageFileName
                                                                          )
                                                                        : () => {}
                                                                }
                                                                aria-disabled={
                                                                    !(
                                                                        currentImage &&
                                                                        currentImageFileName
                                                                    )
                                                                }
                                                            >
                                                                <IconDownload size='sm' />{' '}
                                                                Download
                                                            </Button>
                                                        </div>
                                                        <TransformComponent
                                                            wrapperClass={
                                                                styles.transformWrapper
                                                            }
                                                        >
                                                            <Image
                                                                alt={fileName}
                                                                src={
                                                                    image ?? ''
                                                                }
                                                                className={
                                                                    styles.carouselImage
                                                                }
                                                                width={500}
                                                                height={500}
                                                            />
                                                        </TransformComponent>
                                                    </div>
                                                </>
                                            )}
                                        </TransformWrapper>
                                    </Box>
                                )
                            })}
                        </HStack>
                    </Box>

                    <IconButton
                        aria-label='previous slide'
                        position='absolute'
                        left='8px'
                        top='50%'
                        transform='translateY(-50%)'
                        onClick={() =>
                            setActiveIndex(prev => {
                                const page =
                                    prev === 0 ? images.length - 1 : prev - 1
                                handleCarouselChange(page)
                                return page
                            })
                        }
                        _dark={{ bg: 'black' }}
                    >
                        <IconChevronLeft color='white' isFilled={true} />
                    </IconButton>

                    <IconButton
                        aria-label='next'
                        position='absolute'
                        right='2'
                        top='50%'
                        onClick={() =>
                            setActiveIndex(prev => {
                                const page =
                                    prev === images.length - 1 ? 0 : prev + 1
                                handleCarouselChange(page)
                                return page
                            })
                        }
                        _dark={{ bg: 'black' }}
                    >
                        <IconChevronRight color='white' isFilled={true} />
                    </IconButton>

                    <HStack
                        justify='center'
                        mt={4}
                        bottom='10%'
                        position='absolute'
                        left='50%'
                        bgColor='rgba(0, 0, 0, 0.6)'
                        p='0.8125rem'
                        borderRadius='0.25rem'
                    >
                        {images.map((_, index) => (
                            <Button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                size='xs'
                                minW='10px'
                                h='10px'
                                p='0'
                                borderRadius='full'
                                bg={activeIndex === index ? 'white' : 'gray'}
                                width={activeIndex === index ? '15px' : '10px'}
                                height={activeIndex === index ? '15px' : '10px'}
                                _hover={{ bg: 'white' }}
                            />
                        ))}
                    </HStack>
                </Box>
            </div>
        </div>
    )
}

export default DiagramPreview
