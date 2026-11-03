export function formatVND(value) {
  const n = Number(value) || 0
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(n)
}

export function todayStr() {
  const d = new Date()
  const pad = (x) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function invoiceId() {
  const d = new Date()
  const pad = (x) => String(x).padStart(2, '0')
  const r = Math.floor(1000 + Math.random() * 9000)
  return `HD${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}-${r}`
}
