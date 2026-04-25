 
 
 export const backendUrl = 'http://127.0.0.1:8000'


//function to get the data from  the backend
  export const sendNodeToBackend = async (loc) => {
    const payload = {
      name: loc.name || 'Unnamed',
      latitude: loc.coords[0],
      longitude: loc.coords[1],
    }
    const response = await fetch(`${backendUrl}/nodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const t = await response.text()
      throw new Error(t || `HTTP ${response.status}`)
    }
    return response.json()
  }


 //function to create an  edges 

 export const createEdge = async (source, target, weight = 1) => {
  const res = await fetch(`${backendUrl}/edges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, target, weight }),
  })

  if (!res.ok) {
    const t = await res.text()
    throw new Error(t || `HTTP ${res.status}`)
  }

  return res.json()
}