/**
 * PhotoStrip.tsx — Preview komponen yang IDENTIK dengan canvas.ts output.
 *
 * Strategi agar preview = hasil download:
 * - Komponen ini SELALU dirender dengan lebar VIRTUAL 800px (sama dengan canvas.ts W=800).
 * - Kemudian di-scale ke ukuran tampil yang diinginkan via CSS transform: scale().
 * - Dengan ini, semua ukuran font/emoji dalam `rem` akan proporsional sempurna.
 * - Font Fredoka dimuat paksa via useEffect sebelum render.
 *
 * Cara pakai di parent:
 *   <PhotoStripScaled template={t} photos={p} bgColor={bg} displayWidth={300} />
 *
 * Atau pakai wrapper <PhotoStripPreview> yang sudah handle scaling otomatis.
 */

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Template, Decoration } from '../data/templates'

// ─── Konstanta virtual canvas (harus SAMA dengan canvas.ts) ──
const VIRTUAL_W = 800   // lebar virtual = lebar canvas output
const REM_PX    = 16    // 1rem = 16px (browser default)

// ─── Load font Fredoka ────────────────────────────────────────
async function ensureFreedokaLoaded(): Promise<void> {
  const link = document.querySelector('link[data-font="fredoka"]')
  if (!link) {
    const el = document.createElement('link')
    el.rel  = 'stylesheet'
    el.href = 'https://fonts.googleapis.com/css2?family=Fredoka+One&family=Fredoka:wght@600&display=swap'
    el.setAttribute('data-font', 'fredoka')
    document.head.appendChild(el)
  }
  try {
    await document.fonts.ready
    await document.fonts.load('bold 40px "Fredoka One"')
    await document.fonts.load('600 40px "Fredoka"')
  } catch { /* fallback */ }
}

// ─── Helper: border-radius dari slotShape ────────────────────
function getSlotBorderRadius(shape: string): string {
  switch (shape) {
    case 'oval':  return '50%'
    case 'arch':  return '50% 50% 6px 6px'
    case 'cloud': return '18px'
    case 'wavy':  return '10px 24px 10px 24px'
    default:      return '4px'
  }
}

// ─── Helper: background-pattern berdasarkan theme ────────────
function getThemeBgStyle(theme: string): React.CSSProperties {
  switch (theme) {
    case 'gingham':
      return {
        backgroundImage:
          'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(214,52,71,0.06) 10px,rgba(214,52,71,0.06) 20px),' +
          'repeating-linear-gradient(-45deg,transparent,transparent 10px,rgba(214,52,71,0.06) 10px,rgba(214,52,71,0.06) 20px)',
      }
    case 'strawberry':
      return {
        backgroundImage: 'radial-gradient(rgba(214,52,71,0.09) 15%,transparent 16%)',
        backgroundSize:  '14px 14px',
      }
    case 'hearts':
      return {
        backgroundImage: 'radial-gradient(rgba(241,143,169,0.18) 20%,transparent 20%)',
        backgroundSize:  '20px 20px',
      }
    case 'pastel':
      return {
        backgroundImage: 'linear-gradient(135deg,rgba(255,255,255,0.25) 0%,rgba(0,0,0,0.03) 100%)',
      }
    case 'retro':
    case 'neon':
      return {
        backgroundImage: 'linear-gradient(to bottom,rgba(255,255,255,0.08),rgba(0,0,0,0.28))',
      }
    case 'y2k-stars':
      return {
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.25) 1px,transparent 1px)',
        backgroundSize:  '18px 18px',
      }
    case 'boho':
      return {
        backgroundImage:
          'repeating-linear-gradient(0deg,rgba(212,163,115,0.08) 0px,rgba(212,163,115,0.08) 1px,transparent 1px,transparent 14px)',
      }
    case 'film':
      return {
        backgroundImage:
          'repeating-linear-gradient(90deg,rgba(107,91,78,0.06) 0px,rgba(107,91,78,0.06) 2px,transparent 2px,transparent 20px)',
      }
    case 'vintage':
      return {
        backgroundImage: 'radial-gradient(ellipse at center,rgba(207,185,151,0.12) 0%,transparent 70%)',
      }
    default:
      return {}
  }
}

// ─── Draggable Decoration ─────────────────────────────────────
interface DraggableDecProps {
  dec:          Decoration
  containerRef: React.RefObject<HTMLDivElement>
  onUpdate:     (id: string, updates: Partial<Decoration>) => void
  scale:        number   // scaleX dari parent agar hitTest tetap benar
}

function DraggableDecoration({ dec, containerRef, onUpdate, scale }: DraggableDecProps) {
  const dragging = useRef(false)
  const startPos = useRef({ mx: 0, my: 0, dx: 0, dy: 0 })

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!containerRef.current) return
      dragging.current = true
      startPos.current = { mx: e.clientX, my: e.clientY, dx: dec.x, dy: dec.y }

      const onMove = (me: MouseEvent) => {
        if (!dragging.current || !containerRef.current) return
        const cr  = containerRef.current.getBoundingClientRect()
        // Bagi dengan scale agar koordinat sesuai virtual space
        const newX = startPos.current.dx + ((me.clientX - startPos.current.mx) / (cr.width))  * 100
        const newY = startPos.current.dy + ((me.clientY - startPos.current.my) / (cr.height)) * 100
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
    [dec.id, dec.x, dec.y, containerRef, onUpdate, scale],
  )

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation()
      if (!containerRef.current) return
      const touch = e.touches[0]
      dragging.current = true
      startPos.current = { mx: touch.clientX, my: touch.clientY, dx: dec.x, dy: dec.y }

      const onMove = (te: TouchEvent) => {
        if (!dragging.current || !containerRef.current) return
        const cr = containerRef.current.getBoundingClientRect()
        const t  = te.touches[0]
        const newX = startPos.current.dx + ((t.clientX - startPos.current.mx) / cr.width)  * 100
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
    [dec.id, dec.x, dec.y, containerRef, onUpdate, scale],
  )

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="absolute select-none cursor-grab active:cursor-grabbing"
      style={{
        left:       `${dec.x}%`,
        top:        `${dec.y}%`,
        transform:  `translate(-50%,-50%) rotate(${dec.rotation || 0}deg)`,
        fontSize:   `${dec.size * REM_PX}px`,   // ← px bukan rem, agar konsisten
        color:      dec.color || '#333',
        fontFamily: dec.type === 'text'
          ? ((dec as any).fontFamily || 'Georgia, serif')
          : '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif',
        fontWeight:    'bold',
        whiteSpace:    'nowrap',
        lineHeight:    1,
        touchAction:   'none',
        zIndex:        30,
        outline:       'none',
        userSelect:    'none',
      }}
    >
      {dec.content}
    </div>
  )
}

// ─── PROPS ───────────────────────────────────────────────────
interface PhotoStripProps {
  template:             Template
  photos:               string[]
  bgColor:              string
  userDecorations?:     Decoration[]
  stripTitle?:          string
  instagramHandle?:     string
  onUpdateDecoration?:  (id: string, updates: Partial<Decoration>) => void
  /** Lebar tampil dalam px. Default 300. */
  displayWidth?:        number
}

// ─── KOMPONEN UTAMA ───────────────────────────────────────────
/**
 * Render strip pada virtual width 800px (sama dengan canvas.ts),
 * lalu scale ke displayWidth.
 *
 * Keuntungan: semua font size, padding, gap 100% identik antara
 * preview dan hasil download — di semua device.
 */
export function PhotoStrip({
  template,
  photos,
  bgColor,
  userDecorations  = [],
  stripTitle,
  instagramHandle,
  onUpdateDecoration,
  displayWidth     = 300,
}: PhotoStripProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontsReady, setFontsReady] = useState(false)

  // Pastikan Fredoka ter-load sebelum render teks
  useEffect(() => {
    ensureFreedokaLoaded().then(() => setFontsReady(true))
  }, [])

  // ── Kalkulasi dimensi (IDENTIK dengan canvas.ts) ────────────
  const W = VIRTUAL_W
  const H = Math.round(W / template.aspectRatio)

  const isInstagram = template.category === 'instagram'
  const padXPct     = isInstagram ? 0.05 : 0.08
  const padTopPct   = stripTitle  ? 0.10 : 0.07
  const padBotPct   = 0.15
  const gapPct      = 0.025

  const areaLeft  = W * padXPct
  const areaTop   = H * padTopPct
  const areaRight = W * padXPct
  const areaBot   = H * padBotPct

  const n      = template.slots
  const gapPx  = n > 1 ? H * gapPct : 0

  // Scale untuk tampil di displayWidth
  const scale = displayWidth / W

  // Border tebal: 4px pada virtual 800px (identik canvas.ts: borderW = round(4*(800/300))=11px tapi di sini kita pakai px langsung di virtual)
  const borderW = Math.round(4 * (W / 300))  // =11px di virtual space

  // Font scale: 1rem = 16px di virtual space (identik canvas.ts remScale = 16*(800/300))
  // Karena kita render di 800px virtual, cukup pakai px langsung
  const remScalePx = REM_PX  // dekorasi pakai `${dec.size * 16}px`

  // Strip title font
  const titleFontPx   = 0.7 * 16 * (W / 300)   // = 18.67px di virtual
  const handleFontPx  = 0.55 * 16 * (W / 300)  // = 14.67px di virtual

  const themeBgStyle = getThemeBgStyle(template.theme)

  return (
    /**
     * Wrapper: ukuran sebenarnya displayWidth × displayHeight
     * Overflow hidden agar tidak meluber.
     */
    <div
      style={{
        width:    `${displayWidth}px`,
        height:   `${Math.round(H * scale)}px`,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/**
       * Inner: dirender pada ukuran virtual 800×H, lalu di-scale.
       * transform-origin top-left agar posisi (0,0) tidak bergeser.
       */}
      <div
        ref={containerRef}
        style={{
          width:           `${W}px`,
          height:          `${H}px`,
          transform:       `scale(${scale})`,
          transformOrigin: 'top left',
          position:        'absolute',
          top:             0,
          left:            0,
          backgroundColor: bgColor,
          border:          `${borderW}px solid ${template.frameColor}`,
          boxSizing:       'border-box',
          overflow:        'hidden',
          ...themeBgStyle,
        }}
      >
        {/* ── SLOT FOTO ──────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top:      areaTop,
            bottom:   areaBot,
            left:     areaLeft,
            right:    areaRight,
            display:  'flex',
            flexDirection: 'column',
            gap:      `${gapPx}px`,
          }}
        >
          {Array.from({ length: n }).map((_, i) => (
            <div
              key={i}
              style={{
                position:        'relative',
                flex:            1,
                width:           '100%',
                overflow:        'hidden',
                borderRadius:    getSlotBorderRadius(template.slotShape),
                border:          `2.5px solid ${template.frameColor}`,
                backgroundColor: 'rgba(255,255,255,0.08)',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
              }}
            >
              {photos[i] ? (
                <img
                  src={photos[i]}
                  alt={`Foto ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  draggable={false}
                />
              ) : (
                <span
                  style={{
                    color:      `${template.frameColor}88`,
                    fontSize:   `${0.65 * 16}px`,
                    fontWeight: 'bold',
                    textAlign:  'center',
                    userSelect: 'none',
                  }}
                >
                  Foto {i + 1}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ── DEKORASI TEMPLATE (tidak bisa digeser) ──────── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
          {template.decorations.map((dec) => (
            <div
              key={dec.id}
              style={{
                position:   'absolute',
                left:       `${dec.x}%`,
                top:        `${dec.y}%`,
                transform:  `translate(-50%,-50%) rotate(${dec.rotation || 0}deg)`,
                fontSize:   `${dec.size * remScalePx}px`,
                color:      dec.color || template.frameColor,
                fontFamily: dec.type === 'text'
                  ? '"Fredoka One","Fredoka",cursive'
                  : '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif',
                fontWeight:  'bold',
                whiteSpace:  'nowrap',
                lineHeight:  1,
                userSelect:  'none',
                textShadow:  dec.type === 'text'
                  ? '1px 1px 0 rgba(255,255,255,0.5),-1px -1px 0 rgba(255,255,255,0.5)'
                  : 'none',
              }}
            >
              {dec.content}
            </div>
          ))}
        </div>

        {/* ── DEKORASI USER ────────────────────────────────── */}
        {userDecorations.map((dec) =>
          onUpdateDecoration ? (
            <DraggableDecoration
              key={dec.id}
              dec={dec}
              containerRef={containerRef}
              onUpdate={onUpdateDecoration}
              scale={scale}
            />
          ) : (
            <div
              key={dec.id}
              style={{
                position:   'absolute',
                left:       `${dec.x}%`,
                top:        `${dec.y}%`,
                transform:  `translate(-50%,-50%) rotate(${dec.rotation || 0}deg)`,
                fontSize:   `${dec.size * remScalePx}px`,
                color:      dec.color || '#333',
                fontFamily: dec.type === 'text'
                  ? ((dec as any).fontFamily || 'Georgia, serif')
                  : '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif',
                fontWeight:  'bold',
                whiteSpace:  'nowrap',
                lineHeight:  1,
                userSelect:  'none',
                pointerEvents: 'none',
                zIndex:      30,
              }}
            >
              {dec.content}
            </div>
          ),
        )}

        {/* ── STRIP TITLE ──────────────────────────────────── */}
        {stripTitle && (
          <div
            style={{
              position:      'absolute',
              top:           `${H * 0.025}px`,
              left:          0,
              right:         0,
              textAlign:     'center',
              fontSize:      `${titleFontPx}px`,
              fontFamily:    '"Georgia", serif',
              fontWeight:    'bold',
              letterSpacing: `${titleFontPx * 0.15}px`,
              color:         template.frameColor,
              pointerEvents: 'none',
              userSelect:    'none',
              zIndex:        25,
              textTransform: 'uppercase',
            }}
          >
            {stripTitle}
          </div>
        )}

        {/* ── INSTAGRAM HANDLE ─────────────────────────────── */}
        {instagramHandle && (
          <div
            style={{
              position:      'absolute',
              bottom:        `${H * 0.015}px`,
              left:          0,
              right:         0,
              textAlign:     'center',
              fontSize:      `${handleFontPx}px`,
              fontFamily:    '"Arial", sans-serif',
              fontWeight:    600,
              color:         template.frameColor,
              opacity:       0.85,
              pointerEvents: 'none',
              userSelect:    'none',
              zIndex:        25,
            }}
          >
            {instagramHandle}
          </div>
        )}
      </div>
    </div>
  )
}
