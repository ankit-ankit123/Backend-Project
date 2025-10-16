const API_BASE = import.meta.env.VITE_API_BASE || 'https://backend-h32q.onrender.com/api'

export async function getTours() {
  const r = await fetch(`${API_BASE}/tour`)
  return r.json()
}

export async function postTour(body) {
  const r = await fetch(`${API_BASE}/tour`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return r.json()
}

export async function putTour(id, body) {
  const r = await fetch(`${API_BASE}/tour/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return r.json()
}

export async function deleteTour(id) {
  const r = await fetch(`${API_BASE}/tour/${id}`, { method: 'DELETE' })
  return r.json()
}
