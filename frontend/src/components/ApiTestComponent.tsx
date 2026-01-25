// frontend/src/App.jsx
import { useState, useEffect } from 'react'

type Item = { message: string };

function AppComponentTest() {
  const [items, setItems] = useState<Item[]>([])
  const [message, setMessage] = useState('')

  const fetchItems = async () => {
    const res = await fetch('/api/test')
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    await fetch('/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    setMessage('')
    fetchItems()
  }

  return (
    <div>
      <h1>Test</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item.message}</li>
        ))}
      </ul>
    </div>
  )
}

export default AppComponentTest