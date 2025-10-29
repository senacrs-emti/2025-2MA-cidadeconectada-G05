document.addEventListener('DOMContentLoaded', () => 

    // ======== FUNÇÃO GENÉRICA DE PREENCHIMENTO DE COR =========
    function updateSliderFill(slider, value) {
      const min = parseInt(slider.min) || 0;
      const max = parseInt(slider.max) || 100;
      const val = parseInt(value) || 0;
      const percentage = ((val - min) / (max - min)) * 100;
      slider.style.background = `linear-gradient(to right, #4caf50 ${percentage}%, #ccc ${percentage}%)`;
    }
  
    // ======== ALIMENTOS (slider de % local) =========
    const rangeAlimentos = document.getElementById('rangeAlimentos');
    const porcentagemValor = document.getElementById('porcentagemValor');
  
    if (rangeAlimentos && porcentagemValor) {
      const updateAlimentos = (value) => {
        porcentagemValor.textContent = value + ' %';
        updateSliderFill(rangeAlimentos, value);
      };
      rangeAlimentos.addEventListener('input', e => updateAlimentos(e.target.value));
      updateAlimentos(rangeAlimentos.value);
    }
  
    // ======== PESSOAS =========
    const rangePessoas = document.getElementById('rangePessoas');
    const valorPessoas = document.getElementById('valorPessoas');
  
    if (rangePessoas && valorPessoas) {
      const updatePessoas = (value) => {
        const num = parseInt(value);
        valorPessoas.textContent = num === 1 ? 'APENAS EU' : num >= 10 ? '10+' : num;
        updateSliderFill(rangePessoas, value);
      };
      rangePessoas.addEventListener('input', e => updatePessoas(e.target.value));
      updatePessoas(rangePessoas.value);
    }
  
    // ======== TAMANHO DA CASA =========
    const rangeTamanho = document.getElementById('rangeTamanho');
    const valorTamanho = document.getElementById('valorTamanho');
    const labelTamanho = document.getElementById('labelTamanho');
  
    if (rangeTamanho && valorTamanho && labelTamanho) 
      const getTamanhoLabel = (m2) => {
// Variáveis
const stepOrder = [
    'step-housing-type',
    'step-housing-material',
    'step-food-meat',
    'step-food-local',
    'step-result'
];

/**
 * Função:avançar para a próxima etapa.
 *  chamada pelos botões 'Próxima Etapa' no HTML.
 * @param {string} currentStepId id da  etapa atual.
 */
function nextStep(currentStepId) {
    const currentIndex = stepOrder.indexOf(currentStepId);
    
    if (currentIndex === -1) {
        console.error(`ID da etapa atual não encontrado: ${currentStepId}`);
        return;
    }

    const nextIndex = currentIndex + 1;
    
    if (nextIndex < stepOrder.length) {
        const nextStepId = stepOrder[nextIndex];
        
        const currentStep = document.getElementById(currentStepId);
        if (currentStep) {
            currentStep.classList.remove('active-step');
            currentStep.classList.add('hidden-step');
        }

        // Mostra a próxima etapa
        const nextStep = document.getElementById(nextStepId);
        if (nextStep) {
            nextStep.classList.remove('hidden-step');
            nextStep.classList.add('active-step');
            // Rola para o topo da calculadora para a nova etapa
            document.getElementById('calculator-container').scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Se for a última etapa, pode-se adicionar a lógica de cálculo final aqui.
        console.log("Fim do questionário. Exibir resultados.");
    }
}

/**
 * Freiniciar o quiz.
 *  chama o botão 'Recalcular' no HTML.
 */
function restartQuiz() {
    // Esconde as etapas
    stepOrder.forEach(id => {
        const step = document.getElementById(id);
        if (step) {
            step.classList.remove('active-step');
            step.classList.add('hidden-step');
        }
    });

    // Mostra a primeira etapa
    const firstStep = document.getElementById(stepOrder[0]);
    if (firstStep) {
        firstStep.classList.remove('hidden-step');
        firstStep.classList.add('active-step');
    }

    const result = document.getElementById('final-result');
    if (result) result.textContent = "Calculando...";
    
    // Reinicia o  toggle
    const toggleSwitch = document.getElementById('toggleSwitch');
    if (toggleSwitch) {
        toggleSwitch.checked = false;
        alternarToggle();
    }
    
    // Rola para o topo
    document.getElementById('calculator-container').scrollIntoView({ behavior: 'smooth' });
}


/**
 *  (barra de progresso).
 * @param {HTMLElement} slider O elemento input TYPE ="range".
 */
function updateSliderFill(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percentage = (val - min) / (max - min) * 100;
    
    // Usa a variável CSS
    let color = 'var(--color-secondary)';
    if (slider.id === 'energiaRange') {
        color = '#4caf50'; // Cor verde da energia renovável
    }
    
    slider.style.background = `linear-gradient(to right, ${color} ${percentage}%, #ccc ${percentage}%)`;
}

function alternarToggle() {
    const checkbox = document.getElementById('toggleSwitch');
    const estadoTexto = document.getElementById('estado');
    const labelNao = document.getElementById('labelNao');
    const labelSim = document.getElementById('labelSim');

    if (checkbox && estadoTexto && labelNao && labelSim) {
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
}


/**
 * Lógica para o slider de frequência de carne.
 * É chamada pelo evento oninput no HTML.
 * @param {string} value 
 */
function updateMeatLabel(value) {
    const meatFrequency = document.getElementById('meat-frequency');
    const meatLabel = document.getElementById('meat-label');
    
    function getMeatLabel(val) {
        if (val <= 10) return "NUNCA (Vegano/Vegetariano)";
        if (val <= 30) return "Raramente (1-2x por semana)";
        if (val <= 50) return "Moderadamente (3-4x por semana)";
        if (val <= 75) return "Frequentemente (quase todos os dias)";
        return "MUITO FREQUENTEMENTE (carne diariamente)";
    }
    
    if (meatLabel) meatLabel.textContent = getMeatLabel(parseInt(value));
    if (meatFrequency) updateSliderFill(meatFrequency);
}



document.addEventListener('DOMContentLoaded'), () => {
    
    window.nextStep = nextStep;
    window.restartQuiz = restartQuiz;
    window.alternarToggle = alternarToggle;
    window.updateMeatLabel = updateMeatLabel;
    


    // consumo de alimentos locais  Alimentos Locais
    const rangeAlimentos = document.getElementById('rangeAlimentos');
    const porcentagemValor = document.getElementById('porcentagemValor');

    function updateAlimentos() {
        if (rangeAlimentos && porcentagemValor) {
            const value = rangeAlimentos.value;
            porcentagemValor.textContent = value + ' %';
            updateSliderFill(rangeAlimentos);
        }
    }
    
    if (rangeAlimentos) {
        rangeAlimentos.addEventListener('input', updateAlimentos);
        updateAlimentos();
    }

    //  número de pessoas  Pessoas
    const rangePessoas = document.getElementById('rangePessoas');
    const valorPessoas = document.getElementById('valorPessoas');

    function updatePessoas() { 
        if (rangePessoas && valorPessoas) {
            const value = rangePessoas.value;
            const numValue = parseInt(value, 10);
            let displayValue;

            if (numValue === 1) {
                displayValue = 'APENAS EU';
            } else if (numValue >= 10) { 
                displayValue = '10+';
            } else {
                displayValue = numValue;
            }
            
            valorPessoas.textContent = displayValue;
            updateSliderFill(rangePessoas); 
        }
    }

    if (rangePessoas) {
        rangePessoas.addEventListener('input', updatePessoas);
        updatePessoas(); 
    }

    // Tamanho da Casa
    const rangeTamanho = document.getElementById('rangeTamanho');
    const valorTamanho = document.getElementById('valorTamanho');
    const labelTamanho = document.getElementById('labelTamanho');

    function getTamanhoLabel(m2) {
        if (m2 <= 20) return 'Minúscula';
        if (m2 <= 50) return 'Pequena';
        if (m2 <= 100) return 'Média';
        if (m2 <= 200) return 'Grande';
        return 'Enorme';
      };
      const updateTamanho = (value) => {
        valorTamanho.textContent = value + ' m²';
        labelTamanho.textContent = getTamanhoLabel(parseInt(value));
        updateSliderFill(rangeTamanho, value);
      };
      rangeTamanho.addEventListener('input', e => updateTamanho(e.target.value));
      updateTamanho(rangeTamanho.value);
    }
  
    // ======== TOGGLE ENERGIA ELÉTRICA =========
    const toggleSwitch = document.getElementById('toggleSwitch');
    const estado = document.getElementById('estado');
    const labelNao = document.getElementById('labelNao');
    const labelSim = document.getElementById('labelSim');
  
    if (toggleSwitch && estado && labelNao && labelSim) {
      const alternarToggle = () => {
        if (toggleSwitch.checked) {
          estado.textContent = 'SIM';
          estado.style.color = 'green';
          labelSim.style.fontWeight = 'bold';
          labelNao.style.fontWeight = 'normal';
        } else {
          estado.textContent = 'NÃO';
          estado.style.color = 'red';
          labelNao.style.fontWeight = 'bold';
          labelSim.style.fontWeight = 'normal';
        }
      };
      toggleSwitch.addEventListener('change', alternarToggle);
      alternarToggle();
    }
  
    // ======== ENERGIA RENOVÁVEL =========
    const energiaRange = document.getElementById('energiaRange');
    const percentValue = document.getElementById('percentValue');
    const set50Btn = document.getElementById('set50Btn');
  
    if (energiaRange && percentValue) {
      const updateEnergiaRange = (value) => {
        percentValue.textContent = value + '%';
        updateSliderFill(energiaRange, value);
      };
  
      energiaRange.addEventListener('input', e => updateEnergiaRange(e.target.value));
      if (set50Btn) {
        set50Btn.addEventListener('click', () => {
          energiaRange.value = 50;
          updateEnergiaRange(50);
        });
      }
      updateEnergiaRange(energiaRange.value);
    }
  
  });
  
    

    function updateTamanho() {
        if (rangeTamanho && valorTamanho && labelTamanho) {
            const value = rangeTamanho.value;
            valorTamanho.textContent = value + ' m²';
            labelTamanho.textContent = getTamanhoLabel(parseInt(value));
            updateSliderFill(rangeTamanho);
        }
    }

    if (rangeTamanho) {
        rangeTamanho.addEventListener('input', updateTamanho);
        updateTamanho();
    }
    
    // Frequência de Carne 
    const meatFrequency = document.getElementById('meat-frequency');
    if (meatFrequency) {
        updateMeatLabel(meatFrequency.value);
    }


    // Energia Renovável
    const energiaRange = document.getElementById('energiaRange');
    const percentValue = document.getElementById('percentValue');
    const set50Btn = document.getElementById('set50Btn');

    function updateEnergiaRange() {
        if (energiaRange && percentValue) {
            const value = energiaRange.value;
            percentValue.textContent = value + '%';
            updateSliderFill(energiaRange);
        }
    }

    if (energiaRange) {
        energiaRange.addEventListener('input', updateEnergiaRange);
        updateEnergiaRange();
    }
    
    if (set50Btn) {
        set50Btn.addEventListener('click', () => {
            if (energiaRange) {
                energiaRange.value = 50;
                updateEnergiaRange();
            }
        });
    }
    
    // reinicia o quiz 
    restartQuiz();
;
