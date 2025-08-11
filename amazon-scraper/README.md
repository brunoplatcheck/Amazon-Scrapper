# Amazon Product Scraper

Um projeto completo de web scraping da Amazon com backend em Bun e frontend em Vite, que permite buscar produtos em tempo real e exibir os resultados de forma organizada e visualmente atrativa.

## 🚀 Funcionalidades

- **Busca em tempo real**: Pesquise produtos diretamente na Amazon
- **Interface moderna**: Design responsivo e intuitivo
- **Dados completos**: Extrai título, rating, número de avaliações e imagens dos produtos
- **Tratamento de erros**: Sistema robusto de tratamento de erros
- **Performance otimizada**: Backend eficiente com Bun e frontend rápido com Vite

## 🛠️ Tecnologias Utilizadas

### Backend
- **Bun**: Runtime JavaScript moderno e rápido
- **Express**: Framework web minimalista
- **Axios**: Cliente HTTP para requisições
- **JSDOM**: Parser HTML para extração de dados
- **CORS**: Middleware para permitir requisições cross-origin

### Frontend
- **Vite**: Build tool moderna e rápida
- **HTML5**: Estrutura semântica
- **CSS3**: Design moderno com variáveis CSS e animações
- **JavaScript ES6+**: Lógica de interação e comunicação com API

## 📁 Estrutura do Projeto

```
amazon-scraper/
├── backend/
│   ├── index.ts          # Servidor principal com API
│   ├── package.json      # Dependências do backend
│   └── tsconfig.json     # Configuração TypeScript
├── frontend/
│   ├── src/
│   │   ├── main.js       # Lógica principal do frontend
│   │   └── style.css     # Estilos CSS
│   ├── index.html        # Página principal
│   ├── package.json      # Dependências do frontend
│   └── vite.config.js    # Configuração do Vite
└── README.md             # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Bun (instalado globalmente)

### Instalação

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd amazon-scraper
   ```

2. **Configure o Backend**:
   ```bash
   cd backend
   bun install
   ```

3. **Configure o Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

### Executando a Aplicação

1. **Inicie o Backend** (Terminal 1):
   ```bash
   cd backend
   bun run index.ts
   ```
   O servidor estará disponível em: `http://localhost:3001`

2. **Inicie o Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   A aplicação estará disponível em: `http://localhost:5173`

3. **Acesse a aplicação**:
   Abra seu navegador e vá para `http://localhost:5173`

## 📖 Como Usar

1. **Digite um termo de busca**: No campo de entrada, digite o produto que deseja buscar (ex: "smartphone", "laptop", "headphones")

2. **Clique em "Buscar"**: O sistema fará o scraping da primeira página de resultados da Amazon

3. **Visualize os resultados**: Os produtos serão exibidos em cards organizados com:
   - Imagem do produto
   - Título completo
   - Rating (estrelas)
   - Número de avaliações

## 🔧 API Endpoints

### GET `/`
Endpoint de teste para verificar se a API está funcionando.

**Resposta**:
```json
{
  "message": "Amazon Scraper API está funcionando!"
}
```

### GET `/api/scrape?keyword={termo}`
Realiza o scraping dos produtos da Amazon para o termo especificado.

**Parâmetros**:
- `keyword` (string, obrigatório): Termo de busca

**Resposta de sucesso**:
```json
{
  "success": true,
  "keyword": "smartphone",
  "products": [
    {
      "title": "iPhone 15 Pro Max 256GB",
      "rating": "4.5",
      "reviewCount": "1,234",
      "imageUrl": "https://..."
    }
  ],
  "count": 16
}
```

**Resposta de erro**:
```json
{
  "error": "Parâmetro keyword é obrigatório"
}
```

## 🎨 Características do Design

- **Design responsivo**: Funciona perfeitamente em desktop e mobile
- **Animações suaves**: Transições e efeitos visuais modernos
- **Tema Amazon**: Cores inspiradas na identidade visual da Amazon
- **UX otimizada**: Interface intuitiva e fácil de usar
- **Estados visuais**: Loading, erro e sucesso claramente indicados

## ⚠️ Considerações Importantes

### Limitações
- **Rate limiting**: A Amazon pode limitar requisições muito frequentes
- **Estrutura HTML**: Os seletores podem mudar conforme a Amazon atualiza seu site
- **Uso educacional**: Este projeto é destinado apenas para fins educacionais

### Tratamento de Erros
- **Timeout de requisições**: 10 segundos para evitar travamentos
- **Fallback de dados**: Retorna dados de exemplo em caso de erro no scraping
- **Validação de entrada**: Verifica se o termo de busca foi fornecido
- **Headers de navegador**: Simula um navegador real para evitar bloqueios

## 🔄 Melhorias Futuras

- [ ] Cache de resultados para melhor performance
- [ ] Paginação para ver mais produtos
- [ ] Filtros por preço, rating, etc.
- [ ] Comparação de produtos
- [ ] Histórico de buscas
- [ ] Export de dados (CSV, JSON)
- [ ] Notificações de mudança de preço

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é destinado apenas para fins educacionais. Respeite os termos de uso da Amazon ao utilizar este código.

## 👨‍💻 Autor

Desenvolvido como projeto educacional para demonstrar técnicas de web scraping, desenvolvimento full-stack e design de interfaces modernas.

---

**Nota**: Este projeto é apenas para fins educacionais. Sempre respeite os termos de serviço dos sites que você está fazendo scraping e considere usar APIs oficiais quando disponíveis.

