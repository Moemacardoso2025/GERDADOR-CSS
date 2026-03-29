const btnGerar = document.getElementById('btn-gerar');
const inputText = document.querySelector('#input-text');
const outputCss = document.querySelector('#output-css');
const resultContainer = document.querySelector('#result-container');

// ⚠️ SUBSTITUA PELA SUA CHAVE NOVA E SEGURA
const API_KEY = "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"; 

btnGerar.addEventListener('click', async () => {
    const prompt = inputText.value.trim();

    if (!prompt) {
        alert("Por favor, descreva o que você imagina!");
        return;
    }

    // Feedback visual
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
                        content: "Você é um especialista em CSS. Gere código apenas para a classe chamada '.element-to-style'. Responda APENAS com o código CSS puro, sem explicações, sem aspas, sem blocos de código markdown (```css) e sem notas extras."
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
        let codigoGerado = data.choices[0].message.content.trim();

        // Limpeza de segurança
        codigoGerado = codigoGerado.replace(/```css|```/g, "").trim();

        // Aplicar ao DOM
        outputCss.innerText = codigoGerado;
        resultContainer.style.display = 'block';

        // Aplicar estilo dinâmico
        let styleTag = document.getElementById('dynamic-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-styles';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = `.element-to-style { ${codigoGerado} }`;

        resultContainer.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Erro:", error);
        alert("Ops! Verifique sua chave de API ou conexão.");
    } finally {
        btnGerar.innerText = "Gerar Código";
        btnGerar.disabled = false;
    }
});

// Função de Copiar
function copyToClipboard() {
    const text = outputCss.innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btnCopiar = document.querySelector('.copy-btn');
        const originalText = btnCopiar.innerText;
        btnCopiar.innerText = "✅ Copiado!";
        setTimeout(() => btnCopiar.innerText = originalText, 2000);
    });
}
