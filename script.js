const btnGerar = document.getElementById('btn-gerar');
const inputText = document.querySelector('#input-text');

// ⚠️ SUBSTITUA POR UMA CHAVE NOVA E NÃO COMPARTILHE
const API_KEY = "SUA_NOVA_CHAVE_AQUI"; 

btnGerar.addEventListener('click', async () => {
    const prompt = inputText.value.trim();

    if (!prompt) {
        alert("Por favor, descreva o que você imagina!");
        return;
    }

    // Feedback visual e trava de segurança
    btnGerar.innerText = "Gerando...";
    btnGerar.disabled = true;

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
                        content: "Você é um especialista em CSS. Gere código apenas para a classe chamada '.element-to-style'. Responda APENAS com o código CSS puro, sem explicações, sem aspas e sem blocos de código markdown (```)."
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
        let codigoGerado = data.choices[0].message.content;

        // Limpeza de segurança caso a IA envie markdown (```css)
        codigoGerado = codigoGerado.replace(/```css|```/g, "").trim();

        // 1. Mostrar o texto no container
        const resultContainer = document.querySelector('#result-container');
        const outputCss = document.querySelector('#output-css');
        
        outputCss.innerText = codigoGerado;
        resultContainer.style.display = 'block';

        // 2. Aplicar o CSS no Preview
        let styleTag = document.getElementById('dynamic-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-styles';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = codigoGerado;

        // Rolagem suave
        resultContainer.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Erro:", error);
        alert("Ops! Verifique sua conexão ou se a chave de API ainda é válida.");
    } finally {
        btnGerar.innerText = "Gerar Código";
        btnGerar.disabled = false;
    }
});
