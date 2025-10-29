document.addEventListener('DOMContentLoaded', (event) => {
  

    function updateSliderFill(slider, value) {
        // min/max
        const min = parseInt(slider.min) || 0;
        const max = parseInt(slider.max) || 100;
        const val = parseInt(value) || 0;
        
        const percentage = (val - min) / (max - min) * 100;

       
        slider.style.background = `linear-gradient(to right, var(--color-secondary) ${percentage}%, rgba(255, 255, 255, 0.4) ${percentage}%)`;
    }


    // variaveis/etapas
    const steps = [
        'step-housing-type',
        'step-housing-material',
        'step-food-meat',
        'step-food-local',
        'step-result'
    ];
    let currentStepIndex = 0;

    function showStep(stepId) {
        const allSteps = document.querySelectorAll('.quiz-step');
        allSteps.forEach(step => {
            step.classList.add('hidden-step');
            step.classList.remove('active-step');
        });

        const targetStep = document.getElementById(stepId);
        if (targetStep) {
            targetStep.classList.remove('hidden-step');
            targetStep.classList.add('active-step');
        }
    }

    window.nextStep = function(currentStepId) {
        const currentStep = document.getElementById(currentStepId);
        const nextStepId = steps[steps.indexOf(currentStepId) + 1];

        if (nextStepId) {
            showStep(nextStepId);
            currentStepIndex++;
        } else if (currentStepId === 'food-local') {
            calculateResult();
            showStep('step-result');
            currentStepIndex = steps.length - 1;
        }
    }

    window.restartQuiz = function() {
        currentStepIndex = 0;
        showStep(steps[0]);
        document.getElementById('final-result').textContent = 'Calculando...';
    }

    function calculateResult() {
      
        const randomResult = (Math.random() * (15 - 5) + 5).toFixed(2); // Entre 5 e 15 toneladas
        document.getElementById('final-result').textContent = `${randomResult} Toneladas de CO2`;
    }

    showStep(steps[currentStepIndex]);


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

    const rangePessoas = document.getElementById('rangePessoas');
    const valorPessoas = document.getElementById('valorPessoas');

    function updatePessoas(value) { 
       
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
        
        if (rangePessoas) updateSliderFill(rangePessoas, value); 
    }

    if (rangePessoas) {
        rangePessoas.addEventListener('input', (e) => updatePessoas(e.target.value));
        updatePessoas(rangePessoas.value); 
    }

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

  
    window.alternarToggle = function() {
        const checkbox = document.getElementById('toggleSwitch');
        const estadoTexto = document.getElementById('estado');
        const labelNao = document.getElementById('labelNao');
        const labelSim = document.getElementById('labelSim');

        if (checkbox.checked) {
            estadoTexto.textContent = 'SIM';
            estadoTexto.style.color = 'var(--color-secondary)'; 
            labelSim.style.fontWeight = 'bold'; 
            labelNao.style.fontWeight = 'normal'; 
        } else {
            estadoTexto.textContent = 'NÃO';
            estadoTexto.style.color = '#D32F2F'; // Vermelho de Alerta
            labelNao.style.fontWeight = 'bold'; 
            labelSim.style.fontWeight = 'normal'; 
        }
    }
    
    const toggleSwitch = document.getElementById('toggleSwitch');
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', alternarToggle);
        // Chamada inicial para definir o estado visual correto
        // Nota: O HTML original não tinha um 'estado' inicial, então vamos garantir que ele seja inicializado.
        alternarToggle(); 
    }

    window.updateMeatLabel = function(value) {
        const label = document.getElementById('meat-label');
        const slider = document.getElementById('meat-frequency');
        let text = '';

        if (value < 10) {
            text = 'NUNCA (Vegano/Vegetariano)';
        } else if (value < 30) {
            text = 'Raramente (1-2 vezes por semana)';
        } else if (value < 60) {
            text = 'Moderadamente (3-5 vezes por semana)';
        } else if (value < 90) {
            text = 'Frequentemente (quase diariamente)';
        } else {
            text = 'MUITO FREQUENTEMENTE (carne diariamente)';
        }
        label.textContent = text;
        updateSliderFill(slider, value);
    }

    const meatFrequencySlider = document.getElementById('meat-frequency');
    if (meatFrequencySlider) {
        meatFrequencySlider.addEventListener('input', (e) => updateMeatLabel(e.target.value));
        updateMeatLabel(meatFrequencySlider.value);
    }


    const energiaRange = document.getElementById('energiaRange');
    const percentValue = document.getElementById('percentValue');
    const set50Btn = document.getElementById('set50Btn');

    function updateEnergiaRange(value) {
        percentValue.textContent = value + '%';

        const min = parseInt(energiaRange.min);
        const max = parseInt(energiaRange.max);
        const val = parseInt(value);

        const percentage = ((val - min) / (max - min)) * 100;
        energiaRange.style.background = `linear-gradient(to right, var(--color-primary) ${percentage}%, rgba(255, 255, 255, 0.4) ${percentage}%)`;
    }

    if (energiaRange) {
        energiaRange.addEventListener('input', (e) => {
            updateEnergiaRange(e.target.value);
        });

        if (set50Btn) {
            set50Btn.addEventListener('click', () => {
                energiaRange.value = 50;
                updateEnergiaRange(50);
            });
        }

        // Inicializa visualização
        updateEnergiaRange(energiaRange.value);
    }
});