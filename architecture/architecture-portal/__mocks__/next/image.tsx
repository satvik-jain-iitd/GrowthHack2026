const MockNextImage = ({
    src,
    alt,
    width,
    height
}: {
    src: string
    alt: string
    width?: number
    height?: number
}) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} />
}

export default MockNextImage
