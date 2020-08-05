const Tablesort = require('tablesort')
const chroma = require('chroma-js')

const cleanNumber = (i) => i.replace(/[^\-?0-9.]/g, '')

const compareNumber = (a, b) => {
  a = parseFloat(a);
  b = parseFloat(b);

  a = isNaN(a) ? 0 : a;
  b = isNaN(b) ? 0 : b;

  return a - b;
};

Tablesort.extend('number', function(item) {
  return item.match(/^[-+]?[£\x24Û¢´€]?\d+\s*([,\.]\d{0,2})/) || // Prefixed currency
    item.match(/^[-+]?\d+\s*([,\.]\d{0,2})?[£\x24Û¢´€]/) || // Suffixed currency
    item.match(/^[-+]?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/); // Number
}, function(a, b) {
  a = cleanNumber(a);
  b = cleanNumber(b);

  return compareNumber(b, a);
});


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
  let columnIndex = -1
  for (let i = 0; i < columns.length; i += 1) {
    if (columns[i].hide) {
      continue
    }
    columnIndex += 1
    if (!columns[i].text && !columns[i].html) {
      colourColumn(tbody, columnIndex, {
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
