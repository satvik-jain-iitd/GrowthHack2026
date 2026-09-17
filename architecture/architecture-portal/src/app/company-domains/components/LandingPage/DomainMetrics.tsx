import { SubDomainsIcon } from '@/components/icons'
import { Box, Grid } from '@chakra-ui/react'

export const DomainMetrics = ({ subDomains }: { subDomains: number }) => (
    <>
        {subDomains !== 0 && (
            <Grid>
                <Box display={'flex'} alignItems={'center'}>
                    <Box>
                        <SubDomainsIcon color={'#61c5ff'} />
                    </Box>
                    <Box ml={2}>
                        <div
                            style={{
                                fontSize: '40px',
                                fontWeight: '700',
                                color: '#006fcf',
                                lineHeight: '44px'
                            }}
                        >
                            {subDomains}
                        </div>
                        <div
                            style={{
                                color: ' #006fcf',
                                fontSize: '16px',
                                fontWeight: '600'
                            }}
                        >
                            SUBDOMAINS
                        </div>
                    </Box>
                </Box>
            </Grid>
        )}
    </>
)
