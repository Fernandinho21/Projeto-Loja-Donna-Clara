# 👗 Donna Clara — Sistema de Controle de Vendas

> Sistema web de gestão de vendas desenvolvido para a loja de roupas **Donna Clara**, com interface limpa, intuitiva e funcionamento 100% offline via navegador.

---

## ✨ Funcionalidades

- 🛍️ **Registro de Vendas** — cadastro completo com produto, categoria, tamanho, quantidade, preço, desconto, forma de pagamento e observações
- 📋 **Histórico** — listagem de todas as vendas com filtros por texto, categoria, pagamento e período
- 📊 **Dashboard** — visão geral com gráficos de receita, ticket médio, top produtos, categorias e formas de pagamento
- 💾 **Exportar CSV** — exporta o histórico de vendas para planilha com um clique
- 🗑️ **Exclusão de registros** — remove vendas diretamente pelo histórico
- 📅 **Filtro por período** — visualize dados dos últimos 7, 30, 90 dias, 1 ano ou tudo

---

## 🚀 Como usar

Não precisa instalar nada. Basta abrir o arquivo no navegador:

```bash
# Clone o repositório
git clone https://github.com/Fernandinho21/Projeto-Loja-Donna-Clara.git

# Acesse a pasta
cd Projeto-Loja-Donna-Clara

# Abra o index.html no navegador
# Ou use o Live Server no VS Code
```

---

## 🗂️ Estrutura do Projeto

```
Donna-Clara/
│
├── index.html        # Página principal (Registrar Venda)
├── historico.html    # Histórico de vendas com filtros
├── vendas.html       # Página de vendas
├── styles.css        # Estilos globais
└── script.js         # Lógica e banco de dados local
```

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização e responsividade |
| JavaScript | Lógica de negócio e interatividade |
| LocalStorage | Banco de dados local no navegador |

> Sem dependências externas. Sem backend. Funciona 100% offline.

---

## 📦 Banco de Dados

Os dados são armazenados no **LocalStorage** do navegador, ou seja:

- ✅ Funciona sem internet
- ✅ Não precisa de servidor
- ✅ Os dados ficam salvos mesmo fechando o navegador
- ⚠️ Os dados ficam armazenados no navegador daquele computador

---

## 📊 Dashboard

O dashboard exibe em tempo real:

- **Receita Total** no período selecionado
- **Número de Vendas** realizadas
- **Ticket Médio** por venda
- **Descontos** concedidos
- Gráfico de vendas por **Categoria**
- Gráfico por **Forma de Pagamento**
- **Top 5 Produtos** mais vendidos
- Vendas por **dia** nos últimos 14 dias

---

## 🌐 Deploy

O sistema está publicado e disponível em:

🔗 **[donna-clara.netlify.app](https://69bd6cd5ba88696df3070145--darling-pika-bdbaf1.netlify.app/)

---

## 📸 Preview

![Registrar Venda](preview1.png)
![Histórico](preview2.png)  
![Dashboard](preview3.png)

---

## 👨‍💻 Desenvolvido por

**Fernando** — [@Fernandinho21](https://github.com/Fernandinho21)

Projeto desenvolvido com dedicação para facilitar o controle de vendas da loja **Donna Clara**. 🧡

---

## 📄 Licença

Este projeto é de uso privado da loja Donna Clara.
