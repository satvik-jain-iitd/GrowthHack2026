/* istanbul ignore file */
export const scrollToExpandedData = (
    id: string,
    dataTestId: string,
    parentTable: string | boolean = false
) => {
    if (
        id &&
        document.querySelector(`[data-testid=${dataTestId}]`) &&
        (parentTable
            ? document.querySelector(`[data-testid=${parentTable}]`)
            : true)
    ) {
        const element = document.querySelector(`[data-testid=${dataTestId}]`)
        let scrollableParent = element?.parentElement
        const parent =
            parentTable &&
            document.querySelector(`[data-testid=${parentTable}]`)

        while (scrollableParent && scrollableParent != document.body) {
            const hasScroll =
                scrollableParent.scrollHeight > scrollableParent.clientHeight
            const overflowY =
                window.getComputedStyle(scrollableParent).overflowY
            if (hasScroll && (overflowY === 'auto' || overflowY === 'scroll')) {
                scrollableParent.scrollTo({
                    top:
                        (element?.getBoundingClientRect()?.top || 0) -
                        (scrollableParent?.getBoundingClientRect().top || 0) +
                        scrollableParent.scrollTop -
                        (parent ? parent.getBoundingClientRect().height : 0),
                    behavior: 'smooth'
                })
                break
            }
            scrollableParent = scrollableParent.parentElement
        }
    }
}
