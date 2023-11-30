import fs from 'fs';
import * as PDFLIB from 'pdfjs-dist';
import { getTags } from './format.js';

const convertPdfToText = async (path) => {
    const defaultPath = './editais';
    const exist = fs.existsSync(`${defaultPath}/${path}`);
    if (!exist) {
        console.log(`File '${path}' not found`);
        return;
    }

    const pdfDoc = await PDFLIB.getDocument({ url: `${defaultPath}/${path}`, verbosity: 0 }).promise;
    const numPages = pdfDoc.numPages;

    let rawText = '';

    const sections = [];

    for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);

        const content = await page.getTextContent();

        for (const item of content.items) {
            rawText += item.str;
        }

        sections.push(...identifySections(content));
    }

    const clearedSections = verifyQuantity(sections);
    const text = clearedSections.map(item => item.items).join('\n');

    if (!fs.existsSync(`${defaultPath}/clean`)) fs.mkdirSync(`${defaultPath}/clean`);

    const fileName = `${defaultPath}/clean/${path.replace('.pdf', '.txt')}`;
    fs.writeFileSync(fileName, text);

    //get percentage
    const percentage = Math.round((text.length / rawText.length) * 100);
    
    console.log(`File saved at '${fileName}' with '${text.length}' (from '${rawText.length}') characters [${percentage}%]]`);
}

convertPdfToText('ED1.pdf');
convertPdfToText('ED2.pdf');
convertPdfToText('ED3.pdf');
convertPdfToText('ED5.pdf');
convertPdfToText('ED6.pdf');
convertPdfToText('decon.pdf');
convertPdfToText('editalM.pdf');
convertPdfToText('tjrr_edital.pdf');

const identifySections = (content) => {
    const sizes = content.items.map(item => item.height);
    const sections = [];

    for (const item of content.items) {
        if (item.height == 0) continue;

        // if only number
        // if (!isNaN(item.str)) continue;
        
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
        sections.push({ items: [item.str], size: item.height });
    }

    for (const section of sections) {
        section.items = section.items.join(' ');
    }

    return sections;
}

const verifyQuantity = (sections) => {
    const data = [];

    for (const section of sections) {
        // count how many times the section appears
        const count = sections.filter(item => item.items === section.items).length;
        if (count > 5) continue;

        // regex that matches the word 'item' or 'itens' or 'objeto'
        const regex = /item|iten|bem|ben|serviço|servico|material/gi;
        const hasItemOrObject = section.items.match(regex);
        if (!hasItemOrObject) continue;

        // find tags
        const tags = findTags(section.items);
        if (tags <= 0) continue;

        data.push(section);
    }

    return data;
}

const findTags = (text) => {
    const tags = [ "casa de boneca", "casinha", "rotomolda", "organizador de brinquedos", "mesinha", "cadeirinha", "banco", "cerquinha", "poltrona", "poltroninha", "fraldario", "trocador", "chale", "gira-gira", "gira gira", "carrossel", "gol", "tabela de basquete", "piscina de bolinhas", "Agility", "coleta seletiva", "conjunto lixeira", "lixeira seletiva", "gerador", "geracao de energia", "playtable", "play table", "play-table", "kram", "Caminha", "cama", "quadro", "lousa", "flanelografo", "cavalete", "flipchart", "flip-chart", "flip chart", "Prancha", "StandUp", "Stand-Up", "Stand Up", "Paddle", "Mesa", "Mesinha", "quadro", "lousa", "tela", "frame", "moldura", "painel", "tv", "tote", "terminal", "auto-atendimento", "auto atendimento", "autoatendimento", "alto-atendimento", "alto atendimento", "altoatendimento", "digital", "interativ", "multi-m", "multim", "multi m", "touch", "toque", "sensitiv", "inovador", "inovadoras", "inovadora", "solução", "solucao", "soluções", "solucoes", "sensitiva", "Vota", "moveis", "mobilia", "expediente", "claviculario", "portachave", "porta-chave", "porta chave", "informática", "controle acesso", "controle de acesso", "aferição temperatura", "aferição de temperatura", "caat", "pulpito", "gerador", "geracao de energia", "gerador", "geracao de energia", "nobreak", "no-break", "no break", "nobre-ak", "ups", "Supply", "energy", "power", "uninterruptible power supply", "nobreak", "no-break", "no break", "nobre-ak", "ups", "Supply", "energy", "power", "uninterruptible power supply", "lousainterativa", "teste", "pacote", "saco", "tampa", "garrafa", "embalage", "nobreak", "no-break", "no break", "nobre-ak", "nobreack", "no breack", "no-breack", "ups", "Supply", "energy", "power", "uninterruptible power supply", "gerador", "solar", "fotovolta", "Brinquedo", "parqu", "miniplay", "Kitplay", "playground", "play-ground", "play ground", "NBR16071", "NBR-16071", "NBR 16071", "Gangorra", "Castelo", "balanco", "escorregador", "toboagua", "tobo agua", "tobo-agua", "tunel", "Rotomoldado", "didatico", "mini cozinha", "madeira plastica", "educa", "pedag", "didatic", "creche", "cmei", "cemei", "escola", "ensino", "sala", "equipamento", "permanente", "equip", "Lousa", "descart", "palito", "papel", "mexedor", "guardanapo", "copo", "colher", "faca", "garfo", "canud", "bandeja", "espatula", "espeto", "papel", "bobina", "prato", "pote", "garrafa", "generos alimenticios", "copa", "cozinha", "consumo", "expediente", "antivirus", "anti-virus", "anti virus", "endpoint", "end-point", "end point", "f-secure", "f secure", "fsecure", "edr", "next generation", "nobreak", "no-break", "no break", "ingles", "inglês", "ensino", "lingua", "língua", "idioma", "aprendizagem", "conversa", "educacional", "curso", "bilingue", "bilíngue", "estrangeir", "servicos em nuvem", "serviços em nuvem", "cloud", "infraestrutura de servidores", "computação de nuvem", "computacao de nuvem", "computacao em nuvem", "computação em nuvem", "hospedagem", "nuvem", "datacenter", "data center", "data-center", "servidor", "storage", "flasharray", "flash array", "imutabilidade", "armazenamento"]
    
    const tagsFound = [];

    for (const tag of tags) {
        const regex = new RegExp(` ${tag} `, 'gi');
        const matches = text.match(regex);
        if (matches) tagsFound.push(tag);
    }

    const defTagsFound = [];
    const defTags = getTags();

    for (const tag of defTags) {
        const regex = new RegExp(` ${tag} `, 'gi');
        const matches = text.match(regex);
        if (matches) defTagsFound.push(tag);
    }

    if (defTagsFound.length > 0 || tagsFound.length > 0) return true;
    return false;
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

