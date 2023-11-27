import pdfparse from 'pdf-parse';
import fs from 'fs';
import * as PDFLIB from 'pdfjs-dist';

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

        pageText = pageText.replace(/\s\s+/g, ' ').normalize().trim();

        text += pageText + '\n';
    }

    fs.writeFileSync(path.replace('.pdf', 'raw.txt'), text);

    //* remove duplicate sections
    text = removeDuplicatesFromStart(text);
    text = removeDuplicatesFromEnd(text);

    fs.writeFileSync(path.replace('.pdf', '.txt'), text);
}

convertPdfToText('./decon.pdf');

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

//! OBSOLETE
const convertPdfToTextOld = async (path) => {
    const dataBuffer = fs.readFileSync(path);
    let pdf = await pdfparse(dataBuffer);

    pdf = pdf.text.replace(/\s\s+/g, ' ');

    fs.writeFileSync(path.replace('.pdf', '.txt'), pdf);
}

const removeDuplicatesFromStartOld = (text) => {
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

const removeDuplicatesFromEndOld = (text) => {
    const pages = text.split('\n');

    let currentSection = '';

    for (let i = 0; i < pages.length; i++) {
        currentSection = pages[i];

        while (currentSection.length > 20) {
            for (let j = 0; j < pages.length; j++) {
                if (i === j) continue;
                const match = pages[j].endsWith(currentSection);
    
                if (match) pages[j] = pages[j].replace(currentSection, '').trim();
                // else currentSection = currentSection.slice(0, -1).trim();
                else currentSection = currentSection.split(' ').slice(0, -1).join(' ').trim();
            }
        }
    }

    return pages.join('\n');
}