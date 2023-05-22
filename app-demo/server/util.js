import payload from './payload.js'

const getPayload = (type, query) => {
    if (type === 'suggestions') {
        return payload.getSuggestionsPayload(query)
    }
    if (type === 'resources') {
        return payload.getResourcesPayload(query)
    }
    if (type === 'did-you-mean') {
        return payload.getSpellCheckPayload(query)
    }
}

const getSuggestions = (result) => {
    const unsortedSuggestions = []
    const responses = result.body.responses
    for (let i = 0; i < responses.length; i++) {
        if (responses[i].hits.total.value !== 0) {
            responses[i].hits.hits.map(hit => {
                unsortedSuggestions.push(hit)
            })
        }
    }
    const sortedSuggestions = unsortedSuggestions.sort((a, b) => a._score - b._score)
    const filteredSuggestions = sortedSuggestions.map(suggestion => {
        return {
            id: suggestion._source.id,
            name: suggestion.highlight.name
        }
    })
    return filteredSuggestions.length > 5 ? 
        filteredSuggestions.slice(0, 5) : 
        filteredSuggestions
}

const getResources = (result) => {
    const resources = []
    const response = result.body
    if (response.hits.total.value !== 0) {
        response.hits.hits.map(hit => {
            resources.push({
                id: hit._source.id,
                name: hit.highlight.name
            })
        })
    }
    return resources
}

const getFullResources = (result) => {
    const response = result.body
    const total = response.hits.total.value
    const resources = []
    const subjects = []
    const curriculums = []
    const year_levels = []
    response.hits.hits.map(hit => {
        resources.push(hit._source)
    })
    response.aggregations.unique_subjects.buckets.map(bucket => {
        subjects.push(bucket.key)
    })
    response.aggregations.unique_curriculums.buckets.map(bucket => {
        curriculums.push(bucket.key)
    })
    response.aggregations.unique_year_levels.buckets.map(bucket => {
        year_levels.push(bucket.key)
    })
    return {
        type: 'resources',
        total,
        resources,
        subjects,
        curriculums,
        year_levels
    }
}

const getSpellCheckSuggestion = (result) => {
    const suggestions = []
    const responses = result.body.responses
    for (let i = 0; i < responses.length; i++) {
        const options = responses[i].suggest.phrase_check[0].options
        if (options.length !== 0) {
            options.map(option => {
                suggestions.push(option)
            })
        }
    }
    const sortedSuggestions = suggestions.sort((a, b) => a.score - b.score)
    return sortedSuggestions[0]
}

const getResult = async (client, type, reqPayload) => {
    if (type === 'suggestions') {
        const result = await client.msearch({ body: reqPayload })
        const suggestions = getSuggestions(result)
        return { type: 'suggestions', suggestions }
    }
    if (type === 'resources') {
        const result = await client.search({ index: 'books', body: reqPayload })
        const resources = getResources(result)
        return { type: 'resources', resources }
    }
    if (type === 'did-you-mean') {
        const spellCheckResult = await client.msearch({ body: reqPayload })
        const suggestion = getSpellCheckSuggestion(spellCheckResult)
        if (!suggestion) {
            return { type: 'did-you-mean', suggestions: [] }
        }
        const didYouMeanPayload = payload.getDidYouMeanPayload(suggestion.text)
        const result = await client.msearch({ body: didYouMeanPayload })
        const suggestions = getSuggestions(result)
        return { type: 'did-you-mean', suggestions }
    }
}

const getFullResult = async (client, payload) => {
    const result = await client.search({ index: 'books', body: payload })
    const resources = getFullResources(result)
    return resources
}

const getFilters = (subjectsFilters, curriculumsFilters, yearLevelsFilters) => {
    const filters = []
    subjectsFilters?.split(',').map(filter => {
        filters.push({
            type: 'subjects',
            name: filter
        })
    })
    curriculumsFilters?.split(',').map(filter => {
        filters.push({
            type: 'curriculums',
            name: filter
        })
    })
    yearLevelsFilters?.split(',').map(filter => {
        filters.push({
            type: 'year_levels',
            name: filter
        })
    })
    return filters
}

export default {
    getPayload,
    getResult,
    getFullResult,
    getFilters
}
