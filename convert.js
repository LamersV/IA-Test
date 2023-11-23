import pdfparse from 'pdf-parse';
import fs from 'fs';
import * as PDFLIB from 'pdfjs-dist'

const convertPdfToText = async (path) => {
    const dataBuffer = fs.readFileSync(path);
    let pdf = await pdfparse(dataBuffer);

    pdf = pdf.text.replace(/\s\s+/g, ' ');

    fs.writeFileSync(path.replace('.pdf', '.txt'), pdf);
}

const convertPdfToTextV2 = async (path) => {
    const pdfDoc = await PDFLIB.getDocument(path).promise;
    const numPages = pdfDoc.numPages;

    let text = '';

    for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        let pageText = '';

        const content = await page.getTextContent();

        for (const item of content.items) {
            item.str = item.str.normalize().replace(/[\u0300-\u036f]/g, '');
            pageText += item.str + ' ';
        }

        pageText = pageText.replace(/\s\s+/g, ' ').normalize().trim();

        text += pageText + '\n';
    }

    fs.writeFileSync(path.replace('.pdf', 'raw.txt'), text);

    // remove duplicate sections
    console.log(text.length);
    text = removeDuplicatesFromStart(text);
    console.log(text.length);

    fs.writeFileSync(path.replace('.pdf', '.txt'), text);
}

convertPdfToTextV2('./editalM.pdf');

//função para remover palavras que se repetem pelo menos 10 vezes
const removeDuplicateSections = (text) => {
    console.time('removeDuplicateSections');
    const words = text.split(' ');
    const wordsCount = {};

    words.forEach(word => {
        if (!wordsCount[word]) wordsCount[word] = 0;
        wordsCount[word]++;
    });

    const newWords = [];

    words.forEach(word => {
        if (wordsCount[word] < 30) newWords.push(word);
        else console.log(word);
    });

    console.timeEnd('removeDuplicateSections');
    return newWords.join('\n');
}

const removeDuplicatesFromStart = (text) => {
    const pages = text.split('\n');

    let currentSection = '';

    for (let i = 0; i < pages.length; i++) {
        currentSection = pages[i];

        while (currentSection.length > 20) {
            for (let j = 0; j < pages.length; j++) {
                if (i === j) continue;
                const match = pages[j].startsWith(currentSection);
    
                if (match) pages[j] = pages[j].replace(currentSection, '').trim();
                // else currentSection = currentSection.slice(0, -1).trim();
                else currentSection = currentSection.split(' ').slice(0, -1).join(' ').trim();
            }
        }
    }


    return pages.join('\n');
}