// Função para carregar os carros a partir da API
async function carregarCarros() {
    const container = document.getElementById('carros-container');
    container.innerHTML = '';
    
    try {
        const response = await fetch('http://localhost:5000/carros');  // URL da sua API
        const carros = await response.json();

        carros.forEach((carro, index) => {
            const carroDiv = document.createElement('div');
            carroDiv.classList.add('carro');
            carroDiv.innerHTML = `
                <img src="${carro.imagem}" alt="Imagem do ${carro.nome}">
                <h3>${carro.nome}</h3>
                <p>Preço: ${carro.preco}</p>
                <p>Localização: ${carro.localizacao}</p>
                <button onclick="mostrarDetalhes(${index})">Ver detalhes</button>
            `;
            container.appendChild(carroDiv);
        });
    } catch (error) {
        console.error('Erro ao buscar carros:', error);
    }
}

// Carregar os carros ao abrir a página
window.onload = carregarCarros;
