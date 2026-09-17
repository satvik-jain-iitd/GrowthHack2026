/* istanbul ignore file */
import React, { useState } from 'react'
import { Button, Circle, Dialog } from '@chakra-ui/react'
import styles from '@/app/company-domains/modals.module.css'
import Image from 'next/image'

export interface EBCMDetailsProps {
    data?: {
        level1_name?: string
        level2_name?: string
        level3_name?: string
        level4_name?: string
        level1_desc?: string
        level1_start?: string
        level1_end?: string
        level1_includes?: string
        level2_desc?: string
        level2_start?: string
        level2_end?: string
        level2_includes?: string
        level3_desc?: string
        level3_start?: string
        level3_end?: string
        level3_includes?: string
        level4_desc?: string
        level4_start?: string
        level4_end?: string
        level4_includes?: string
    }
    isOpen: boolean
    onClose: () => void
}

const EBCMDetails: React.FC<EBCMDetailsProps> = ({ data, isOpen, onClose }) => {
    const [levelActive, setLevelActive] = useState({
        levelOne:
            !data?.level4_name && !data?.level3_name && !data?.level2_name,
        levelTwo: !data?.level4_name && !data?.level3_name,
        levelThree: !data?.level4_name,
        levelFour: data?.level4_name != ''
    })
    const levelDetails = levelActive.levelOne
        ? {
              level_desc: data?.level1_desc,
              level_start: data?.level1_start,
              level_end: data?.level1_end,
              level_includes: data?.level1_includes
          }
        : levelActive.levelTwo
          ? {
                level_desc: data?.level2_desc,
                level_start: data?.level2_start,
                level_end: data?.level2_end,
                level_includes: data?.level2_includes
            }
          : levelActive.levelThree
            ? {
                  level_desc: data?.level3_desc,
                  level_start: data?.level3_start,
                  level_end: data?.level3_end,
                  level_includes: data?.level3_includes
              }
            : {
                  level_desc: data?.level4_desc,
                  level_start: data?.level4_start,
                  level_end: data?.level4_end,
                  level_includes: data?.level4_includes
              }
    const onClickActiveLevel = (activeLevel: string) => {
        setLevelActive(prevState => ({
            ...prevState,
            levelOne: activeLevel === 'levelOne',
            levelTwo: activeLevel === 'levelTwo',
            levelThree: activeLevel === 'levelThree',
            levelFour: activeLevel === 'levelFour'
        }))
    }

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={isOpen => {
                if (!isOpen) onClose()
            }}
            size='md'
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content
                    className={styles.modalContent}
                    style={{ height: '500px', overflow: 'auto' }}
                >
                    <Dialog.Header className={styles.modalHeader}>
                        <Dialog.Title>
                            {data?.level4_name || data?.level3_name}
                        </Dialog.Title>
                        <Dialog.CloseTrigger />
                    </Dialog.Header>
                    <Dialog.Body className='flex flex-wrap'>
                        <div className={`${styles.col} ${styles.levelsAction}`}>
                            {data?.level1_name && (
                                <div
                                    className={
                                        levelActive.levelOne
                                            ? styles.ebcmLevelActive
                                            : styles.ebcmLevel
                                    }
                                    onClick={() =>
                                        onClickActiveLevel('levelOne')
                                    }
                                >
                                    EBCM Level 1
                                    <p>
                                        <strong>{data?.level1_name}</strong>
                                    </p>
                                </div>
                            )}

                            {data?.level2_name && (
                                <div
                                    className={
                                        levelActive.levelTwo
                                            ? styles.ebcmLevelActive
                                            : styles.ebcmLevel
                                    }
                                    onClick={() =>
                                        onClickActiveLevel('levelTwo')
                                    }
                                >
                                    EBCM Level 2
                                    <p>
                                        <strong>{data?.level2_name}</strong>
                                    </p>
                                </div>
                            )}
                            {data?.level3_name && (
                                <div
                                    className={
                                        levelActive.levelThree
                                            ? styles.ebcmLevelActive
                                            : styles.ebcmLevel
                                    }
                                    onClick={() =>
                                        onClickActiveLevel('levelThree')
                                    }
                                >
                                    EBCM Level 3
                                    <p>
                                        <strong>{data?.level3_name}</strong>
                                    </p>
                                </div>
                            )}
                            {data?.level4_name && (
                                <div
                                    className={
                                        levelActive.levelFour
                                            ? styles.ebcmLevelActive
                                            : styles.ebcmLevel
                                    }
                                    onClick={() =>
                                        onClickActiveLevel('levelFour')
                                    }
                                >
                                    EBCM Level 4
                                    <p>
                                        <strong>{data?.level4_name}</strong>
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className='col-md-8'>
                            <div className={`col-md-12 ${styles.ebcmInfo}`}>
                                {levelDetails.level_desc}
                            </div>
                            <div className='col-md-12 flex'>
                                <div className={`col-md-6 ${styles.ebcmInfo}`}>
                                    <Image
                                        src='/company-domains/list-check-all-svgrepo.png'
                                        alt='Icon'
                                        width={50}
                                        height={50}
                                    />
                                    <strong>Includes</strong>
                                    <p>{levelDetails.level_includes}</p>
                                </div>
                                <div className='col-md-6'>
                                    <div
                                        className={`col-md-12 ${styles.ebcmInfo}`}
                                    >
                                        <Image
                                            src='/company-domains/panel-road-sign-svgrepo.png'
                                            alt='Icon'
                                            width={50}
                                            height={50}
                                        />
                                        <strong>Begins with</strong>
                                        <p>{levelDetails.level_start}</p>
                                    </div>
                                    <div
                                        className={`col-md-12 ${styles.ebcmInfo}`}
                                    >
                                        <Image
                                            src='/company-domains/flag-svgrepo.png'
                                            alt='Icon'
                                            width={50}
                                            height={50}
                                        />
                                        <strong>Ends with</strong>
                                        <p>{levelDetails.level_end}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-1 flex flex-justify-end flex-wrap'>
                            <Circle
                                size='100px'
                                bg='#006FCF'
                                color='white'
                                className={styles.levelImage}
                            >
                                <strong>Level</strong>
                                <p>
                                    {levelActive.levelOne
                                        ? '1'
                                        : levelActive.levelTwo
                                          ? '2'
                                          : levelActive.levelThree
                                            ? '3'
                                            : '4'}
                                </p>
                            </Circle>
                        </div>
                    </Dialog.Body>
                    <Dialog.Footer className={styles.closeButton}>
                        <Button
                            variant='outline'
                            colorScheme='blue'
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default EBCMDetails
