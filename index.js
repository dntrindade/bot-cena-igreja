// index.js - Fix definitivo para recuperar o número cadastrado no disparo
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const { obterGAsProximos } = require('./dados');

// ⚠️ LISTA DE VISITANTES (Digite os números com DDD)
const listaNumerosDisparo = [
    "554797170685" // O número do visitante cadastrado
];

const MENSAGEM_BOAS_VINDAS = 
`Olá! 😊 Que a paz do Senhor esteja com você!

Passando para agradecer por sua visita à nossa igreja. Foi uma alegria muito grande receber você em nossa casa. ❤️

A CENA nasceu de uma família que foi restaurada pela graça de Deus e tem como missão servir e cooperar com o Corpo de Cristo.

Somos uma casa de cura para todos os povos, onde buscamos viver o amor de Cristo, promover a restauração de vidas e a edificação dos santos por meio das ferramentas que o Senhor nos confiou.

Antes de encerrarmos, poderia nos confirmar seu nome? 😊 Assim conseguimos cadastrar seu contato corretamente.

Que Deus abençoe sua vida, sua casa e seus projetos. Esperamos revê-lo(a) em breve! 🙏🏡`;

// Armazena as sessões ativas
const sessoesVisitantes = {};

// Função para simplificar busca por dígitos finais
function extrairChaveNumero(jid) {
    if (!jid) return '';
    const apenasNumeros = jid.replace(/\D/g, '');
    return apenasNumeros.slice(-8); // Pega os últimos 8 dígitos
}

async function iniciarBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('\n======================================================');
            console.log('📲 ESCANEIE O QR CODE ABAIXO COM O WHATSAPP DA IGREJA:');
            console.log('======================================================\n');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const deviaReconectar = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Conexão encerrada. Reconectando...', deviaReconectar);
            if (deviaReconectar) iniciarBot();
        } else if (connection === 'open') {
            console.log('\n======================================================');
            console.log('✅ CONECTADO COM SUCESSO AO WHATSAPP DA IGREJA!');
            console.log('======================================================\n');
            
            for (const numero of listaNumerosDisparo) {
                const numLimpo = numero.replace(/\D/g, '');
                const remoteJid = `${numLimpo}@s.whatsapp.net`;
                const chaveBusca = extrairChaveNumero(numLimpo);

                // Cadastra na memória garantindo o número de disparo exato!
                sessoesVisitantes[chaveBusca] = { 
                    etapa: 'AGUARDANDO_NOME', 
                    telefoneReal: numLimpo 
                };

                console.log(`📤 Enviando boas-vindas para: ${numLimpo}...`);
                try {
                    await sock.sendMessage(remoteJid, { text: MENSAGEM_BOAS_VINDAS });
                    console.log(`---> Enviado com sucesso para ${numLimpo}!`);
                } catch (err) {
                    console.log(`❌ Erro ao enviar para ${numLimpo}:`, err.message);
                }
                await new Promise(r => setTimeout(r, 2500));
            }
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
            if (msg.key.fromMe) continue;

            const remetente = msg.key.remoteJid;

            // Bloqueia grupos (@g.us)
            if (!remetente || remetente.endsWith('@g.us')) continue;

            const textoRecebido = (
                msg.message?.conversation || 
                msg.message?.extendedTextMessage?.text || 
                msg.message?.buttonsResponseMessage?.selectedButtonId ||
                ''
            ).trim();

            if (!textoRecebido) continue;

            const chaveRemetente = extrairChaveNumero(remetente);
            
            // 🔍 Busca a sessão: Primeiro pela chave exata, depois procurando qualquer sessão ativa criada no disparo
            let chaveEncontrada = Object.keys(sessoesVisitantes).find(k => k === chaveRemetente);
            
            // Se veio via ID mascarado (@lid), pega a sessão ativa do disparo
            if (!chaveEncontrada && Object.keys(sessoesVisitantes).length > 0) {
                chaveEncontrada = Object.keys(sessoesVisitantes)[0];
            }

            let estado = sessoesVisitantes[chaveEncontrada];

            console.log(`\n📩 Mensagem recebida de: ${remetente}`);
            console.log(`📝 Conteúdo: "${textoRecebido}"`);

            if (!estado) continue;

            switch (estado.etapa) {

                case 'AGUARDANDO_NOME':
                    estado.nome = textoRecebido;
                    estado.etapa = 'AGUARDANDO_RESPOSTA_GA';
                    sessoesVisitantes[chaveEncontrada] = estado;

                    const msgSegunda = 
`Olá, *${estado.nome}*! 😊

Ficamos muito felizes em ter conhecido você. Que Deus continue abençoando sua vida e sua família!

Gostaríamos de fazer um convite especial. Durante a semana temos os nossos *GA – Grupos de Atos*, encontros realizados em casas, de *segunda a sexta-feira*, em diversos bairros.

Ambiente acolhedor, onde compartilhamos a Palavra de Deus, oramos, fazemos novas amizades e crescemos juntos na fé. Temos um GA pertinho de você!

Você teria interesse em participar de um dos nossos encontros?

👉 *SIM*
👉 *NÃO*`;

                    await sock.sendMessage(remetente, { text: msgSegunda });
                    console.log(`➡️ Resposta enviada para ${estado.nome} (Perguntando interesse no GA).`);
                    break;

                case 'AGUARDANDO_RESPOSTA_GA':
                    const resp = textoRecebido.toLowerCase();

                    if (resp === 'não' || resp === 'nao' || resp === '2') {
                        const msgNao = 
`*${estado.nome}*! 😊

Agradecemos por nos responder.

Sem problemas! Ficamos felizes por você ter nos visitado!

Queremos apenas lembrar que as portas da *CENA – Comunidade Evangélica Novo Amanhecer* estarão sempre abertas para você e sua família.

Nossos cultos de celebração acontecem *todos os domingos*, em dois horários:
🕤 *09h30*
🌙 *19h30*

Que Deus abençoe sua vida, sua casa e sua família! 🙏`;

                        await sock.sendMessage(remetente, { text: msgNao });
                        delete sessoesVisitantes[chaveEncontrada];
                    } 
                    else if (resp === 'sim' || resp === '1') {
                        estado.etapa = 'AGUARDANDO_BAIRRO';
                        sessoesVisitantes[chaveEncontrada] = estado;

                        const msgSim = 
`*${estado.nome}*! 😊

Ficamos muito felizes com seu interesse em participar de um *GA – Grupo de Atos*! ❤️

Para indicar o grupo mais próximo de você, poderia nos informar *em qual bairro você mora?*

Assim, vamos localizar o *GA mais perto da sua residência*, facilitando sua participação e integração com as famílias da sua região.🙏🏡`;

                        await sock.sendMessage(remetente, { text: msgSim });
                        console.log(`➡️ Resposta enviada para ${estado.nome} (Solicitando bairro).`);
                    } else {
                        await sock.sendMessage(remetente, { text: `Por favor, responda com *SIM* ou *NÃO*.` });
                    }
                    break;

                case 'AGUARDANDO_BAIRRO':
                    estado.bairro = textoRecebido;
                    estado.etapa = 'SELECAO_OPCAO_GA';

                    estado.opcoesGAs = obterGAsProximos(textoRecebido);
                    sessoesVisitantes[chaveEncontrada] = estado;

                    let msgOpcoes = `Abaixo estão as opções de GAs mais próximos da sua região:\n\n`;
                    estado.opcoesGAs.forEach((ga, index) => {
                        msgOpcoes += `*${index + 1}* - GA ${ga.bairro} (${ga.dia} às ${ga.horario})\n`;
                    });
                    msgOpcoes += `\n*Digite o número da opção desejada (1, 2 ou 3):*`;

                    await sock.sendMessage(remetente, { text: msgOpcoes });
                    console.log(`➡️ Opções de GA enviadas para ${estado.nome}.`);
                    break;

                case 'SELECAO_OPCAO_GA':
                    const opcao = parseInt(textoRecebido);

                    if (isNaN(opcao) || opcao < 1 || opcao > estado.opcoesGAs.length) {
                        await sock.sendMessage(remetente, { text: `Por favor, digite apenas o número correspondente à opção (1, 2 ou 3).` });
                        return;
                    }

                    const gaEscolhido = estado.opcoesGAs[opcao - 1];

                    // 1. Mensagem para o visitante
                    const msgFinalVisitante = 
`*${estado.nome}*! 😊

Obrigado(a) por nos informar o GA mais próximo de você.

Nas próximas horas, o líder desse grupo entrará em contato com você para se apresentar, passar todas as informações e tirar qualquer dúvida que possa surgir.🙏❤️

_"Todos os dias, continuavam a reunir-se no pátio do templo. Partiam o pão em suas casas e juntos participavam das refeições, com alegria e sinceridade de coração, louvando a Deus... E o Senhor lhes acrescentava diariamente os que iam sendo salvos."_

*Atos 2:46-47*`;

                    await sock.sendMessage(remetente, { text: msgFinalVisitante });

                    // 2. Garante o número REAL cadastrado na lista de disparos
                    const telefoneVisitante = estado.telefoneReal;

                    // 3. Envia Alerta ao Líder do GA
                    if (gaEscolhido && gaEscolhido.liderTelefone) {
                        const liderJid = `${gaEscolhido.liderTelefone.replace(/\D/g, '')}@s.whatsapp.net`;

                        const msgAlertaLider = 
`🚨 *ALERTA DE NOVO VISITANTE - CENA IGREJA* 🚨

Paz do Senhor! Um novo visitante demonstrou interesse em participar do seu *GA ${gaEscolhido.bairro}*!

📌 *Dados do Visitante:*
👤 *Nome:* ${estado.nome}
📱 *Telefone:* +${telefoneVisitante}
🏡 *Bairro Informado:* ${estado.bairro}

💬 *Iniciar conversa rápida:*
https://wa.me/${telefoneVisitante}

⚠️ *Ação necessária:* Por favor, entre em contato nas próximas horas para dar as boas-vindas e passar o endereço exato das reuniões. Deus abençoe seu ministério! 🙏✨`;

                        try {
                            await sock.sendMessage(liderJid, { text: msgAlertaLider });
                            console.log(`📲 Alerta enviado com sucesso para o Líder do GA ${gaEscolhido.bairro}`);
                        } catch (errLider) {
                            console.error(`❌ Falha ao notificar líder do GA:`, errLider.message);
                        }
                    }

                    delete sessoesVisitantes[chaveEncontrada];
                    console.log(`✨ Fluxo concluído com sucesso para ${estado.nome}!`);
                    break;
            }
        }
    });
}

iniciarBot();