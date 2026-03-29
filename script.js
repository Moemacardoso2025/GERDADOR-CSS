const btnGerar = document.querySelector('.button');
const inputText = document.querySelector('#input-text');

// ⚠️ Mantenha sua chave aqui
const API_KEY = "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
"; 

btnGerar.addEventListener('click', async () => {
    const prompt = inputText.value;

    if (!prompt) {
        alert("Por favor, descreva o que você imagina!");
        return;
    }

    btnGerar.innerText = "Gerando...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        // MUDANÇA AQUI: Instrução forçada para a IA usar sempre a mesma classe
                        content: "Você é um especialista em CSS. Gere código apenas para a classe chamada '.element-to-style'. Responda apenas com o código CSS, sem explicações ou markdown (sem aspas ou blocos de código)."
                    },
                    {
                        role: "user",
                        content: `Gere um efeito CSS de: ${prompt}`
                    }
                ],
                model: "llama-3.3-70b-versatile",
            })
        });

        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

        const data = await response.json();
        const codigoGerado = data.choices[0].message.content;

        // 1. Mostrar o texto no container
        const resultContainer = document.querySelector('#result-container');
        const outputCss = document.querySelector('#output-css');
        outputCss.innerText = codigoGerado;
        resultContainer.style.display = 'block';

        // 2. Aplicar o CSS no Preview (Agora dentro do try!)
        let styleTag = document.querySelector('#dynamic-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-styles';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = codigoGerado;

        resultContainer.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Erro:", error);
        alert("Ops! Verifique sua conexão ou chave de API.");
    } finally {
        btnGerar.innerText = "Gerar Código";
    }
});
