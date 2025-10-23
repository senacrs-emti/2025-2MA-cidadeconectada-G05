document.addEventListener('DOMContentLoaded', (event) => {
  
    function updateSliderFill(slider, value) {
        // Converte min/max/value para números
        const min = parseInt(slider.min) || 0;
        const max = parseInt(slider.max) || 100;
        const val = parseInt(value) || 0;
        
        const percentage = (val - min) / (max - min) * 100;

       
        slider.style.background = `linear-gradient(to right, #a2aeb6 ${percentage}%, #466c71 ${percentage}%)`;
    }

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
    
    const toggleSwitch = document.getElementById('toggleSwitch');
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', alternarToggle);
        alternarToggle(); 
    }
});
    const descricoes = [
        { max: 20, texto: "Baixíssima eficiência. A casa provavelmente tem alto consumo de energia e pouca ou nenhuma isolação térmica." },
        { max: 40, texto: "Pouca eficiência. Consumo de energia alto. Pode haver janelas antigas e falta de isolamento básico." },
        { max: 60, texto: "Eficiência Média. Algumas melhorias foram feitas (ex: lâmpadas LED), mas o isolamento estrutural pode ser fraco." },
        { max: 80, texto: "Boa eficiência. Isolamento térmico razoável, eletrodomésticos eficientes e algum controle de temperatura." },
        { max: 100, texto: "Concebida para a eficiência (aquecimento/arrefecimento passivo, controlo avançado da temperatura e ventilação, baixo consumo de eletricidade)" }
    ];

    // Função para atualizar a descrição
    function atualizarDescricao() {
        const valor = parseInt(slider.value); 
        let novoTexto = "Mova o slider para indicar a eficiência da sua casa."; 

        // Encontra a descrição correta
        for (const item of descricoes) {
            if (valor <= item.max) {
                novoTexto = item.texto;
                break; 
            }
        }

        descricao.textContent = novoTexto;
        
        const progresso = (valor / slider.max) * 100;
        
        slider.style.background = `linear-gradient(to right, #ff8c00 ${progresso}%, #ccc ${progresso}%)`;
    }

document.addEventListener('DOMContentLoaded', () => {
  // Seu código existente aqui...
  
  const energiaRange = document.getElementById('energiaRange');
  const percentValue = document.getElementById('percentValue');
  const set50Btn = document.getElementById('set50Btn');

  function updateEnergiaRange(value) {
    percentValue.textContent = value + '%';

    const min = parseInt(energiaRange.min);
    const max = parseInt(energiaRange.max);
    const val = parseInt(value);

    const percentage = ((val - min) / (max - min)) * 100;
    energiaRange.style.background = `linear-gradient(to right, #4caf50 ${percentage}%, #ccc ${percentage}%)`;
  }

  // Atualiza quando o slider é movido
  energiaRange.addEventListener('input', (e) => {
    updateEnergiaRange(e.target.value);
  });

  // Botão para definir 50%
  set50Btn.addEventListener('click', () => {
    energiaRange.value = 50;
    updateEnergiaRange(50);
  });

  // Inicializa visualização
  updateEnergiaRange(energiaRange.value);
});

    slider.addEventListener('input', atualizarDescricao);

    atualizarDescricao();

