import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Camera,
  Upload,
  ArrowLeft,
  RefreshCw,
  Type,
  Smile,
  Save,
  Trash2,
  LayoutTemplate,
  Edit3,
  Download,
  FlipHorizontal2,
  Palette,
} from 'lucide-react'
import { templates, Template, Decoration } from '../data/templates'
import { FILTERS, BG_COLORS, generateFinalStrip } from '../utils/canvas'
import { PhotoStrip } from '../components/PhotoStrip'
import { useAuth } from '../contexts/AuthContext'

const EMOJIS = [
  '✨', '💖', '⭐', '🎀', '💌', '💕', '💎', '🔥', '👑', '🪄',
  '🦋', '🌸', '🌻', '🌷', '🌈', '🌙', '🍒', '🍓', '📸', '🧸',
]

const AVAILABLE_FONTS = [
  { name: 'Elegant Serif',   value: 'Georgia, serif' },
  { name: 'Modern Sans',     value: 'Arial, sans-serif' },
  { name: 'Retro Monospace', value: '"Courier New", Courier, monospace' },
  { name: 'Playful Hand',    value: '"Comic Sans MS", cursive' },
  { name: 'Bold Impact',     value: 'Impact, sans-serif' },
]

export function EditPhoto() {
  const { photoId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [item, setItem] = useState<any>(null)
  const [template, setTemplate] = useState<Template | null>(null)
  const [step, setStep] = useState<'edit' | 'saving'>('edit')
  const [activeTab, setActiveTab] = useState<'photos' | 'template' | 'decorate'>('photos')

  const [photos, setPhotos] = useState<string[]>([])
  const [bgColor, setBgColor] = useState('#ffffff')
  const [userDecorations, setUserDecorations] = useState<Decoration[]>([])

  // Re-take photo state
  const [editingSlot, setEditingSlot] = useState<number | null>(null)
  const [source, setSource] = useState<'camera' | 'upload' | null>(null)
  const [filter, setFilter] = useState(FILTERS[0])
  const [mirrored, setMirrored] = useState(false)
  const [timer, setTimer] = useState<number | null>(null)

  // Decorate state
  const [textInput, setTextInput] = useState('')
  const [textColor, setTextColor] = useState('#d63447')
  const [textFont, setTextFont] = useState(AVAILABLE_FONTS[0].value)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load item dari localStorage
  useEffect(() => {
    if (!user || !photoId) return
    const gallery = JSON.parse(
      localStorage.getItem(`lensaloka_gallery_${user.id}`) || '[]',
    )
    const found = gallery.find((g: any) => g.id === photoId)
    if (!found) {
      navigate('/gallery')
      return
    }
    setItem(found)
    const t = templates.find((t) => t.id === found.templateId) || templates[0]
    setTemplate(t)
    setPhotos(found.photos || [])
    setBgColor(found.bgColor || t.defaultBgColor)
    setUserDecorations(found.userDecorations || [])
  }, [user, photoId, navigate])

  // Cleanup stream kamera
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
      alert('Tidak bisa mengakses kamera.')
    }
  }

  const handleSourceSelect = (s: 'camera' | 'upload') => {
    setSource(s)
    if (s === 'camera') startCamera()
  }

  const capturePhoto = () => {
    if (!videoRef.current || editingSlot === null) return
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
    if (!file || editingSlot === null) return
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
    if (editingSlot === null) return
    const newPhotos = [...photos]
    newPhotos[editingSlot] = dataUrl
    setPhotos(newPhotos)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    setEditingSlot(null)
    setSource(null)
  }

  const cancelEditSlot = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    setEditingSlot(null)
    setSource(null)
  }

  const changeTemplate = (newTemplate: Template) => {
    setTemplate(newTemplate)
    setBgColor(newTemplate.defaultBgColor)
    // Sesuaikan jumlah foto
    const newPhotos = [...photos]
    while (newPhotos.length < newTemplate.slots) newPhotos.push('')
    setPhotos(newPhotos.slice(0, newTemplate.slots))
  }

  const handleDownload = async () => {
    if (!template) return
    if (photos.some((p) => !p)) {
      alert('Ada slot foto yang masih kosong!')
      setActiveTab('photos')
      return
    }
    try {
      const finalImage = await generateFinalStrip(template, photos, bgColor, userDecorations)
      const a = document.createElement('a')
      a.href = finalImage
      a.download = `LensaLoka_${item?.id || Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch {
      alert('Gagal mengunduh foto!')
    }
  }

  const handleSave = async () => {
    if (!template || !user || !item) return
    if (photos.some((p) => !p)) {
      alert('Ada slot foto yang masih kosong!')
      setActiveTab('photos')
      return
    }
    setStep('saving')
    try {
      const finalImage = await generateFinalStrip(template, photos, bgColor, userDecorations)
      const gallery = JSON.parse(
        localStorage.getItem(`lensaloka_gallery_${user.id}`) || '[]',
      )
      const idx = gallery.findIndex((g: any) => g.id === item.id)
      if (idx !== -1) {
        gallery[idx] = {
          ...gallery[idx],
          image: finalImage,
          templateId: template.id,
          photos,
          bgColor,
          userDecorations,
        }
        localStorage.setItem(`lensaloka_gallery_${user.id}`, JSON.stringify(gallery))
      }
      navigate('/gallery')
    } catch {
      alert('Gagal menyimpan foto!')
      setStep('edit')
    }
  }

  const addText = () => {
    if (!textInput.trim()) return
    setUserDecorations((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'text',
        content: textInput,
        x: 50,
        y: 50,
        size: 1.8,
        color: textColor,
        fontFamily: textFont,
        rotation: 0,
      } as Decoration,
    ])
    setTextInput('')
  }

  const addEmoji = (emoji: string) => {
    setUserDecorations((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'emoji',
        content: emoji,
        x: 50,
        y: 50,
        size: 2.5,
        rotation: 0,
      } as Decoration,
    ])
  }

  const updateDecoration = (id: string, updates: Partial<Decoration>) => {
    setUserDecorations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    )
  }

  if (!template || !item) return null

  return (
    <div className="min-h-screen w-full bg-cream text-dark-brown flex flex-col">

      {/* ── HEADER ────────────────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur p-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <Link to="/gallery">
          <button className="flex items-center gap-2 font-bold text-medium-brown hover:text-cherry-red transition-colors">
            <ArrowLeft className="w-5 h-5" /> Batal Edit
          </button>
        </Link>
        <div className="brand-text text-xl flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-cherry-red" /> Edit Foto
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={step === 'saving'}
            className="px-4 py-2 bg-baby-blue text-dark-brown rounded-full font-bold
                       flex items-center gap-2 hover:scale-105 transition-transform
                       disabled:opacity-50 border-2 border-dark-brown text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button
            onClick={handleSave}
            disabled={step === 'saving'}
            className="px-5 py-2 bg-cherry-red text-white rounded-full font-bold
                       flex items-center gap-2 hover:scale-105 transition-transform
                       disabled:opacity-50 text-sm"
          >
            <Save className="w-4 h-4" /> Simpan
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 gap-8">

        {/* ── KOLOM KIRI: PREVIEW ───────────────────────── */}
        <div className="w-full md:w-5/12 flex flex-col items-center justify-start pt-4">
          <div className="w-full max-w-[280px] sticky top-24">
            <p className="text-xs font-bold text-center text-cherry-red mb-2">
              💡 Klik & geser stiker di sini!
            </p>
            <div className="w-full shadow-2xl rounded overflow-hidden border-2 border-gray-200">
              <PhotoStrip
                template={template}
                photos={photos}
                bgColor={bgColor}
                userDecorations={userDecorations}
                onUpdateDecoration={updateDecoration}
              />
            </div>
          </div>
        </div>

        {/* ── KOLOM KANAN: PANEL EDIT ───────────────────── */}
        <div className="w-full md:w-7/12 flex flex-col pt-4">
          {step === 'saving' ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <RefreshCw className="w-12 h-12 text-cherry-red" />
              </motion.div>
              <p className="brand-text text-xl text-dark-brown">Menyimpan perubahan...</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border-4 border-dark-brown overflow-hidden">

              {/* TABS */}
              <div className="flex border-b-4 border-dark-brown bg-gray-50">
                {(
                  [
                    { id: 'photos',   label: 'Foto',      icon: <Camera className="w-4 h-4" /> },
                    { id: 'template', label: 'Template',   icon: <LayoutTemplate className="w-4 h-4" /> },
                    { id: 'decorate', label: 'Hias',       icon: <Smile className="w-4 h-4" /> },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3.5 font-bold flex items-center justify-center gap-1.5 text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-cherry-red border-b-4 border-cherry-red -mb-1'
                        : 'text-medium-brown hover:text-dark-brown'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5">

                {/* TAB: FOTO */}
                {activeTab === 'photos' && (
                  <div>
                    {editingSlot === null ? (
                      <>
                        <p className="font-bold mb-4">Pilih slot foto yang ingin diganti:</p>
                        <div className="grid grid-cols-2 gap-4">
                          {photos.map((photo, i) => (
                            <div
                              key={i}
                              className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden
                                         border-2 border-gray-200 group cursor-pointer"
                              onClick={() => setEditingSlot(i)}
                            >
                              {photo ? (
                                <img src={photo} alt={`Slot ${i + 1}`} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-sm">
                                  Slot {i + 1} (kosong)
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="px-3 py-1.5 bg-white text-dark-brown rounded-full font-bold text-xs flex items-center gap-1">
                                  <Edit3 className="w-3 h-3" /> Ganti
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold">Ganti Foto Slot {editingSlot + 1}</h3>
                          <button onClick={cancelEditSlot} className="text-red-500 font-bold text-sm">
                            Batal
                          </button>
                        </div>

                        {!source ? (
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => handleSourceSelect('camera')}
                              className="p-6 bg-butter-yellow rounded-xl font-bold flex flex-col items-center gap-2 border-2 border-dark-brown"
                            >
                              <Camera className="w-8 h-8" /> Kamera
                            </button>
                            <button
                              onClick={() => handleSourceSelect('upload')}
                              className="p-6 bg-baby-blue rounded-xl font-bold flex flex-col items-center gap-2 border-2 border-dark-brown"
                            >
                              <Upload className="w-8 h-8" /> Upload
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                            <div className="relative w-full max-w-md aspect-video bg-black rounded-xl overflow-hidden">
                              {source === 'camera' ? (
                                <>
                                  <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                    style={{ filter: filter.css, transform: mirrored ? 'scaleX(-1)' : 'none' }}
                                  />
                                  <button
                                    onClick={() => setMirrored((m) => !m)}
                                    className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-bold"
                                  >
                                    <FlipHorizontal2 className="w-3.5 h-3.5 inline mr-1" />
                                    {mirrored ? 'Mirror' : 'Normal'}
                                  </button>
                                  {timer !== null && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                      <span className="text-white text-6xl font-bold">{timer}</span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 gap-2">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                  />
                                  <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-2 bg-dark-brown text-white rounded-full font-bold"
                                  >
                                    Pilih File
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Filter pills */}
                            <div className="flex gap-2 overflow-x-auto pb-1 w-full">
                              {FILTERS.map((f) => (
                                <button
                                  key={f.id}
                                  onClick={() => setFilter(f)}
                                  className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                                    filter.id === f.id ? 'bg-cherry-red text-white' : 'bg-gray-100'
                                  }`}
                                >
                                  {f.name}
                                </button>
                              ))}
                            </div>

                            {source === 'camera' && (
                              <button
                                onClick={startTimer}
                                disabled={timer !== null}
                                className="w-16 h-16 bg-cherry-red rounded-full border-4 border-white shadow-[0_0_0_4px_#d63447]
                                           disabled:opacity-50 hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* TAB: TEMPLATE */}
                {activeTab === 'template' && (
                  <div>
                    <p className="font-bold mb-3">
                      Ganti Template{' '}
                      <span className="text-xs text-gray-500 font-normal">
                        (kategori {template.category === 'strip' ? 'Strip' : 'Instagram'})
                      </span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 max-h-72 overflow-y-auto pr-1">
                      {templates
                        .filter((t) => t.category === template.category)
                        .map((t) => (
                          <button
                            key={t.id}
                            onClick={() => changeTemplate(t)}
                            className={`p-2 rounded-xl border-4 transition-all text-left ${
                              template.id === t.id
                                ? 'border-cherry-red bg-cherry-red/5'
                                : 'border-transparent hover:border-gray-200 bg-gray-50'
                            }`}
                          >
                            {/* Mini preview */}
                            <div
                              className="w-full rounded-lg mb-2 overflow-hidden relative"
                              style={{
                                aspectRatio: `${t.aspectRatio}`,
                                backgroundColor: t.defaultBgColor,
                                border: `2px solid ${t.frameColor}`,
                              }}
                            >
                              <div
                                className="absolute inset-0 flex flex-col items-center justify-evenly py-[8%] px-[8%]"
                                style={{ gap: '4%' }}
                              >
                                {Array.from({ length: t.slots }).map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-full flex-1"
                                    style={{
                                      border: `1.5px solid ${t.frameColor}`,
                                      borderRadius:
                                        t.slotShape === 'oval' ? '50%'
                                        : t.slotShape === 'arch' ? '50% 50% 3px 3px'
                                        : t.slotShape === 'cloud' ? '8px'
                                        : t.slotShape === 'wavy' ? '6px 14px'
                                        : '3px',
                                      backgroundColor: 'rgba(255,255,255,0.5)',
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="font-bold text-xs text-center truncate">{t.name}</p>
                          </button>
                        ))}
                    </div>

                    <div className="border-t pt-4">
                      <p className="font-bold mb-2 flex items-center gap-1 text-sm">
                        <Palette className="w-4 h-4 text-cherry-red" /> Warna Background
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {BG_COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => setBgColor(color)}
                            className={`w-9 h-9 rounded-full border-2 transition-transform ${
                              bgColor === color
                                ? 'border-cherry-red scale-110 shadow-md'
                                : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <label className="w-9 h-9 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer">
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
                  </div>
                )}

                {/* TAB: HIAS */}
                {activeTab === 'decorate' && (
                  <div>
                    {/* Tambah Teks */}
                    <div className="mb-5 bg-cream p-4 rounded-2xl border-2 border-medium-brown">
                      <p className="font-bold text-sm mb-2 flex items-center gap-1">
                        <Type className="w-4 h-4 text-cherry-red" /> Tambah Tulisan
                      </p>
                      <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addText()}
                        placeholder="Ketik tulisan..."
                        className="w-full px-3 py-2 rounded-xl border-2 border-gray-300 text-sm mb-2 focus:border-cherry-red focus:outline-none"
                      />
                      <div className="flex gap-2 mb-2">
                        <select
                          value={textFont}
                          onChange={(e) => setTextFont(e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded-xl border-2 border-gray-300 text-xs focus:outline-none"
                        >
                          {AVAILABLE_FONTS.map((f) => (
                            <option key={f.value} value={f.value}>{f.name}</option>
                          ))}
                        </select>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-9 h-9 rounded-xl cursor-pointer border-2 border-gray-300 p-0.5"
                        />
                      </div>
                      <button
                        onClick={addText}
                        className="w-full py-2 bg-dark-brown hover:bg-medium-brown text-white rounded-xl font-bold text-sm transition-colors"
                      >
                        Tempel Tulisan
                      </button>
                    </div>

                    {/* Stiker Emoji */}
                    <div className="mb-5 bg-cream p-4 rounded-2xl border-2 border-medium-brown">
                      <p className="font-bold text-sm mb-2">🎨 Stiker Lucu</p>
                      <div className="flex flex-wrap gap-2 justify-center max-h-28 overflow-y-auto">
                        {EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addEmoji(emoji)}
                            className="text-2xl hover:scale-125 transition-transform p-1 bg-white rounded-xl shadow-sm"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Daftar dekorasi user */}
                    {userDecorations.length > 0 && (
                      <div>
                        <p className="font-bold mb-2 text-xs text-gray-500">
                          Hiasan Aktif — atur ukuran & putar:
                        </p>
                        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                          {userDecorations.map((dec) => (
                            <div
                              key={dec.id}
                              className="bg-white border-2 border-gray-100 p-3 rounded-xl text-xs shadow-sm"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-bold truncate max-w-[160px]">{dec.content}</span>
                                <button
                                  onClick={() =>
                                    setUserDecorations((prev) => prev.filter((d) => d.id !== dec.id))
                                  }
                                  className="text-red-400 bg-red-50 p-1 rounded-lg hover:bg-red-100"
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
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
