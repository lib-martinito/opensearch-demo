import parse from 'html-react-parser'

const SearchSuggestions = (props) => {
    const { isVisible, suggestions, resources, didYouMeanSuggestions } = props
    return (
        <div className={`box block ${isVisible ? '' : 'is-hidden'}`}>
            { didYouMeanSuggestions.length === 0 &&
                <>
                    <p className='title is-6 pt-4'>Suggestions</p>
                    {suggestions.length > 0 &&
                        suggestions.map(suggestion =>
                            <p key={suggestion.id}>{parse(suggestion.name.toString())}</p>
                        )
                    }
                    <p className='title is-6 pt-6'>Resources</p>
                    {resources.length > 0 &&
                        resources.map(resource =>
                            <p key={resource.id}>{parse(resource.name.toString())}</p>
                        )
                    }
                </>
            }
            { didYouMeanSuggestions.length !== 0 &&
                <>
                    <p className='title is-6 pt-6'>Did you mean:</p>
                    {
                        didYouMeanSuggestions.map(suggestion =>
                            <p key={suggestion.id}>{parse(suggestion.name.toString())}</p>
                        )
                    }
                </>
            }
        </div>
    )
}

export default SearchSuggestions
