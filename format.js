const itemsList = [
    {
        title: 'Mesinha/Mesa',
        items: [
            'Mesa Digital',
            'Mesinha Digital',
            'Mesa Digital Interativa',
            'Mesinha Interativa',
            'Mesa Interativa',
            'Mesa Educacional',
            'Tecnologia Assistiva',
            'Mesa Interativa Digital',
            'Mesa Tecnológica',
            'Mesa Interativa Educacional',
            'Mesinha Digital Infantil',
            'Ecossistema Ludopedagógico',
            'Mesa Educativa',
            'Mesa Touch',
            'Mesa Visualizadora Interativa',
            'Mesa Digital Infantil',
            'Mesinha Digital Interativa Educacional',
            'Mesinha Didática Infantil',
            'Mesa Educacional Interativa',
            'Mesa Interativa Touch Screen',
            'Mesas Interativas',
            'Mesas Educacionais Interativas',
            'Mesa Interativa Educacional',
            'Mesa Totem',
            'Mesa Terapêutica Interativa',
            'Mesa Terapêutica',
            'Playtable',
            'Mesa Digital Touch',
            'Mesa Diretório Interativa',
            'Mesinha Interativa Digital',
            'Ferramenta Educacional',
            'Mesinha Digital Interativa',
            'Mesas Interativa',
            'Mesa Tática Interativa',
            'Mesa Pedagógica'
        ]
    },
    {
        title: 'Lousa/Quadro',
        items: [
            'Lousa Digital',
            'Lousa Interativa',
            'Lousas Digitais',
            'Lousa Digital Interativa',
            'Lousa Interativa Portátil',
            'Lousa Digital Integrada',
            'Lousa Touch',
            'Lousa Película Interativa',
            'Kit Lousa',
            'Lousa Integrada',
            'Quadro Interativo',
            'Kit Lousa Digital',
            'Lousas Interativas',
            'Lousa Tela Interativa',
            'Lousas Digitais',
            'Lousa Display Interativo',
            'Quadro Multifuncional',
            'Lousas Display Interativo',
            'Lousa Retrátil Integrada',
            'Lousa Cerâmica',
            'Lousa Panorâmica Retrátil',
            'Lousa Eletrônica',
            'Quadro Multimídia',
            'Lousa Touch Screen',
            'Lousa Branca Interativa',
            'Lousa Interativa Digital',
            'Lousa Película Interativa',
            'Lousa Digitalizadora',
            'Lousa Inteligente',
            'Lousa Integrada Interativa',
            'Digitalizador',
            'Lousa Panorâmica Display Interativo',
            'Lousa Panorâmica',
            'Lousas Inteligentes',
            'Lousa Panorâmica Lousa Interativa'
        ]
    },
    {
        title: 'Totem',
        items: [
            'Totem Autoatendimento',
            'Totem Auto Atendimento',
            'Totem Auto-Atendimento',
            'Totem Emissor Senha',
            'Totem',
            'Totens',
            'Totem Autoatendimento',
            'Totem Touchscreen',
            'Terminal Autoatendimento',
            'Terminal Autoatendimento',
            'Terminal Auto-atendimento',
            'Sistema Gestão Filas',
            'Terminais Autoatendimento',
            'Conjunto Auto Atendimento',
            'Totem Tela Touch',
            'Terminal Auto Atendimento',
            'Totens Autoatendimento',
            'Totem Interativo',
            'Sistema Atendimento',
            'Kit Equipamentos Autoatendimento',
            'Terminal Dispensador Senha',
            'Kit Autoatendimento',
            'Terminal Auto Atendimento',
            'Totem Autoatendimento',
            'Totens Interativos',
            'Totem Atendimento',
            'Unidade Móvel Atendimento',
            'Totem Dispensar Senha',
            'Totem Gerenciador',
            'Totem Tela Interativa',
            'Totem Digital',
            'Totem Multimidia',
            'Estação Auto Atendimento',
            'Toten Touch Screen',
            'Toten Autoatendimento',
            'Totem Gerador Senhas',
            'Totem Distribuição Senhas',
            'Totens Senha',
            'Totem Virtual',
            'Terminais Atendimento',
            'Terminais Interativos',
            'Totens Pesquisa',
            'Emissor Senhas Totem',
            'Totens Digitais',
            'Autoatendimento',
            'Totem Touch Screen',
            'Emissor Senhas',
            'Totens Multimídia',
            'Totem Multimídia',
            'Sistema Gerenciamento Filas',
            'Totens Autoatendimento Multimídia'
        ]
    }
]

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