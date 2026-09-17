export const DomainDescription = ({
    domain_name,
    domain_description
}: {
    domain_name: string
    domain_description: string
}) => (
    <div className='description'>
        <div>
            <span style={{ fontWeight: 700 }}>{domain_name}: </span>
            {domain_description || '--'}
        </div>
    </div>
)
