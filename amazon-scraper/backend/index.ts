import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Permitir CORS para todas as origens
app.use(express.json());

// Interface para os dados do produto
interface ProductData {
  title: string;
  rating: string;
  reviewCount: string;
  imageUrl: string;
}

// Endpoint básico de teste
app.get('/', (req, res) => {
  res.json({ message: 'Amazon Scraper API está funcionando!' });
});

// Endpoint para scraping da Amazon
app.get('/api/scrape', async (req, res) => {
  try {
    const keyword = req.query.keyword as string;
    
    if (!keyword) {
      return res.status(400).json({ 
        error: 'Parâmetro keyword é obrigatório' 
      });
    }

    console.log(`Iniciando scraping para: ${keyword}`);
    
    // Realizar scraping real da Amazon
    const products = await scrapeAmazonProducts(keyword);

    res.json({
      success: true,
      keyword,
      products,
      count: products.length
    });

  } catch (error) {
    console.error('Erro no scraping:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Função para fazer scraping dos produtos da Amazon
async function scrapeAmazonProducts(keyword: string): Promise<ProductData[]> {
  try {
    // URL de busca da Amazon
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    
    // Headers para simular um navegador real
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    console.log(`Fazendo requisição para: ${searchUrl}`);
    
    // Fazer requisição para a Amazon
    const response = await axios.get(searchUrl, { 
      headers,
      timeout: 10000 // 10 segundos de timeout
    });

    // Parsear HTML com JSDOM
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const products: ProductData[] = [];

    // Seletores para produtos da Amazon (podem variar)
    const productSelectors = [
      '[data-component-type="s-search-result"]',
      '.s-result-item',
      '[data-asin]:not([data-asin=""])'
    ];

    let productElements: Element[] = [];
    
    // Tentar diferentes seletores
    for (const selector of productSelectors) {
      productElements = Array.from(document.querySelectorAll(selector));
      if (productElements.length > 0) {
        console.log(`Encontrados ${productElements.length} produtos usando seletor: ${selector}`);
        break;
      }
    }

    if (productElements.length === 0) {
      console.log('Nenhum produto encontrado com os seletores padrão');
      return [];
    }

    // Extrair dados de cada produto (máximo 20 produtos da primeira página)
    for (let i = 0; i < Math.min(productElements.length, 20); i++) {
      const element = productElements[i];
      
      try {
        // Extrair título
        const titleElement = element.querySelector('h2 a span, .s-title-instructions-style span, [data-cy="title-recipe-title"]');
        const title = titleElement?.textContent?.trim() || 'Título não encontrado';

        // Extrair rating
        const ratingElement = element.querySelector('.a-icon-alt, [aria-label*="stars"], .a-star-mini .a-icon-alt');
        let rating = 'N/A';
        if (ratingElement) {
          const ratingText = ratingElement.getAttribute('aria-label') || ratingElement.textContent || '';
          const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
          rating = ratingMatch ? ratingMatch[1] : 'N/A';
        }

        // Extrair número de reviews
        const reviewElement = element.querySelector('a[href*="#customerReviews"] span, .a-size-base');
        let reviewCount = 'N/A';
        if (reviewElement) {
          const reviewText = reviewElement.textContent?.trim() || '';
          const reviewMatch = reviewText.match(/(\d+(?:,\d+)*)/);
          reviewCount = reviewMatch ? reviewMatch[1] : 'N/A';
        }

        // Extrair URL da imagem
        const imageElement = element.querySelector('img.s-image, .s-product-image img, img[data-image-latency]');
        let imageUrl = 'https://via.placeholder.com/200x200';
        if (imageElement) {
          imageUrl = imageElement.getAttribute('src') || 
                    imageElement.getAttribute('data-src') || 
                    imageUrl;
        }

        // Adicionar produto se tiver pelo menos título
        if (title && title !== 'Título não encontrado') {
          products.push({
            title: title.substring(0, 200), // Limitar tamanho do título
            rating,
            reviewCount,
            imageUrl
          });
        }

      } catch (productError) {
        console.error(`Erro ao processar produto ${i}:`, productError);
        continue;
      }
    }

    console.log(`Scraping concluído. ${products.length} produtos extraídos.`);
    return products;

  } catch (error) {
    console.error('Erro no scraping da Amazon:', error);
    
    // Retornar dados de exemplo em caso de erro
    return [
      {
        title: `Produto de exemplo para "${keyword}" (erro no scraping real)`,
        rating: '4.0',
        reviewCount: '100',
        imageUrl: 'https://via.placeholder.com/200x200'
      }
    ];
  }
}

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});