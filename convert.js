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

    //get fonts
    let text = '';

    for (let i = 1; i <= 1; i++) {
        const page = await pdfDoc.getPage(i);
        let pageText = '';

        const content = await page.getTextContent();

        for (const item of content.items) {
            item.str = item.str.normalize().replace(/[\u0300-\u036f]/g, '');
            pageText += item.str + ' ';

            identifySections(content)
        }

        pageText = pageText.replace(/\s\s+/g, ' ').normalize().trim();

        const clients = identifyScopeAndClient(pageText);
        if (clients.length <= 0) continue;

        text += pageText + '\n';
    }
    const tags = findTags(text);
    console.log('TAGS', tags);

    //* remove duplicate sections
    text = removeDuplicatesFromStart(text);
    text = removeDuplicatesFromEnd(text);

    if (!fs.existsSync(`${defaultPath}/clean`)) fs.mkdirSync(`${defaultPath}/clean`);

    const fileName = `${defaultPath}/clean/${path.replace('.pdf', '.txt')}`;
    fs.writeFileSync(fileName, text);
    
    console.log(`File saved at '${fileName}' with '${text.length}' characters`);
}

convertPdfToText('ED1.pdf');

const identifySections = (content) => {
    const sizes = content.items.map(item => item.height);
    const sections = [];

    for (const item of content.items) {
        if (item.height == 0) continue;

        // if only number
        if (!isNaN(item.str)) continue;
        

        //verify if include some character like a,b,c,...,A,B,C,...,1,2,3,..., ,.,;,,
        const regex = new RegExp('[a-zA-Z0-9 ,.;:]', 'gi');
        const matches = item.str.match(regex);
        if (!matches) continue;

        if (sections.length == 0) {
            sections.push({ items: [item.str], size: item.height });
            continue;
        }

        const lastSection = sections[sections.length - 1];
        const size = lastSection.size;

        if (item.height == size) {
            lastSection.items.push(item.str);
            continue;
        }

        if (item.height > size) {
            sections.push({ items: [item.str], size: item.height });
            continue;
        }

        if (item.height < size) {
            const lastItem = lastSection.items[lastSection.items.length - 1];
            if (item.height < lastItem.height) {
                lastSection.items.push(item.str);
                continue;
            } else {
                sections.push({ items: [item.str], size: item.height });
                continue;
            }
        }
    }

    for (const section of sections) {
        section.items = section.items.join(' ');
    }

    console.log(sections);
}

const findTags = (text) => {
    const tags = [ "casa de boneca", "casinha", "rotomolda", "organizador de brinquedos", "mesinha", "cadeirinha", "banco", "cerquinha", "poltrona", "poltroninha", "fraldario", "trocador", "chale", "gira-gira", "gira gira", "carrossel", "gol", "tabela de basquete", "piscina de bolinhas", "Agility", "coleta seletiva", "conjunto lixeira", "lixeira seletiva", "gerador", "geracao de energia", "playtable", "play table", "play-table", "kram", "Caminha", "cama", "quadro", "lousa", "flanelografo", "cavalete", "flipchart", "flip-chart", "flip chart", "Prancha", "StandUp", "Stand-Up", "Stand Up", "Paddle", "Mesa", "Mesinha", "quadro", "lousa", "tela", "frame", "moldura", "painel", "tv", "tote", "terminal", "auto-atendimento", "auto atendimento", "autoatendimento", "alto-atendimento", "alto atendimento", "altoatendimento", "digital", "interativ", "multi-m", "multim", "multi m", "touch", "toque", "sensitiv", "inovador", "inovadoras", "inovadora", "solução", "solucao", "soluções", "solucoes", "sensitiva", "Vota", "moveis", "mobilia", "expediente", "claviculario", "portachave", "porta-chave", "porta chave", "informática", "controle acesso", "controle de acesso", "aferição temperatura", "aferição de temperatura", "caat", "pulpito", "gerador", "geracao de energia", "gerador", "geracao de energia", "nobreak", "no-break", "no break", "nobre-ak", "ups", "Supply", "energy", "power", "uninterruptible power supply", "nobreak", "no-break", "no break", "nobre-ak", "ups", "Supply", "energy", "power", "uninterruptible power supply", "lousainterativa", "teste", "pacote", "saco", "tampa", "garrafa", "embalage", "nobreak", "no-break", "no break", "nobre-ak", "nobreack", "no breack", "no-breack", "ups", "Supply", "energy", "power", "uninterruptible power supply", "gerador", "solar", "fotovolta", "Brinquedo", "parqu", "miniplay", "Kitplay", "playground", "play-ground", "play ground", "NBR16071", "NBR-16071", "NBR 16071", "Gangorra", "Castelo", "balanco", "escorregador", "toboagua", "tobo agua", "tobo-agua", "tunel", "Rotomoldado", "didatico", "mini cozinha", "madeira plastica", "educa", "pedag", "didatic", "creche", "cmei", "cemei", "escola", "ensino", "sala", "equipamento", "permanente", "equip", "Lousa", "descart", "palito", "papel", "mexedor", "guardanapo", "copo", "colher", "faca", "garfo", "canud", "bandeja", "espatula", "espeto", "papel", "bobina", "prato", "pote", "garrafa", "generos alimenticios", "copa", "cozinha", "consumo", "expediente", "antivirus", "anti-virus", "anti virus", "endpoint", "end-point", "end point", "f-secure", "f secure", "fsecure", "edr", "next generation", "nobreak", "no-break", "no break", "ingles", "inglês", "ensino", "lingua", "língua", "idioma", "aprendizagem", "conversa", "educacional", "curso", "bilingue", "bilíngue", "estrangeir", "servicos em nuvem", "serviços em nuvem", "cloud", "infraestrutura de servidores", "computação de nuvem", "computacao de nuvem", "computacao em nuvem", "computação em nuvem", "hospedagem", "nuvem", "datacenter", "data center", "data-center", "servidor", "storage", "flasharray", "flash array", "imutabilidade", "armazenamento"]
    
    const tagsFound = [];

    for (const tag of tags) {
        const regex = new RegExp(tag, 'gi');
        const matches = text.match(regex);
        if (matches) tagsFound.push(tag);
    }

    return tagsFound;
}

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

