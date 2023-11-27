import fs from 'fs';
import * as PDFLIB from 'pdfjs-dist';
import { identifyParagraphs, identifyScopeAndClient } from './format.js';

const convertPdfToText = async (path) => {
    const defaultPath = './editais';
    const exist = fs.existsSync(`${defaultPath}/${path}`);
    if (!exist) {
        console.log(`File '${path}' not found`);
        return;
    }

    const pdfDoc = await PDFLIB.getDocument(`${defaultPath}/${path}`).promise;
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

        const clients = identifyScopeAndClient(pageText);
        if (clients.length <= 0) continue;

        text += pageText + '\n';
    }

    //* remove duplicate sections
    text = removeDuplicatesFromStart(text);
    text = removeDuplicatesFromEnd(text);

    if (!fs.existsSync(`${defaultPath}/clean`)) fs.mkdirSync(`${defaultPath}/clean`);

    const fileName = `${defaultPath}/clean/${path.replace('.pdf', '.txt')}`;
    fs.writeFileSync(fileName, text);
    
    console.log(`File saved at '${fileName}' with '${text.length}' characters`);
}

convertPdfToText('tjrr_edital.pdf');

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
            if (matches > 15) {
                done = true;
                for (let j = 0; j < pages.length; j++) {
                    const match = pages[j].endsWith(currentSection);
                    if (match) pages[j] = pages[j].replace(currentSection, '').trim();
                }
            }
            currentSection = currentSection.split(' ').slice(1).join(' ').trim();
        }
    } 

    return pages.join('\n');
}