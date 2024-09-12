class RecintosZoo {
    constructor() {
        this.recintos = [
            {numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: ['MACACO', 'MACACO', 'MACACO']},
            {numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: []},
            {numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: ['GAZELA']},
            {numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: []},
            {numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: ['LEAO']}
        ];
        this.animaisValidos = {
            'LEAO': {tamanho: 3, bioma: ['savana'], carnivoro: true},
            'LEOPARDO': {tamanho: 2, bioma: ['savana'], carnivoro: true},
            'CROCODILO': {tamanho: 3, bioma: ['rio'], carnivoro: true},
            'MACACO': {tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false},
            'GAZELA': {tamanho: 2, bioma: ['savana'], carnivoro: false},
            'HIPOPOTAMO': {tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false},
        };
    }

    analisaRecintos(animal, quantidade) {
        // Validação do animal
        if (!this.animaisValidos[animal]) {
            return {erro: "Animal inválido"};
        }

        // Validação da quantidade
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return {erro: "Quantidade inválida"};
        }

        const infoAnimal = this.animaisValidos[animal];
        const recintosViaveis = this.recintos.filter(recinto => {
            const espacoOcupado = this.ocupaEspaço(recinto.animais);
            const espacoLivre = recinto.tamanhoTotal - espacoOcupado;

            // Checa bioma compatível
            if (!infoAnimal.bioma.includes(recinto.bioma)) return false;

            // Checa se é carnivoro e se pode conviver
            if (infoAnimal.carnivoro && recinto.animais.length > 0 && !recinto.animais.every(a => this.animaisValidos[a].carnivoro)) {
                return false;
            }

            // Verifica se é hipopotamo e há outras espécies
            if (animal === 'HIPOPOTAMO' && recinto.animais.length > 0 && !recinto.bioma.includes('savana e rio')) {
                return false;
            }

            // Verifica se é macaco e o recinto está vazio
            if (animal === 'MACACO' && recinto.animais.length === 0) {
                return false;
            }

            // Checa se há espaço suficiente
            const espacoNecessario = quantidade * infoAnimal.tamanho;
            return espacoLivre >= espacoNecessario;
        })
        // Ordena os recintos por número
        .sort((a, b) => a.numero - b.numero)
        .map(recinto => {
            const espacoOcupado = this.ocupaEspaço(recinto.animais);
            const espacoLivre = recinto.tamanhoTotal - espacoOcupado - (quantidade * infoAnimal.tamanho);
            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
        });

        if (recintosViaveis.length > 0) {
            return {recintosViaveis};
        }

        return {erro: "Não há recinto viável"};
    }

    ocupaEspaço(animais) {
        return animais.reduce((total, animal) => total + this.animaisValidos[animal].tamanho, 0);
    }
}

// Usando CommonJS para exportar
module.exports = RecintosZoo;
