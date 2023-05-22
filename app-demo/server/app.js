import express from 'express'
import { Client } from '@opensearch-project/opensearch'
import util from './util.js'
import payload from './payload.js'

const app = express()

const host = 'localhost'
const protocol = 'http'
const port = 9200
const auth = 'admin:admin'

const client = new Client({ node: `${protocol}://${auth}@${host}:${port}` })

app.use(express.static('dist'))
app.use(express.json())

app.get('/api/search', async (req, res) => {
    const { type, query } = req.query
    const decodedQuery = decodeURI(query)

    const payload = util.getPayload(type, decodedQuery)

    try {
        const result = await util.getResult(client, type, payload)
        res.status(200).json(result)
    } catch (err) {
        console.error(err)
    }
})

app.get('/api/fullSearch', async (req, res) => {
    const { 
        subjects_filter, 
        curriculums_filter, 
        year_levels_filter, 
        page, 
        size, 
        query 
    } = req.query
    const decodedQuery = decodeURI(query)

    const filters = util.getFilters(subjects_filter, curriculums_filter, year_levels_filter)
    const fullPayaload = payload.getFullResourcesPayload(decodedQuery, filters, page, size)

    try {
        const result = await util.getFullResult(client, fullPayaload)
        res.status(200).json(result)
    } catch (err) {
        console.error(err)
    }
})

app.listen(3000, () => {
    console.log('Server now listening on port 3000')
})
