import axios from 'axios'
import fs from 'fs'

const username = 'admin'
const password = 'admin'

const assets_path = 'cup_content/images'
const cdn_uri = 'https://go-assets-dev.cambridgedev.org'

const base_url = 'http://localhost:9200'

const isString = (text) => {
	return typeof text === 'string' || text instanceof String
}

const parseArguments = (args) => {
	if (args.length < 4) throw new Error('not enough arguments')
	if (args.length > 4) throw new Error('too much arguments')

	const file = args[2]
	const index = args[3]

	if (!isString(file) || !isString(index)) {
		throw new Error('provided values are not strings')
	}
	return { file, index }
}

const migrate_books = async (file, index) => {
	const books = JSON.parse(fs.readFileSync(file, 'utf-8'))
	for (let i = 0; i < books.data.length; i++) {
		const book = books.data[i]
		console.log (book)
		if (book.published_at === '0000-00-00 00:00:00') {
			continue
		}
		const subjects = book.subjects ?
			book.subjects.split(/,(?!\s)/) :
			null
		const curriculums = book.curriculums ?
			book.curriculums.split(',') :
			null
		const year_levels = book.year_levels ?
			book.year_levels.split(',') :
			null
		const thumbnail_url = book.thumbnail_path ?
			book.thumbnail_path.includes(assets_path) ?
				`${cdn_uri}/${book.thumbnail_path}` :
				null :
			null
		const entry = {
			...book,
			subjects,
			curriculums,
			year_levels,
			thumbnail_url
		}
		await axios({
			method: 'POST',
			url: `${base_url}/${index}/_doc/${book.id}`,
			auth: { username, password },
			data: entry
		})
		console.log('successful migration')
	}
	console.log('migration finished')
}


const migrate = async (file, index) => {
	const object = JSON.parse(fs.readFileSync(file, 'utf-8'))
    const indexArr = index.split('_')
	const data = object[indexArr[0]]
	for (let i = 0; i < data.length; i++) {
		await axios({
			method: 'POST',
			url: `${base_url}/${index}/_doc/${data[i].id}`,
			auth: { username, password },
			data: data[i]
		})
		console.log('successful migration')
	}
	console.log('migration finished')
}

try {
	const { file, index } = parseArguments(process.argv)
	if (index.includes('books')) {
		migrate_books(file, index)
	} else {
		migrate(file, index)
	}
} catch (err) {
	console.error(err)
}
