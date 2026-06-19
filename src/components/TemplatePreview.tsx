import React from 'react'
import { Template } from '../data/templates'

interface TemplatePreviewProps {
  template: Template
  className?: string
  onClick?: () => void
  selected?: boolean
}

export function TemplatePreview({
  template,
  className = '',
  onClick,
  selected,
}: TemplatePreviewProps) {
  const slots = Array.from({ length: template.slots }).map((_, i) => i)

  // Sizing adaptif agar slot foto muat sempurna tanpa overflow luar frame
  const getSlotStyle = () => {
    const isInstagram = template.category === 'instagram'
    
    const baseStyle: React.CSSProperties = {
      backgroundColor: '#ffffff',
      border: `2.5px solid ${template.frameColor}`,
      aspectRatio: template.slotAspectRatio,
      // Jika instagram dengan 2 slot, perkecil lebar sedikit agar tidak jebol ke bawah
      width: isInstagram && template.slots > 1 ? '65%' : '80%', 
      maxWidth: '90%',
      margin: '0 auto',
      flexShrink: 1, // Mengizinkan mengecil secara fleksibel demi keamanan layout
      position: 'relative',
      zIndex: 10,
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
    }

    switch (template.slotShape) {
      case 'oval':
        return { ...baseStyle, borderRadius: '50%' }
      case 'arch':
        return { ...baseStyle, borderRadius: '40px 40px 4px 4px' }
      case 'cloud':
        return { ...baseStyle, borderRadius: '16px' }
      case 'wavy':
        return { ...baseStyle, borderRadius: '10px' }
      default:
        return baseStyle
    }
  }

  // Pengaturan Pola & Gradasi Background Belakang Sesuai Tema
  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: template.defaultBgColor,
    }

    switch (template.theme) {
      case 'gingham':
        baseStyles.backgroundImage = 
          'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(214, 52, 71, 0.04) 10px, rgba(214, 52, 71, 0.04) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(214, 52, 71, 0.04) 10px, rgba(214, 52, 71, 0.04) 20px)'
        break
      case 'strawberry':
        baseStyles.backgroundImage = 'radial-gradient(rgba(214, 52, 71, 0.08) 15%, transparent 16%)'
        baseStyles.backgroundSize = '14px 14px'
        break
      case 'hearts':
        baseStyles.backgroundImage = 'radial-gradient(rgba(241, 143, 169, 0.15) 20%, transparent 20%)'
        baseStyles.backgroundSize = '20px 20px'
        break
      case 'pastel':
        baseStyles.backgroundImage = 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.02) 100%)'
        break
      case 'retro':
      case 'neon':
        baseStyles.backgroundImage = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.3))'
        break
      default:
        baseStyles.backgroundImage = 'none'
    }

    return baseStyles
  }

  // Kalkulasi ukuran dimensi bingkai/frame utama
  const cardWidth = 190 // Lebar konstan yang proporsional untuk gallery grid
  const cardHeight = cardWidth / template.aspectRatio

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center group ${className}`}
    >
      {/* 📦 FRAME KARTU (Sizing Presisi & Kokoh) */}
      <div
        className={`relative transition-all duration-300 ease-out transform group-hover:scale-105 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl ${
          selected ? 'ring-4 ring-cherry-red ring-offset-4' : ''
        }`}
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          flexShrink: 0,
          ...getBackgroundStyle()
        }}
      >
        {/* Container Isi Slot Foto */}
        <div 
          className={`absolute inset-0 flex flex-col justify-evenly items-center ${
            template.category === 'instagram' ? 'px-3 py-4' : 'px-4 py-6'
          }`}
        >
          {slots.map((slot) => (
            <div key={slot} style={getSlotStyle()} />
          ))}
        </div>

        {/* Aksesoris / Stiker Emoji & Teks Ornamen */}
        {template.decorations.map((dec) => (
          <div
            key={dec.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none whitespace-nowrap select-none"
            style={{
              left: `${dec.x}%`,
              top: `${dec.y}%`,
              fontSize: `${dec.size * 0.9}rem`, // Skala disesuaikan sedikit agar pas dengan ukuran preview
              rotate: `${dec.rotation || 0}deg`,
              color: dec.color,
              fontFamily: dec.type === 'text' ? '"Fredoka", cursive' : 'inherit',
              fontWeight: 'bold',
              textShadow: dec.type === 'text' ? '1px 1px 3px rgba(255,255,255,0.8), -1px -1px 3px rgba(255,255,255,0.8)' : 'none',
            }}
          >
            {dec.content}
          </div>
        ))}
      </div>

      {/* 🏷️ INFO JUDUL (Mengalir Normal di Bawah Kartu - Tidak Akan Menabrak Grid Lagi) */}
      <div className="mt-3 text-center w-full max-w-[190px]">
        <p className="brand-text text-dark-brown font-bold text-sm truncate px-1">
          {template.name}
        </p>
        <p className="text-xs text-medium-brown/80 font-medium">
          {template.slots} {template.slots === 1 ? 'photo' : 'photos'}
        </p>
      </div>
    </div>
  )
}
