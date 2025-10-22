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

// Funções globais de navegação e cálculo (devem ficar fora do DOMContentLoaded)
// ... seu código 'window.nextStep', 'window.updateMeatLabel', 'window.calculateTotalFootprint', etc. ...
// Você deve ter certeza que apenas uma versão dessas funções exista.