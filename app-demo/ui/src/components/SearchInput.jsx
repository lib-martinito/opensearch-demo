const SearchInput = (props) => {
    const { query, handleQueryChange, handleSubmit } = props

    return (
        <form
            className='block is-flex field'
            onSubmit={handleSubmit}
        >
            <input
                className='input'
                type='text'
                placeholder='Search...'
                value={query}
                onInput={handleQueryChange}
            />
            <button className='button ml-4' type='submit'>Submit</button>
        </form>
    )
}

export default SearchInput
