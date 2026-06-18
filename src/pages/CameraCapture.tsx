import React, { useEffect, useState, useRef, createElement } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  ArrowLeft,
  RefreshCw,
  Check,
  Type,
  Smile,
  Save,
  Trash2,
  FlipHorizontal2 } from
'lucide-react';
import { templates, Decoration } from '../data/templates';
import { FILTERS, BG_COLORS, generateFinalStrip } from '../utils/canvas';
import { PhotoStrip } from '../components/PhotoStrip';
import { useAuth } from '../contexts/AuthContext';
type Step = 'source' | 'capture' | 'decorate' | 'saving';
const EMOJIS = [
'✨',
'💖',
'⭐',
'🎀',
'🍒',
'🍓',
'📸',
'🦋',
'🌸',
'🧸',
'💌',
'💕'];

export function CameraCapture() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const template = templates.find((t) => t.id === templateId);
  const [step, setStep] = useState<Step>('source');
  const [source, setSource] = useState<'camera' | 'upload' | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [mirrored, setMirrored] = useState(false);
  const [bgColor, setBgColor] = useState(template?.defaultBgColor || '#ffffff');
  const [timer, setTimer] = useState<number | null>(null);
  // Decoration state
  const [userDecorations, setUserDecorations] = useState<Decoration[]>([]);
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#d63447');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!template) {
      navigate('/create');
    }
  }, [template, navigate]);
  // Cleanup camera
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: {
            ideal: 1280
          },
          height: {
            ideal: 720
          }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Tidak bisa mengakses kamera. Pastikan izin diberikan.');
    }
  };
  const handleSourceSelect = (s: 'camera' | 'upload') => {
    setSource(s);
    setStep('capture');
    if (s === 'camera') {
      startCamera();
    }
  };
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Apply filter to canvas context before drawing
    ctx.filter = filter.css;
    // Mirror the capture to match the preview when flip is on
    if (mirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    handlePhotoTaken(dataUrl);
  };
  const startTimer = () => {
    let count = 3;
    setTimer(count);
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setTimer(count);
      } else {
        clearInterval(interval);
        setTimer(null);
        capturePhoto();
      }
    }, 1000);
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.filter = filter.css;
        ctx.drawImage(img, 0, 0);
        handlePhotoTaken(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  const handlePhotoTaken = (dataUrl: string) => {
    const newPhotos = [...photos];
    newPhotos[currentSlot] = dataUrl;
    setPhotos(newPhotos);
    if (currentSlot < (template?.slots || 0) - 1) {
      setCurrentSlot((prev) => prev + 1);
    } else {
      // All slots filled
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setStep('decorate');
    }
  };
  const retakeSlot = (index: number) => {
    setCurrentSlot(index);
    if (source === 'camera') {
      startCamera();
    }
  };
  const addText = () => {
    if (!textInput.trim()) return;
    const newDec: Decoration = {
      id: Date.now().toString(),
      type: 'text',
      content: textInput,
      x: 50,
      y: 50,
      size: 2,
      color: textColor,
      rotation: Math.floor(Math.random() * 20) - 10
    };
    setUserDecorations([...userDecorations, newDec]);
    setTextInput('');
  };
  const addEmoji = (emoji: string) => {
    const newDec: Decoration = {
      id: Date.now().toString(),
      type: 'emoji',
      content: emoji,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      size: 2.5,
      rotation: Math.floor(Math.random() * 40) - 20
    };
    setUserDecorations([...userDecorations, newDec]);
  };
  const removeDecoration = (id: string) => {
    setUserDecorations(userDecorations.filter((d) => d.id !== id));
  };
  const handleSave = async () => {
    if (!template || !user) return;
    setStep('saving');
    try {
      const finalImage = await generateFinalStrip(
        template,
        photos,
        bgColor,
        userDecorations
      );
      const gallery = JSON.parse(
        localStorage.getItem(`lensaloka_gallery_${user.id}`) || '[]'
      );
      gallery.unshift({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        image: finalImage,
        templateId: template.id,
        photos,
        bgColor,
        userDecorations
      });
      localStorage.setItem(
        `lensaloka_gallery_${user.id}`,
        JSON.stringify(gallery)
      );
      navigate('/gallery');
    } catch (err) {
      console.error('Error saving:', err);
      alert('Gagal menyimpan foto!');
      setStep('decorate');
    }
  };
  if (!template) return null;
  return (
    <div className="min-h-screen w-full bg-cream text-dark-brown flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur p-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <Link to="/create">
          <button className="flex items-center gap-2 font-bold text-medium-brown hover:text-cherry-red transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Ganti Template
          </button>
        </Link>
        <div className="brand-text text-xl flex items-center gap-2">
          <Camera className="w-6 h-6 text-cherry-red" />
          LensaLoka
        </div>
        <div className="w-32" />
      </header>

      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 gap-8">
        {/* Left Column: Preview Strip */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-start pt-4">
          <div className="w-full max-w-[300px] sticky top-24">
            <PhotoStrip
              template={template}
              photos={photos}
              bgColor={bgColor}
              userDecorations={userDecorations} />
            

            {/* Background Color Picker */}
            {step !== 'saving' &&
            <div className="mt-6 bg-white p-4 rounded-2xl shadow-md border-2 border-medium-brown">
                <p className="font-bold text-sm mb-2 text-center">
                  Warna Background Template
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {BG_COLORS.map((color) =>
                <button
                  key={color}
                  onClick={() => setBgColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${bgColor === color ? 'border-cherry-red scale-110' : 'border-gray-300'}`}
                  style={{
                    backgroundColor: color
                  }} />

                )}
                </div>
              </div>
            }
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="w-full md:w-2/3 flex flex-col items-center justify-start pt-4">
          {step === 'source' &&
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border-4 border-dark-brown text-center">
            
              <h2 className="brand-text text-3xl mb-6">Pilih Sumber Foto</h2>
              <div className="grid grid-cols-1 gap-4">
                <button
                onClick={() => handleSourceSelect('camera')}
                className="flex items-center justify-center gap-3 p-6 bg-butter-yellow rounded-2xl hover:scale-105 transition-transform border-2 border-dark-brown font-bold text-xl">
                
                  <Camera className="w-8 h-8" />
                  Gunakan Kamera
                </button>
                <button
                onClick={() => handleSourceSelect('upload')}
                className="flex items-center justify-center gap-3 p-6 bg-baby-blue rounded-2xl hover:scale-105 transition-transform border-2 border-dark-brown font-bold text-xl">
                
                  <Upload className="w-8 h-8" />
                  Upload Foto
                </button>
              </div>
            </motion.div>
          }

          {step === 'capture' &&
          <div className="w-full max-w-2xl flex flex-col items-center">
              <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-dark-brown w-full">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h2 className="brand-text text-2xl">
                    Foto {currentSlot + 1} dari {template.slots}
                  </h2>
                  <span className="bg-cherry-red text-white px-3 py-1 rounded-full font-bold text-sm">
                    Slot {currentSlot + 1}
                  </span>
                </div>

                {/* Viewfinder */}
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden mb-4 shadow-inner">
                  {source === 'camera' ?
                <>
                      <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    style={{
                      filter: filter.css,
                      transform: mirrored ? 'scaleX(-1)' : 'none'
                    }} />
                  
                      <button
                    onClick={() => setMirrored((m) => !m)}
                    className={`absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 border-2 ${mirrored ? 'bg-cherry-red text-white border-white' : 'bg-white/90 text-dark-brown border-dark-brown'}`}>
                    
                        <FlipHorizontal2 className="w-4 h-4" />
                        {mirrored ? 'Mirror ON' : 'Mirror OFF'}
                      </button>
                      <AnimatePresence>
                        {timer !== null &&
                    <motion.div
                      initial={{
                        scale: 0.5,
                        opacity: 0
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1
                      }}
                      exit={{
                        scale: 1.5,
                        opacity: 0
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40">
                      
                            <span className="text-white text-8xl font-bold brand-text drop-shadow-lg">
                              {timer}
                            </span>
                          </motion.div>
                    }
                      </AnimatePresence>
                    </> :

                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 border-4 border-dashed border-gray-300 rounded-2xl">
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-500 font-bold">
                        Pilih foto untuk slot ini
                      </p>
                      <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload} />
                  
                      <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-6 py-2 bg-dark-brown text-white rounded-full font-bold">
                    
                        Browse
                      </button>
                    </div>
                }
                </div>

                {/* Filters */}
                <div className="mb-6">
                  <p className="font-bold mb-2 text-sm">Filter Foto:</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {FILTERS.map((f) =>
                  <button
                    key={f.id}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-colors ${filter.id === f.id ? 'bg-cherry-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    
                        {f.name}
                      </button>
                  )}
                  </div>
                </div>

                {/* Action */}
                {source === 'camera' &&
              <div className="flex justify-center">
                    <button
                  onClick={startTimer}
                  disabled={timer !== null}
                  className="w-20 h-20 bg-cherry-red rounded-full border-4 border-white shadow-[0_0_0_4px_#d63447] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50">
                  
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                  </div>
              }
              </div>

              {/* Slot Navigation (Retake) */}
              <div className="mt-8 flex gap-2">
                {Array.from({
                length: template.slots
              }).map((_, i) =>
              <button
                key={i}
                onClick={() => photos[i] && retakeSlot(i)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold border-2 ${currentSlot === i ? 'border-cherry-red bg-cherry-red/10 text-cherry-red' : photos[i] ? 'border-sage-green bg-sage-green text-dark-brown' : 'border-gray-300 text-gray-400'}`}>
                
                    {photos[i] ? <Check className="w-6 h-6" /> : i + 1}
                  </button>
              )}
              </div>
            </div>
          }

          {step === 'decorate' &&
          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            className="w-full max-w-md bg-white p-6 rounded-3xl shadow-xl border-4 border-dark-brown">
            
              <h2 className="brand-text text-2xl mb-6 flex items-center gap-2">
                <Smile className="w-6 h-6 text-cherry-red" />
                Hias Foto Kamu!
              </h2>

              {/* Add Text */}
              <div className="mb-6 bg-cream p-4 rounded-2xl border-2 border-medium-brown">
                <p className="font-bold mb-2 flex items-center gap-2">
                  <Type className="w-4 h-4" /> Tambah Tulisan
                </p>
                <div className="flex gap-2 mb-2">
                  <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Ketik sesuatu..."
                  className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-300 focus:border-cherry-red outline-none" />
                
                  <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer" />
                
                </div>
                <button
                onClick={addText}
                className="w-full py-2 bg-dark-brown text-white rounded-xl font-bold hover:bg-medium-brown">
                
                  Tambah
                </button>
              </div>

              {/* Add Emoji */}
              <div className="mb-6 bg-cream p-4 rounded-2xl border-2 border-medium-brown">
                <p className="font-bold mb-2">Sticker Lucu</p>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((emoji) =>
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="text-3xl hover:scale-125 transition-transform p-2 bg-white rounded-xl shadow-sm">
                  
                      {emoji}
                    </button>
                )}
                </div>
              </div>

              {/* Active Decorations */}
              {userDecorations.length > 0 &&
            <div className="mb-6">
                  <p className="font-bold mb-2 text-sm text-gray-500">
                    Hiasan Ditambahkan:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {userDecorations.map((dec) =>
                <div
                  key={dec.id}
                  className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  
                        <span className="truncate max-w-[100px]">
                          {dec.content}
                        </span>
                        <button
                    onClick={() => removeDecoration(dec.id)}
                    className="text-red-500 hover:text-red-700">
                    
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                )}
                  </div>
                </div>
            }

              {/* Save Button */}
              <button
              onClick={handleSave}
              className="w-full py-4 bg-cherry-red text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform">
              
                <Save className="w-6 h-6" />
                Simpan ke Galeri
              </button>
            </motion.div>
          }

          {step === 'saving' &&
          <div className="flex flex-col items-center justify-center h-64">
              <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: 'linear'
              }}>
              
                <RefreshCw className="w-12 h-12 text-cherry-red" />
              </motion.div>
              <p className="mt-4 brand-text text-xl text-dark-brown">
                Menyimpan foto...
              </p>
            </div>
          }
        </div>
      </main>
    </div>);

}