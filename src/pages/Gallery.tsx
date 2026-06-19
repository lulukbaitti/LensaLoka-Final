import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, Download, Edit3, Trash2, Image as ImageIcon, Camera, RefreshCw } from 'lucide-react'
// IMPORT Supabase client Anda di sini (sesuaikan path-nya jika berbeda)
import { supabase } from '../utils/supabaseClient'

interface GalleryItem {
  id:               string
  image:            string // Ini memetakan ke URL gambar di Supabase Storage
  templateId:       string
  photos:           string[]
  bgColor:          string
  userDecorations:  any[]
  stripTitle?:      string
  instagramHandle?: string
  created_at?:      string // Menggunakan penamaan timestamp bawaan Supabase
}

export function Gallery() {
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // 🔄 AMBIL DATA DARI SUPABASE (Real-time Sinkron HP & Laptop)
  useEffect(() => {
    if (!user) { 
      navigate('/')
      return 
    }

    async function fetchGallery() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('user_photos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }) // Urutkan langsung dari database (terbaru di atas)

        if (error) throw error
        
        // Map jika ada perbedaan nama kolom antara state 'image' dan 'photo_url' di DB Anda
        const mappedData = (data || []).map((dbItem: any) => ({
          ...dbItem,
          image: dbItem.image || dbItem.photo_url // Fleksibel membaca kolom image atau photo_url
        }))

        setItems(mappedData)
      } catch (err) {
        console.error('Gagal memuat galeri dari Supabase:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [user, navigate])

  // 🗑️ HAPUS DATA LANGSUNG DARI SUPABASE
  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus karya ini?')) return
    
    try {
      // 1. Hapus baris data di tabel Supabase
      const { error } = await supabase
        .from('user_photos')
        .delete()
        .eq('id', id)

      if (error) throw error

      // 2. Perbarui state tampilan lokal setelah berhasil dihapus di cloud
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error('Gagal menghapus data:', err)
      alert('Gagal menghapus foto dari database!')
    }
  }

  const handleDownload = (item: GalleryItem) => {
    if (!item.image) { alert('Gambar tidak ditemukan!'); return }
    const a = document.createElement('a')
    a.href     = item.image
    a.download = `LensaLoka_${item.id}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen w-full bg-cream text-dark-brown flex flex-col">

      {/* ── HEADER ────────────────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur p-4 flex items-center shadow-sm sticky top-0 z-50">
        <Link to="/">
          <button className="flex items-center gap-2 font-bold text-medium-brown hover:text-cherry-red transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Beranda
          </button>
        </Link>
        <div className="flex-1 flex justify-center">
          <h1 className="brand-text text-2xl flex items-center gap-2 text-dark-brown">
            <ImageIcon className="w-6 h-6 text-cherry-red" />
            Galeri LensaLoka
          </h1>
        </div>
        <Link to="/create">
          <button className="flex items-center gap-2 px-4 py-2 bg-cherry-red text-white rounded-full font-bold text-sm hover:bg-red-600 transition-colors shadow-md">
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Buat Baru</span>
          </button>
        </Link>
      </header>

      {/* ── MAIN ──────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6">
        
        {/* STATE LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
            <RefreshCw className="w-10 h-10 text-cherry-red animate-spin" />
            <p className="font-bold text-medium-brown">Sinkronisasi data galeri...</p>
          </div>
        ) : items.length === 0 ? (

          /* STATE KOSONG */
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ImageIcon className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-medium-brown mb-2">Galeri Masih Kosong</h2>
            <p className="text-gray-500 mb-6 max-w-xs">
              Kamu belum membuat foto apapun. Yuk mulai berkreasi!
            </p>
            <Link to="/create">
              <button className="px-8 py-3 bg-cherry-red text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                Buat Foto Sekarang ✨
              </button>
            </Link>
          </div>

        ) : (
          <>
            <p className="text-sm text-medium-brown/70 mb-4 font-medium">
              {items.length} karya tersimpan cloud ☁️
            </p>

            {/* ── GRID GALERI ───────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md border-2 border-dark-brown/10 overflow-hidden
                             flex flex-col hover:-translate-y-1 transition-transform duration-200"
                >
                  {/* AREA GAMBAR */}
                  <div
                    style={{
                      width:           '100%',
                      height:          '200px',
                      flexShrink:      0,
                      backgroundColor: '#f9fafb',
                      display:         'flex',
                      alignItems:      'center',
                      justifyContent:  'center',
                      overflow:        'hidden',
                    }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt="Hasil Photobooth"
                        style={{
                          maxWidth:   '100%',
                          maxHeight:  '200px',
                          width:      'auto',
                          height:     'auto',
                          objectFit:  'contain',
                          display:    'block',
                          filter:     'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
                        }}
                      />
                    ) : (
                      <div className="text-gray-300 text-sm font-bold flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8" />
                        <span>Gambar Error</span>
                      </div>
                    )}
                  </div>

                  {/* TOMBOL AKSI */}
                  <div className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white flex-shrink-0">
                    <button
                      onClick={() => handleDownload(item)}
                      title="Download"
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-baby-blue text-dark-brown
                                 rounded-xl font-bold text-xs hover:bg-blue-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Save</span>
                    </button>

                    <button
                      onClick={() => navigate(`/edit/${item.id}`)}
                      title="Edit Ulang"
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-butter-yellow text-dark-brown
                                 rounded-xl font-bold text-xs hover:bg-yellow-300 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Hapus"
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-500
                                 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
