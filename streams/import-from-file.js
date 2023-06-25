import { parse } from 'csv-parse'
import fs from 'node:fs'

const filePath = new URL('../tasks.csv', import.meta.url)

const stream = fs.createReadStream(filePath)

const csvParse = parse({
    delimiter: ',',
    skip_empty_lines: true,
    fromLine: 2
})

async function importFromFile() {
    const parsedLines = stream.pipe(csvParse)

    for await (const line of parsedLines) {
        const [title, description] = line

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
            })
        })
    }
}

importFromFile()