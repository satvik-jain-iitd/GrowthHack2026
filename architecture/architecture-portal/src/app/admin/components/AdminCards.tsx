'use client'
import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import { adminTabs } from '../constants/adminTabs'
import Image from 'next/image'
import { useNavigation } from '@/hooks'
import { ADMIN_TEST_IDS } from '../test-ids'
import { useState } from 'react'

export const AdminCards = () => {
    const router = useNavigation()
    const [filled, setFilled] = useState<string | undefined>(undefined)
    return (
        <Box mt={{ base: 4, sm: 12 }} display='flex' justifyContent='center'>
            <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3 }}
                gap={6}
                alignItems='stretch'
                width={{ base: '80%', md: '70%', lg: '60%' }}
            >
                {adminTabs.map((product, index) => (
                    <Box
                        key={product.title}
                        padding={6}
                        borderRadius='lg'
                        border='1px solid'
                        borderColor='border'
                        boxShadow={filled === product.title ? 'xl' : 'md'}
                        transition='box-shadow 0.2s'
                        cursor='pointer'
                        display='flex'
                        flexDirection='column'
                        height='100%'
                        onMouseEnter={() => setFilled(product.title)}
                        onMouseLeave={() => setFilled(undefined)}
                        onClick={() => router.push(product.link)}
                    >
                        <Box
                            data-testid={ADMIN_TEST_IDS.cardTitle}
                            display='flex'
                            alignItems='center'
                            gap={2}
                            fontSize='2xl'
                            mb={2}
                        >
                            {filled === product.title ? (
                                <>
                                    <Image
                                        data-testid={ADMIN_TEST_IDS.cardImage(
                                            index,
                                            'dark-filled'
                                        )}
                                        src={product.darkFilledImgSrc}
                                        alt={`${product.title} filled icon`}
                                        className='image-dark'
                                        width={32}
                                        height={32}
                                    />
                                    <Image
                                        data-testid={ADMIN_TEST_IDS.cardImage(
                                            index,
                                            'light-filled'
                                        )}
                                        src={product.filledImgSrc}
                                        alt={`${product.title} filled icon`}
                                        className='image-light'
                                        width={32}
                                        height={32}
                                    />
                                </>
                            ) : (
                                <>
                                    <Image
                                        data-testid={ADMIN_TEST_IDS.cardImage(
                                            index,
                                            'dark'
                                        )}
                                        src={product.darkImgSrc}
                                        alt={`${product.title} icon`}
                                        className='image-dark'
                                        width={32}
                                        height={32}
                                    />
                                    <Image
                                        data-testid={ADMIN_TEST_IDS.cardImage(
                                            index,
                                            'light'
                                        )}
                                        src={product.imgSrc}
                                        alt={`${product.title} icon`}
                                        className='image-light'
                                        width={32}
                                        height={32}
                                    />
                                </>
                            )}
                            <Text fontSize='lg' color='fg'>
                                {product.title}
                            </Text>
                        </Box>
                        <Text
                            data-testid={ADMIN_TEST_IDS.cardDescription}
                            color='fg.muted'
                            fontSize='sm'
                        >
                            {product.description}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    )
}
