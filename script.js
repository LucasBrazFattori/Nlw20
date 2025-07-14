const apiKeyinput = document.getElementById('ApiKey');
const gameSelect = document.getElementById('game-select');
const questionInput = document.getElementById('question');
const askButton = document.getElementById('ask-button');
const aiResponse = document.getElementById('IA-response');
const form = document.getElementById('form');

const markdownToHTML = (text) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(text);
}


const perguntarIA = async (question, game, apiKey) => {
const model = "gemini-2.5-flash"
const GeminiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key
=${apiKey}`;

const pergunta = `
 ## Especialidade
  - Você é um especialista assistente de meta para o jogo ${game}.

 ## Tarefa
  - Você deve responder as pergntas do usuário com base no seu conhecimento  do jogo, eestratégias, biulds e dicas.

 ## Regras
  - Se você não souber a resposta, diga que não sabe. Não tente inventar uma resposta. E jamais diga coisas que você não sabe.
  - Se a pergunta não for sobre o jogo, diga: "Esta pergunta não está reacionada com o jogo.".
  - Considere a data atual ${new Date().toLocaleDateString('pt-br')}.
  - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
  - Nunca responda itens que você não conhece ou que não existem no jogo no atual patch.

 ## Resposta
 - Economize na resposta, seja direto e com no máximo 300 caracteres.
 - Responda em markdown.
 - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está buscando.

 ## Exemplo de resposta
  - Pergunta do usuario: Melhor biuld de rengar jungle
  resposta: A biuld mais atual é: /n/n **Itens**:/n/n coloque os itens aqui/n/n **Runas**:/n/n coloque as runas aqui/n/n **Habilidades**:/n/n coloque as habilidades aqui/n/n **Estratégia**:/n/n coloque a estratégia aqui/n/n **Dicas**:/n/n coloque as dicas aqui
  ---
  Aqui está a pergunta do usuário: ${question}
  `



    const contents = [{
        role: "user",
        parts:[{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    // API
    const response = await fetch(GeminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents, tools })
    });
     
const data = await response.json();
return data.candidates[0].content.parts[0].text;


}



async function enviarFormulario(event) {
    event.preventDefault(); /* dont reload the page */
    const apiKey = apiKeyinput.value;
    const game = gameSelect.value;
    const question = questionInput.value;


    console.log({ game, apiKey, question });

    if (apiKey == '' || game == '' || question == '') {
        alert('Por favor preencha todos os campos.');
        return;
    }

    askButton.disabled = true;
    askButton.textContent = 'Perguntando...';
    askButton.classList.add('Loading');


    try {
    const text =  await perguntarIA(question, game, apiKey);
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML (text);
    aiResponse.classList.remove('hidden');
    


        // perguntar para a ia//
    } catch (error) {
        console.log('Erro: ', error);
    } finally {
        askButton.disabled = false;
        askButton.textContent = 'Perguntar';
        askButton.classList.remove('Loading');
    }
}


form.addEventListener('submit', enviarFormulario);