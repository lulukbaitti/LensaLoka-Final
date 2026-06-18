export type SlotShape = 'rect' | 'oval' | 'arch' | 'cloud' | 'wavy';
export type Theme =
'plain' |
'strawberry' |
'camera' |
'hearts' |
'gingham' |
'y2k-stars' |
'vintage' |
'cute-bows';

export interface Decoration {
  id: string;
  type: 'emoji' | 'text' | 'image';
  content: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number; // rem or px
  rotation?: number; // degrees
  color?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  slots: number;
  slotShape: SlotShape;
  theme: Theme;
  defaultBgColor: string;
  frameColor: string;
  decorations: Decoration[];
  aspectRatio: number; // width/height of the whole strip
  slotAspectRatio: number; // width/height of each slot
}

export const templates: Template[] = [
{
  id: 'plain-3',
  name: 'Cozy Cream',
  description: 'Soft & dreamy 3-slot',
  slots: 3,
  slotShape: 'rect',
  theme: 'plain',
  defaultBgColor: '#f6ecd9', // cream
  frameColor: '#3b2a1e', // dark brown
  decorations: [
  { id: 'd1', type: 'emoji', content: '☕', x: 12, y: 5, size: 1.8 },
  {
    id: 'd2',
    type: 'emoji',
    content: '✨',
    x: 88,
    y: 8,
    size: 1.4,
    rotation: 10
  },
  { id: 'd3', type: 'emoji', content: '🤎', x: 90, y: 50, size: 1.5 },
  {
    id: 'd4',
    type: 'emoji',
    content: '🌙',
    x: 10,
    y: 55,
    size: 1.5,
    rotation: -10
  },
  {
    id: 'd5',
    type: 'text',
    content: 'sweet moments',
    x: 50,
    y: 95,
    size: 1.4,
    color: '#3b2a1e'
  }],

  aspectRatio: 0.35,
  slotAspectRatio: 1.2
},
{
  id: 'plain-4',
  name: 'Mono Film',
  description: 'Clean retro 4-slot',
  slots: 4,
  slotShape: 'rect',
  theme: 'plain',
  defaultBgColor: '#ffffff',
  frameColor: '#000000',
  decorations: [
  {
    id: 'd1',
    type: 'emoji',
    content: '🎞️',
    x: 12,
    y: 4,
    size: 1.6,
    rotation: -12
  },
  { id: 'd2', type: 'emoji', content: '⭐', x: 88, y: 6, size: 1.3 },
  { id: 'd3', type: 'emoji', content: '🖤', x: 90, y: 52, size: 1.4 },
  { id: 'd4', type: 'emoji', content: '✦', x: 10, y: 48, size: 1.3 },
  {
    id: 'd5',
    type: 'text',
    content: 'memories',
    x: 50,
    y: 96,
    size: 1.4,
    color: '#000000'
  }],

  aspectRatio: 0.3,
  slotAspectRatio: 1.2
},
{
  id: 'strawberry-3',
  name: 'Berry Sweet',
  description: 'Juicy strawberry party',
  slots: 3,
  slotShape: 'cloud',
  theme: 'strawberry',
  defaultBgColor: '#ffd966', // butter yellow
  frameColor: '#d63447', // cherry red
  decorations: [
  { id: 'd1', type: 'emoji', content: '🍓', x: 10, y: 4, size: 2.2 },
  {
    id: 'd2',
    type: 'emoji',
    content: '🍓',
    x: 82,
    y: 10,
    size: 1.7,
    rotation: 18
  },
  { id: 'd3', type: 'emoji', content: '🌸', x: 90, y: 32, size: 1.5 },
  { id: 'd4', type: 'emoji', content: '✨', x: 8, y: 30, size: 1.4 },
  {
    id: 'd5',
    type: 'emoji',
    content: '🍓',
    x: 14,
    y: 55,
    size: 1.6,
    rotation: -12
  },
  { id: 'd6', type: 'emoji', content: '🐞', x: 88, y: 58, size: 1.5 },
  { id: 'd7', type: 'emoji', content: '🍰', x: 12, y: 80, size: 1.8 },
  {
    id: 'd8',
    type: 'emoji',
    content: '🍓',
    x: 86,
    y: 82,
    size: 1.6,
    rotation: 10
  },
  {
    id: 'd9',
    type: 'text',
    content: 'berry sweet!',
    x: 50,
    y: 96,
    size: 1.6,
    color: '#d63447'
  }],

  aspectRatio: 0.35,
  slotAspectRatio: 1.2
},
{
  id: 'camera-2',
  name: 'Retro Snap',
  description: 'Old-school camera club',
  slots: 2,
  slotShape: 'rect',
  theme: 'camera',
  defaultBgColor: '#b8c5a0', // sage green
  frameColor: '#3b2a1e',
  decorations: [
  { id: 'd1', type: 'emoji', content: '📸', x: 50, y: 7, size: 2.8 },
  {
    id: 'd2',
    type: 'emoji',
    content: '🎞️',
    x: 12,
    y: 28,
    size: 1.8,
    rotation: -15
  },
  {
    id: 'd3',
    type: 'emoji',
    content: '📷',
    x: 88,
    y: 30,
    size: 1.8,
    rotation: 12
  },
  { id: 'd4', type: 'emoji', content: '⭐', x: 90, y: 60, size: 1.5 },
  { id: 'd5', type: 'emoji', content: '✨', x: 10, y: 62, size: 1.4 },
  { id: 'd6', type: 'emoji', content: '🍄', x: 86, y: 84, size: 1.6 },
  {
    id: 'd7',
    type: 'text',
    content: 'SAY CHEESE',
    x: 50,
    y: 92,
    size: 1.7,
    color: '#3b2a1e'
  }],

  aspectRatio: 0.4,
  slotAspectRatio: 1.0
},
{
  id: 'hearts-4',
  name: 'Love Letter',
  description: 'Lovecore oval frames',
  slots: 4,
  slotShape: 'oval',
  theme: 'hearts',
  defaultBgColor: '#e8b4b8', // dusty pink
  frameColor: '#d63447',
  decorations: [
  { id: 'd1', type: 'emoji', content: '💌', x: 50, y: 4, size: 2.4 },
  { id: 'd2', type: 'emoji', content: '💕', x: 10, y: 18, size: 1.6 },
  {
    id: 'd3',
    type: 'emoji',
    content: '🎀',
    x: 90,
    y: 16,
    size: 1.6,
    rotation: 12
  },
  { id: 'd4', type: 'emoji', content: '💖', x: 88, y: 42, size: 1.6 },
  { id: 'd5', type: 'emoji', content: '🩷', x: 9, y: 44, size: 1.5 },
  { id: 'd6', type: 'emoji', content: '💘', x: 12, y: 70, size: 1.6 },
  { id: 'd7', type: 'emoji', content: '🌹', x: 90, y: 72, size: 1.5 },
  {
    id: 'd8',
    type: 'text',
    content: 'XOXO',
    x: 50,
    y: 96,
    size: 1.6,
    color: '#d63447'
  }],

  aspectRatio: 0.3,
  slotAspectRatio: 1.2
},
{
  id: 'gingham-3',
  name: 'Picnic Day',
  description: 'Gingham & cherries',
  slots: 3,
  slotShape: 'wavy',
  theme: 'gingham',
  defaultBgColor: '#f6ecd9',
  frameColor: '#d63447',
  decorations: [
  { id: 'd1', type: 'emoji', content: '🧺', x: 50, y: 5, size: 2.4 },
  { id: 'd2', type: 'emoji', content: '🍒', x: 88, y: 14, size: 1.8 },
  {
    id: 'd3',
    type: 'emoji',
    content: '🐝',
    x: 10,
    y: 16,
    size: 1.6,
    rotation: -10
  },
  { id: 'd4', type: 'emoji', content: '🌻', x: 10, y: 50, size: 1.9 },
  { id: 'd5', type: 'emoji', content: '🍓', x: 90, y: 48, size: 1.6 },
  { id: 'd6', type: 'emoji', content: '🦋', x: 12, y: 80, size: 1.6 },
  {
    id: 'd7',
    type: 'emoji',
    content: '🍒',
    x: 88,
    y: 80,
    size: 1.6,
    rotation: 10
  },
  {
    id: 'd8',
    type: 'text',
    content: 'picnic date',
    x: 50,
    y: 95,
    size: 1.6,
    color: '#d63447'
  }],

  aspectRatio: 0.35,
  slotAspectRatio: 1.1
},
{
  id: 'y2k-4',
  name: 'Y2K Starz',
  description: 'Blingy 2000s vibes',
  slots: 4,
  slotShape: 'rect',
  theme: 'y2k-stars',
  defaultBgColor: '#a8d8ea', // baby blue
  frameColor: '#ffd966', // butter yellow
  decorations: [
  { id: 'd1', type: 'emoji', content: '💿', x: 12, y: 4, size: 2 },
  { id: 'd2', type: 'emoji', content: '🦋', x: 88, y: 6, size: 1.9 },
  { id: 'd3', type: 'emoji', content: '⭐', x: 9, y: 28, size: 1.5 },
  { id: 'd4', type: 'emoji', content: '💖', x: 91, y: 30, size: 1.6 },
  { id: 'd5', type: 'emoji', content: '✨', x: 10, y: 52, size: 1.4 },
  { id: 'd6', type: 'emoji', content: '🌟', x: 90, y: 54, size: 1.6 },
  { id: 'd7', type: 'emoji', content: '👾', x: 12, y: 78, size: 1.7 },
  {
    id: 'd8',
    type: 'emoji',
    content: '🦋',
    x: 88,
    y: 80,
    size: 1.6,
    rotation: 15
  },
  {
    id: 'd9',
    type: 'text',
    content: '★ BFFs ★',
    x: 50,
    y: 96,
    size: 1.8,
    color: '#d63447'
  }],

  aspectRatio: 0.3,
  slotAspectRatio: 1.3
},
{
  id: 'bows-3',
  name: 'Coquette Bows',
  description: 'Ribbons, swans & lace',
  slots: 3,
  slotShape: 'arch',
  theme: 'cute-bows',
  defaultBgColor: '#f6ecd9',
  frameColor: '#e8b4b8',
  decorations: [
  { id: 'd1', type: 'emoji', content: '🎀', x: 50, y: 4, size: 2.8 },
  { id: 'd2', type: 'emoji', content: '🩰', x: 12, y: 22, size: 1.7 },
  { id: 'd3', type: 'emoji', content: '🦢', x: 88, y: 22, size: 1.7 },
  { id: 'd4', type: 'emoji', content: '🌷', x: 9, y: 50, size: 1.6 },
  {
    id: 'd5',
    type: 'emoji',
    content: '🎀',
    x: 91,
    y: 50,
    size: 1.5,
    rotation: -12
  },
  { id: 'd6', type: 'emoji', content: '🤍', x: 12, y: 78, size: 1.5 },
  { id: 'd7', type: 'emoji', content: '✨', x: 88, y: 78, size: 1.4 },
  {
    id: 'd8',
    type: 'text',
    content: 'mon chéri',
    x: 50,
    y: 96,
    size: 1.6,
    color: '#c97b86'
  }],

  aspectRatio: 0.35,
  slotAspectRatio: 1.0
}];