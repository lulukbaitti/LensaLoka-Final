import React, { useEffect, useState, useRef, createElement } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  FlipHorizontal2 } from
'lucide-react';
import { templates, Template, Decoration } from '../data/templates';
import { FILTERS, BG_COLORS, generateFinalStrip } from '../utils/canvas';
import { PhotoStrip } from '../components/PhotoStrip';
import { useAuth } from '../contexts/AuthContext';
export function EditPhoto() {
  const { photoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<any>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [step, setStep] = useState<'edit' | 'saving'>('edit');
  const [activeTab, setActiveTab] = useState<
    'photos' | 'template' | 'decorate'>(
    'photos');
  const [photos, setPhotos] = useState<string[]>([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [userDecorations, setUserDecorations] = useState<Decoration[]>([]);
  // For re-taking photos
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [source, setSource] = useState<'camera' | 'upload' | null>(null);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [mirrored, setMirrored] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#d63447');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (user && photoId) {
      const gallery = JSON.parse(
        localStorage.getItem(`lensaloka_gallery_${user.id}`) || '[]'
      );
      const found = gallery.find((g: any) => g.id === photoId);
      if (found) {
        setItem(found);
        const t =
        templates.find((t) => t.id === found.templateId) || templates[0];
        setTemplate(t);
        setPhotos(found.photos);
        setBgColor(found.bgColor);
        setUserDecorations(found.userDecorations || []);
      } else {
        navigate('/gallery');
      }
    }
  }, [user, photoId, navigate]);
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
      alert('Tidak bisa mengakses kamera.');
    }
  };
  const handleSourceSelect = (s: 'camera' | 'upload') => {
    setSource(s);
    if (s === 'camera') {
      startCamera();
    }
  };
  const capturePhoto = () => {
    if (!videoRef.current || editingSlot === null) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.filter = filter.css;
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
    if (!file || editingSlot === null) return;
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
    if (editingSlot === null) return;
    const newPhotos = [...photos];
    newPhotos[editingSlot] = dataUrl;
    setPhotos(newPhotos);
    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setEditingSlot(null);
    setSource(null);
  };
  const changeTemplate = (newTemplate: Template) => {
    setTemplate(newTemplate);
    // Adjust photos array length if needed
    if (photos.length > newTemplate.slots) {
      setPhotos(photos.slice(0, newTemplate.slots));
    } else if (photos.length < newTemplate.slots) {
      const newP = [...photos];
      while (newP.length < newTemplate.slots) {
        newP.push(''); // Empty slots
      }
      setPhotos(newP);
    }
  };
  const handleDownload = async () => {
    if (!template) return;
    if (photos.some((p) => !p)) {
      alert('Ada slot foto yang masih kosong! Silahkan isi dulu.');
      setActiveTab('photos');
      return;
    }
    try {
      const finalImage = await generateFinalStrip(
        template,
        photos,
        bgColor,
        userDecorations
      );
      const a = document.createElement('a');
      a.href = finalImage;
      a.download = `LensaLoka_${item?.id || Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading:', err);
      alert('Gagal mengunduh foto!');
    }
  };
  const handleSave = async () => {
    if (!template || !user || !item) return;
    // Check if all slots are filled
    if (photos.some((p) => !p)) {
      alert('Ada slot foto yang masih kosong! Silahkan isi dulu.');
      setActiveTab('photos');
      return;
    }
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
      const index = gallery.findIndex((g: any) => g.id === item.id);
      if (index !== -1) {
        gallery[index] = {
          ...gallery[index],
          image: finalImage,
          templateId: template.id,
          photos,
          bgColor,
          userDecorations
        };
        localStorage.setItem(
          `lensaloka_gallery_${user.id}`,
          JSON.stringify(gallery)
        );
      }
      navigate('/gallery');
    } catch (err) {
      console.error('Error saving:', err);
      alert('Gagal menyimpan foto!');
      setStep('edit');
    }
  };
  if (!template || !item) return null;
  return (
    <div className="min-h-screen w-full bg-cream text-dark-brown flex flex-col">
      <header className="bg-white/80 backdrop-blur p-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <Link to="/gallery">
          <button className="flex items-center gap-2 font-bold text-medium-brown hover:text-cherry-red transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Batal Edit
          </button>
        </Link>
        <div className="brand-text text-xl flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-cherry-red" />
          Edit Foto
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={step === 'saving'}
            className="px-4 py-2 bg-baby-blue text-dark-brown rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 border-2 border-dark-brown">
            
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button
            onClick={handleSave}
            disabled={step === 'saving'}
            className="px-6 py-2 bg-cherry-red text-white rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50">
            
            <Save className="w-4 h-4" />
            Simpan
          </button>
        </div>
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
            
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="w-full md:w-2/3 flex flex-col pt-4">
          {step === 'saving' ?
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
                Menyimpan perubahan...
              </p>
            </div> :

          <div className="bg-white rounded-3xl shadow-xl border-4 border-dark-brown overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b-4 border-dark-brown bg-gray-50">
                <button
                onClick={() => setActiveTab('photos')}
                className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${activeTab === 'photos' ? 'bg-white text-cherry-red border-b-4 border-cherry-red -mb-1' : 'text-medium-brown'}`}>
                
                  <Camera className="w-5 h-5" /> Foto
                </button>
                <button
                onClick={() => setActiveTab('template')}
                className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${activeTab === 'template' ? 'bg-white text-cherry-red border-b-4 border-cherry-red -mb-1' : 'text-medium-brown'}`}>
                
                  <LayoutTemplate className="w-5 h-5" /> Template
                </button>
                <button
                onClick={() => setActiveTab('decorate')}
                className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${activeTab === 'decorate' ? 'bg-white text-cherry-red border-b-4 border-cherry-red -mb-1' : 'text-medium-brown'}`}>
                
                  <Smile className="w-5 h-5" /> Hias
                </button>
              </div>

              <div className="p-6">
                {/* PHOTOS TAB */}
                {activeTab === 'photos' &&
              <div>
                    {editingSlot === null ?
                <div>
                        <p className="font-bold mb-4 text-lg">
                          Pilih slot foto yang ingin diganti:
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {photos.map((photo, i) =>
                    <div
                      key={i}
                      className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-300 group">
                      
                              {photo ?
                      <img
                        src={photo}
                        alt={`Slot ${i + 1}`}
                        className="w-full h-full object-cover" /> :


                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                  Kosong
                                </div>
                      }
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                          onClick={() => setEditingSlot(i)}
                          className="px-4 py-2 bg-white text-dark-brown rounded-full font-bold flex items-center gap-2">
                          
                                  <Edit3 className="w-4 h-4" /> Ganti
                                </button>
                              </div>
                            </div>
                    )}
                        </div>
                      </div> :

                <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-lg">
                            Ganti Foto Slot {editingSlot + 1}
                          </h3>
                          <button
                      onClick={() => {
                        setEditingSlot(null);
                        setSource(null);
                      }}
                      className="text-red-500 font-bold">
                      
                            Batal
                          </button>
                        </div>

                        {!source ?
                  <div className="grid grid-cols-2 gap-4">
                            <button
                      onClick={() => handleSourceSelect('camera')}
                      className="p-6 bg-butter-yellow rounded-xl font-bold flex flex-col items-center gap-2 border-2 border-dark-brown">
                      
                              <Camera className="w-8 h-8" /> Kamera
                            </button>
                            <button
                      onClick={() => handleSourceSelect('upload')}
                      className="p-6 bg-baby-blue rounded-xl font-bold flex flex-col items-center gap-2 border-2 border-dark-brown">
                      
                              <Upload className="w-8 h-8" /> Upload
                            </button>
                          </div> :

                  <div className="flex flex-col items-center">
                            <div className="relative w-full max-w-md aspect-video bg-black rounded-xl overflow-hidden mb-4">
                              {source === 'camera' ?
                      <>
                                  <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                          style={{
                            filter: filter.css,
                            transform: mirrored ?
                            'scaleX(-1)' :
                            'none'
                          }} />
                        
                                  <button
                          onClick={() => setMirrored((m) => !m)}
                          className={`absolute top-2 right-2 px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 border-2 ${mirrored ? 'bg-cherry-red text-white border-white' : 'bg-white/90 text-dark-brown border-dark-brown'}`}>
                          
                                    <FlipHorizontal2 className="w-4 h-4" />
                                    {mirrored ? 'Mirror' : 'Normal'}
                                  </button>
                                  {timer !== null &&
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                      <span className="text-white text-6xl font-bold brand-text">
                                        {timer}
                                      </span>
                                    </div>
                        }
                                </> :

                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                                  <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileUpload} />
                        
                                  <button
                          onClick={() =>
                          fileInputRef.current?.click()
                          }
                          className="px-6 py-2 bg-dark-brown text-white rounded-full font-bold">
                          
                                    Pilih File
                                  </button>
                                </div>
                      }
                            </div>

                            <div className="mb-4 w-full max-w-md">
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                {FILTERS.map((f) =>
                        <button
                          key={f.id}
                          onClick={() => setFilter(f)}
                          className={`px-3 py-1 rounded-full text-sm font-bold ${filter.id === f.id ? 'bg-cherry-red text-white' : 'bg-gray-200'}`}>
                          
                                    {f.name}
                                  </button>
                        )}
                              </div>
                            </div>

                            {source === 'camera' &&
                    <button
                      onClick={startTimer}
                      disabled={timer !== null}
                      className="w-16 h-16 bg-cherry-red rounded-full border-4 border-white shadow-[0_0_0_4px_#d63447] flex items-center justify-center">
                      
                                <Camera className="w-6 h-6 text-white" />
                              </button>
                    }
                          </div>
                  }
                      </div>
                }
                  </div>
              }

                {/* TEMPLATE TAB */}
                {activeTab === 'template' &&
              <div>
                    <p className="font-bold mb-4">Ganti Template:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                      {templates.map((t) =>
                  <button
                    key={t.id}
                    onClick={() => changeTemplate(t)}
                    className={`p-2 rounded-xl border-4 transition-all ${template.id === t.id ? 'border-cherry-red bg-cherry-red/10' : 'border-transparent hover:border-gray-200'}`}>
                    
                          <div
                      className="aspect-[0.35] bg-gray-200 rounded-lg mb-2 relative overflow-hidden"
                      style={{
                        backgroundColor: t.defaultBgColor
                      }}>
                      
                            <div className="absolute inset-0 flex flex-col justify-center gap-2 py-4">
                              {Array.from({
                          length: t.slots
                        }).map((_, i) =>
                        <div
                          key={i}
                          className="w-[80%] mx-auto bg-white border-2 border-gray-800"
                          style={{
                            aspectRatio: t.slotAspectRatio.toString()
                          }} />

                        )}
                            </div>
                          </div>
                          <p className="font-bold text-sm text-center">
                            {t.name}
                          </p>
                        </button>
                  )}
                    </div>

                    <p className="font-bold mb-2">Warna Background:</p>
                    <div className="flex flex-wrap gap-2">
                      {BG_COLORS.map((color) =>
                  <button
                    key={color}
                    onClick={() => setBgColor(color)}
                    className={`w-10 h-10 rounded-full border-2 ${bgColor === color ? 'border-cherry-red scale-110' : 'border-gray-300'}`}
                    style={{
                      backgroundColor: color
                    }} />

                  )}
                    </div>
                  </div>
              }

                {/* DECORATE TAB */}
                {activeTab === 'decorate' &&
              <div>
                    <div className="mb-6 bg-cream p-4 rounded-2xl border-2 border-medium-brown">
                      <p className="font-bold mb-2 flex items-center gap-2">
                        <Type className="w-4 h-4" /> Tambah Tulisan
                      </p>
                      <div className="flex gap-2 mb-2">
                        <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-300 outline-none" />
                    
                        <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer" />
                    
                      </div>
                      <button
                    onClick={() => {
                      if (!textInput.trim()) return;
                      setUserDecorations([
                      ...userDecorations,
                      {
                        id: Date.now().toString(),
                        type: 'text',
                        content: textInput,
                        x: 50,
                        y: 50,
                        size: 2,
                        color: textColor,
                        rotation: 0
                      }]
                      );
                      setTextInput('');
                    }}
                    className="w-full py-2 bg-dark-brown text-white rounded-xl font-bold">
                    
                        Tambah
                      </button>
                    </div>

                    <div className="mb-6 bg-cream p-4 rounded-2xl border-2 border-medium-brown">
                      <p className="font-bold mb-2">Sticker Lucu</p>
                      <div className="flex flex-wrap gap-2">
                        {[
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
                    '💕'].
                    map((emoji) =>
                    <button
                      key={emoji}
                      onClick={() => {
                        setUserDecorations([
                        ...userDecorations,
                        {
                          id: Date.now().toString(),
                          type: 'emoji',
                          content: emoji,
                          x: 50,
                          y: 50,
                          size: 2.5,
                          rotation: 0
                        }]
                        );
                      }}
                      className="text-3xl hover:scale-125 transition-transform p-2 bg-white rounded-xl shadow-sm">
                      
                            {emoji}
                          </button>
                    )}
                      </div>
                    </div>

                    {userDecorations.length > 0 &&
                <div>
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
                        onClick={() =>
                        setUserDecorations(
                          userDecorations.filter(
                            (d) => d.id !== dec.id
                          )
                        )
                        }
                        className="text-red-500">
                        
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                    )}
                        </div>
                      </div>
                }
                  </div>
              }
              </div>
            </div>
          }
        </div>
      </main>
    </div>);

}