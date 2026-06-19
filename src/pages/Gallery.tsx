import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Image, Trash2, Grid, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface UserPhoto {
  id: string
  image_url: string
  strip_title: string
  created_at: string
}

// MENGGUNAKAN EXPORT FUNCTION AGAR MATCH DENGAN IMPORT { Gallery } DI APP.TSX
export function Gallery() {
  const { user } = useAuth()
  const [photos, setPhotos] = useState<UserPhoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPhotos() {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('user_photos')
          .select('id, image_url, strip_title, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data) setPhotos(data)
      } catch (err) {
        console.error('Gagal memuat galeri:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah kamu yakin ingin menghapus foto strip ini?')) return
    
    try {
      const { error } = await supabase
        .from('user_photos')
        .delete()
        .eq('id', id)

      if (error) throw error
      setPhotos((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert('Gagal menghapus foto.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen w-full bg-cream text-dark-brown p-6">
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <Link to="/create" className="flex items-center gap-2 font-bold text-medium-brown hover:text-cherry-red transition-colors">
          <ArrowLeft className="w-5 h-5" /> Buat Lagi
        </Link>
        <h1 className="brand-text text-3xl flex items-center gap-2">
          <Grid className="w-7 h-7 text-cherry-red" /> Galeri Cetakku
        </h1>
        <div className="w-20" />
      </header>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center animate-pulse py-12">Memuat foto strip cantikmu...</p>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-gray-300">
            <Image className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada foto strip yang disimpan.</p>
            <Link to="/create">
              <button className="mt-4 px-6 py-2.5 bg-cherry-red text-white font-bold rounded-full hover:bg-red-600 transition-colors">
                Mulai Potret Sekarang
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white p-4 rounded-2xl shadow-md border-2 border-dark-brown flex flex-col group relative">
                <div className="aspect-[1/3] w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                  <img 
                    src={photo.image_url} 
                    alt={photo.strip_title || 'Photo Strip'} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="font-bold text-sm truncate flex-1">
                    {photo.strip_title || 'Untitled Strip'}
                  </p>
                  <button 
                    onClick={() => handleDelete(photo.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
