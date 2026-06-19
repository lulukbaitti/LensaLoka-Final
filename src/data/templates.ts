// ─── TYPES (JANGAN DIUBAH) ─────────────────────────────────
export type SlotShape = 'rect' | 'oval' | 'arch' | 'cloud' | 'wavy'
export type Theme =
  | 'plain'
  | 'strawberry'
  | 'camera'
  | 'hearts'
  | 'gingham'
  | 'y2k-stars'
  | 'vintage'
  | 'cute-bows'
  | 'pastel'
  | 'retro'
  | 'minimal'
  | 'neon'
  | 'boho'
  | 'film'
  | 'food'

export interface Decoration {
  id: string
  type: 'emoji' | 'text' | 'image'
  content: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  size: number // rem
  rotation?: number
  color?: string
}

export interface Template {
  id: string
  name: string
  description: string
  category: 'strip' | 'instagram'
  slots: number
  slotShape: SlotShape
  theme: Theme
  defaultBgColor: string
  frameColor: string
  decorations: Decoration[]
  aspectRatio: number
  slotAspectRatio: number
}

// ==========================================================
// 🔥 [BAGIAN 1]: KATEGORI STRIP PANJANG (VERTIKAL)
// ==========================================================
export const stripTemplates: Template[] = [
  {
    id: 'plain-3',
    name: 'Cozy Cream',
    description: 'Soft & dreamy 3-slot strip',
    category: 'strip',
    slots: 3,
    slotShape: 'rect',
    theme: 'plain',
    defaultBgColor: '#f6ecd9',
    frameColor: '#3b2a1e',
    aspectRatio: 0.33,
    slotAspectRatio: 1.2,
    decorations: [
      { id: 'd1', type: 'emoji', content: '☕', x: 12, y: 5, size: 1.8 },
      { id: 'd2', type: 'emoji', content: '✨', x: 88, y: 8, size: 1.4, rotation: 10 },
      { id: 'd3', type: 'emoji', content: '🤎', x: 90, y: 50, size: 1.5 },
      { id: 'd4', type: 'emoji', content: '🌙', x: 10, y: 55, size: 1.5, rotation: -10 },
      { id: 'd5', type: 'text', content: 'sweet moments', x: 50, y: 91, size: 1.1, color: '#3b2a1e' },
      { id: 'd-loka-p3', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#3b2a1e' }
    ]
  },
  {
    id: 'food-strip-4',
    name: 'Yummy Munchies',
    description: 'Cute food & snacks 4-slot strip',
    category: 'strip',
    slots: 4,
    slotShape: 'rect',
    theme: 'food',
    defaultBgColor: '#fff3b0',
    frameColor: '#e36414',
    aspectRatio: 0.33,
    slotAspectRatio: 1.2,
    decorations: [
      { id: 'df1', type: 'emoji', content: '🍳', x: 12, y: 4, size: 1.6, rotation: -12 },
      { id: 'df2', type: 'emoji', content: '🍕', x: 88, y: 6, size: 1.5 },
      { id: 'df3', type: 'emoji', content: '🍔', x: 90, y: 30, size: 1.4 },
      { id: 'df4', type: 'emoji', content: '🍟', x: 10, y: 52, size: 1.4 },
      { id: 'df5', type: 'emoji', content: '🍩', x: 90, y: 74, size: 1.5, rotation: 15 },
      { id: 'df6', type: 'text', content: 'happy tummy!', x: 50, y: 91, size: 1.1, color: '#e36414' },
      { id: 'd-loka-fs4', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#333333' }
    ]
  },
  {
    id: 'strawberry-3',
    name: 'Berry Sweet',
    description: 'Juicy strawberry party strip',
    category: 'strip',
    slots: 3,
    slotShape: 'cloud',
    theme: 'strawberry',
    defaultBgColor: '#ffd966',
    frameColor: '#d63447',
    aspectRatio: 0.33,
    slotAspectRatio: 1.2,
    decorations: [
      { id: 'ds1', type: 'emoji', content: '🍓', x: 10, y: 4, size: 2.2 },
      { id: 'ds2', type: 'emoji', content: '🍓', x: 82, y: 10, size: 1.7, rotation: 18 },
      { id: 'ds3', type: 'emoji', content: '🌸', x: 90, y: 32, size: 1.5 },
      { id: 'ds4', type: 'emoji', content: '✨', x: 8, y: 30, size: 1.4 },
      { id: 'ds5', type: 'emoji', content: '🍓', x: 14, y: 55, size: 1.6, rotation: -12 },
      { id: 'ds6', type: 'emoji', content: '🐞', x: 88, y: 58, size: 1.5 },
      { id: 'ds7', type: 'emoji', content: '🍰', x: 12, y: 78, size: 1.8 },
      { id: 'ds8', type: 'emoji', content: '🍓', x: 86, y: 78, size: 1.6, rotation: 10 },
      { id: 'ds9', type: 'text', content: 'berry sweet!', x: 50, y: 91, size: 1.1, color: '#d63447' },
      { id: 'd-loka-s3', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#d63447' }
    ]
  },
  {
    id: 'camera-2',
    name: 'Retro Snap',
    description: 'Old-school camera club strip',
    category: 'strip',
    slots: 2,
    slotShape: 'rect',
    theme: 'camera',
    defaultBgColor: '#b8c5a0',
    frameColor: '#3b2a1e',
    aspectRatio: 0.33,
    slotAspectRatio: 1.0,
    decorations: [
      { id: 'dc1', type: 'emoji', content: '📸', x: 50, y: 7, size: 2.8 },
      { id: 'dc2', type: 'emoji', content: '🎞️', x: 12, y: 28, size: 1.8, rotation: -15 },
      { id: 'dc3', type: 'emoji', content: '📷', x: 88, y: 30, size: 1.8, rotation: 12 },
      { id: 'dc4', type: 'emoji', content: '⭐', x: 90, y: 60, size: 1.5 },
      { id: 'dc5', type: 'emoji', content: '✨', x: 10, y: 62, size: 1.4 },
      { id: 'dc6', type: 'emoji', content: '🍄', x: 86, y: 78, size: 1.6 },
      { id: 'dc7', type: 'text', content: 'SAY CHEESE', x: 50, y: 91, size: 1.2, color: '#3b2a1e' },
      { id: 'd-loka-c2', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#3b2a1e' }
    ]
  },
  {
    id: 'hearts-4',
    name: 'Love Letter',
    description: 'Lovecore oval frames strip',
    category: 'strip',
    slots: 4,
    slotShape: 'oval',
    theme: 'hearts',
    defaultBgColor: '#e8b4b8',
    frameColor: '#d63447',
    aspectRatio: 0.33,
    slotAspectRatio: 1.2,
    decorations: [
      { id: 'dh1', type: 'emoji', content: '💌', x: 50, y: 4, size: 2.4 },
      { id: 'dh2', type: 'emoji', content: '💕', x: 10, y: 18, size: 1.6 },
      { id: 'dh3', type: 'emoji', content: '🎀', x: 90, y: 16, size: 1.6, rotation: 12 },
      { id: 'dh4', type: 'emoji', content: '💖', x: 88, y: 42, size: 1.6 },
      { id: 'dh5', type: 'emoji', content: '🩷', x: 9, y: 44, size: 1.5 },
      { id: 'dh6', type: 'emoji', content: '💘', x: 12, y: 70, size: 1.6 },
      { id: 'dh7', type: 'emoji', content: '🌹', x: 90, y: 72, size: 1.5 },
      { id: 'dh8', type: 'text', content: 'XOXO', x: 50, y: 91, size: 1.2, color: '#d63447' },
      { id: 'd-loka-h4', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#d63447' }
    ]
  },
  {
    id: 'gingham-3',
    name: 'Picnic Day',
    description: 'Gingham & cherries strip',
    category: 'strip',
    slots: 3,
    slotShape: 'wavy',
    theme: 'gingham',
    defaultBgColor: '#f6ecd9',
    frameColor: '#d63447',
    aspectRatio: 0.33,
    slotAspectRatio: 1.1,
    decorations: [
      { id: 'dg1', type: 'emoji', content: '🧺', x: 50, y: 5, size: 2.4 },
      { id: 'dg2', type: 'emoji', content: '🍒', x: 88, y: 14, size: 1.8 },
      { id: 'dg3', type: 'emoji', content: '🐝', x: 10, y: 16, size: 1.6, rotation: -10 },
      { id: 'dg4', type: 'emoji', content: '🌻', x: 10, y: 50, size: 1.9 },
      { id: 'dg5', type: 'emoji', content: '🍓', x: 90, y: 48, size: 1.6 },
      { id: 'dg6', type: 'emoji', content: '🦋', x: 12, y: 78, size: 1.6 },
      { id: 'dg7', type: 'emoji', content: '🍒', x: 88, y: 78, size: 1.6, rotation: 10 },
      { id: 'dg8', type: 'text', content: 'picnic date', x: 50, y: 91, size: 1.2, color: '#d63447' },
      { id: 'd-loka-g3', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#d63447' }
    ]
  },
  {
    id: 'y2k-4',
    name: 'Y2K Starz',
    description: 'Blingy 2000s vibes strip',
    category: 'strip',
    slots: 4,
    slotShape: 'rect',
    theme: 'y2k-stars',
    defaultBgColor: '#a8d8ea',
    frameColor: '#ffd966',
    aspectRatio: 0.33,
    slotAspectRatio: 1.3,
    decorations: [
      { id: 'dy1', type: 'emoji', content: '💿', x: 12, y: 4, size: 2 },
      { id: 'dy2', type: 'emoji', content: '🦋', x: 88, y: 6, size: 1.9 },
      { id: 'dy3', type: 'emoji', content: '⭐', x: 9, y: 28, size: 1.5 },
      { id: 'dy4', type: 'emoji', content: '💖', x: 91, y: 30, size: 1.6 },
      { id: 'dy5', type: 'emoji', content: '✨', x: 10, y: 52, size: 1.4 },
      { id: 'dy6', type: 'emoji', content: '🌟', x: 90, y: 54, size: 1.6 },
      { id: 'dy7', type: 'emoji', content: '👾', x: 12, y: 76, size: 1.7 },
      { id: 'dy8', type: 'emoji', content: '🦋', x: 88, y: 76, size: 1.6, rotation: 15 },
      { id: 'dy9', type: 'text', content: '★ BFFs ★', x: 50, y: 91, size: 1.2, color: '#d63447' },
      { id: 'd-loka-y4', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#d63447' }
    ]
  },
  {
    id: 'bows-3',
    name: 'Coquette Bows',
    description: 'Ribbons, swans & lace strip',
    category: 'strip',
    slots: 3,
    slotShape: 'arch',
    theme: 'cute-bows',
    defaultBgColor: '#f6ecd9',
    frameColor: '#e8b4b8',
    aspectRatio: 0.33,
    slotAspectRatio: 1.0,
    decorations: [
      { id: 'db1', type: 'emoji', content: '🎀', x: 50, y: 4, size: 2.8 },
      { id: 'db2', type: 'emoji', content: '🩰', x: 12, y: 22, size: 1.7 },
      { id: 'db3', type: 'emoji', content: '🦢', x: 88, y: 22, size: 1.7 },
      { id: 'db4', type: 'emoji', content: '🌷', x: 9, y: 50, size: 1.6 },
      { id: 'db5', type: 'emoji', content: '🎀', x: 91, y: 50, size: 1.5, rotation: -12 },
      { id: 'db6', type: 'emoji', content: '🤍', x: 12, y: 76, size: 1.5 },
      { id: 'db7', type: 'emoji', content: '✨', x: 88, y: 76, size: 1.4 },
      { id: 'db8', type: 'text', content: 'mon chéri', x: 50, y: 91, size: 1.2, color: '#c97b86' },
      { id: 'd-loka-b3', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#c97b86' }
    ]
  },
  {
    id: 'pastel-dream-3',
    name: 'Pastel Dream',
    description: 'Soft gradient with stars strip',
    category: 'strip',
    slots: 3,
    slotShape: 'cloud',
    theme: 'pastel',
    defaultBgColor: '#f9e0d9',
    frameColor: '#d4a5a5',
    aspectRatio: 0.33,
    slotAspectRatio: 1.2,
    decorations: [
      { id: 'dp1', type: 'emoji', content: '🌈', x: 10, y: 6, size: 2.0 },
      { id: 'dp2', type: 'emoji', content: '☁️', x: 88, y: 10, size: 1.8, rotation: 8 },
      { id: 'dp3', type: 'emoji', content: '✨', x: 90, y: 50, size: 1.6 },
      { id: 'dp4', type: 'emoji', content: '🦄', x: 10, y: 50, size: 1.8 },
      { id: 'dp5', type: 'emoji', content: '🌸', x: 12, y: 78, size: 1.7 },
      { id: 'dp6', type: 'emoji', content: '🌊', x: 88, y: 78, size: 1.6 },
      { id: 'dp7', type: 'text', content: 'dreamy days', x: 50, y: 91, size: 1.1, color: '#d4a5a5' },
      { id: 'd-loka-pd3', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#d4a5a5' }
    ]
  },
  {
    id: 'retro-wave-4',
    name: 'Retro Wave',
    description: 'Neon 80s vibes strip',
    category: 'strip',
    slots: 4,
    slotShape: 'rect',
    theme: 'retro',
    defaultBgColor: '#1a1a2e',
    frameColor: '#f72585',
    aspectRatio: 0.33,
    slotAspectRatio: 1.2,
    decorations: [
      { id: 'dr1', type: 'emoji', content: '🌴', x: 12, y: 4, size: 1.8 },
      { id: 'dr2', type: 'emoji', content: '🌀', x: 88, y: 6, size: 1.6, rotation: 20 },
      { id: 'dr3', type: 'emoji', content: '⚡', x: 10, y: 30, size: 1.5 },
      { id: 'dr4', type: 'emoji', content: '🎵', x: 90, y: 32, size: 1.7 },
      { id: 'dr5', type: 'emoji', content: '💜', x: 10, y: 60, size: 1.6 },
      { id: 'dr6', type: 'emoji', content: '🌟', x: 90, y: 62, size: 1.5 },
      { id: 'dr7', type: 'emoji', content: '🌈', x: 12, y: 79, size: 1.8 },
      { id: 'dr8', type: 'text', content: 'RADICAL', x: 50, y: 91, size: 1.2, color: '#f72585' },
      { id: 'd-loka-rw4', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#4cc9f0' }
    ]
  },
  {
    id: 'plain-2',
    name: 'Cozy Minimal',
    description: 'Clean & sleek 2-slot classic strip',
    category: 'strip',
    slots: 2,
    slotShape: 'rect',
    theme: 'minimal',
    defaultBgColor: '#fcfaf2',
    frameColor: '#2b2b2b',
    aspectRatio: 0.33,
    slotAspectRatio: 1.1,
    decorations: [
      { id: 'dm1', type: 'emoji', content: '🤍', x: 15, y: 6, size: 1.5 },
      { id: 'dm2', type: 'text', content: 'pure joy', x: 50, y: 91, size: 1.2, color: '#2b2b2b' },
      { id: 'd-loka-m2', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#8a8a8a' }
    ]
  },
  {
    id: 'vintage-2-strip',
    name: 'Classic Noir',
    description: 'Elegant dark vintage 2-slot strip',
    category: 'strip',
    slots: 2,
    slotShape: 'rect',
    theme: 'vintage',
    defaultBgColor: '#1c1a17',
    frameColor: '#cfb997',
    aspectRatio: 0.33,
    slotAspectRatio: 1.1,
    decorations: [
      { id: 'dv1', type: 'emoji', content: '📜', x: 85, y: 6, size: 1.4 },
      { id: 'dv2', type: 'text', content: 'memento', x: 50, y: 91, size: 1.2, color: '#cfb997' },
      { id: 'd-loka-v2', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#cfb997' }
    ]
  }
]

// ==========================================================
// 📸 [BAGIAN 2]: KATEGORI STRIP INSTAGRAM (HANYA 1 ATAU 2 FOTO)
// ==========================================================
export const instaTemplates: Template[] = [
  {
    id: 'insta-food-2',
    name: 'Foodie Journal',
    description: 'Delicious 2-slot food frame',
    category: 'instagram',
    slots: 2,
    slotShape: 'rect',
    theme: 'food',
    defaultBgColor: '#faedcd',
    frameColor: '#d4a373',
    aspectRatio: 0.8,
    slotAspectRatio: 1.3,
    decorations: [
      { id: 'if1', type: 'emoji', content: '🍜', x: 15, y: 6, size: 1.8 },
      { id: 'if2', type: 'emoji', content: '🍰', x: 85, y: 6, size: 1.6 },
      { id: 'if3', type: 'text', content: "today's menu", x: 50, y: 91, size: 1.1, color: '#bc6c25' },
      { id: 'd-loka-if2', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#bc6c25' }
    ]
  },
  {
    id: 'insta-minimal-1',
    name: 'Minimalist',
    description: 'Clean single shot frame',
    category: 'instagram',
    slots: 1,
    slotShape: 'rect',
    theme: 'minimal',
    defaultBgColor: '#fafafa',
    frameColor: '#cccccc',
    aspectRatio: 0.8,
    slotAspectRatio: 1.1,
    decorations: [
      { id: 'im1', type: 'text', content: 'less is more', x: 50, y: 91, size: 1.1, color: '#aaaaaa' },
      { id: 'd-loka-im1', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#2b2b2b' }
    ]
  },
  {
    id: 'insta-vintage-2',
    name: 'Vintage Film',
    description: 'Double exposure feel frame',
    category: 'instagram',
    slots: 2,
    slotShape: 'rect',
    theme: 'film',
    defaultBgColor: '#f4ede4',
    frameColor: '#6b5b4e',
    aspectRatio: 0.8,
    slotAspectRatio: 1.3,
    decorations: [
      { id: 'iv1', type: 'emoji', content: '🎞️', x: 50, y: 6, size: 2.0 },
      { id: 'iv2', type: 'emoji', content: '📷', x: 15, y: 91, size: 1.4 },
      { id: 'iv3', type: 'emoji', content: '✨', x: 85, y: 91, size: 1.4 },
      { id: 'iv4', type: 'text', content: 'nostalgia', x: 50, y: 91, size: 1.1, color: '#6b5b4e' },
      { id: 'd-loka-iv2', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#6b5b4e' }
    ]
  },
  {
    id: 'insta-neon-1',
    name: 'Neon Glow',
    description: 'Bold single square frame',
    category: 'instagram',
    slots: 1,
    slotShape: 'rect',
    theme: 'neon',
    defaultBgColor: '#0b0b1a',
    frameColor: '#ff00ff',
    aspectRatio: 0.8,
    slotAspectRatio: 1.1,
    decorations: [
      { id: 'in1', type: 'emoji', content: '💡', x: 15, y: 12, size: 2.2, rotation: -15 },
      { id: 'in2', type: 'text', content: 'NEON', x: 50, y: 91, size: 1.4, color: '#ff00ff' },
      { id: 'd-loka-in1', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#39ff14' }
    ]
  },
  {
    id: 'insta-boho-2',
    name: 'Boho Vibes',
    description: 'Earthy double square',
    category: 'instagram',
    slots: 2,
    slotShape: 'cloud',
    theme: 'boho',
    defaultBgColor: '#f5ebe0',
    frameColor: '#d4a373',
    aspectRatio: 0.8,
    slotAspectRatio: 1.3,
    decorations: [
      { id: 'ibh1', type: 'emoji', content: '🌿', x: 12, y: 8, size: 1.8 },
      { id: 'ibh2', type: 'emoji', content: '🌸', x: 88, y: 8, size: 1.6 },
      { id: 'ibh3', type: 'emoji', content: '☀️', x: 50, y: 8, size: 1.6 },
      { id: 'ibh4', type: 'text', content: 'wild & free', x: 50, y: 91, size: 1.1, color: '#d4a373' },
      { id: 'd-loka-ibh2', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#d4a373' }
    ]
  },
  {
    id: 'insta-artsy-1',
    name: 'Artsy Frame',
    description: 'Painterly single frame',
    category: 'instagram',
    slots: 1,
    slotShape: 'oval',
    theme: 'plain',
    defaultBgColor: '#f7f0e6',
    frameColor: '#b5838d',
    aspectRatio: 0.8,
    slotAspectRatio: 1.1,
    decorations: [
      { id: 'ia1', type: 'emoji', content: '🎨', x: 88, y: 14, size: 2.2, rotation: 15 },
      { id: 'ia2', type: 'text', content: 'art production', x: 50, y: 91, size: 1.2, color: '#b5838d' },
      { id: 'd-loka-ia1', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#b5838d' }
    ]
  },
  {
    id: 'insta-sunset-2',
    name: 'Sunset Duo',
    description: 'Warm double frame',
    category: 'instagram',
    slots: 2,
    slotShape: 'arch',
    theme: 'gingham',
    defaultBgColor: '#ffd6a5',
    frameColor: '#f77f00',
    aspectRatio: 0.8,
    slotAspectRatio: 1.3,
    decorations: [
      { id: 'isu1', type: 'emoji', content: '🌅', x: 50, y: 8, size: 2.2 },
      { id: 'isu2', type: 'emoji', content: '☀️', x: 15, y: 91, size: 1.6 },
      { id: 'isu3', type: 'emoji', content: '🌊', x: 85, y: 91, size: 1.6 },
      { id: 'isu4', type: 'text', content: 'golden hour', x: 50, y: 91, size: 1.1, color: '#f77f00' },
      { id: 'd-loka-isu2', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#f77f00' }
    ]
  },
  {
    id: 'insta-moody-1',
    name: 'Moody Mono',
    description: 'Dark single square frame',
    category: 'instagram',
    slots: 1,
    slotShape: 'rect',
    theme: 'plain',
    defaultBgColor: '#2d2d2d',
    frameColor: '#8a8a8a',
    aspectRatio: 0.8,
    slotAspectRatio: 1.1,
    decorations: [
      { id: 'imo1', type: 'emoji', content: '🖤', x: 14, y: 14, size: 2.0 },
      { id: 'imo2', type: 'text', content: 'noir vibe', x: 50, y: 91, size: 1.2, color: '#b0b0b0' },
      { id: 'd-loka-imo1', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#b0b0b0' }
    ]
  },
  {
    id: 'insta-bloom-2',
    name: 'Blooming',
    description: 'Floral double frame',
    category: 'instagram',
    slots: 2,
    slotShape: 'cloud',
    theme: 'cute-bows',
    defaultBgColor: '#fde2e4',
    frameColor: '#e5989b',
    aspectRatio: 0.8,
    slotAspectRatio: 1.3,
    decorations: [
      { id: 'ibl1', type: 'emoji', content: '🌷', x: 12, y: 8, size: 1.8 },
      { id: 'ibl2', type: 'emoji', content: '🌹', x: 88, y: 8, size: 1.8 },
      { id: 'ibl3', type: 'emoji', content: '🌸', x: 15, y: 91, size: 1.4 },
      { id: 'ibl4', type: 'text', content: 'bloom', x: 50, y: 91, size: 1.2, color: '#e5989b' },
      { id: 'd-loka-ibl2', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#e5989b' }
    ]
  },
  {
    id: 'insta-retro-1',
    name: 'Retro Square',
    description: 'Vintage single square',
    category: 'instagram',
    slots: 1,
    slotShape: 'rect',
    theme: 'vintage',
    defaultBgColor: '#f6e9d7',
    frameColor: '#b07d62',
    aspectRatio: 0.8,
    slotAspectRatio: 1.1,
    decorations: [
      { id: 'ire1', type: 'emoji', content: '📻', x: 86, y: 14, size: 2.0, rotation: 10 },
      { id: 'ire2', type: 'emoji', content: '🎶', x: 15, y: 91, size: 1.4 },
      { id: 'ire3', type: 'emoji', content: '💿', x: 85, y: 91, size: 1.4 },
      { id: 'ire4', type: 'text', content: 'old school', x: 50, y: 91, size: 1.2, color: '#b07d62' },
      { id: 'd-loka-ire1', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#b07d62' }
    ]
  },
  {
    id: 'insta-fresh-2',
    name: 'Fresh Greens',
    description: 'Nature double square',
    category: 'instagram',
    slots: 2,
    slotShape: 'wavy',
    theme: 'plain',
    defaultBgColor: '#d8e2dc',
    frameColor: '#2b9348',
    aspectRatio: 0.8,
    slotAspectRatio: 1.3,
    decorations: [
      { id: 'ifr1', type: 'emoji', content: '🌱', x: 12, y: 8, size: 1.8 },
      { id: 'ifr2', type: 'emoji', content: '🍃', x: 88, y: 8, size: 1.8 },
      { id: 'ifr3', type: 'text', content: 'fresh', x: 50, y: 91, size: 1.2, color: '#2b9348' },
      { id: 'd-loka-ifr2', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#2b9348' }
    ]
  },
  {
    id: 'insta-p-hearts',
    name: 'Amour Portrait',
    description: 'Lovely 2-slot oval portrait frame',
    category: 'instagram',
    slots: 2,
    slotShape: 'oval',
    theme: 'hearts',
    defaultBgColor: '#ffe5ec',
    frameColor: '#fb6f92',
    aspectRatio: 0.8,
    slotAspectRatio: 1.3,
    decorations: [
      { id: 'ip3_1', type: 'emoji', content: '💝', x: 12, y: 6, size: 1.6 },
      { id: 'ip3_2', type: 'emoji', content: '🎀', x: 88, y: 6, size: 1.6 },
      { id: 'ip3_3', type: 'text', content: 'with all my love', x: 50, y: 91, size: 1.1, color: '#fb6f92' },
      { id: 'd-loka-iph', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#fb6f92' }
    ]
  },
  {
    id: 'insta-p-bows',
    name: 'Angelic Ribbons',
    description: 'Delicate coquette 2-slot portrait',
    category: 'instagram',
    slots: 2,
    slotShape: 'arch',
    theme: 'cute-bows',
    defaultBgColor: '#fcf6bd',
    frameColor: '#ff99c8',
    aspectRatio: 0.8,
    slotAspectRatio: 1.2,
    decorations: [
      { id: 'ip6_1', type: 'emoji', content: '🎀', x: 50, y: 6, size: 2.2 },
      { id: 'ip6_2', type: 'text', content: 'sweet cherub', x: 50, y: 91, size: 1.1, color: '#ff99c8' },
      { id: 'd-loka-ipb', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#ff99c8' }
    ]
  },
  {
    id: 'insta-p-retro',
    name: 'Vapor Wave',
    description: 'Vibrant neon retro 2-slot portrait',
    category: 'instagram',
    slots: 2,
    slotShape: 'rect',
    theme: 'retro',
    defaultBgColor: '#240046',
    frameColor: '#ff6b6b',
    aspectRatio: 0.8,
    slotAspectRatio: 1.2,
    decorations: [
      { id: 'ip8_1', type: 'emoji', content: '⚡', x: 12, y: 6, size: 1.6 },
      { id: 'ip8_2', type: 'emoji', content: '🌴', x: 88, y: 6, size: 1.6 },
      { id: 'ip8_3', type: 'text', content: 'SYNTH WAVE', x: 50, y: 91, size: 1.1, color: '#ff6b6b' },
      { id: 'd-loka-ipr', type: 'text', content: 'LensaLoka', x: 50, y: 96, size: 0.8, color: '#4cc9f0' }
    ]
  }
]

// ==========================================================
// 🔗 COMBINED EXPORTS (JANGAN DIUBAH SAMA SEKALI)
// ==========================================================
export const templates: Template[] = [...stripTemplates, ...instaTemplates]
export const allTemplates = templates
