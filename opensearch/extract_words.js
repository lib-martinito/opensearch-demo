import fs from 'fs'

const books = JSON.parse(fs.readFileSync('./data/books.json'))
const subjects = JSON.parse(fs.readFileSync('./data/subjects.json'))

const uniqueWords = []

for (let i = 0; i < books.data.length; i++) {
    const words = books.data[i].name.split(' ')
    for (const word of words) {
        if (!uniqueWords.includes(word)) {
            uniqueWords.push(word)
        }
    }
}

for (let i = 0; i < subjects.subjects.length; i++) {
    const words = subjects.subjects[i].name.split(' ')
    for (const word of words) {
        if (!uniqueWords.includes(word)) {
            uniqueWords.push(word)
        }
    }
}

const uniqueWordsJSON = JSON.stringify({ uniqueWords })

fs.writeFileSync('./data/words.json', uniqueWordsJSON, 'utf8')
