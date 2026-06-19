import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Upload,
  ArrowLeft,
  RefreshCw,
  Smile,
  Save,
  Trash2,
  FlipHorizontal2,
  Palette,
  Instagram,
} from 'lucide-react'
import { templates, Decoration } from '../data/templates'
import { FILTERS, BG_COLORS, generateFinalStrip } from '../utils/canvas'
import { PhotoStrip } from '../components/PhotoStrip'
import { useAuth } from '../contexts/AuthContext'
// IMPORT KONEKSI SUPABASE DARI LIB KAMU
import { supabase } from '../lib/supabase'

type Step = 'source' | 'capture' | 'decorate' | 'saving'

const EMOJIS = [
  '✨', '💖', '⭐', '🎀', '💌', '💕', '💎', '🔥', '👑', '🪄', '💡',
  '😍', '😎', '🥺', '😂', '🥰', '🤪', '😇', '🤫', '🥳', '👻', '👽',
  '🦋', '🌸', '🌻', '🌷', '🌈', '🌙', '🌵', '🍄', '🧸', '🐈', '🐶', '🐰',
  '🍒', '🍓', '🎂', '🍰', '🍕', '🍟', '🍭', '☕', '🎉', '🎈', '🎁', '📸',
]

const AVAILABLE_FONTS = [
  { name: 'Elegant Serif',    value: 'Georgia, serif' },
  { name: 'Modern Sans',      value: 'Arial, sans-serif' },
  { name: 'Retro Monospace',  value: '"Courier New", Courier, monospace' },
  { name: 'Playful Hand',     value: '"Comic Sans MS", cursive' },
  { name: 'Bold Impact',      value: 'Impact, sans-serif' },
]

export function CameraCapture() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const template = templates.find((t) => t.id === templateId)

  const [step, setStep] = useState<Step>('source')
  const [source, setSource] = useState<'camera' | 'upload' | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [currentSlot, setCurrentSlot] = useState(0)
  const [filter, setFilter] = useState(FILTERS[0])
  const [mirrored, setMirrored] = useState(false)
  const [bgColor, setBgColor] = useState(template?.defaultBgColor || '#ffffff')
  const [timer, setTimer] = useState<number | null>(null)
  const [stripTitle, setStripTitle] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')

  const [userDecorations, setUserDecorations] = useState<Decoration[]>([])
  const [textInput, setTextInput] = useState('')
  const [textColor, setTextColor] = useState('#d63447')
  const [textAddFont, setTextAddFont] = useState(AVAILABLE_FONTS[0].value)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!template) navigate('/create')
  }, [template, navigate])

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch {
      alert('Tidak bisa mengakses kamera. Pastikan browser memiliki izin.')
    }
  }

  const handleSourceSelect = (s: 'camera' | 'upload') => {
    setSource(s)
    setStep('capture')
    if (s === 'camera') startCamera()
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.filter = filter.css
    if (mirrored) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    handlePhotoTaken(canvas.toDataURL('image/jpeg', 0.9))
  }

  const startTimer = () => {
    if (timer !== null) return
    let count = 3
    setTimer(count)
    const interval = setInterval(() => {
      count -= 1
      if (count > 0) {
        setTimer(count)
      } else {
        clearInterval(interval)
        setTimer(null)
        capturePhoto()
      }
    }, 1000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.filter = filter.css
        ctx.drawImage(img, 0, 0)
        handlePhotoTaken(canvas.toDataURL('image/jpeg', 0.9))
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handlePhotoTaken = (dataUrl: string) => {
    const newPhotos = [...photos]
    newPhotos[currentSlot] = dataUrl
    setPhotos(newPhotos)

    if (currentSlot < (template?.slots || 0) - 1) {
      setCurrentSlot((prev) => prev + 1)
    } else {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      setStep('decorate')
    }
  }

  const addText = () => {
    if (!textInput.trim()) return
    const newDec: Decoration = {
      id: Date.now().toString(),
      type: 'text',
      content: textInput,
      x: 50,
      y: 45,
      size: 1.8,
      color: textColor,
      fontFamily: textAddFont,
      rotation: 0,
    }
    setUserDecorations((prev) => [...prev, newDec])
    setTextInput('')
  }

  const addEmoji = (emoji: string) => {
    const newDec: Decoration = {
      id: Date.now().toString(),
      type: 'emoji',
      content: emoji,
      x: 50,
      y: 40,
      size: 2.5,
      rotation: 0,
    }
    setUserDecorations((prev) => [...prev, newDec])
  }

  const removeDecoration = (id: string) => {
    setUserDecorations((prev) => prev.filter((d) => d.id !== id))
  }

  const updateDecoration = (id: string, updates: Partial<Decoration>) => {
    setUserDecorations((prev) =>
      prev.map((dec) => (dec.id === id ? { ...dec, ...updates } : dec)),
    )
  }

  // ☁️ SIMPAN DATA LANGSUNG KE SUPABASE DATABASE
  const handleSave = async () => {
    if (!template || !user) return
    setStep('saving')
    try {
      const finalImage = await generateFinalStrip(
        template,
        photos,
        bgColor,
        userDecorations,
        stripTitle,
        instagramHandle,
      )

      // Masukkan baris data baru ke tabel cloud Supabase 'user_photos'
      const { error } = await supabase
        .from('user_photos')
        .insert([
          {
            user_id: user.id,
            image: finalImage, // Menyimpan base64 / string gambar strip final
            templateId: template.id,
            photos: photos,
            bgColor: bgColor,
            userDecorations: userDecorations,
            stripTitle: stripTitle,
            instagramHandle: instagramHandle,
          }
        ])

      if (error) throw error

      navigate('/gallery')
    } catch (err) {
      console.error('Gagal menyimpan ke Supabase:', err)
      alert('Gagal menyimpan foto ke cloud database! Coba lagi.')
      setStep('decorate')
    }
  }

  if (!template) return null

  return (
    <div className="min-h-screen w-full bg-cream text-dark-brown flex flex-col">

      {/* ── HEADER ────────────────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur p-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <Link to="/create">
          <button className="flex items-center gap-2 font-bold text-medium-brown hover:text-cherry-red transition-colors">
            <ArrowLeft className="w-5 h-5" /> Ganti Template
          </button>
        </Link>
        <div className="brand-text text-xl flex items-center gap-2">
          <Camera className="w-6 h-6 text-cherry-red" /> LensaLoka
        </div>
        <div className="w-32" />
      </header>

      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 gap-8">

        {/* ── KOLOM KIRI: PREVIEW STRIP ─────────────────── */}
        <div className="w-full md:w-5/12 flex flex-col items-center justify-start pt-4">
          <div className="w-full max-w-[300px] sticky top-24">
            <p className="text-xs font-bold text-center text-cherry-red mb-2 animate-bounce">
              💡 Klik & geser stiker langsung di foto ini!
            </p>

            <div
              className="w-full shadow-2xl rounded overflow-hidden"
              style={{ border: '2px solid #e5e7eb' }}
            >
              <PhotoStrip
                template={template}
                photos={photos}
                bgColor={bgColor}
                userDecorations={userDecorations}
                stripTitle={stripTitle}
                instagramHandle={instagramHandle}
                onUpdateDecoration={step === 'decorate' ? updateDecoration : undefined}
              />
            </div>

            {/* Background Color Picker */}
            {step !== 'saving' && (
              <div className="mt-4 bg-white p-4 rounded-2xl shadow-md border-2 border-medium-brown">
                <p className="font-bold text-sm mb-2 text-center flex justify-center items-center gap-1">
                  <Palette className="w-4 h-4 text-cherry-red" /> Warna Background
                </p>
                <div className="flex flex-wrap justify-center items-center gap-2">
                  {BG_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBgColor(color)}
                      title={color}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        bgColor === color
                          ? 'border-cherry-red scale-110 shadow-md'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <label className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer overflow-hidden" title="Warna custom">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="opacity-0 w-0 h-0 absolute"
                    />
                    <span className="text-gray-400 text-lg leading-none">+</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── KOLOM KANAN: KONTROL ──────────────────────── */}
        <div className="w-full md:w-7/12 flex flex-col items-center justify-start pt-4">

          {/* STEP: PILIH SUMBER */}
          {step === 'source' && (
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border-4 border-dark-brown text-center">
              <h2 className="brand-text text-3xl mb-2">Pilih Sumber Foto</h2>
              <p className="text-sm text-medium-brown mb-6">
                Template: <strong>{template.name}</strong> · {template.slots} foto
              </p>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleSourceSelect('camera')}
                  className="flex items-center justify-center gap-3 p-6 bg-butter-yellow rounded-2xl
                             border-2 border-dark-brown font-bold text-xl hover:bg-yellow-300 transition-colors"
                >
                  <Camera className="w-8 h-8" /> Gunakan Kamera
                </button>
                <button
                  onClick={() => handleSourceSelect('upload')}
                  className="flex items-center justify-center gap-3 p-6 bg-baby-blue rounded-2xl
                             border-2 border-dark-brown font-bold text-xl hover:bg-blue-200 transition-colors"
                >
                  <Upload className="w-8 h-8" /> Upload dari Galeri
                </button>
              </div>
            </div>
          )}

          {/* STEP: CAPTURE */}
          {step === 'capture' && (
            <div className="w-full max-w-xl flex flex-col items-center">
              <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-dark-brown w-full">
                <div className="flex justify-between items-center mb-3 px-1">
                  <h2 className="brand-text text-2xl">
                    Foto {currentSlot + 1} dari {template.slots}
                  </h2>
                  <div className="flex gap-1">
                    {Array.from({ length: template.slots }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                          i < photos.length
                            ? 'bg-cherry-red border-cherry-red'
                            : i === currentSlot
                            ? 'border-cherry-red bg-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden mb-4 shadow-inner">
                  {source === 'camera' ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                        style={{
                          filter: filter.css,
                          transform: mirrored ? 'scaleX(-1)' : 'none',
                        }}
                      />
                      <button
                        onClick={() => setMirrored((m) => !m)}
                        className="absolute top-3 right-3 bg-white/90 text-dark-brown
                                   px-3 py-1.5 rounded-full font-bold text-sm z-20 shadow-md"
                      >
                        <FlipHorizontal2 className="w-4 h-4 inline mr-1" /> Mirror
                      </button>

                      <AnimatePresence>
                        {timer !== null && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 2 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 backdrop-blur-sm"
                          >
                            <span className="text-[150px] font-extrabold text-white drop-shadow-[0_0_30px_rgba(214,52,71,1)]">
                              {timer}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-4 border-dashed border-gray-300 rounded-2xl gap-3">
                      <Upload className="w-12 h-12 text-gray-400" />
                      <p className="text-gray-500 font-medium text-sm">
                        Pilih foto dari galeri kamu
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-dark-brown text-white rounded-full font-bold hover:bg-medium-brown transition-colors"
                      >
                        Browse Foto
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-1.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                        filter.id === f.id
                          ? 'bg-cherry-red text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>

                {source === 'camera' && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={startTimer}
                      disabled={timer !== null}
                      className={`w-20 h-20 bg-cherry-red rounded-full border-4 border-white
                                  shadow-[0_0_0_4px_#d63447] transition-transform ${
                                    timer !== null
                                      ? 'opacity-50 scale-95 cursor-not-allowed'
                                      : 'hover:scale-105 active:scale-95'
                                  }`}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP: HIAS / DECORATE */}
          {step === 'decorate' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md bg-white p-6 rounded-3xl shadow-xl border-4 border-dark-brown"
            >
              <h2 className="brand-text text-2xl mb-4 flex items-center gap-2">
                <Smile className="w-6 h-6 text-cherry-red" /> Hias Foto Kamu!
              </h2>

              <div className="mb-4 bg-butter-yellow/30 p-4 rounded-2xl border-2 border-dark-brown">
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-medium-brown block mb-1">
                      Judul Strip (tampil di atas)
                    </label>
                    <input
                      type="text"
                      maxLength={25}
                      value={stripTitle}
                      onChange={(e) => setStripTitle(e.target.value)}
                      placeholder="HAPPY GRADUATION"
                      className="w-full px-3 py-2 rounded-xl border-2 border-gray-300 text-sm focus:border-cherry-red focus:outline-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-1 text-right">
                      {stripTitle.length}/25
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-medium-brown flex items-center gap-1 mb-1">
                      <Instagram className="w-3 h-3 text-cherry-red" /> Username Instagram
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={instagramHandle}
                      onChange={(e) =>
                        setInstagramHandle(e.target.value.replace(/\s/g, ''))
                      }
                      placeholder="@instagram_kamu"
                      className="w-full px-3 py-2 rounded-xl border-2 border-gray-300 text-sm focus:border-cherry-red focus:outline-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-1 text-right">
                      {instagramHandle.length}/20
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4 bg-cream p-4 rounded-2xl border-2 border-medium-brown">
                <p className="font-bold text-sm mb-2 text-dark-brown">✏️ Tambah Tulisan</p>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addText()}
                  placeholder="Ketik tulisan..."
                  className="w-full mb-2 px-3 py-2 rounded-xl border-2 border-gray-300 focus:border-cherry-red focus:outline-none text-sm"
                />
                <div className="flex gap-2 mb-3">
                  <select
                    value={textAddFont}
                    onChange={(e) => setTextAddFont(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-300 text-sm focus:outline-none"
                  >
                    {AVAILABLE_FONTS.map((f) => (
                      <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-2 border-gray-300 p-0.5"
                  />
                </div>
                <button
                  onClick={addText}
                  className="w-full py-2 bg-dark-brown hover:bg-medium-brown transition-colors text-white rounded-xl font-bold text-sm"
                >
                  Tempel Tulisan
                </button>
              </div>

              <div className="mb-4 bg-cream p-4 rounded-2xl border-2 border-medium-brown">
                <p className="font-bold text-sm mb-2 text-dark-brown">🎨 Tambah Stiker</p>
                <div className="flex flex-wrap justify-center gap-1.5 max-h-28 overflow-y-auto p-2 bg-white rounded-xl">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="text-2xl hover:scale-125 transition-transform p-0.5"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {userDecorations.length > 0 && (
                <div className="mb-4">
                  <p className="font-bold mb-2 text-xs text-gray-500">
                    Stiker Aktif — atur ukuran & rotasi:
                  </p>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {userDecorations.map((dec) => (
                      <div
                        key={dec.id}
                        className="bg-white border-2 border-gray-100 p-3 rounded-xl flex flex-col gap-2 text-xs shadow-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-dark-brown truncate max-w-[160px]">
                            {dec.content}
                          </span>
                          <button
                            onClick={() => removeDecoration(dec.id)}
                            className="text-red-400 bg-red-50 p-1 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex flex-col gap-1">
                            <span className="text-gray-500">Ukuran</span>
                            <input
                              type="range"
                              min="0.5"
                              max="6"
                              step="0.1"
                              value={dec.size}
                              onChange={(e) =>
                                updateDecoration(dec.id, { size: parseFloat(e.target.value) })
                              }
                              className="accent-cherry-red"
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-gray-500">Putar</span>
                            <input
                              type="range"
                              min="-180"
                              max="180"
                              step="5"
                              value={dec.rotation || 0}
                              onChange={(e) =>
                                updateDecoration(dec.id, { rotation: parseInt(e.target.value) })
                              }
                              className="accent-cherry-red"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleSave}
                className="w-full py-4 bg-cherry-red hover:bg-red-600 transition-colors text-white
                           rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
              >
                <Save className="w-5 h-5" /> Simpan ke Galeri
              </button>
            </motion.div>
          )}

          {/* STEP: SAVING */}
          {step === 'saving' && (
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <RefreshCw className="w-12 h-12 text-cherry-red animate-spin" />
              <p className="text-dark-brown font-bold text-lg animate-pulse">
                Mencetak karyamu ke Cloud Database...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
