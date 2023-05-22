import { useState, useEffect } from 'react'
import queryService from './services/query.service.js'
import SearchInput from './components/SearchInput.jsx'
import SearchSuggestions from './components/SearchSuggestions.jsx'
import Filters from './components/Filters.jsx'
import Pagination from './components/Pagination.jsx'
import Resources from './components/Resources.jsx'

const App = () => {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [resources, setResources] = useState([])
    const [didYouMeanSuggestions, setDidYouMeanSuggestions] = useState([])

    const [fullResources, setFullResources] = useState({})
    const [filterGroups, setFilterGroups] = useState([])
    const [userFilters, setUserFilters] = useState([])
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        if (Object.keys(fullResources).length === 0) {
            return
        }
        const newFilters = []
        newFilters.push({
            name: 'Subjects',
            filters: fullResources.subjects
        })
        newFilters.push({
            name: 'Curriculums',
            filters: fullResources.curriculums
        })
        newFilters.push({
            name: 'Year Levels',
            filters: fullResources.year_levels
        })
        setFilterGroups(newFilters)
    }, [fullResources])

    const size = 20
    const isVisible = suggestions.length > 0 || resources.length > 0 || didYouMeanSuggestions.length > 0

    const handleQueryChange = async ({ target }) => {
        setQuery(target.value)
        const encodedQuery = encodeURI(target.value)

        setDidYouMeanSuggestions([])

        const responses = await Promise.all([
            queryService.search('suggestions', encodedQuery),
            queryService.search('resources', encodedQuery),
            queryService.search('did-you-mean', encodedQuery)
        ])
        responses.map(response => {
            if (response.data.type === 'did-you-mean' &&
                response.data.suggestions.length !== 0) {
                setDidYouMeanSuggestions(response.data.suggestions)
            }
            if (response.data.type === 'suggestions') {
                setSuggestions(response.data.suggestions)
            }
            if (response.data.type === 'resources') {
                setResources(response.data.resources)
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await queryService.fullSearch([], 1, size, query)
        setFullResources(response.data)
        setTotal(response.data.total)
        setCurrentPage(1)
    }

    const handleUserFilterChange = async (filterName, filterGroupName) => {
        const filterNames = userFilters.map(userFilter => userFilter.name)
        const newUserFilters = filterNames.includes(filterName) ?
            userFilters.filter((filter) => filter.name !== filterName) :
            [...userFilters, { type: filterGroupName, name: filterName }]
        setUserFilters(newUserFilters)
        const response = await queryService.fullSearch(newUserFilters, 1, size, query)
        setFullResources(response.data)
        setTotal(response.data.total)
        setCurrentPage(1)
    }

    const goToPrevious = async () => {
        const response = await queryService.fullSearch(userFilters, currentPage - 1, size, query)
        setFullResources(response.data)
        setCurrentPage(currentPage - 1)
    }

    const goToNext = async () => {
        const response = await queryService.fullSearch(userFilters, currentPage + 1, size, query)
        setFullResources(response.data)
        setCurrentPage(currentPage + 1)
    }

    return (
        <div className='container is-max-desktop'>
            <p className='title pt-4'>Search Demo</p>
            <SearchInput 
                query={query} 
                handleQueryChange={handleQueryChange} 
                handleSubmit={handleSubmit}
            />
            <SearchSuggestions
                isVisible={isVisible}
                suggestions={suggestions}
                resources={resources}
                didYouMeanSuggestions={didYouMeanSuggestions}
            />
            <div
                className={`
                    box
                    is-flex
                    is-flex-wrap-wrap
                    is-justify-content-space-between
                    ${filterGroups.length === 0 || total === 0 ? 'is-hidden' : ''}
                `}
            >
                <Filters 
                    filterGroups={filterGroups} 
                    handleUserFilterChange={handleUserFilterChange}
                />
                <Pagination
                    total={total}
                    size={size}
                    currentPage={currentPage}
                    goToPrevious={goToPrevious}
                    goToNext={goToNext}
                />
            </div>
            <Resources fullResources={fullResources} />
        </div>
    )
}

export default App
