import React, { useRef, useState, useCallback } from 'react'
import { Template, Decoration } from '../data/templates'

interface PhotoStripProps {
  template: Template
  photos: string[]
  bgColor: string
  userDecorations?: Decoration[]
  stripTitle?: string
  instagramHandle?: string
  onUpdateDecoration?: (id: string, updates: Partial<Decoration>) => void
}

// ─── Helper: border-radius dari slotShape ──────────────────
function getSlotBorderRadius(shape: string): string {
  switch (shape) {
    case 'oval':  return '50%'
    case 'arch':  return '50% 50% 6px 6px'
    case 'cloud': return '18px'
    case 'wavy':  return '10px 24px 10px 24px'
    default:      return '4px'
  }
}

// ─── Helper: background-pattern berdasarkan theme ──────────
function getThemeBgStyle(theme: string): React.CSSProperties {
  switch (theme) {
    case 'gingham':
      return {
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(214,52,71,0.06) 10px, rgba(214,52,71,0.06) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(214,52,71,0.06) 10px, rgba(214,52,71,0.06) 20px)',
      }
    case 'strawberry':
      return {
        backgroundImage:
          'radial-gradient(rgba(214,52,71,0.09) 15%, transparent 16%)',
        backgroundSize: '14px 14px',
      }
    case 'hearts':
      return {
        backgroundImage:
          'radial-gradient(rgba(241,143,169,0.18) 20%, transparent 20%)',
        backgroundSize: '20px 20px',
      }
    case 'pastel':
      return {
        backgroundImage:
          'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.03) 100%)',
      }
    case 'retro':
    case 'neon':
      return {
        backgroundImage:
          'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(0,0,0,0.28))',
      }
    case 'y2k-stars':
      return {
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }
    case 'boho':
      return {
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(212,163,115,0.08) 0px, rgba(212,163,115,0.08) 1px, transparent 1px, transparent 14px)',
      }
    case 'film':
      return {
        backgroundImage:
          'repeating-linear-gradient(90deg, rgba(107,91,78,0.06) 0px, rgba(107,91,78,0.06) 2px, transparent 2px, transparent 20px)',
      }
    case 'vintage':
      return {
        backgroundImage:
          'radial-gradient(ellipse at center, rgba(207,185,151,0.12) 0%, transparent 70%)',
      }
    default:
      return {}
  }
}

// ─── Draggable Decoration ───────────────────────────────────
interface DraggableDecProps {
  dec: Decoration
  containerRef: React.RefObject<HTMLDivElement>
  onUpdate: (id: string, updates: Partial<Decoration>) => void
}

function DraggableDecoration({ dec, containerRef, onUpdate }: DraggableDecProps) {
  const dragging = useRef(false)
  const startPos = useRef({ mx: 0, my: 0, dx: 0, dy: 0 })

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      dragging.current = true
      startPos.current = {
        mx: e.clientX,
        my: e.clientY,
        dx: dec.x,
        dy: dec.y,
      }

      const onMove = (me: MouseEvent) => {
        if (!dragging.current || !containerRef.current) return
        const cr = containerRef.current.getBoundingClientRect()
        const newX = startPos.current.dx + ((me.clientX - startPos.current.mx) / cr.width) * 100
        const newY = startPos.current.dy + ((me.clientY - startPos.current.my) / cr.height) * 100
        onUpdate(dec.id, {
          x: Math.max(0, Math.min(100, newX)),
          y: Math.max(0, Math.min(100, newY)),
        })
      }
      const onUp = () => {
        dragging.current = false
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [dec.id, dec.x, dec.y, containerRef, onUpdate],
  )

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation()
      if (!containerRef.current) return
      const touch = e.touches[0]
      dragging.current = true
      startPos.current = {
        mx: touch.clientX,
        my: touch.clientY,
        dx: dec.x,
        dy: dec.y,
      }

      const onMove = (te: TouchEvent) => {
        if (!dragging.current || !containerRef.current) return
        const cr = containerRef.current.getBoundingClientRect()
        const t = te.touches[0]
        const newX = startPos.current.dx + ((t.clientX - startPos.current.mx) / cr.width) * 100
        const newY = startPos.current.dy + ((t.clientY - startPos.current.my) / cr.height) * 100
        onUpdate(dec.id, {
          x: Math.max(0, Math.min(100, newX)),
          y: Math.max(0, Math.min(100, newY)),
        })
      }
      const onEnd = () => {
        dragging.current = false
        window.removeEventListener('touchmove', onMove)
        window.removeEventListener('touchend', onEnd)
      }
      window.addEventListener('touchmove', onMove, { passive: true })
      window.addEventListener('touchend', onEnd)
    },
    [dec.id, dec.x, dec.y, containerRef, onUpdate],
  )

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="absolute select-none cursor-grab active:cursor-grabbing hover:outline-dashed hover:outline-2 hover:outline-white/60 rounded"
      style={{
        left: `${dec.x}%`,
        top: `${dec.y}%`,
        transform: `translate(-50%, -50%) rotate(${dec.rotation || 0}deg)`,
        fontSize: `${dec.size}rem`,
        color: dec.color || '#333',
        fontFamily: dec.type === 'text' ? ((dec as any).fontFamily || 'Georgia, serif') : 'inherit',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        lineHeight: 1,
        touchAction: 'none',
        zIndex: 30,
      }}
    >
      {dec.content}
    </div>
  )
}

// ─── KOMPONEN UTAMA ─────────────────────────────────────────
export function PhotoStrip({
  template,
  photos,
  bgColor,
  userDecorations = [],
  stripTitle,
  instagramHandle,
  onUpdateDecoration,
}: PhotoStripProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Hitung padding berdasarkan jumlah slot + ukuran dekorasi di atas/bawah
  // Strip panjang: lebih ketat di kiri-kanan, lebih lega di atas-bawah untuk dekorasi
  const isInstagram = template.category === 'instagram'

  // Padding disesuaikan agar slot mengikuti proporsi canvas.ts (slotWidth = 80% width)
  const padX = isInstagram ? '5%' : '8%'
  // Top: ada ruang untuk dekorasi y < 15% dan stripTitle
  const padTop = stripTitle ? '10%' : '7%'
  // Bottom: ada ruang untuk dekorasi y > 85% dan instagramHandle + "LensaLoka" text
  const padBottom = '15%'

  // Gap antar slot: proporsi relatif terhadap tinggi strip
  // Mengikuti kalkulasi canvas.ts: safeGap = (height * 0.7 - totalSlotHeight) / (slots-1)
  const gapPercent = template.slots > 1 ? `2.5%` : '0'

  const themeBgStyle = getThemeBgStyle(template.theme)

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden shadow-lg"
      style={{
        aspectRatio: `${template.aspectRatio}`,
        backgroundColor: bgColor,
        border: `4px solid ${template.frameColor}`,
        boxSizing: 'border-box',
        ...themeBgStyle,
      }}
    >
      {/* ── SLOT FOTO ────────────────────────────────────── */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          top: padTop,
          bottom: padBottom,
          left: padX,
          right: padX,
          gap: gapPercent,
        }}
      >
        {Array.from({ length: template.slots }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden flex-1 w-full flex items-center justify-center"
            style={{
              borderRadius: getSlotBorderRadius(template.slotShape),
              border: `2.5px solid ${template.frameColor}`,
              backgroundColor: 'rgba(255,255,255,0.08)',
              // Paksa aspect ratio tiap slot sesuai template
              // (flex-1 akan otomatis membagi tinggi secara merata)
              aspectRatio: `${template.slotAspectRatio}`,
              flexShrink: 0,
              flexGrow: 1,
            }}
          >
            {photos[i] ? (
              <img
                src={photos[i]}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <span
                className="font-bold text-center select-none"
                style={{
                  color: `${template.frameColor}88`,
                  fontSize: '0.65rem',
                }}
              >
                Foto {i + 1}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── DEKORASI TEMPLATE (tetap / tidak bisa digeser) ─ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
        {template.decorations.map((dec) => (
          <div
            key={dec.id}
            className="absolute select-none"
            style={{
              left: `${dec.x}%`,
              top: `${dec.y}%`,
              transform: `translate(-50%, -50%) rotate(${dec.rotation || 0}deg)`,
              fontSize: `${dec.size}rem`,
              color: dec.color || template.frameColor,
              fontFamily:
                dec.type === 'text'
                  ? '"Fredoka", "Georgia", cursive'
                  : 'inherit',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              lineHeight: 1,
              textShadow:
                dec.type === 'text'
                  ? '1px 1px 0 rgba(255,255,255,0.5), -1px -1px 0 rgba(255,255,255,0.5)'
                  : 'none',
            }}
          >
            {dec.content}
          </div>
        ))}
      </div>

      {/* ── DEKORASI USER (draggable jika ada onUpdateDecoration) ─ */}
      {userDecorations.map((dec) =>
        onUpdateDecoration ? (
          <DraggableDecoration
            key={dec.id}
            dec={dec}
            containerRef={containerRef}
            onUpdate={onUpdateDecoration}
          />
        ) : (
          <div
            key={dec.id}
            className="absolute select-none pointer-events-none"
            style={{
              left: `${dec.x}%`,
              top: `${dec.y}%`,
              transform: `translate(-50%, -50%) rotate(${dec.rotation || 0}deg)`,
              fontSize: `${dec.size}rem`,
              color: dec.color || '#333',
              fontFamily:
                dec.type === 'text'
                  ? ((dec as any).fontFamily || 'Georgia, serif')
                  : 'inherit',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              lineHeight: 1,
              zIndex: 30,
            }}
          >
            {dec.content}
          </div>
        ),
      )}

      {/* ── STRIP TITLE (opsional, dari user) ─────────────── */}
      {stripTitle && (
        <div
          className="absolute w-full text-center font-bold tracking-widest uppercase pointer-events-none"
          style={{
            top: '2.5%',
            left: 0,
            right: 0,
            fontSize: '0.7rem',
            color: template.frameColor,
            zIndex: 25,
            letterSpacing: '0.15em',
          }}
        >
          {stripTitle}
        </div>
      )}

      {/* ── INSTAGRAM HANDLE (opsional, dari user) ────────── */}
      {instagramHandle && (
        <div
          className="absolute w-full text-center pointer-events-none"
          style={{
            bottom: '1.5%',
            left: 0,
            right: 0,
            fontSize: '0.55rem',
            color: template.frameColor,
            opacity: 0.85,
            zIndex: 25,
            fontWeight: 600,
          }}
        >
          {instagramHandle}
        </div>
      )}
    </div>
  )
}
