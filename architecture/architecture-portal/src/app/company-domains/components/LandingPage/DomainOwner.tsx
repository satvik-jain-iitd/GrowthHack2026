'use client'
import { Avatar, Popover, Portal } from '@chakra-ui/react'
import styles from '@/app/company-domains/display-user.module.css'
import { Domain } from '@/app/company-domains/types'
import { useUserAvatar } from '@/hooks'

const DisplayUsers = ({
    heading,
    name,
    email
}: {
    heading?: string
    name: string
    email: string
}) => {
    const names = name?.split(',') || []
    const { avatarUrl, isLoading } = useUserAvatar(email ?? '')

    return (
        <div className={styles.userDisplayContainer}>
            <div className={styles.imageContainer}>
                <Avatar.Root height={'30px'} width={'30px'}>
                    <Avatar.Fallback name={name} />
                    {!isLoading && avatarUrl && (
                        <Avatar.Image src={avatarUrl} alt={email} />
                    )}
                </Avatar.Root>
            </div>
            <div className={styles.textContainer}>
                <div className={styles.textHeading}>{heading}</div>
                <div className={styles.textName}>
                    {names.length > 1 ? (
                        <Popover.Root>
                            <Popover.Trigger asChild>
                                <span className={styles.popoverTrigger}>
                                    Show {names.length} Delegates
                                </span>
                            </Popover.Trigger>

                            <Portal>
                                <Popover.Positioner>
                                    <Popover.Content
                                        style={{
                                            border: '1px solid black'
                                        }}
                                        className={styles.popOver}
                                    >
                                        <Popover.Body>
                                            {email &&
                                                email
                                                    .split(',')
                                                    .map((element, index) => {
                                                        return (
                                                            <div
                                                                className='popOver'
                                                                key={index}
                                                            >
                                                                <DisplayUsers
                                                                    key={index}
                                                                    email={
                                                                        element
                                                                    }
                                                                    name={
                                                                        names[
                                                                            index
                                                                        ]
                                                                    }
                                                                    heading={
                                                                        undefined
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    })}
                                        </Popover.Body>

                                        <Popover.CloseTrigger />
                                    </Popover.Content>
                                </Popover.Positioner>
                            </Portal>
                        </Popover.Root>
                    ) : (
                        name
                    )}
                </div>
            </div>
        </div>
    )
}

export const DomainOwners = ({ domain }: { domain: Domain | undefined }) => {
    const {
        unit_cio_nm,
        tech_owner_nm,
        principal_ea_architect_nm,
        head_engineer_nm,
        ea_architect_delegate_nm,
        ea_archt_dlgte_email_ad_da,
        head_engnr_email_ad_da,
        ea_archt_email_ad_da,
        princ_ea_archt_email_ad_da,
        tech_own_email_ad_da,
        unit_cio_email_ad_da,
        ea_architect_nm
    } = domain || ({} as Domain)

    return (
        <div style={{ marginTop: '30px' }} className={styles.domainOwners}>
            <DisplayUsers
                heading='Unit CIO'
                name={unit_cio_nm}
                email={unit_cio_email_ad_da?.[0]}
            />

            <DisplayUsers
                heading='Tech Owner'
                name={tech_owner_nm}
                email={tech_own_email_ad_da?.[0]}
            />

            <DisplayUsers
                heading='Principal Architect'
                name={principal_ea_architect_nm}
                email={princ_ea_archt_email_ad_da?.[0]}
            />

            <DisplayUsers
                heading='Enterprise Architect'
                name={ea_architect_nm}
                email={ea_archt_email_ad_da?.[0]}
            />

            <DisplayUsers
                heading='Head Engineer'
                name={head_engineer_nm}
                email={head_engnr_email_ad_da?.[0]}
            />

            <DisplayUsers
                heading='Unit CIO Architect (delegate)'
                name={ea_architect_delegate_nm}
                email={
                    Array.isArray(ea_archt_dlgte_email_ad_da)
                        ? ea_archt_dlgte_email_ad_da.join(', ')
                        : ea_archt_dlgte_email_ad_da
                }
            />
        </div>
    )
}
