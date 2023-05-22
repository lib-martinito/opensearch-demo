const getSuggestionsPayload = (query) => {
    return [
        { index: 'subjects' },
        {
            query: {
                match: {
                    name: {
                        query,
                        analyzer: 'standard'
                    }
                }
            },
            _source: ['id', 'name'],
            size: 5,
            highlight: {
                pre_tags: [
                    '<strong>'
                ],
                post_tags: [
                    '</strong>'
                ],
                fields: {
                    name: {}
                }
            },
        },
        { index: 'books' },
        {
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                name: {
                                    query,
                                    analyzer: 'standard'
                                }
                            }
                        }
                    ],
                    must_not: [
                        {
                            match: {
                                title_id: 0
                            }
                        }
                    ]
                }
            },
            _source: ['id', 'name'],
            size: 5,
            highlight: {
                pre_tags: [
                    '<strong>'
                ],
                post_tags: [
                    '</strong>'
                ],
                fields: {
                    name: {}
                }
            }
        }
    ]
}

const getResourcesPayload = (query) => {
    return {
        query: {
            match: {
                name: {
                    query,
                    analyzer: 'standard'
                }
            }
        },
        _source: ['id', 'name'],
        size: 5,
        highlight: {
            pre_tags: [
                '<strong>'
            ],
            post_tags: [
                '</strong>'
            ],
            fields: {
                name: {}
            }
        }
    }
}

const getMustFilters = (query, filters) => {
    const mustFilters = []
    mustFilters.push({
        match: {
            name: {
                query,
                analyzer: 'standard'
            }
        }
    })
    if (filters.length === 0) {
        return mustFilters
    }
    filters.map(filter => {
        if (filter.type === 'subjects') {
            mustFilters.push({
                match: {
                    subjects: filter.name
                }
            })
        }
        if (filter.type === 'curriculums') {
            mustFilters.push({
                match: {
                    curriculums: filter.name
                }
            })
        }
        if (filter.type === 'year_levels') {
            mustFilters.push({
                match: {
                    year_levels: filter.name
                }
            })
        }
    })
    return mustFilters
}

const getFullResourcesPayload = (query, filters = [], page = 1, size = 20) => {
    const mustFilters = getMustFilters(query, filters)
    return {
        from: size * (page - 1),
        size,
        query: {
            bool: {
                must: mustFilters,
            }
        },
        aggs: {
            unique_subjects: {
                terms: {
                    field: 'subjects.keyword',
                    size: 100
                }
            },
            unique_curriculums: {
                terms: {
                    field: 'curriculums.keyword',
                    size: 100
                }
            },
            unique_year_levels: {
                terms: {
                    field: 'year_levels.keyword',
                    size: 100
                }
            }
        }
    }
}

const getSpellCheckPayload = (query) => {
    return [
        { index: 'subjects' },
        {
            suggest: {
                phrase_check: {
                    text: query,
                    phrase: {
                        field: 'name.trigram',
                        direct_generator: [
                            {
                                field: 'name.trigram',
                                suggest_mode: 'always'
                            }
                        ]
                    }
                }
            }
        },
        { index: 'books' },
        {
            suggest: {
                phrase_check: {
                    text: query,
                    phrase: {
                        field: 'name.trigram',
                        direct_generator: [
                            {
                                field: 'name.trigram',
                                suggest_mode: 'always'
                            }
                        ]
                    }
                }
            }
        }
    ]
}

const getDidYouMeanPayload = (query) => {
    return [
        { index: 'subjects' },
        {
            query: {
                match: {
                    name: {
                        query,
                        analyzer: 'standard'
                    }
                }
            },
            _source: ['id', 'name'],
            size: 5,
            highlight: {
                pre_tags: [
                    '<strong>'
                ],
                post_tags: [
                    '</strong>'
                ],
                fields: {
                    name: {}
                }
            }
        },
        { index: 'books' },
        {
            query: {
                match: {
                    name: {
                        query,
                        analyzer: 'standard'
                    }
                }
            },
            _source: ['id', 'name'],
            size: 5,
            highlight: {
                pre_tags: [
                    '<strong>'
                ],
                post_tags: [
                    '</strong>'
                ],
                fields: {
                    name: {}
                }
            }
        }
    ]
}

export default {
    getSuggestionsPayload,
    getResourcesPayload,
    getSpellCheckPayload,
    getDidYouMeanPayload,
    getFullResourcesPayload
}
