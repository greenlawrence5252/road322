const BASE_URL = process.env.EXTERNAL_API_URL

export async function sendToApi({ id, username, first_name, last_name }) {
  const payload = {
    id,
    nickName: username ?? '',
    name: [first_name, last_name].filter(Boolean).join(' '),
  }

  const res = await fetch(`${BASE_URL}/fromBot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`API responded with ${res.status}`)
  }

  return res.json()
}
