import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://backend-h32q.onrender.com/api'

export default function App() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(false)

  const [postForm, setPostForm] = useState({
    tour_id: '',
    name: '',
    description: '',
    pickup: '',
    meeting_point: '',
    drop_off: '',
    duration: '',
    durationUnit: 'days'
  })

  const [putForm, setPutForm] = useState({ id: '', name: '', duration: '' })
  const [deleteId, setDeleteId] = useState('')

  const fetchTours = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/tour`)
      const data = await res.json()
      setTours(data)
      toast.success(`Loaded ${data.length} tours`)
    } catch (err) {
      toast.error('Error loading tours')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePost = async (e) => {
    e.preventDefault()
    if (!postForm.tour_id) return toast.error('tour_id is required')
    try {
      const res = await fetch(`${API_BASE}/tour`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tour_id: Number(postForm.tour_id),
          name: postForm.name,
          description: postForm.description,
          pickup: postForm.pickup,
          meeting_point: postForm.meeting_point,
          drop_off: postForm.drop_off,
          duration: `${postForm.duration} ${postForm.durationUnit}`
        })
      })
      const body = await res.json()
      if (res.status === 201) {
        toast.success(body.message || 'Created')
        setPostForm({ tour_id: '', name: '', description: '', pickup: '', meeting_point: '', drop_off: '', duration: '', durationUnit: 'days' })
        fetchTours()
      } else {
        toast.error(body.error || 'Insert failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error')
    }
  }

  const handlePut = async (e) => {
    e.preventDefault()
    if (!putForm.id) return toast.error('Tour ID is required')
    try {
      const res = await fetch(`${API_BASE}/tour/${putForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: putForm.name, duration: putForm.duration })
      })
      const body = await res.json()
      if (res.status === 200) {
        toast.success(body.message || 'Updated')
        setPutForm({ id: '', name: '', duration: '' })
        fetchTours()
      } else {
        toast.error(body.error || 'Update failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this tour?')) return
    try {
      const res = await fetch(`${API_BASE}/tour/${id}`, { method: 'DELETE' })
      const body = await res.json()
      if (res.status === 200) {
        toast.success(body.message || 'Deleted')
        fetchTours()
      } else {
        toast.error(body.message || 'Delete failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error')
    }
  }

  return (
    <div className="min-h-screen p-6 bg-sky-100">
      <ToastContainer position="top-center" />

      <header className="max-w-4xl mx-auto text-center py-8">
        <div className="bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=ae9b9c6f39c3897c69ef1c6b8f6a0f52')] bg-cover rounded-t-lg h-40 shadow-inner"></div>
        <h1 className="text-5xl font-extrabold text-slate-800 mt-6">Tour Website</h1>
        <button onClick={fetchTours} className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg shadow-lg">
          GET Tours
        </button>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <section className="card-bg rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-center mb-4">Add New Tour</h2>
          <form onSubmit={handlePost} className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <input value={postForm.tour_id} onChange={e=>setPostForm({...postForm,tour_id:e.target.value})} placeholder="Tour ID" className="border px-2 py-1" />
              <input value={postForm.name} onChange={e=>setPostForm({...postForm,name:e.target.value})} placeholder="Title" className="border px-2 py-1 col-span-2" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <textarea value={postForm.description} onChange={e=>setPostForm({...postForm,description:e.target.value})} placeholder="Description" className="border px-2 py-1 col-span-3" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input value={postForm.pickup} onChange={e=>setPostForm({...postForm,pickup:e.target.value})} placeholder="Pick Up" className="border px-2 py-1" />
              <input value={postForm.meeting_point} onChange={e=>setPostForm({...postForm,meeting_point:e.target.value})} placeholder="Meeting Point" className="border px-2 py-1" />
              <input value={postForm.drop_off} onChange={e=>setPostForm({...postForm,drop_off:e.target.value})} placeholder="Drop Off" className="border px-2 py-1" />
            </div>
            <div className="flex items-center gap-3">
              <input value={postForm.duration} onChange={e=>setPostForm({...postForm,duration:e.target.value})} placeholder="Duration" className="border px-2 py-1 w-40" />
              <select value={postForm.durationUnit} onChange={e=>setPostForm({...postForm,durationUnit:e.target.value})} className="border px-2 py-1">
                <option value="days">days</option>
                <option value="hours">hours</option>
              </select>
              <button type="submit" className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded shadow">POST Tour</button>
            </div>
          </form>
        </section>

        <section className="card-bg rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-center mb-4">Update Tour</h2>
          <form onSubmit={handlePut} className="flex gap-3 items-center">
            <input value={putForm.id} onChange={e=>setPutForm({...putForm,id:e.target.value})} placeholder="Tour ID" className="border px-2 py-1 w-36" />
            <input value={putForm.name} onChange={e=>setPutForm({...putForm,name:e.target.value})} placeholder="Title" className="border px-2 py-1 flex-1" />
            <input value={putForm.duration} onChange={e=>setPutForm({...putForm,duration:e.target.value})} placeholder="Duration" className="border px-2 py-1 w-40" />
            <button type="submit" className="ml-2 btn btn-primary">PUT Tour</button>
          </form>
        </section>

        <section className="card-bg rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-center mb-4">Delete Tour</h2>
          <form onSubmit={e=>{e.preventDefault(); if(!deleteId) return toast.error('Tour ID is required'); handleDelete(deleteId); setDeleteId('') }} className="flex gap-3 items-center">
            <input value={deleteId} onChange={e=>setDeleteId(e.target.value)} placeholder="Tour ID" className="border px-2 py-1 w-36" />
            <button type="submit" className="btn btn-danger">Delete Tour</button>
            <p className="text-sm text-slate-500 ml-4">You can also delete from the table action buttons.</p>
          </form>
        </section>

        <section className="card-bg rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-center mb-4">Tours</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-slate-600">
                  <th className="p-2">Tour ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Duration</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={5} className="p-4">Loading...</td></tr>}
                {!loading && tours.length === 0 && <tr><td colSpan={5} className="p-4">No tours found</td></tr>}
                {tours.map(t => (
                  <tr key={t._id} className="border-t">
                    <td className="p-2 align-top">{t.tour_id}</td>
                    <td className="p-2 align-top">{t.name}</td>
                    <td className="p-2 align-top">{t.description}</td>
                    <td className="p-2 align-top">{t.duration}</td>
                    <td className="p-2 align-top">
                      <button onClick={()=>{setPutForm({id:t.tour_id,name:t.name,duration:t.duration})}} className="mr-2 px-2 py-1 bg-yellow-200 rounded">Edit</button>
                      <button onClick={()=>handleDelete(t.tour_id)} className="px-2 py-1 bg-red-200 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
