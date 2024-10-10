// Função para carregar os carros do banco de dados (via Flask API)
async function carregarCarros() {
    const container = document.getElementById('carros-container');
    container.innerHTML = ''; // Limpa o container antes de preencher

    try {
        const response = await fetch('http://localhost:5000/api/carros'); // Substitua pelo endpoint correto
        const carros = await response.json();

        carros.forEach(carro => {
            const carroDiv = document.createElement('div');
            carroDiv.classList.add('carro');
            carroDiv.innerHTML = `
                <img src="${carro.imagem}" alt="${carro.nome}">
                <h3>${carro.nome}</h3>
                <p>Ano: ${carro.ano}</p>
                <p>Preço: ${carro.preco}</p>
                <button onclick="mostrarDetalhes('${carro._id}')">Ver detalhes</button>
            `;
            container.appendChild(carroDiv);
        });
    } catch (error) {
        console.error('Erro ao buscar carros:', error);
    }
}

// Função para pesquisar carros
async function pesquisarCarros() {
    const query = document.getElementById('search-bar').value;
    const container = document.getElementById('carros-container');
    container.innerHTML = '';

    try {
        const response = await fetch(`http://localhost:5000/api/carros/search?q=${query}`);
        const carros = await response.json();

        carros.forEach(carro => {
            const carroDiv = document.createElement('div');
            carroDiv.classList.add('carro');
            carroDiv.innerHTML = `
                <img src="${carro.imagem}" alt="${carro.nome}">
                <h3>${carro.nome}</h3>
                <p>Ano: ${carro.ano}</p>
                <p>Preço: ${carro.preco}</p>
                <button onclick="mostrarDetalhes('${carro._id}')">Ver detalhes</button>
            `;
            container.appendChild(carroDiv);
        });
    } catch (error) {
        console.error('Erro ao pesquisar carros:', error);
    }
}

// Função para exibir detalhes do carro
async function mostrarDetalhes(carroId) {
    const detalhesDiv = document.getElementById('conteudo-detalhes');
    const catalogoDiv = document.getElementById('catalogo');
    const detalhesSection = document.getElementById('detalhes');

    try {
        const response = await fetch(`http://localhost:5000/api/carros/${carroId}`);
        const carro = await response.json();

        detalhesDiv.innerHTML = `
            <h2>${carro.nome}</h2>
            <img src="${carro.imagem}" alt="${carro.nome}">
            <p>Ano: ${carro.ano}</p>
            <p>Preço: ${carro.preco}</p>
            <p>Descrição: ${carro.descricao}</p>
            <p>Localização: ${carro.localizacao}</p>
            <a href="${carro.whatsapp}" target="_blank">Fale com o vendedor</a>
        `;

        catalogoDiv.style.display = 'none';
        detalhesSection.style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar detalhes do carro:', error);
    }
}

// Função para voltar para o catálogo
function voltarParaCatalogo() {
    document.getElementById('catalogo').style.display = 'block';
    document.getElementById('detalhes').style.display = 'none';
}

// Função para redirecionar à página inicial
function voltarParaInicio() {
    window.location.href = 'index.html';  // Substitua pelo caminho correto da página inicial
}

window.onload = carregarCarros;
