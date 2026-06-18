import { Template, Decoration } from '../data/templates';

export const FILTERS = [
{ id: 'normal', name: 'Normal', css: 'none' },
{ id: 'bw', name: 'B & W', css: 'grayscale(100%)' },
{ id: 'sepia', name: 'Vintage', css: 'sepia(80%)' },
{
  id: 'warm',
  name: 'Warm',
  css: 'sepia(30%) saturate(140%) hue-rotate(-10deg)'
},
{
  id: 'cool',
  name: 'Cool',
  css: 'saturate(120%) hue-rotate(10deg) contrast(110%)'
}];


export const BG_COLORS = [
'#f6ecd9', // cream
'#ffd966', // butter yellow
'#e8b4b8', // dusty pink
'#b8c5a0', // sage green
'#a8d8ea', // baby blue
'#ffffff', // white
'#3b2a1e', // dark brown
'#000000' // black
];

// Helper to load an image from a data URL
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Draw a rounded rectangle or specific shape path
const drawShapePath = (
ctx: CanvasRenderingContextCurrent,
shape: string,
x: number,
y: number,
w: number,
h: number) =>
{
  ctx.beginPath();
  if (shape === 'oval') {
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
  } else if (shape === 'arch') {
    const radius = w / 2;
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + radius);
    ctx.arc(x + radius, y + radius, radius, Math.PI, 0);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  } else if (shape === 'cloud') {
    // Simplified rounded rect for cloud/wavy
    const r = 20;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
  } else {
    // Rect
    ctx.rect(x, y, w, h);
  }
};

export const generateFinalStrip = async (
template: Template,
photos: string[],
bgColor: string,
userDecorations: Decoration[])
: Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No canvas context');

  // Base dimensions
  const width = 800;
  const height = width / template.aspectRatio;
  canvas.width = width;
  canvas.height = height;

  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw gingham pattern if theme is gingham
  if (template.theme === 'gingham') {
    ctx.fillStyle = 'rgba(214, 52, 71, 0.1)';
    for (let i = -height; i < width + height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i - height, height);
      ctx.lineTo(i - height + 20, height);
      ctx.lineTo(i + 20, 0);
      ctx.fill();
    }
  }

  // Calculate slot dimensions
  const slotWidth = width * 0.8;
  const slotHeight = slotWidth / template.slotAspectRatio;
  const totalSlotsHeight = slotHeight * template.slots;
  const gap = (height * 0.8 - totalSlotsHeight) / (template.slots - 1 || 1);
  const startY = height * 0.1;

  // Draw photos and frames
  for (let i = 0; i < template.slots; i++) {
    const x = (width - slotWidth) / 2;
    const y = startY + i * (slotHeight + gap);

    // Draw frame background (white)
    ctx.fillStyle = '#ffffff';
    drawShapePath(ctx as any, template.slotShape, x, y, slotWidth, slotHeight);
    ctx.fill();

    // Draw photo if exists
    if (photos[i]) {
      try {
        const img = await loadImage(photos[i]);
        ctx.save();
        drawShapePath(
          ctx as any,
          template.slotShape,
          x,
          y,
          slotWidth,
          slotHeight
        );
        ctx.clip();

        // Cover object-fit
        const imgAspect = img.width / img.height;
        let drawW = slotWidth;
        let drawH = slotWidth / imgAspect;
        if (drawH < slotHeight) {
          drawH = slotHeight;
          drawW = slotHeight * imgAspect;
        }
        const drawX = x + (slotWidth - drawW) / 2;
        const drawY = y + (slotHeight - drawH) / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      } catch (e) {
        console.error('Failed to load photo', e);
      }
    }

    // Draw frame border
    ctx.strokeStyle = template.frameColor;
    ctx.lineWidth = 8;
    drawShapePath(ctx as any, template.slotShape, x, y, slotWidth, slotHeight);
    ctx.stroke();
  }

  // Draw decorations (template + user)
  const allDecs = [...template.decorations, ...userDecorations];

  // Sort so text is usually on top
  allDecs.sort((a, b) => a.type === 'text' ? 1 : -1);

  for (const dec of allDecs) {
    ctx.save();
    const x = dec.x / 100 * width;
    const y = dec.y / 100 * height;

    ctx.translate(x, y);
    if (dec.rotation) {
      ctx.rotate(dec.rotation * Math.PI / 180);
    }

    if (dec.type === 'text') {
      ctx.font = `bold ${dec.size * 24}px "Fredoka", cursive`;
      ctx.fillStyle = dec.color || template.frameColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dec.content, 0, 0);
    } else {
      // Emoji
      ctx.font = `${dec.size * 32}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dec.content, 0, 0);
    }

    ctx.restore();
  }

  return canvas.toDataURL('image/jpeg', 0.9);
};