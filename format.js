import raw from './clients.json' assert { type: 'json' };

const ignoreList = [
   'a', 'A', 
   'e', 'E',
   'de', 'De', 'DE', 
   'da', 'Da', 'DA', 
   'do', 'Do', 'DO',
   'para', 'Para', 'PARA',
    'em', 'Em', 'EM',
    'no', 'No', 'NO',
    'na', 'Na', 'NA',
    'com', 'Com', 'COM',
    'por', 'Por', 'POR',
    'dos', 'Dos', 'DOS',
    'das', 'Das', 'DAS',
    'nos', 'Nos', 'NOS',
    'nas', 'Nas', 'NAS',
    'aos', 'Aos', 'AOS',
    'sem', 'Sem', 'SEM',
]

export const identifyScopeAndClient = (text) => {
    const clients = [];

    const data = JSON.parse(JSON.stringify(raw));

    for (const client of data) {
        for (const scope of client.scopes) {
            const tempItems = splitItems(scope.items);

            const list = [];

            const some = tempItems.some(item => { 
                if (item.length < 3) return false;
                const regex = new RegExp(` ${item} `, 'gi');
                const matches = text.match(regex);
                if (matches) {
                    list.push(item);
                    return true;
                }
                return false;
            });

            if (!some) continue;
            
            const find = clients.find(item => item.name === client.name);
            if (!find) clients.push({ name: client.name, scopes: [scope.name, ...list] });
            else {
                const findScope = find.scopes.find(item => item === scope.name);
                if (!findScope) find.scopes.push(scope.name, ...list);
            }
        }
    }

    return clients;
}

const splitItems = (list) => {
    const newList = [];
    for (const item of list) {
        const splitteds = item.split(' ');
        for (const splitted of splitteds) {
            if (!ignoreList.includes(splitted)) newList.push(splitted);
        }
    }
    return [...new Set(newList)];
}

export const identifyParagraphs = (text) => {
    for (const item of itemsList) {
        for (const item2 of item.items) {
            const regex = new RegExp(item2, 'gi');
            const matches = text.match(regex);
            if (matches) return text;
            else {
                const splitteds = [...new Set(item2.split(' '))];
                for (const splitted of splitteds) {
                    const regex = new RegExp(splitted, 'gi');
                    const matches = text.match(regex);
                    if (matches) return text;
                }
            }
        }
    }
    return '';
}