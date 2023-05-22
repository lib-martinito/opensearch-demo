const Pagination = (props) => {
    const {total, size, currentPage, goToPrevious, goToNext} = props
    return (
        <nav className='pagination'>
            <a 
                className={`
                    pagination-previous
                    ${currentPage === 1 ? 'is-disabled' : ''}
                `}
                onClick={goToPrevious}
            >Previous</a>
            <a 
                className={`
                    pagination-next
                    ${currentPage === Math.ceil(total / size) ? 'is-disabled' : ''}
                `}
                onClick={goToNext}
            >Next</a>
        </nav>
    )
}

export default Pagination
