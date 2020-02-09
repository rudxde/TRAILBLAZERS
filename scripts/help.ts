// Logs the Commands section from the readme to the console.

import { readFileSync } from 'fs';
const readme = readFileSync('./readme.md').toLocaleString();
const readmeLines = readme.split('\n');

const readmeLinesFrom = readmeLines.findIndex(x => x === '# Commands') + 1;
let readmeLinesTo = readmeLinesFrom;
for (; readmeLinesTo < readmeLines.length; readmeLinesTo++) {
    if (readmeLines[readmeLinesTo].startsWith('# ')) {
        break;
    }
}
readmeLinesTo -= 1;

for (let i = readmeLinesFrom; i <= readmeLinesTo; i++) {
    console.log(readmeLines[i]);
}
