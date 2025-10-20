document.addEventListener('DOMContentLoaded', (event) => {
    const rangeSlider = document.getElementById('rangeAlimentos');
    const porcentagemValor = document.getElementById('porcentagemValor');

    // Função para atualizar o valor da porcentagem e o estilo de preenchimento
    function updateSliderValue(value) {
        porcentagemValor.textContent = value + ' %';
        
        // Opcional: Atualizar a cor de preenchimento da barra 
        // (necessário para alguns navegadores onde o truque do CSS não é suficiente)
        const percentage = (value - rangeSlider.min) / (rangeSlider.max - rangeSlider.min) * 100;
        
        // Truque para preencher a barra até o seletor
        rangeSlider.style.background = `linear-gradient(to right, #a2aeb6 ${percentage}%, #ccc ${percentage}%)`;
    }
    
    // Define o valor inicial
    updateSliderValue(rangeSlider.value);

    // Adiciona um listener para o evento 'input' (ocorre enquanto o usuário arrasta)
    rangeSlider.addEventListener('input', (e) => {
        updateSliderValue(e.target.value);
    });
});

// Objeto para armazenar as respostas do usuário
let userResponses = {
    housingType: '',
    meatFrequency: 0,
    localFoodPercentage: 4, // Valor inicial
    hasEnergy: 'nao', // Valor inicial
    // ... outras categorias ...
};

// ===============================================
// Fatores de Emissão (a parte crucial do cálculo)
// Valores fictícios - devem ser baseados em dados reais (kg CO2e)
const EMISSION_FACTORS = {
    housing: {
        'sem-agua-potavel': 1000,
        'com-agua-potavel': 800,
        'duplex': 600,
        'condominio-luxo': 1200,
        // ... outros fatores anuais em kg CO2e
    },
    food: {
        // Mapeamento de 0 (Nunca) a 100 (Muito Frequente)
        perKilogramPerYear: 5, // Fator de base para consumo médio
        meatImpact: 50, // Multiplicador para carne
    },
    // NOVO FATOR: Energia
    energy: {
        'sim': 2500, // Alto impacto se for de fonte não renovável
        'nao': 50,
    }
    // NOVO FATOR: Hídrico (L/ano)
    ,water: {
        base: 100000, // Pegada hídrica base
        energyMultiplier: 0.5, // Multiplicador se tiver energia
    }
};
// Função para avançar para a próxima etapa
function nextStep(currentStepName) {
    let currentStep = document.getElementById(`step-${currentStepName}`);
    let nextStepElement = null;

    // 1. CAPTURAR E SALVAR DADOS da etapa atual
    if (currentStepName === 'housing') {
        let selectedOption = document.querySelector('input[name="housing-type"]:checked');
        if (selectedOption) {
            userResponses.housingType = selectedOption.value;
            // PRÓXIMA ETAPA APÓS 'housing' DEVE SER 'food'
            nextStepElement = document.getElementById('step-food'); 
        } else {
            alert("Por favor, selecione uma opção.");
            return;
        }
    } else if (currentStepName === 'food') {
        userResponses.meatFrequency = document.getElementById('meat-frequency').value;
        // PRÓXIMA ETAPA APÓS 'food' DEVE SER 'step-food-local' (o segundo div com ID duplicado no HTML)
        // Como o HTML tem IDs duplicados, usarei a convenção que seria mais correta:
        nextStepElement = document.querySelectorAll('#calculator-container > div.quiz-step')[2]; 
    } else if (currentStepName === 'food-local') { // Tratamento para o segundo quiz de alimentos
        userResponses.localFoodPercentage = document.getElementById('rangeAlimentos').value;
         // PRÓXIMA ETAPA APÓS 'food-local' DEVE SER A PERGUNTA DE ENERGIA
        nextStepElement = document.getElementById('step-energy');
    } else if (currentStepName === 'energy') { // Nova etapa: Energia
        let selectedOption = document.querySelector('input[name="energy-presence"]:checked');
        if (selectedOption) {
            userResponses.hasEnergy = selectedOption.value;
            // ÚLTIMA ETAPA: CALCULA E VAI PARA O RESULTADO
            calculateTotalFootprint();
            nextStepElement = document.getElementById('step-result');
        } else {
            alert("Por favor, selecione uma opção.");
            return;
        }
    }

    // 2. NAVEGAÇÃO
    if (nextStepElement) {
        currentStep.classList.remove('active-step');
        currentStep.classList.add('hidden-step');
        nextStepElement.classList.remove('hidden-step');
        nextStepElement.classList.add('active-step');
    }
}

// Função de atualização do label (para o slider de alimentação)
function updateMeatLabel(value) {
    let label = document.getElementById('meat-label');
    if (value == 0) {
        label.textContent = 'Nunca (Vegano/Vegetariano)';
    } else if (value > 0 && value <= 33) {
        label.textContent = 'Raramente (1-2x por semana)';
    } else if (value > 33 && value <= 66) {
        label.textContent = 'Moderadamente (3-5x por semana)';
    } else {
        label.textContent = 'Muito frequentemente (carne diariamente)';
    }
}

// Função principal 
function calculateTotalFootprint() {
    let totalFootprint = 0; // CO2
    let totalWaterFootprint = EMISSION_FACTORS.water.base; // em Litros

    // 1. CÁLCULO DE HABITAÇÃO
    let housingFactor = EMISSION_FACTORS.housing[userResponses.housingType] || 0;
    totalFootprint += housingFactor;

    // 2. CÁLCULO DE ALIMENTAÇÃO 
    let foodImpact = EMISSION_FACTORS.food.perKilogramPerYear * (1 + (userResponses.meatFrequency / 100) * EMISSION_FACTORS.food.meatImpact);
    
    // Ajuste baseado em alimentos locais menos distanccia menor pegada
    foodImpact *= (1 - (userResponses.localFoodPercentage / 200)); // Multiplica  fator de redução
    totalFootprint += foodImpact;
    
    let energyFactor = EMISSION_FACTORS.energy[userResponses.hasEnergy] || 0;
    totalFootprint += energyFactor;
    
    if (userResponses.hasEnergy === 'sim') {
        totalWaterFootprint *= (1 + EMISSION_FACTORS.water.energyMultiplier);
    }

    // Conversão e Exibição do Resultado no SPAN 
    let totalTonnes = (totalFootprint / 1000).toFixed(2); 
    document.getElementById('final-result').textContent = `${totalTonnes} Toneladas de CO2e por ano`;
    
    // Exibição do Resultado no  SPAN 
    let totalWaterM3 = (totalWaterFootprint / 1000).toFixed(0); // Convertendo para m³
    document.getElementById('water-footprint-result').textContent = `${totalWaterM3} m³ (metros cúbicos) de água por ano`;
}

// Função para atualizar o valor da resposta e o label de status
function updateEnergyValue(checkbox) {
    // 1. Atualiza a resposta no objeto de controle do formulário
    // Se estiver marcado (checked), o valor é 'sim'
    if (checkbox.checked) {
        userResponses.hasEnergy = 'sim';
        document.getElementById('energy-status-label').textContent = 'SIM';
        document.getElementById('energy-status-label').style.color = 'green';
    } 
    // Se estiver desmarcado (unchecked), o valor é 'nao'
    else {
        userResponses.hasEnergy = 'nao';
        document.getElementById('energy-status-label').textContent = 'NÃO';
        document.getElementById('energy-status-label').style.color = 'red';
    }
}

// Garante o valor inicial ao carregar
document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializa o estado do switch de energia
    const initialCheckbox = document.getElementById('energy-toggle');
    if (initialCheckbox) {
        // Define o estado inicial como desmarcado ('nao') se não houver 'checked' no HTML
        initialCheckbox.checked = (userResponses.hasEnergy === 'sim');
        updateEnergyValue(initialCheckbox);
    }
});

// Função para reiniciar o quiz
function restartQuiz() {
    location.reload(); // Maneira mais simples de reiniciar para este exemplo
}