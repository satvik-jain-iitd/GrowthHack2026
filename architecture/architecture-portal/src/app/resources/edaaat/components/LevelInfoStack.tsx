/* istanbul ignore file */
import { VStack, Flex, Box, Text } from '@chakra-ui/react'
import styles from '../edaaat.module.css'
import Image from 'next/image'
import { LevelInfoStackProps } from '@/app/resources/edaaat/utils/interfaces'

const LevelInfoStack: React.FC<LevelInfoStackProps> = ({
    features,
    expandedItemId,
    setExpandedItemId
}) => {
    return (
        <VStack align='stretch' m='2rem' className={styles.levelInfoStack}>
            <Flex gap='2rem' align='flex-start'>
                <Box flex='1'>
                    {features.map(item => (
                        <Box
                            key={item.id}
                            mb='1rem'
                            borderLeft={
                                expandedItemId === item.id
                                    ? '4px solid #006FCF'
                                    : '4px solid transparent'
                            }
                        >
                            <Flex
                                p='1rem'
                                cursor='pointer'
                                onClick={() => setExpandedItemId(item.id)}
                            >
                                <Text
                                    className={`${styles.descriptionLabel} ${
                                        expandedItemId === item.id
                                            ? styles.descriptionLabelSelected
                                            : styles.descriptionLabelUnselected
                                    }`}
                                    _dark={
                                        expandedItemId === item.id
                                            ? { color: '#3182ce' }
                                            : { color: 'white' }
                                    }
                                >
                                    {item.descriptionLabel}
                                </Text>
                            </Flex>

                            {expandedItemId === item.id && (
                                <Box px='1rem' pb='1rem'>
                                    <Text
                                        className={styles.descriptionContent}
                                        _dark={{ color: 'white' }}
                                    >
                                        {item.descriptionContent}
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
                <Box
                    flex={1}
                    position='sticky'
                    top='100px'
                    borderRadius='6px'
                    boxShadow='sm'
                    p='1rem'
                >
                    <Text className={styles.sampleImageText}>Sample</Text>
                    {features
                        .filter(item => item.id === expandedItemId)
                        .map(item => (
                            <Image
                                key={item.id}
                                src={item.imageSrc}
                                alt={item.descriptionLabel}
                                className={styles.image}
                                width={500}
                                height={500}
                            />
                        ))}
                </Box>
            </Flex>
        </VStack>
    )
}

export default LevelInfoStack
