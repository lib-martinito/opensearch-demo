import axios from 'redaxios'

const baseUrl = '/api'

const search = async (type, query) => {
    try {
        const url = `${baseUrl}/search?type=${type}&query=${query}`
        const result = await axios.get(url)
        return result
    } catch (err) {
        console.error(err)
    }
}

const buildUrl = (userFilters, page, size, query) => {
    const subjectFilters = []
    const curriculumFilters = []
    const yearLevelFilters = []
    const filterStrings = []

    userFilters.map(userFilter => {
        if (userFilter.type.toLowerCase() === 'subjects') {
            subjectFilters.push(userFilter.name)
        }
        if (userFilter.type.toLowerCase() === 'curriculums') {
            curriculumFilters.push(userFilter.name)
        }
        if (userFilter.type.toLowerCase() === 'year levels') {
            yearLevelFilters.push(userFilter.name)
        }
    })

    if (subjectFilters.length !== 0) {
        const filterString = subjectFilters.join(',')
        const encodedFilterString = encodeURI(filterString)
        filterStrings.push(`subjects_filter=${encodedFilterString}`)
    }
    if (curriculumFilters.length !== 0) {
        const filterString = curriculumFilters.join(',')
        const encodedFilterString = encodeURI(filterString)
        filterStrings.push(`curriculums_filter=${encodedFilterString}`)
    }
    if (yearLevelFilters.length !== 0) {
        const filterString = yearLevelFilters.join(',')
        const encodedFilterString = encodeURI(filterString)
        filterStrings.push(`year_levels_filter=${encodedFilterString}`)
    }
    if (filterStrings.length !== 0) {
        return `${baseUrl}/fullSearch?${filterStrings.join('&')}&page=${page}&size=${size}&query=${query}`
    }
    return `${baseUrl}/fullSearch?page=${page}&size=${size}&query=${query}`
}

const fullSearch = async (userFilters = [], page = 1, size = 20, query) => {
    try {
        const url = buildUrl(userFilters, page, size, query)
        const result = await axios.get(url)
        return result
    } catch (err) {
        console.error(err)
    }
}

export default {
    search,
    fullSearch
}
