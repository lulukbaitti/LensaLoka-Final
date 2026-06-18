import React from 'react';
import { Template } from '../data/templates';
interface TemplatePreviewProps {
  template: Template;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}
export function TemplatePreview({
  template,
  className = '',
  onClick,
  selected
}: TemplatePreviewProps) {
  // Generate slots
  const slots = Array.from({
    length: template.slots
  }).map((_, i) => i);
  const getSlotStyle = () => {
    const baseStyle = {
      backgroundColor: '#ffffff',
      border: `3px solid ${template.frameColor}`,
      aspectRatio: template.slotAspectRatio.toString(),
      width: '80%',
      margin: '0 auto',
      position: 'relative' as const,
      zIndex: 10
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
      // Simplified cloud for preview
      case 'wavy':
        return {
          ...baseStyle,
          borderRadius: '10px'
        };
      // Simplified wavy for preview
      default:
        return baseStyle;
    }
  };
  return (
    <div
      className={`relative cursor-pointer transition-transform hover:scale-105 ${selected ? 'ring-4 ring-cherry-red ring-offset-4 rounded-xl' : ''} ${className}`}
      onClick={onClick}
      style={{
        aspectRatio: template.aspectRatio.toString()
      }}>
      
      <div
        className="w-full h-full rounded-xl overflow-hidden relative shadow-lg"
        style={{
          backgroundColor: template.defaultBgColor,
          backgroundImage:
          template.theme === 'gingham' ?
          'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(214, 52, 71, 0.1) 10px, rgba(214, 52, 71, 0.1) 20px)' :
          'none'
        }}>
        
        {/* Slots Container */}
        <div className="absolute inset-0 flex flex-col justify-center gap-4 py-8">
          {slots.map((slot) =>
          <div
            key={slot}
            style={getSlotStyle()}
            className="shadow-inner bg-gray-100/50" />

          )}
        </div>

        {/* Decorations */}
        {template.decorations.map((dec) =>
        <div
          key={dec.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          style={{
            left: `${dec.x}%`,
            top: `${dec.y}%`,
            fontSize: `${dec.size}rem`,
            rotate: `${dec.rotation || 0}deg`,
            color: dec.color,
            fontFamily:
            dec.type === 'text' ? '"Fredoka", cursive' : 'inherit',
            fontWeight: 'bold'
          }}>
          
            {dec.content}
          </div>
        )}
      </div>

      {/* Label */}
      <div className="absolute -bottom-8 left-0 right-0 text-center">
        <p className="brand-text text-dark-brown font-bold">{template.name}</p>
        <p className="text-xs text-medium-brown">{template.slots} photos</p>
      </div>
    </div>);

}