import React from 'react';
import { Template, Decoration } from '../data/templates';
interface PhotoStripProps {
  template: Template;
  photos: string[];
  bgColor: string;
  userDecorations: Decoration[];
  className?: string;
}
export function PhotoStrip({
  template,
  photos,
  bgColor,
  userDecorations,
  className = ''
}: PhotoStripProps) {
  const slots = Array.from({
    length: template.slots
  }).map((_, i) => i);
  const getSlotStyle = () => {
    const baseStyle = {
      backgroundColor: '#ffffff',
      border: `4px solid ${template.frameColor}`,
      aspectRatio: template.slotAspectRatio.toString(),
      width: '80%',
      margin: '0 auto',
      position: 'relative' as const,
      zIndex: 10,
      overflow: 'hidden'
    };
    switch (template.slotShape) {
      case 'oval':
        return {
          ...baseStyle,
          borderRadius: '50%'
        };
      case 'arch':
        return {
          ...baseStyle,
          borderRadius: '50% 50% 0 0'
        };
      case 'cloud':
        return {
          ...baseStyle,
          borderRadius: '20px'
        };
      case 'wavy':
        return {
          ...baseStyle,
          borderRadius: '10px'
        };
      default:
        return baseStyle;
    }
  };
  const allDecorations = [...template.decorations, ...userDecorations];
  return (
    <div
      className={`relative shadow-2xl ${className}`}
      style={{
        aspectRatio: template.aspectRatio.toString()
      }}>
      
      <div
        className="w-full h-full overflow-hidden relative"
        style={{
          backgroundColor: bgColor,
          backgroundImage:
          template.theme === 'gingham' ?
          'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(214, 52, 71, 0.1) 10px, rgba(214, 52, 71, 0.1) 20px)' :
          'none'
        }}>
        
        {/* Slots */}
        <div className="absolute inset-0 flex flex-col justify-center gap-4 py-8">
          {slots.map((slot) =>
          <div
            key={slot}
            style={getSlotStyle()}
            className="shadow-inner bg-gray-100 flex items-center justify-center">
            
              {photos[slot] ?
            <img
              src={photos[slot]}
              alt={`Slot ${slot + 1}`}
              className="w-full h-full object-cover" /> :


            <span className="text-gray-400 font-bold text-2xl">
                  {slot + 1}
                </span>
            }
            </div>
          )}
        </div>

        {/* Decorations */}
        {allDecorations.map((dec) =>
        <div
          key={dec.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none whitespace-nowrap"
          style={{
            left: `${dec.x}%`,
            top: `${dec.y}%`,
            fontSize: `${dec.size}rem`,
            rotate: `${dec.rotation || 0}deg`,
            color: dec.color,
            fontFamily:
            dec.type === 'text' ? '"Fredoka", cursive' : 'inherit',
            fontWeight: 'bold',
            textShadow:
            dec.type === 'text' ?
            '2px 2px 0px rgba(255,255,255,0.8)' :
            'none'
          }}>
          
            {dec.content}
          </div>
        )}
      </div>
    </div>);

}