document.addEventListener('DOMContentLoaded', (event) => {
    // ------------------------------------------------------------------
    // 1. FUNÇÃO PRINCIPAL PARA ATUALIZAR O PREENCHIMENTO VISUAL DA BARRA
    // ------------------------------------------------------------------
    function updateSliderFill(slider, value) {
        // Converte min/max/value para números
        const min = parseInt(slider.min) || 0;
        const max = parseInt(slider.max) || 100;
        const val = parseInt(value) || 0;
        
        // Calcula a porcentagem de preenchimento
        const percentage = (val - min) / (max - min) * 100;

        // Aplica um background gradiente que simula a barra preenchida
        // O valor 'percentage%' determina até onde a cor preenchida (#a2aeb6) vai.
        // #466c71 é a cor da trilha não preenchida.
        slider.style.background = `linear-gradient(to right, #a2aeb6 ${percentage}%, #466c71 ${percentage}%)`;
    }

    // ------------------------------------------------------------------
    // 2. SLIDER: ALIMENTOS (rangeAlimentos)
    // ------------------------------------------------------------------
    const rangeAlimentos = document.getElementById('rangeAlimentos');
    const porcentagemValor = document.getElementById('porcentagemValor');

    function updateAlimentos(value) {
        porcentagemValor.textContent = value + ' %';
        updateSliderFill(rangeAlimentos, value);
    }
    
    if (rangeAlimentos) {
        rangeAlimentos.addEventListener('input', (e) => updateAlimentos(e.target.value));
        updateAlimentos(rangeAlimentos.value);
    }

    // ------------------------------------------------------------------
    // 3. SLIDER: PESSOAS (rangePessoas) - CORREÇÃO DE LÓGICA
    // ------------------------------------------------------------------
    const rangePessoas = document.getElementById('rangePessoas');
    const valorPessoas = document.getElementById('valorPessoas');

    function updatePessoas(value) { 
        // Conversão para número é CRUCIAL para a comparação de 10+
        const numValue = parseInt(value, 10);
        let displayValue;

        if (numValue === 1) {
            displayValue = 'APENAS EU';
        } else if (numValue >= 10) { // Agora compara corretamente o número 10
            displayValue = '10+';
        } else {
            displayValue = numValue;
        }
        
        valorPessoas.textContent = displayValue;
        
        if (rangePessoas) updateSliderFill(rangePessoas, value); 
    }

    if (rangePessoas) {
        rangePessoas.addEventListener('input', (e) => updatePessoas(e.target.value));
        updatePessoas(rangePessoas.value); 
    }

    // ------------------------------------------------------------------
    // 4. SLIDER: TAMANHO DA CASA (rangeTamanho)
    // ------------------------------------------------------------------
    const rangeTamanho = document.getElementById('rangeTamanho');
    const valorTamanho = document.getElementById('valorTamanho');
    const labelTamanho = document.getElementById('labelTamanho');

    function getTamanhoLabel(m2) {
        if (m2 <= 20) return 'Minúscula';
        if (m2 <= 50) return 'Pequena';
        if (m2 <= 100) return 'Média';
        if (m2 <= 200) return 'Grande';
        return 'Enorme';
    }

    function updateTamanho(value) {
        valorTamanho.textContent = value + ' m²';
        labelTamanho.textContent = getTamanhoLabel(parseInt(value));

        if (rangeTamanho) updateSliderFill(rangeTamanho, value);
    }

    if (rangeTamanho) {
        rangeTamanho.addEventListener('input', (e) => updateTamanho(e.target.value));
        updateTamanho(rangeTamanho.value);
    }

    // ------------------------------------------------------------------
    // 5. TOGGLE SWITCH
    // ------------------------------------------------------------------
    function alternarToggle() {
        const checkbox = document.getElementById('toggleSwitch');
        const estadoTexto = document.getElementById('estado');
        const labelNao = document.getElementById('labelNao');
        const labelSim = document.getElementById('labelSim');

        if (checkbox.checked) {
            estadoTexto.textContent = 'SIM';
            estadoTexto.style.color = 'green'; 
            labelSim.style.fontWeight = 'bold'; 
            labelNao.style.fontWeight = 'normal'; 
        } else {
            estadoTexto.textContent = 'NÃO';
            estadoTexto.style.color = 'red'; 
            labelNao.style.fontWeight = 'bold'; 
            labelSim.style.fontWeight = 'normal'; 
        }
    }
    
    // Inicializa o toggle
    const toggleSwitch = document.getElementById('toggleSwitch');
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', alternarToggle);
        alternarToggle(); // Chama para definir o estado inicial
    }
});
// 1. Definição dos textos de descrição com base na faixa de valor (0 a 100)
    const descricoes = [
        { max: 20, texto: "Baixíssima eficiência. A casa provavelmente tem alto consumo de energia e pouca ou nenhuma isolação térmica." },
        { max: 40, texto: "Pouca eficiência. Consumo de energia alto. Pode haver janelas antigas e falta de isolamento básico." },
        { max: 60, texto: "Eficiência Média. Algumas melhorias foram feitas (ex: lâmpadas LED), mas o isolamento estrutural pode ser fraco." },
        { max: 80, texto: "Boa eficiência. Isolamento térmico razoável, eletrodomésticos eficientes e algum controle de temperatura." },
        { max: 100, texto: "Concebida para a eficiência (aquecimento/arrefecimento passivo, controlo avançado da temperatura e ventilação, baixo consumo de eletricidade)" }
    ];

    // Função para atualizar a descrição
    function atualizarDescricao() {
        const valor = parseInt(slider.value); // Pega o valor atual do slider
        let novoTexto = "Mova o slider para indicar a eficiência da sua casa."; // Texto padrão

        // Encontra a descrição correta
        for (const item of descricoes) {
            if (valor <= item.max) {
                novoTexto = item.texto;
                break; // Encontrou a faixa, pode parar o loop
            }
        }

        // Atualiza o conteúdo da div de descrição
        descricao.textContent = novoTexto;
        
        // --- TENTATIVA DE AJUSTAR A COR DA BARRA (Apenas para simular, pois exige CSS avançado) ---
        // Calcula a porcentagem para um gradiente inline simulado
        const progresso = (valor / slider.max) * 100;
        
        // Simulação do gradiente mudando a cor do background do range
        // Nota: Isso não funciona perfeitamente em todos os navegadores para o <input type="range">, mas é a abordagem mais simples via JS.
        // O estilo visual exato da imagem original exige CSS específico para webkit/moz/ms (pseudo-elementos), que foge do escopo "simples HTML/JS".
        slider.style.background = `linear-gradient(to right, #ff8c00 ${progresso}%, #ccc ${progresso}%)`;
    }

    // 2. Adiciona o ouvinte de evento para quando o slider for movido (evento 'input')
    slider.addEventListener('input', atualizarDescricao);

    // 3. Executa a função na primeira carga para definir o texto inicial (valor 50)
    atualizarDescricao();

// Funções globais de navegação e cálculo (devem ficar fora do DOMContentLoaded)
// ... seu código 'window.nextStep', 'window.updateMeatLabel', 'window.calculateTotalFootprint', etc. ...
// Você deve ter certeza que apenas uma versão dessas funções exista.