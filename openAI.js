import OpenAI from 'openai';
import fs from 'fs';

const prompt = `Você é um analista de licitações, seu papel é analisar a fundo o seguinte documento e verificar quais são os objetos do mesmo. Traga todos os objetos em tópicos, trazendo uma breve descrição do objeto em uma frase, a quantidade e o valor unitário. Traga apenas a resposta em um formato JSON contendo os campos 'objeto', 'descricao', 'quantidade', 'valor_unitario'. A resposta deve conter apenas o JSON`;

const prompt2 = `Você é um analista de licitações, seu papel é analisar a fundo os seguintes documentos e verificar as informações de acordo com esses tópicos: Prazo de entrega, instalação, treinamento, garantia, garantia contratual, amostra, carta do fabricante, exigências do fabricante e visita técnica. Seu trabalho é identificar nos arquivos se esses tópicos são tratados, trazendo uma frase curta sobre o tópico, o trecho completo do de onde o tópico foi encontrado. Não traga nenhum tópico que não for encontrado.`;

class IA {
    constructor(key = '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') {
        this.openai = new OpenAI({ apiKey: key });

        this.headers = {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
        }

        this.options = {
            n: 1,
            size: '1024x1024',
        };
    }

    async sendFile(path) {
        const file = await this.openai.files.create({
            file: fs.createReadStream(path),
            purpose: 'assistants'
        });

        console.log(file);

        return file;
    }

    async createAssistant(file) {
        const assistants = await this.openai.beta.assistants.create({
            instructions: prompt,
            model: "gpt-4-1106-preview",
            // model: "gpt-4-1106-preview",
            tools: [
                { "type": "retrieval" }
            ],
            file_ids: [file.id],
            name: 'Analise de Edital',
        });

        console.log(assistants);

        return assistants;
    }

    async createThread(assistant, file) {
        // const thread = await this.openai.beta.threads.createAndRun({
        const thread = await this.openai.beta.threads.create({
            messages: [
                {
                    role: 'user',
                    content: 'Analise esse documento e traga os objetos do mesmo',
                    file_ids: [file.id]
                }
            ]
        });

        console.log(thread);

        return thread;
    }

    async createRun(thread, assistant) {
        const run = await this.openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id,
        });

        console.log(run);

        return run;
    }

    async getMessages(thread, run) {
        const response = await this.openai.beta.threads.messages.list(thread.id, {
            run_id: run.id,
            page: 1,
            per_page: 100
        });

        return response;
    }

    async deleteFile(file, assistant) {
        await this.openai.beta.assistants.files.del(assistant.id, file.id);
        await this.openai.files.del(file.id);
    }

    async deleteAssistant(assistant) {
        await this.openai.beta.assistants.del(assistant.id);
    }

    async listAssistants() {
        const assistants = await this.openai.beta.assistants.list();
        console.log(assistants);
    }

    async deleteAllAssistants() {
        const assistants = await this.openai.beta.assistants.list();
        assistants.data.forEach(async assistant => {
            await this.openai.beta.assistants.del(assistant.id);
        });
    }

    async listFiles() {
        const files = await this.openai.files.list();
        console.log(files);
    }

    async deleteAllFiles() {
        const files = await this.openai.files.list();
        files.data.forEach(async file => {
            await this.openai.files.del(file.id);
        });
    }
}

class IA2 {
    constructor(key = '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') {
        this.openai = new OpenAI({ apiKey: key });

        this.headers = {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
        }

        this.options = {
            n: 1,
            size: '1024x1024',
        };
    }

    async sendFile(path) {
        const file = await this.openai.files.create({
            file: fs.createReadStream(path),
            purpose: 'assistants'
        });

        console.log(file);

        return file;
    }

    async createAssistant(file) {
        const assistants = await this.openai.beta.assistants.create({
            instructions: prompt2,
            // model: "gpt-4-1106-preview",
            model: "gpt-3.5-turbo-16k",
            tools: [
                { "type": "retrieval" }
            ],
            file_ids: [file.id],
            name: 'Analise de Edital',
        });

        console.log(assistants);

        return assistants;
    }

    async createThread(assistant, file) {
        // const thread = await this.openai.beta.threads.createAndRun({
        const thread = await this.openai.beta.threads.create({
            // maxRetries: 10,
            // stream: true,
            messages: [
                {
                    role: 'user',
                    content: 'Analise esse documento e traga as informações solicitadas',
                    file_ids: [file.id]
                }
            ]
        });

        console.log(thread);

        return thread;
    }

    async createRun(thread, assistant) {
        const run = await this.openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id,
            // instructions: prompt2,
        });

        console.log(run);

        return run;
    }

    async getMessages(thread, run) {
        const response = await this.openai.beta.threads.messages.list(thread.id, {
            run_id: run.id,
            page: 1,
            per_page: 100
        });

        return response;
    }

    async deleteFile(file, assistant) {
        await this.openai.beta.assistants.files.del(assistant.id, file.id);
        await this.openai.files.del(file.id);
    }

    async deleteAssistant(assistant) {
        await this.openai.beta.assistants.del(assistant.id);
    }

    async listAssistants() {
        const assistants = await this.openai.beta.assistants.list();
        console.log(assistants);
    }

    async deleteAllAssistants() {
        const assistants = await this.openai.beta.assistants.list();
        assistants.data.forEach(async assistant => {
            await this.openai.beta.assistants.del(assistant.id);
        });
    }

    async listFiles() {
        const files = await this.openai.files.list();
        console.log(files);
    }

    async deleteAllFiles() {
        const files = await this.openai.files.list();
        files.data.forEach(async file => {
            await this.openai.files.del(file.id);
        });
    }
}

const ia = new IA2();

export const getMessages = async (thread, run) => {
    const response = await ia.getMessages(thread, run);
    console.log(response);
    fs.writeFileSync(`./response.json`, JSON.stringify(response));
    const list = [];

    response.data.forEach(message => {
        const raw = message.content[0].text.value;
        console.log(raw);
        if (!raw.includes('```json')) return;

        const formated = raw.replace(/```json\n|\n```/g, '').replace(/\\n/g, '').replace(/  +/g, ' ');
        const data = JSON.parse(formated)

        list.push(data);
    });

    console.log(list.flat());

    fs.writeFileSync(`./list.json`, JSON.stringify(list.flat(), null, 2));

    return response;
}

export const main = async () => {
    const folderName = new Date().getTime();
    fs.mkdirSync(`./${folderName}`);
    
    const file = await ia.sendFile(`./editalM.pdf`);
    fs.writeFileSync(`./${folderName}/file.json`, JSON.stringify(file));
    const assistant = await ia.createAssistant(file);
    fs.writeFileSync(`./${folderName}/assistant.json`, JSON.stringify(assistant));
    const thread = await ia.createThread(assistant, file);
    fs.writeFileSync(`./${folderName}/thread.json`, JSON.stringify(thread));
    const run = await ia.createRun(thread, assistant);
    fs.writeFileSync(`./${folderName}/run.json`, JSON.stringify(run));
    const response = await ia.getMessages(thread, run);
    fs.writeFileSync(`./${folderName}/response.json`, JSON.stringify(response));

    await new Promise(resolve => setTimeout(resolve, 120000));

    await getMessages(thread, run);

    // await ia.deleteFile(file, assistant);
    // await ia.deleteAssistant(assistant);
}

export const list = async () => {
    await ia.listAssistants();
    await ia.listFiles();
}

export const deleteAll = async () => {
    await ia.deleteAllAssistants();
    await ia.deleteAllFiles();
}
// main();