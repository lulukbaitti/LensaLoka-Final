import { Template, Decoration } from '../data/templates'

export const FILTERS = [
  { id: 'normal',  name: 'Normal',  css: 'none' },
  { id: 'bw',      name: 'B & W',   css: 'grayscale(100%)' },
  { id: 'sepia',   name: 'Vintage', css: 'sepia(80%)' },
  { id: 'warm',    name: 'Warm',    css: 'sepia(30%) saturate(140%) hue-rotate(-10deg)' },
  { id: 'cool',    name: 'Cool',    css: 'saturate(120%) hue-rotate(10deg) contrast(110%)' },
]

export const BG_COLORS = [
  '#f6ecd9',
  '#ffd966',
  '#e8b4b8',
  '#b8c5a0',
  '#a8d8ea',
  '#ffffff',
  '#3b2a1e',
  '#000000',
]

// ─── Pastikan font Fredoka sudah ter-load di dokumen ────────
// Canvas menggunakan font yang sama dengan DOM, tapi hanya jika
// font sudah di-load oleh browser. Fungsi ini memastikan itu.
async function ensureFontsLoaded(): Promise<void> {
  // Cek apakah Fredoka sudah ada di document.fonts
  const fredokaLoaded = [...document.fonts].some(
    (f) => f.family.toLowerCase().includes('fredoka')
  )

  if (!fredokaLoaded) {
    // Inject link element jika belum ada
    const existingLink = document.querySelector('link[data-font="fredoka"]')
    if (!existingLink) {
      const link = document.createElement('link')
      link.rel  = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Fredoka+One&family=Fredoka:wght@600&display=swap'
      link.setAttribute('data-font', 'fredoka')
      document.head.appendChild(link)
    }
  }

  // Tunggu semua font ready (termasuk Fredoka yang baru di-inject)
  try {
    await document.fonts.ready
    // Extra: paksa load Fredoka One secara eksplisit
    await document.fonts.load('bold 40px "Fredoka One"')
    await document.fonts.load('600 40px "Fredoka"')
  } catch {
    // Jika gagal, lanjutkan dengan fallback font
  }
}

// ─── Load image helper ──────────────────────────────────────
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// ─── Shape path ─────────────────────────────────────────────
function drawShapePath(
  ctx: CanvasRenderingContext2D,
  shape: string,
  x: number, y: number,
  w: number, h: number,
) {
  ctx.beginPath()
  switch (shape) {
    case 'oval':
      ctx.ellipse(x + w/2, y + h/2, w/2, h/2, 0, 0, Math.PI * 2)
      break
    case 'arch': {
      const r = w / 2
      ctx.moveTo(x, y + h)
      ctx.lineTo(x, y + r)
      ctx.arc(x + r, y + r, r, Math.PI, 0)
      ctx.lineTo(x + w, y + h)
      ctx.closePath()
      break
    }
    case 'cloud': {
      const cr = (w / 300) * 18
      ctx.moveTo(x + cr, y)
      ctx.arcTo(x + w, y,     x + w, y + h, cr)
      ctx.arcTo(x + w, y + h, x,     y + h, cr)
      ctx.arcTo(x,     y + h, x,     y,     cr)
      ctx.arcTo(x,     y,     x + w, y,     cr)
      ctx.closePath()
      break
    }
    case 'wavy': {
      const s  = w / 300
      const r1 = 10 * s
      const r2 = 24 * s
      ctx.moveTo(x + r1, y)
      ctx.lineTo(x + w - r2, y)
      ctx.arcTo(x + w, y,     x + w, y + r2,    r2)
      ctx.lineTo(x + w, y + h - r1)
      ctx.arcTo(x + w, y + h, x + w - r1, y + h, r1)
      ctx.lineTo(x + r2, y + h)
      ctx.arcTo(x, y + h, x, y + h - r2, r2)
      ctx.lineTo(x, y + r1)
      ctx.arcTo(x, y, x + r1, y, r1)
      ctx.closePath()
      break
    }
    default:
      ctx.roundRect(x, y, w, h, (w / 300) * 6)
      break
  }
}

// ─── Theme background pattern ───────────────────────────────
function drawThemeBackground(
  ctx: CanvasRenderingContext2D,
  theme: string,
  W: number, H: number,
) {
  switch (theme) {
    case 'gingham': {
      ctx.fillStyle = 'rgba(214,52,71,0.07)'
      const step = 40
      for (let i = -H; i < W + H; i += step) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i - H, H)
        ctx.lineTo(i - H + step/2, H)
        ctx.lineTo(i + step/2, 0)
        ctx.closePath()
        ctx.fill()
      }
      break
    }
    case 'strawberry': {
      ctx.fillStyle = 'rgba(214,52,71,0.09)'
      const ds = 14
      for (let gy = 0; gy < H; gy += ds)
        for (let gx = 0; gx < W; gx += ds) {
          ctx.beginPath(); ctx.arc(gx, gy, ds * 0.15, 0, Math.PI * 2); ctx.fill()
        }
      break
    }
    case 'hearts': {
      ctx.fillStyle = 'rgba(241,143,169,0.16)'
      const ds = 20
      for (let gy = 0; gy < H; gy += ds)
        for (let gx = 0; gx < W; gx += ds) {
          ctx.beginPath(); ctx.arc(gx, gy, ds * 0.2, 0, Math.PI * 2); ctx.fill()
        }
      break
    }
    case 'y2k-stars': {
      ctx.fillStyle = 'rgba(255,255,255,0.22)'
      const ds = 18
      for (let gy = 0; gy < H; gy += ds)
        for (let gx = 0; gx < W; gx += ds) {
          ctx.beginPath(); ctx.arc(gx, gy, 1.5, 0, Math.PI * 2); ctx.fill()
        }
      break
    }
    case 'boho': {
      ctx.strokeStyle = 'rgba(212,163,115,0.12)'
      ctx.lineWidth   = 1
      const ls = 14
      for (let gy = 0; gy < H; gy += ls) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke()
      }
      break
    }
    case 'film': {
      ctx.strokeStyle = 'rgba(107,91,78,0.09)'
      ctx.lineWidth   = 2
      const cs = 20
      for (let gx = 0; gx < W; gx += cs) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke()
      }
      break
    }
    case 'retro':
    case 'neon': {
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, 'rgba(255,255,255,0.07)')
      g.addColorStop(1, 'rgba(0,0,0,0.28)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
      break
    }
    case 'pastel': {
      const g = ctx.createLinearGradient(0, 0, W, H)
      g.addColorStop(0, 'rgba(255,255,255,0.22)')
      g.addColorStop(1, 'rgba(0,0,0,0.04)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
      break
    }
    case 'vintage': {
      const g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)/1.5)
      g.addColorStop(0, 'rgba(207,185,151,0.1)')
      g.addColorStop(1, 'rgba(0,0,0,0.0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
      break
    }
  }
}

// ─── Pilih font string yang tepat per dekorasi ───────────────
// Ini mereplikasi PERSIS logika di PhotoStrip.tsx:
//   dec.type === 'text'
//     → template decorations: '"Fredoka", "Georgia", cursive'
//     → user decorations: (dec as any).fontFamily || 'Georgia, serif'
//   dec.type === 'emoji'
//     → 'inherit' (sistem emoji font)
function getFontFamily(dec: Decoration, isUserDec: boolean): string {
  if (dec.type !== 'text') {
    // Emoji: pakai font sistem
    return '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif'
  }
  if (isUserDec) {
    // User-added text: pakai fontFamily pilihan user, atau fallback Georgia
    return (dec as any).fontFamily || 'Georgia, serif'
  }
  // Template decoration text: SELALU Fredoka (sama dengan PhotoStrip.tsx)
  return '"Fredoka One", "Fredoka", cursive'
}

// ─── MAIN: generateFinalStrip ────────────────────────────────
export async function generateFinalStrip(
  template: Template,
  photos: string[],
  bgColor: string,
  userDecorations: Decoration[],
  stripTitle?: string,
  instagramHandle?: string,
): Promise<string> {

  // Pastikan Fredoka ter-load di browser sebelum canvas menggambar teks
  await ensureFontsLoaded()

  const canvas = document.createElement('canvas')
  const ctx    = canvas.getContext('2d')
  if (!ctx) throw new Error('No canvas context')

  // Dimensi output: lebar 800px, tinggi ikut aspectRatio template
  const W = 800
  const H = Math.round(W / template.aspectRatio)
  canvas.width  = W
  canvas.height = H

  // ── 1. Background ──────────────────────────────────────────
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, W, H)
  drawThemeBackground(ctx, template.theme, W, H)

  // ── 2. Kalkulasi slot ─────────────────────────────────────
  // IDENTIK dengan PhotoStrip.tsx:
  //   padX    = instagram ? '5%' : '8%'
  //   padTop  = stripTitle ? '10%' : '7%'
  //   padBot  = '15%'
  //   gap     = '2.5%' antar slot (bukan padding)
  //   flex-1  → slotH = (areaH - totalGap) / n
  const isInstagram = template.category === 'instagram'
  const padXPct    = isInstagram ? 0.05 : 0.08
  const padTopPct  = stripTitle  ? 0.10 : 0.07
  const padBotPct  = 0.15
  const gapPct     = 0.025

  const areaLeft = W * padXPct
  const areaTop  = H * padTopPct
  const areaW    = W * (1 - 2 * padXPct)
  const areaH    = H * (1 - padTopPct - padBotPct)

  const n        = template.slots
  const gapPx    = n > 1 ? H * gapPct : 0
  const slotH    = (areaH - gapPx * (n - 1)) / n
  const slotW    = areaW

  // ── 3. Gambar slot foto ────────────────────────────────────
  for (let i = 0; i < n; i++) {
    const sx = areaLeft
    const sy = areaTop + i * (slotH + gapPx)

    ctx.fillStyle = '#ffffff'
    drawShapePath(ctx, template.slotShape, sx, sy, slotW, slotH)
    ctx.fill()

    if (photos[i]) {
      try {
        const img = await loadImage(photos[i])
        ctx.save()
        drawShapePath(ctx, template.slotShape, sx, sy, slotW, slotH)
        ctx.clip()
        const ia  = img.width / img.height
        const sa  = slotW / slotH
        let dw: number, dh: number
        if (ia > sa) { dh = slotH; dw = dh * ia }
        else         { dw = slotW; dh = dw / ia  }
        ctx.drawImage(img, sx + (slotW - dw)/2, sy + (slotH - dh)/2, dw, dh)
        ctx.restore()
      } catch (e) {
        console.error('Gagal load foto slot', i, e)
      }
    }

    ctx.strokeStyle = template.frameColor
    ctx.lineWidth   = Math.max(4, W * 0.006)
    drawShapePath(ctx, template.slotShape, sx, sy, slotW, slotH)
    ctx.stroke()
  }

  // ── 4. Render dekorasi ─────────────────────────────────────
  //
  // KUNCI KESAMAAN FONT SIZE:
  // PhotoStrip.tsx memakai `${dec.size}rem` dalam container 300px lebar.
  // 1rem = 16px di browser standar.
  // Canvas ini 800px lebar → scale = 800/300 ≈ 2.667
  // Jadi: fontSize_canvas = dec.size * 16 * (800/300)
  //
  // Konstanta PREVIEW_W = 300 karena:
  //   CameraCapture.tsx  → max-w-[300px]
  //   EditPhoto.tsx      → max-w-[280px] (mirip, pakai 300 sebagai basis)
  //
  const PREVIEW_W = 300
  const remScale  = 16 * (W / PREVIEW_W)   // = 42.67 px per 1rem

  const userDecIds = new Set(userDecorations.map((d) => d.id))
  const allDecs    = [...template.decorations, ...userDecorations]

  for (const dec of allDecs) {
    const isUserDec = userDecIds.has(dec.id)
    const px  = (dec.x / 100) * W
    const py  = (dec.y / 100) * H
    const rot = ((dec.rotation || 0) * Math.PI) / 180
    // Font size: dec.size rem → pixel di canvas
    const fs  = dec.size * remScale

    ctx.save()
    ctx.translate(px, py)
    if (rot !== 0) ctx.rotate(rot)
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'

    const ff = getFontFamily(dec, isUserDec)

    if (dec.type === 'text') {
      ctx.font      = `bold ${fs}px ${ff}`
      ctx.fillStyle = dec.color || template.frameColor
      // Shadow tipis persis seperti PhotoStrip.tsx:
      //   textShadow: '1px 1px 0 rgba(255,255,255,0.5), -1px -1px 0 rgba(255,255,255,0.5)'
      // Di canvas: shadowBlur kecil + offset kecil
      ctx.shadowColor   = 'rgba(255,255,255,0.5)'
      ctx.shadowOffsetX = Math.round(W / 800)
      ctx.shadowOffsetY = Math.round(W / 800)
      ctx.shadowBlur    = 0
      ctx.fillText(dec.content, 0, 0)
      // Reset shadow
      ctx.shadowColor   = 'transparent'
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    } else {
      // Emoji: font size sedikit lebih besar (emoji secara visual lebih kecil)
      ctx.font = `${fs * 1.05}px ${ff}`
      ctx.fillText(dec.content, 0, 0)
    }

    ctx.restore()
  }

  // ── 5. Strip title (opsional) ──────────────────────────────
  // PhotoStrip.tsx: top: '2.5%', fontSize: '0.7rem', fontWeight: bold,
  //                 letterSpacing: '0.15em', color: frameColor
  if (stripTitle) {
    const ty = H * 0.025
    const fs = 0.7 * remScale
    ctx.save()
    ctx.font          = `bold ${fs}px "Georgia", serif`
    ctx.fillStyle     = template.frameColor
    ctx.textAlign     = 'center'
    ctx.textBaseline  = 'middle'
    ctx.letterSpacing = `${fs * 0.15}px`
    ctx.fillText(stripTitle.toUpperCase(), W / 2, ty)
    ctx.letterSpacing = '0px'
    ctx.restore()
  }

  // ── 6. Instagram handle (opsional) ────────────────────────
  // PhotoStrip.tsx: bottom: '1.5%', fontSize: '0.55rem', fontWeight: 600,
  //                 color: frameColor, opacity: 0.85
  if (instagramHandle) {
    const iy = H * (1 - 0.015)
    const fs = 0.55 * remScale
    ctx.save()
    ctx.font         = `600 ${fs}px "Arial", sans-serif`
    ctx.fillStyle    = template.frameColor
    ctx.globalAlpha  = 0.85
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(instagramHandle, W / 2, iy)
    ctx.restore()
  }

  // ── 7. Border luar ─────────────────────────────────────────
  // PhotoStrip.tsx: border: `4px solid ${frameColor}`
  // Scale: 4px * (800/300) ≈ 10.67 → 11px di canvas
  const borderW = Math.round(4 * (W / PREVIEW_W))
  ctx.strokeStyle = template.frameColor
  ctx.lineWidth   = borderW
  ctx.strokeRect(borderW / 2, borderW / 2, W - borderW, H - borderW)

  return canvas.toDataURL('image/jpeg', 0.92)
}
