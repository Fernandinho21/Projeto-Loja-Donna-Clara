// ─── DB ────────────────────────────────────────────────────────
const DB_KEY = 'dc_vendas';

function loadVendas() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)) || []; }
  catch { return []; }
}

function saveVendas(v) {
  localStorage.setItem(DB_KEY, JSON.stringify(v));
}

// ─── UTILS ────────────────────────────────────────────────────
function fmtMoeda(v) {
  return 'R$ ' + Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function fmtData(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

// ─── HEADER DATE ──────────────────────────────────────────────
(function() {
  const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  document.getElementById('headerDate').textContent =
    new Date().toLocaleDateString('pt-BR', opts);
})();

// ─── PAGES ────────────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  event.target.classList.add('active');
  if (name === 'historico') renderHistorico();
  if (name === 'dashboard') renderDashboard();
  if (name === 'vendas') renderRecentSales();
}

// ─── FORM ─────────────────────────────────────────────────────
document.getElementById('dataVenda').value = today();

['quantidade', 'preco', 'desconto'].forEach(id => {
  document.getElementById(id).addEventListener('input', updatePreview);
});

function updatePreview() {
  const q = parseFloat(document.getElementById('quantidade').value) || 0;
  const p = parseFloat(document.getElementById('preco').value) || 0;
  const d = parseFloat(document.getElementById('desconto').value) || 0;
  const total = Math.max(0, q * p - d);
  document.getElementById('totalPreview').textContent = total > 0 ? fmtMoeda(total) : '';
}

function salvarVenda() {
  const produto = document.getElementById('produto').value.trim();
  const categoria = document.getElementById('categoria').value;
  const tamanho = document.getElementById('tamanho').value;
  const quantidade = parseInt(document.getElementById('quantidade').value) || 1;
  const preco = parseFloat(document.getElementById('preco').value);
  const pagamento = document.getElementById('pagamento').value;
  const desconto = parseFloat(document.getElementById('desconto').value) || 0;
  const data = document.getElementById('dataVenda').value;
  const obs = document.getElementById('obs').value.trim();

  if (!produto) { toast('⚠️ Informe o produto.'); return; }
  if (!preco || preco <= 0) { toast('⚠️ Informe o preço.'); return; }
  if (!pagamento) { toast('⚠️ Selecione a forma de pagamento.'); return; }
  if (!data) { toast('⚠️ Informe a data.'); return; }

  const total = Math.max(0, quantidade * preco - desconto);

  const venda = { id: genId(), produto, categoria, tamanho, quantidade, preco, pagamento, desconto, total, data, obs };
  const vendas = loadVendas();
  vendas.push(venda);
  saveVendas(vendas);

  toast('✔ Venda registrada — ' + fmtMoeda(total));
  limparForm();
  renderRecentSales();
}

function limparForm() {
  ['produto', 'obs'].forEach(id => document.getElementById(id).value = '');
  ['categoria', 'tamanho', 'pagamento'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('quantidade').value = 1;
  document.getElementById('preco').value = '';
  document.getElementById('desconto').value = 0;
  document.getElementById('dataVenda').value = today();
  document.getElementById('totalPreview').textContent = '';
}

// ─── RECENT SALES ─────────────────────────────────────────────
function renderRecentSales() {
  const vendas = loadVendas().slice(-8).reverse();
  const wrap = document.getElementById('recentSalesWrap');
  if (!vendas.length) {
    wrap.innerHTML = '<div class="empty-state"><div class="icon">🛍️</div>Nenhuma venda registrada ainda.</div>';
    return;
  }
  wrap.innerHTML = `<table>
    <thead><tr>
      <th>Data</th><th>Produto</th><th>Cat.</th><th>Tam.</th><th>Qtd</th><th>Pagamento</th><th>Total</th>
    </tr></thead>
    <tbody>
    ${vendas.map(v => `<tr>
      <td>${fmtData(v.data)}</td>
      <td>${v.produto}</td>
      <td><span class="badge badge-gold">${v.categoria || '—'}</span></td>
      <td>${v.tamanho || '—'}</td>
      <td>${v.quantidade}</td>
      <td>${v.pagamento}</td>
      <td style="color:var(--gold);font-weight:500">${fmtMoeda(v.total)}</td>
    </tr>`).join('')}
    </tbody>
  </table>`;
}

// ─── HISTÓRICO ────────────────────────────────────────────────
function renderHistorico() {
  let vendas = loadVendas();
  const txt = document.getElementById('filterText').value.toLowerCase();
  const cat = document.getElementById('filterCat').value;
  const pag = document.getElementById('filterPag').value;
  const de = document.getElementById('filterDe').value;
  const ate = document.getElementById('filterAte').value;

  if (txt) vendas = vendas.filter(v => v.produto.toLowerCase().includes(txt));
  if (cat) vendas = vendas.filter(v => v.categoria === cat);
  if (pag) vendas = vendas.filter(v => v.pagamento === pag);
  if (de) vendas = vendas.filter(v => v.data >= de);
  if (ate) vendas = vendas.filter(v => v.data <= ate);

  vendas = vendas.slice().reverse();

  const wrap = document.getElementById('historicoWrap');
  const totalEl = document.getElementById('historicoTotal');

  if (!vendas.length) {
    wrap.innerHTML = '<div class="empty-state"><div class="icon">📋</div>Nenhuma venda encontrada.</div>';
    totalEl.textContent = '';
    return;
  }

  const soma = vendas.reduce((s, v) => s + v.total, 0);
  totalEl.textContent = `${vendas.length} venda(s) — Total: ${fmtMoeda(soma)}`;

  wrap.innerHTML = `<table>
    <thead><tr>
      <th>Data</th><th>Produto</th><th>Categoria</th><th>Tam.</th><th>Qtd</th><th>Unitário</th><th>Desconto</th><th>Pagamento</th><th>Total</th><th>Obs</th><th></th>
    </tr></thead>
    <tbody>
    ${vendas.map(v => `<tr>
      <td>${fmtData(v.data)}</td>
      <td>${v.produto}</td>
      <td><span class="badge badge-gold">${v.categoria || '—'}</span></td>
      <td>${v.tamanho || '—'}</td>
      <td>${v.quantidade}</td>
      <td>${fmtMoeda(v.preco)}</td>
      <td>${v.desconto > 0 ? fmtMoeda(v.desconto) : '—'}</td>
      <td><span class="badge badge-green">${v.pagamento}</span></td>
      <td style="color:var(--gold);font-weight:500">${fmtMoeda(v.total)}</td>
      <td style="color:var(--text-muted);font-size:12px">${v.obs || '—'}</td>
      <td><button class="btn btn-danger" style="padding:4px 10px;font-size:12px" onclick="deletarVenda('${v.id}')">✕</button></td>
    </tr>`).join('')}
    </tbody>
  </table>`;
}

function deletarVenda(id) {
  if (!confirm('Remover esta venda?')) return;
  const vendas = loadVendas().filter(v => v.id !== id);
  saveVendas(vendas);
  renderHistorico();
  toast('Venda removida.');
}

function limparFiltros() {
  ['filterText','filterDe','filterAte'].forEach(id => document.getElementById(id).value = '');
  ['filterCat','filterPag'].forEach(id => document.getElementById(id).value = '');
  renderHistorico();
}

function exportarCSV() {
  const vendas = loadVendas();
  if (!vendas.length) { toast('Nenhuma venda para exportar.'); return; }
  const header = 'Data,Produto,Categoria,Tamanho,Qtd,Preco,Desconto,Pagamento,Total,Obs';
  const rows = vendas.map(v =>
    [v.data, `"${v.produto}"`, v.categoria, v.tamanho, v.quantidade,
     v.preco.toFixed(2), v.desconto.toFixed(2), v.pagamento, v.total.toFixed(2), `"${v.obs}"`].join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `donna-clara-vendas-${today()}.csv`;
  a.click();
  toast('CSV exportado!');
}

// ─── DASHBOARD ────────────────────────────────────────────────
let currentPeriod = '7';

function setPeriod(p, el) {
  currentPeriod = p;
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderDashboard();
}

function filterByPeriod(vendas) {
  if (currentPeriod === 'all') return vendas;
  const days = parseInt(currentPeriod);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutStr = cutoff.toISOString().split('T')[0];
  return vendas.filter(v => v.data >= cutStr);
}

function renderDashboard() {
  const all = loadVendas();
  const vendas = filterByPeriod(all);

  // Cards
  const totalRec = vendas.reduce((s, v) => s + v.total, 0);
  const qtdVendas = vendas.length;
  const ticketMedio = qtdVendas ? totalRec / qtdVendas : 0;
  const totalDescontos = vendas.reduce((s, v) => s + (v.desconto || 0), 0);

  document.getElementById('dashCards').innerHTML = `
    <div class="card"><div class="card-label">Receita Total</div><div class="card-value">${fmtMoeda(totalRec)}</div><div class="card-sub">no período</div></div>
    <div class="card"><div class="card-label">Nº de Vendas</div><div class="card-value">${qtdVendas}</div><div class="card-sub">transações</div></div>
    <div class="card"><div class="card-label">Ticket Médio</div><div class="card-value green">${fmtMoeda(ticketMedio)}</div><div class="card-sub">por venda</div></div>
    <div class="card"><div class="card-label">Descontos</div><div class="card-value red">${fmtMoeda(totalDescontos)}</div><div class="card-sub">concedidos</div></div>
  `;

  // Chart helper
  function barChart(containerId, data, fmtVal) {
    const el = document.getElementById(containerId);
    if (!data.length) { el.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:8px 0">Sem dados.</div>'; return; }
    const max = Math.max(...data.map(d => d.val));
    el.innerHTML = data.map(d => `
      <div class="chart-bar-row">
        <div class="chart-bar-label" title="${d.label}">${d.label}</div>
        <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${max ? (d.val/max*100) : 0}%"></div></div>
        <div class="chart-bar-val">${fmtVal(d.val)}</div>
      </div>`).join('');
  }

  // Por categoria
  const byCat = {};
  vendas.forEach(v => { const k = v.categoria || 'Outros'; byCat[k] = (byCat[k] || 0) + v.total; });
  barChart('chartCat', Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([l,v])=>({label:l,val:v})), fmtMoeda);

  // Por pagamento
  const byPag = {};
  vendas.forEach(v => { const k = v.pagamento || '—'; byPag[k] = (byPag[k] || 0) + 1; });
  barChart('chartPag', Object.entries(byPag).sort((a,b)=>b[1]-a[1]).map(([l,v])=>({label:l,val:v})), v => v + ' venda(s)');

  // Top 5 produtos
  const byProd = {};
  vendas.forEach(v => { byProd[v.produto] = (byProd[v.produto] || 0) + v.total; });
  const top5 = Object.entries(byProd).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([l,v])=>({label:l,val:v}));
  barChart('chartProd', top5, fmtMoeda);

  // Por dia (últimos 14 dias)
  const diasMap = {};
  const hoje = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(hoje); d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    diasMap[iso] = 0;
  }
  vendas.forEach(v => { if (diasMap[v.data] !== undefined) diasMap[v.data] += v.total; });
  const diaData = Object.entries(diasMap).map(([iso, val]) => {
    const [y,m,d] = iso.split('-');
    return { label: `${d}/${m}`, val };
  });
  barChart('chartDia', diaData, fmtMoeda);
}

// ─── INIT ─────────────────────────────────────────────────────
renderRecentSales();