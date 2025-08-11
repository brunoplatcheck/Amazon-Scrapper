import './style.css'

// Configuração da API
const API_BASE_URL = 'http://localhost:3001';

// Elementos DOM
const keywordInput = document.getElementById('keyword-input');
const searchBtn = document.getElementById('search-btn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');
const resultsSection = document.getElementById('results-section');
const errorSection = document.getElementById('error-section');
const loadingSection = document.getElementById('loading-section');
const resultsTitle = document.getElementById('results-title');
const resultsCount = document.getElementById('results-count');
const productsGrid = document.getElementById('products-grid');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retry-btn');

// Estado da aplicação
let currentKeyword = '';
let isSearching = false;

/**
 * Inicializar a aplicação
 */
function initApp() {
  // Event listeners
  searchBtn.addEventListener('click', handleSearch);
  retryBtn.addEventListener('click', handleRetry);
  keywordInput.addEventListener('keypress', handleKeyPress);
  keywordInput.addEventListener('input', handleInputChange);
  
  // Focar no input ao carregar
  keywordInput.focus();
  
  console.log('Amazon Scraper App inicializada');
}

/**
 * Manipular tecla Enter no input
 */
function handleKeyPress(event) {
  if (event.key === 'Enter' && !isSearching) {
    handleSearch();
  }
}

/**
 * Manipular mudanças no input
 */
function handleInputChange() {
  const keyword = keywordInput.value.trim();
  searchBtn.disabled = keyword.length === 0 || isSearching;
}

/**
 * Manipular clique no botão de busca
 */
async function handleSearch() {
  const keyword = keywordInput.value.trim();
  
  if (!keyword) {
    showError('Por favor, digite um termo de busca.');
    keywordInput.focus();
    return;
  }
  
  currentKeyword = keyword;
  await performSearch(keyword);
}

/**
 * Manipular clique no botão de tentar novamente
 */
function handleRetry() {
  if (currentKeyword) {
    performSearch(currentKeyword);
  }
}

/**
 * Realizar busca na API
 */
async function performSearch(keyword) {
  try {
    setSearchingState(true);
    hideAllSections();
    showLoadingSection();
    
    console.log(`Buscando produtos para: ${keyword}`);
    
    // Fazer requisição para a API
    const response = await fetch(`${API_BASE_URL}/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Erro desconhecido na API');
    }
    
    console.log(`Busca concluída. ${data.count} produtos encontrados.`);
    
    // Exibir resultados
    displayResults(data);
    
  } catch (error) {
    console.error('Erro na busca:', error);
    showError(`Erro ao buscar produtos: ${error.message}`);
  } finally {
    setSearchingState(false);
  }
}

/**
 * Definir estado de busca
 */
function setSearchingState(searching) {
  isSearching = searching;
  searchBtn.disabled = searching || keywordInput.value.trim().length === 0;
  
  if (searching) {
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
  } else {
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
  }
}

/**
 * Ocultar todas as seções
 */
function hideAllSections() {
  resultsSection.style.display = 'none';
  errorSection.style.display = 'none';
  loadingSection.style.display = 'none';
}

/**
 * Exibir seção de loading
 */
function showLoadingSection() {
  loadingSection.style.display = 'block';
}

/**
 * Exibir resultados da busca
 */
function displayResults(data) {
  hideAllSections();
  
  // Atualizar título e contador
  resultsTitle.textContent = `Resultados para "${data.keyword}"`;
  resultsCount.textContent = `${data.count} produto${data.count !== 1 ? 's' : ''} encontrado${data.count !== 1 ? 's' : ''}`;
  
  // Limpar grid anterior
  productsGrid.innerHTML = '';
  
  // Verificar se há produtos
  if (data.products.length === 0) {
    showError('Nenhum produto encontrado para este termo de busca. Tente com outras palavras-chave.');
    return;
  }
  
  // Criar cards dos produtos
  data.products.forEach((product, index) => {
    const productCard = createProductCard(product, index);
    productsGrid.appendChild(productCard);
  });
  
  // Exibir seção de resultados
  resultsSection.style.display = 'block';
  
  // Scroll suave para os resultados
  setTimeout(() => {
    resultsSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }, 100);
}

/**
 * Criar card de produto
 */
function createProductCard(product, index) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.style.animationDelay = `${index * 0.1}s`;
  
  // Processar rating para exibição
  const rating = product.rating !== 'N/A' ? parseFloat(product.rating) : null;
  const stars = rating ? '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating)) : 'N/A';
  
  // Processar contagem de reviews
  const reviewCount = product.reviewCount !== 'N/A' ? product.reviewCount : 'Sem avaliações';
  
  card.innerHTML = `
    <img 
      src="${product.imageUrl}" 
      alt="${escapeHtml(product.title)}"
      class="product-image"
      loading="lazy"
      onerror="this.src='https://via.placeholder.com/200x200?text=Imagem+Indisponível'"
    />
    <h4 class="product-title">${escapeHtml(product.title)}</h4>
    <div class="product-meta">
      <div class="product-rating">
        <span class="rating-stars">${stars}</span>
        ${rating ? `<span class="rating-value">(${rating})</span>` : ''}
      </div>
      <div class="product-reviews">${reviewCount} avaliações</div>
    </div>
  `;
  
  return card;
}

/**
 * Exibir erro
 */
function showError(message) {
  hideAllSections();
  errorMessage.textContent = message;
  errorSection.style.display = 'block';
  
  // Scroll suave para o erro
  setTimeout(() => {
    errorSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }, 100);
}

/**
 * Escapar HTML para prevenir XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Verificar se a API está disponível
 */
async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (response.ok) {
      console.log('API está funcionando corretamente');
      return true;
    }
  } catch (error) {
    console.warn('API não está disponível:', error.message);
    showError('Não foi possível conectar com o servidor. Verifique se o backend está rodando na porta 3001.');
    return false;
  }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  
  // Verificar saúde da API após um pequeno delay
  setTimeout(checkApiHealth, 1000);
});

// Exportar funções para debug (opcional)
window.amazonScraper = {
  performSearch,
  checkApiHealth,
  currentKeyword: () => currentKeyword,
  isSearching: () => isSearching
};
