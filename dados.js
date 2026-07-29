// dados.js - Cadastro dos GAs com o número do Líder
const listaGAs = [
    { id: 'comasa', bairro: 'Comasa', cidade: 'Joinville', dia: 'Terça-feira', horario: '20h00', liderNome: 'Líder Comasa', liderTelefone: '554791619636' },
    { id: 'costa_e_silva', bairro: 'Costa e Silva', cidade: 'Joinville', dia: 'Quarta-feira', horario: '20h00', liderNome: 'Líder Costa e Silva', liderTelefone: '554791229680' },
    { id: 'ulisses', bairro: 'Ulisses Guimarães', cidade: 'Joinville', dia: 'Segunda-feira', horario: '20h00', liderNome: 'Líder Ulisses', liderTelefone: '554784382557' },
    { id: 'floresta', bairro: 'Floresta', cidade: 'Joinville', dia: 'Sexta-feira', horario: '19h30', liderNome: 'Líder Floresta', liderTelefone: '554796027491' },
    { id: 'itinga', bairro: 'Itinga', cidade: 'Joinville', dia: 'Quinta-feira', horario: '20h00', liderNome: 'Líder Itinga', liderTelefone: '554796683675' },
    { id: 'guaramirim', bairro: 'Guaramirim', cidade: 'Guaramirim', dia: 'Sexta-feira', horario: '20h00', liderNome: 'Líder Guaramirim', liderTelefone: '554788497878' },
    { id: 'boehmewald', bairro: 'Boehmewald', cidade: 'Joinville', dia: 'Quarta-feira', horario: '20h00', liderNome: 'Líder Boehmewald', liderTelefone: '554799485840' },
    { id: 'piraberaba', bairro: 'Piraberaba', cidade: 'Joinville', dia: 'Quarta-feira', horario: '20h00', liderNome: 'Líder Piraberaba', liderTelefone: '554792569704' },
    { id: 'paranaguamirim', bairro: 'Paranaguamirim', cidade: 'Joinville', dia: 'Terça-feira', horario: '20h00', liderNome: 'Líder Paranaguamirim', liderTelefone: '554791329374' }
];

function obterGA(id) {
    return listaGAs.find(g => g.id === id);
}

// Mapeamento territorial de Joinville e Região
const mapaProximidade = {
    // Zona Leste
    "comasa": [obterGA('comasa'), obterGA('floresta'), obterGA('costa_e_silva')],
    "espinheiros": [obterGA('comasa'), obterGA('floresta'), obterGA('paranaguamirim')],
    "boa vista": [obterGA('comasa'), obterGA('floresta'), obterGA('costa_e_silva')],
    "iririu": [obterGA('comasa'), obterGA('costa_e_silva'), obterGA('floresta')],
    "jardim iririu": [obterGA('comasa'), obterGA('floresta'), obterGA('costa_e_silva')],
    "aventureiro": [obterGA('comasa'), obterGA('costa_e_silva'), obterGA('piraberaba')],

    // Zona Sul / Sudeste
    "ulisses guimarães": [obterGA('ulisses'), obterGA('paranaguamirim'), obterGA('itinga')],
    "ulisses guimaraes": [obterGA('ulisses'), obterGA('paranaguamirim'), obterGA('itinga')],
    "paranaguamirim": [obterGA('paranaguamirim'), obterGA('ulisses'), obterGA('itinga')],
    "itinga": [obterGA('itinga'), obterGA('paranaguamirim'), obterGA('ulisses')],
    "boehmewald": [obterGA('boehmewald'), obterGA('floresta'), obterGA('itinga')],
    "floresta": [obterGA('floresta'), obterGA('boehmewald'), obterGA('comasa')],
    "profipo": [obterGA('itinga'), obterGA('boehmewald'), obterGA('floresta')],
    "santa catarina": [obterGA('floresta'), obterGA('boehmewald'), obterGA('itinga')],
    "guanabara": [obterGA('floresta'), obterGA('comasa'), obterGA('boehmewald')],
    "fátima": [obterGA('floresta'), obterGA('comasa'), obterGA('ulisses')],
    "fatima": [obterGA('floresta'), obterGA('comasa'), obterGA('ulisses')],
    "jarivatuba": [obterGA('ulisses'), obterGA('paranaguamirim'), obterGA('floresta')],
    "adhemar garcia": [obterGA('ulisses'), obterGA('paranaguamirim'), obterGA('floresta')],
    "parque guarani": [obterGA('paranaguamirim'), obterGA('ulisses'), obterGA('itinga')],

    // Zona Norte
    "costa e silva": [obterGA('costa_e_silva'), obterGA('piraberaba'), obterGA('floresta')],
    "piraberaba": [obterGA('piraberaba'), obterGA('costa_e_silva'), obterGA('comasa')],
    "santo Antônio": [obterGA('costa_e_silva'), obterGA('piraberaba'), obterGA('floresta')],
    "santo antonio": [obterGA('costa_e_silva'), obterGA('piraberaba'), obterGA('floresta')],
    "américa": [obterGA('costa_e_silva'), obterGA('floresta'), obterGA('comasa')],
    "america": [obterGA('costa_e_silva'), obterGA('floresta'), obterGA('comasa')],
    "glória": [obterGA('costa_e_silva'), obterGA('floresta'), obterGA('boehmewald')],
    "gloria": [obterGA('costa_e_silva'), obterGA('floresta'), obterGA('boehmewald')],
    "bom retiro": [obterGA('costa_e_silva'), obterGA('piraberaba'), obterGA('comasa')],
    "dona francisca": [obterGA('piraberaba'), obterGA('costa_e_silva'), obterGA('comasa')],
    "jardim sofia": [obterGA('piraberaba'), obterGA('costa_e_silva'), obterGA('comasa')],

    // Zona Oeste / Central
    "centro": [obterGA('floresta'), obterGA('costa_e_silva'), obterGA('comasa')],
    "anita garibaldi": [obterGA('floresta'), obterGA('boehmewald'), obterGA('costa_e_silva')],
    "bucarein": [obterGA('floresta'), obterGA('comasa'), obterGA('boehmewald')],
    "atiradores": [obterGA('floresta'), obterGA('costa_e_silva'), obterGA('boehmewald')],
    "vila nova": [obterGA('costa_e_silva'), obterGA('floresta'), obterGA('boehmewald')],

    // Cidades Vizinhas
    "guaramirim": [obterGA('guaramirim'), obterGA('itinga'), obterGA('boehmewald')],
    "jaraguá do sul": [obterGA('guaramirim'), obterGA('itinga'), obterGA('piraberaba')],
    "jaragua do sul": [obterGA('guaramirim'), obterGA('itinga'), obterGA('piraberaba')],
    "araquari": [obterGA('itinga'), obterGA('paranaguamirim'), obterGA('ulisses')],
    "são francisco do sul": [obterGA('ulisses'), obterGA('paranaguamirim'), obterGA('comasa')],
    "sao francisco do sul": [obterGA('ulisses'), obterGA('paranaguamirim'), obterGA('comasa')]
};

const opcoesPadrao = [obterGA('floresta'), obterGA('costa_e_silva'), obterGA('comasa')];

function obterGAsProximos(bairroDigitado) {
    const busca = bairroDigitado.toLowerCase().trim();
    for (const chave in mapaProximidade) {
        if (busca.includes(chave) || chave.includes(busca)) {
            return mapaProximidade[chave];
        }
    }
    return opcoesPadrao;
}

module.exports = { listaGAs, obterGAsProximos };