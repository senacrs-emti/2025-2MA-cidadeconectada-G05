
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
            nextStepElement = document.getElementById('step-food');
        } else {
            alert("Por favor, selecione uma opção.");
            return;
        }
    } else if (currentStepName === 'food') {
        userResponses.meatFrequency = document.getElementById('meat-frequency').value;
        // Se houver mais etapas, defina a próxima aqui:
        // nextStepElement = document.getElementById('step-transporte');
        // Se for a última etapa antes do resultado:
        calculateTotalFootprint();
        nextStepElement = document.getElementById('step-result');
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

// Função principal de cálculo
function calculateTotalFootprint() {
    let totalFootprint = 0; // em kg de CO2e

    // 1. CÁLCULO DE HABITAÇÃO (exemplo)
    let housingFactor = EMISSION_FACTORS.housing[userResponses.housingType] || 0;
    totalFootprint += housingFactor;

    // 2. CÁLCULO DE ALIMENTAÇÃO (exemplo)
    // Assumimos que a frequência é uma porcentagem (0 a 100)
    let foodImpact = EMISSION_FACTORS.food.perKilogramPerYear * (1 + (userResponses.meatFrequency / 100) * EMISSION_FACTORS.food.meatImpact);
    totalFootprint += foodImpact;

    // 3. (ADICIONAR OUTROS CÁLCULOS AQUI)
    
    // Converter para toneladas e mostrar o resultado
    let totalTonnes = (totalFootprint / 1000).toFixed(2); // Duas casas decimais
    document.getElementById('final-result').textContent = `${totalTonnes} Toneladas de CO2e por ano`;
}

// Função para reiniciar o quiz
function restartQuiz() {
    location.reload(); // Maneira mais simples de reiniciar para este exemplo
}