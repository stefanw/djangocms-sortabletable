const Tablesort = require('tablesort')
const chroma = require('chroma-js')
 

const defaultCellColor = '#333';
const whiteCellColor = '#fff';

const getValue = (el) => {
  let tdText = el.getAttribute('data-sort') || el.textContent || el.innerText || '';
  return Number(tdText);
};

var colourColumn = (tbody, col, settings) => {
  let i, td, val;
  let trs = tbody.getElementsByTagName('tr');
  let min = Infinity, max = -Infinity;
  let domain = settings.domain;
  let values = [];
  let t = (x) => x
  if (settings.logscale) {
    t = (x) => Math.LOG10E * Math.log(Math.abs(x)) * Math.sign(x)
  }
  if (domain === undefined) {
    for (i = 0; i < trs.length; i += 1) { // Skip header
      td = trs[i].getElementsByTagName('td')[col];
      val = t(getValue(td));
      if (isNaN(val)) { continue }
      values.push(val);
      min = Math.min(min, val);
      max = Math.max(max, val);
    }
    domain = [min, max];
  }
  if (settings.midpoint !== undefined) {
    domain = [domain[0], settings.midpoint, domain[1]];
  }
  if (settings.reversed) {
    domain = domain.reverse();
  }
  const colorScale = chroma.scale(settings.scale).mode('lab').domain(domain);
  for (i = 0; i < trs.length; i += 1) {
    td = trs[i].getElementsByTagName('td')[col];
    val = t(getValue(td));
    let backgroundColor = colorScale(val).hex();
    td.style.backgroundColor = backgroundColor;
    // Check contrast
    if (chroma.contrast(backgroundColor, defaultCellColor) < 4.5) {
      td.style.color = whiteCellColor;
    }
  }
};

const sortableTable = (table, settings) => {
  let tbody = table.getElementsByTagName('tbody')[0];
  settings.scale = settings.scale || 'OrRd';
  let columns = settings.columns;
  for (let i = 0; i < columns.length; i += 1) {
    if (!columns[i].text && !columns[i].html) {
      colourColumn(tbody, i, {
        scale: columns[i].scale || settings.scale,
        domain: columns[i].domain,
        midpoint: columns[i].midpoint,
        reversed: columns[i].reversed,
        logscale: columns[i].logscale,
      });
    }
  }
  new Tablesort(table, {descending: !settings.ascending});
};

let tables = document.querySelectorAll('.sortable-table')
Array.from(tables).forEach(table => {
  let settings = {}
  try {
    settings = JSON.parse(table.dataset.settings)
  } catch {}
  sortableTable(table, settings)
})
