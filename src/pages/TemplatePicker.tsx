import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, ArrowRight, ArrowLeft } from 'lucide-react';
import { templates } from '../data/templates';
import { TemplatePreview } from '../components/TemplatePreview';
export function TemplatePicker() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleContinue = () => {
    if (selectedId) {
      navigate(`/capture/${selectedId}`);
    }
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cream via-sage-green/20 to-dusty-pink/20 p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <motion.button
              whileHover={{
                scale: 1.05
              }}
              whileTap={{
                scale: 0.95
              }}
              className="flex items-center gap-2 text-dark-brown font-bold bg-white/50 px-4 py-2 rounded-full">
              
              <ArrowLeft className="w-5 h-5" />
              Back Home
            </motion.button>
          </Link>
          <h1 className="brand-text text-3xl text-dark-brown flex items-center gap-2">
            <Camera className="w-8 h-8 text-cherry-red" />
            Pilih Template
          </h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        <div className="text-center mb-12">
          <p className="text-xl text-medium-brown">
            Pilih template lucu untuk photo strip kamu! ✨
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 max-w-5xl mx-auto">
          {templates.map((template) =>
          <motion.div
            key={template.id}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="flex justify-center">
            
              <div className="w-full max-w-[200px]">
                <TemplatePreview
                template={template}
                selected={selectedId === template.id}
                onClick={() => setSelectedId(template.id)} />
              
              </div>
            </motion.div>
          )}
        </div>

        {/* Floating Action Bar */}
        <motion.div
          initial={{
            y: 100
          }}
          animate={{
            y: selectedId ? 0 : 100
          }}
          className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t-4 border-dark-brown shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50">
          
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="text-dark-brown">
              <span className="font-bold text-lg">Template terpilih: </span>
              <span className="brand-text text-xl text-cherry-red">
                {templates.find((t) => t.id === selectedId)?.name}
              </span>
            </div>
            <motion.button
              whileHover={{
                scale: 1.05
              }}
              whileTap={{
                scale: 0.95
              }}
              onClick={handleContinue}
              className="px-8 py-3 bg-cherry-red text-cream rounded-full font-bold text-lg shadow-lg flex items-center gap-2">
              
              Lanjut Foto
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>);

}