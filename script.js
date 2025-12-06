document.addEventListener('DOMContentLoaded', (event) => {
  
    
            function updateSliderFill(slider, value) {
                const min = parseInt(slider.min) || 0;
                const max = parseInt(slider.max) || 100;
                const val = parseInt(value) || 0;
                
                const percentage = (val - min) / (max - min) * 100;
                
                let color = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary');
                if (slider.id === 'energiaRange') {
                     color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
                }
        
                slider.style.background = `linear-gradient(to right, ${color} ${percentage}%, rgba(255, 255, 255, 0.4) ${percentage}%)`;
            }
        
        
         
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
                
                if (currentStepId === 'step-food-local') {
                    
                    calculateResult();
                    showStep('step-result');
                    currentStepIndex = steps.length - 1;
        
                } else {
                    
                    const nextStepId = steps[steps.indexOf(currentStepId) + 1];
                    
                    if (nextStepId) {
                        showStep(nextStepId);
                        currentStepIndex++;
                    }
                }
            }
        
           
            window.restartQuiz = function() {
                currentStepIndex = 0;
                showStep(steps[0]);
                document.getElementById('final-result').textContent = 'Calculando...';
            }
        
        
            window.calculateAnnualCarbonFootprint = function(answers) {
                let totalFootprintKgCO2e = 0;
        
                const EMISSION_FACTORS = {
                    BASE_HOUSING_FOOTPRINT_KG: 1500, 
                    HOUSING_TYPE_MULTIPLIER: {
                        'sem-agua-potavel': 0.8,
                        'com-agua-potavel': 1.0,
                        'duplex': 1.2,   
                        'condominio-luxo': 1.5 
                    },
                    HOUSING_MATERIAL_EMISSION_KG_PER_M2: {
                        'palha/bambu': 5,
                        'adobe/argila/barro': 10,
                        'madeira': 15,
                        'tijolo/cimento': 25, 
                        'aço/outro': 35
                    },
                    ELECTRICITY_EMISSION_FACTOR_KG_PER_KWH: 0.05, 
                    AVG_ELECTRICITY_CONSUMPTION_KWH_PER_M2_YEAR: 150, 
                    BASE_FOOD_FOOTPRINT_KG: 2500, 
                    MEAT_FREQUENCY_MULTIPLIER: {
                        'NUNCA': 0.4,
                        'Raramente': 0.7, 
                        'Moderadamente': 1.0, 
                        'Frequentemente': 1.3,
                        'MUITO FREQUENTEMENTE': 1.6
                    },
                    LOCAL_FOOD_REDUCTION_FACTOR: 0.005, 
                    BASE_TRANSPORT_FOOTPRINT_KG: 1800 
                };
        
                let housingFootprint = 0;
                const housingTypeMultiplier = EMISSION_FACTORS.HOUSING_TYPE_MULTIPLIER[answers.housingType] || 1.0;
                housingFootprint += EMISSION_FACTORS.BASE_HOUSING_FOOTPRINT_KG * housingTypeMultiplier;
                const materialEmissionPerM2 = EMISSION_FACTORS.HOUSING_MATERIAL_EMISSION_KG_PER_M2[answers.housingMaterial] || 25;
                housingFootprint += materialEmissionPerM2 * answers.houseSizeM2;
        
                if (answers.hasElectricity) {
                    const avgConsumption = EMISSION_FACTORS.AVG_ELECTRICITY_CONSUMPTION_KWH_PER_M2_YEAR * answers.houseSizeM2;
                    const renewablePercentage = answers.renewableEnergyPercentage / 100;
                    const nonRenewableConsumption = avgConsumption * (1 - renewablePercentage);
                    const electricityEmission = nonRenewableConsumption * EMISSION_FACTORS.ELECTRICITY_EMISSION_FACTOR_KG_PER_KWH;
                    housingFootprint += electricityEmission;
                }
        
                let peopleFactor = 1.0;
                if (answers.peopleInHouse > 1) {
                    peopleFactor = 1.0 / Math.sqrt(answers.peopleInHouse);
                }
                housingFootprint *= peopleFactor;
                totalFootprintKgCO2e += housingFootprint;
        
                let foodFootprint = EMISSION_FACTORS.BASE_FOOD_FOOTPRINT_KG;
                const meatFrequencyMultiplier = EMISSION_FACTORS.MEAT_FREQUENCY_MULTIPLIER[answers.meatFrequency] || 1.0;
                foodFootprint *= meatFrequencyMultiplier;
                const localFoodReduction = answers.localFoodPercentage * EMISSION_FACTORS.LOCAL_FOOD_REDUCTION_FACTOR;
                foodFootprint *= (1 - localFoodReduction);
                totalFootprintKgCO2e += foodFootprint;
        
                totalFootprintKgCO2e += EMISSION_FACTORS.BASE_TRANSPORT_FOOTPRINT_KG;
        
                const totalFootprintTonnesCO2e = totalFootprintKgCO2e / 1000;
                return totalFootprintTonnesCO2e;
            }
        
            
            
            window.getQuizAnswers = function() {
                const housingType = document.querySelector('input[name="housing-type"]:checked')?.value || 'com-agua-potavel';
                const renewableEnergyPercentage = parseInt(document.getElementById('energiaRange')?.value) || 0;
                const housingMaterial = document.querySelector('input[name="housing-material"]:checked')?.value || 'tijolo/cimento';
                const peopleInHouse = parseInt(document.getElementById('rangePessoas')?.value) || 1;
                const houseSizeM2 = parseInt(document.getElementById('rangeTamanho')?.value) || 50;
                const hasElectricity = document.getElementById('toggleSwitch')?.checked || false;
                
                const meatSliderValue = parseInt(document.getElementById('meat-frequency')?.value) || 75;
                let meatFrequency;
                if (meatSliderValue < 10) {
                    meatFrequency = 'NUNCA';
                } else if (meatSliderValue < 30) {
                    meatFrequency = 'Raramente';
                } else if (meatSliderValue < 60) {
                    meatFrequency = 'Moderadamente';
                } else if (meatSliderValue < 90) {
                    meatFrequency = 'Frequentemente';
                } else {
                    meatFrequency = 'MUITO FREQUENTEMENTE';
                }
        
                const localFoodPercentage = parseInt(document.getElementById('rangeAlimentos')?.value) || 0;
        
                return {
                    housingType,
                    renewableEnergyPercentage,
                    housingMaterial,
                    peopleInHouse,
                    houseSizeM2,
                    hasElectricity,
                    meatFrequency,
                    localFoodPercentage
                };
            }
        
         
            window.calculateResult = function() {
                const answers = getQuizAnswers();
                const result = calculateAnnualCarbonFootprint(answers);
                
                const resultElement = document.getElementById('final-result');
                if (resultElement) {
                    resultElement.textContent = `${result.toFixed(2)} Toneladas de CO2e`;
                } else {
                    console.error("Elemento 'final-result' não encontrado.");
                }
                
                return result;
            }
        
          
            const rangeAlimentos = document.getElementById('rangeAlimentos');
            const porcentagemValor = document.getElementById('porcentagemValor');
        
            function updateAlimentos(value) {
                if (!rangeAlimentos || !porcentagemValor) return;
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
                if (!rangePessoas || !valorPessoas) return;
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
                updateSliderFill(rangePessoas, value); 
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
                if (!rangeTamanho || !valorTamanho || !labelTamanho) return;
                valorTamanho.textContent = value + ' m²';
                labelTamanho.textContent = getTamanhoLabel(parseInt(value));
                updateSliderFill(rangeTamanho, value);
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
                if (!checkbox || !estadoTexto || !labelNao || !labelSim) return;
        
                if (checkbox.checked) {
                    estadoTexto.textContent = 'SIM';
                    estadoTexto.style.color = 'var(--color-secondary)'; 
                    labelSim.style.fontWeight = 'bold'; 
                    labelNao.style.fontWeight = 'normal'; 
                } else {
                    estadoTexto.textContent = 'NÃO';
                    estadoTexto.style.color = '#D32F2F';
                    labelNao.style.fontWeight = 'bold'; 
                    labelSim.style.fontWeight = 'normal'; 
                }
            }
            const toggleSwitch = document.getElementById('toggleSwitch');
            if (toggleSwitch) {
                toggleSwitch.addEventListener('change', alternarToggle);
                alternarToggle();
            }
        
            window.updateMeatLabel = function(value) {
                const label = document.getElementById('meat-label');
                const slider = document.getElementById('meat-frequency');
                if (!label || !slider) return;
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
                if (!energiaRange || !percentValue) return;
                percentValue.textContent = value + '%';
                
                const min = parseInt(energiaRange.min);
                const max = parseInt(energiaRange.max);
                const val = parseInt(value);
                const percentage = ((val - min) / (max - min)) * 100;
                const color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
                energiaRange.style.background = `linear-gradient(to right, ${color} ${percentage}%, rgba(255, 255, 255, 0.4) ${percentage}%)`;
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
        
                }
                updateEnergiaRange(energiaRange.value);
            
        
            showStep(steps[currentStepIndex]);
        
        });