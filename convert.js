import fs from 'fs';
import * as PDFLIB from 'pdfjs-dist';
import { identifyParagraphs } from './format.js';

const convertPdfToText = async (path) => {
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

        pageText = identifyParagraphs(pageText).replace(/\s\s+/g, ' ').normalize().trim();
        if (pageText.length > 0) text += pageText + '\n';
    }

    fs.writeFileSync(path.replace('.pdf', 'raw.txt'), text);

    //* remove duplicate sections
    text = removeDuplicatesFromStart(text);
    text = removeDuplicatesFromEnd(text);

    fs.writeFileSync(path.replace('.pdf', '.txt'), text);
}

convertPdfToText('./editais/decon.pdf');

const removeDuplicatesFromStart = (text) => {
    const pages = text.split('\n');

    let currentSection = '';

    for (let i = 0; i < pages.length; i++) {
        currentSection = pages[i];
        let done = false;

        while (currentSection.length > 20 && !done) {
            let matches = 0;
            for (let j = 0; j < pages.length; j++) {
                const match = pages[j].startsWith(currentSection);
                if (match) matches++;
            }
            if (matches > 15) {
                done = true;
                for (let j = 0; j < pages.length; j++) {
                    const match = pages[j].startsWith(currentSection);
                    if (match) pages[j] = pages[j].replace(currentSection, '').trim();
                }
            }
            currentSection = currentSection.split(' ').slice(0, -1).join(' ').trim();
        }
    } 

    return pages.join('\n');
}

const removeDuplicatesFromEnd = (text) => {
    const pages = text.split('\n');

    let currentSection = '';

    for (let i = 0; i < pages.length; i++) {
        currentSection = pages[i];
        let done = false;

        while (currentSection.length > 20 && !done) {
            let matches = 0;
            for (let j = 0; j < pages.length; j++) {
                const match = pages[j].endsWith(currentSection);
                if (match) matches++;
            }
            if (matches > 10) {
                done = true;
                for (let j = 0; j < pages.length; j++) {
                    const match = pages[j].endsWith(currentSection);
                    if (match) pages[j] = pages[j].replace(currentSection, '').trim();
                }
            }
            currentSection = currentSection.split(' ').slice(0, -1).join(' ').trim();
        }
    } 

    return pages.join('\n');
}