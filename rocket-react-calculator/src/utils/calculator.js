const OPERATIONS = {
  '+': (a, b) => a + b,
  '−': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => (b === 0 ? NaN : a / b),
}

export function parseNumber(str) {
  return parseFloat(str.replace(',', '.'))
}

export function formatNumber(n) {
  if (!Number.isFinite(n)) return 'Error'
  return parseFloat(n.toPrecision(12)).toString().replace('.', ',')
}

export function calculate(a, b, operator) {
  return OPERATIONS[operator](a, b)
}
