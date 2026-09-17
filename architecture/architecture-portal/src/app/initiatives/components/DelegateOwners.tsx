/* istanbul ignore file */
import React, { useState } from 'react'
import {
    Box,
    Button,
    Field,
    Flex,
    GridItem,
    Input,
    InputGroup,
    Text
} from '@chakra-ui/react'
import { IconCancelCircle } from '@americanexpress/dls-icons'

function DelegateOwners({
    delegates,
    setDelegates
}: {
    delegates: string[]
    setDelegates: (e: string[]) => void
}) {
    const [delegateEmail, setDelegateEmail] = useState('')
    const [error, setError] = useState('')

    const isEmailValid = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.endsWith('@aexp.com')

    const handleEmailAdd = () => {
        if (!isEmailValid(delegateEmail)) {
            setError('Invalid email address')
        } else {
            setError('')
            setDelegates([...delegates, delegateEmail])
            setDelegateEmail('')
        }
    }

    return (
        <>
            <GridItem>
                <Field.Root invalid={!!error}>
                    <Field.Label>
                        <Text textStyle='sm' fontWeight='bold'>
                            Delegates
                        </Text>
                    </Field.Label>

                    <InputGroup
                        flex={'1'}
                        endElement={
                            <Button
                                size={'xs'}
                                colorPalette={'blue'}
                                fontWeight={'bold'}
                                onClick={() => {
                                    handleEmailAdd()
                                }}
                            >
                                Add
                            </Button>
                        }
                    >
                        <Input
                            width='600px'
                            placeholder='Add Delegate (e.g. user@aexp.com)'
                            value={delegateEmail}
                            onInput={e => {
                                setDelegateEmail(e.currentTarget.value)
                            }}
                        />
                    </InputGroup>
                    {error && <Text color='red'>{error}</Text>}
                    <Box>
                        {delegates.map((email, index) => (
                            <Flex
                                key={index}
                                alignItems='center'
                                pr={2}
                                pl={2}
                                mt={1}
                                borderWidth='1px'
                                borderRadius='md'
                                width={'fit-content'}
                            >
                                <Text mr={2}>{email}</Text>

                                <IconCancelCircle
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        const updatedDelegates =
                                            delegates.filter(
                                                (_, i) => i !== index
                                            )
                                        setDelegates(updatedDelegates)
                                    }}
                                />
                            </Flex>
                        ))}
                    </Box>
                </Field.Root>
            </GridItem>
        </>
    )
}

export default DelegateOwners
