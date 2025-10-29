document.addEventListener('DOMContentLoaded', () => {

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
  
    if (rangeTamanho && valorTamanho && labelTamanho) {
      const getTamanhoLabel = (m2) => {
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
  