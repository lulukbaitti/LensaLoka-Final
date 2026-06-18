import React, { useEffect, useState, createElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Camera,
  ArrowLeft,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Download } from
'lucide-react';
import { useAuth } from '../contexts/AuthContext';
interface GalleryItem {
  id: string;
  date: string;
  image: string;
  templateId: string;
  photos: string[];
  bgColor: string;
  userDecorations: any[];
}
export function Gallery() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryItem[]>([]);
  useEffect(() => {
    if (user) {
      const gallery = JSON.parse(
        localStorage.getItem(`lensaloka_gallery_${user.id}`) || '[]'
      );
      setItems(gallery);
    }
  }, [user]);
  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus foto ini?')) {
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
      if (user) {
        localStorage.setItem(
          `lensaloka_gallery_${user.id}`,
          JSON.stringify(newItems)
        );
      }
    }
  };
  const handleDownload = (imageStr: string, id: string) => {
    const a = document.createElement('a');
    a.href = imageStr;
    a.download = `LensaLoka_${id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cream via-baby-blue/20 to-dusty-pink/20 p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 bg-white/80 backdrop-blur p-4 rounded-2xl shadow-sm border-2 border-medium-brown">
          <Link to="/">
            <motion.button
              whileHover={{
                scale: 1.05
              }}
              whileTap={{
                scale: 0.95
              }}
              className="flex items-center gap-2 text-dark-brown font-bold">
              
              <ArrowLeft className="w-5 h-5" />
              Home
            </motion.button>
          </Link>
          <h1 className="brand-text text-3xl text-dark-brown flex items-center gap-2">
            <ImageIcon className="w-8 h-8 text-cherry-red" />
            Galeri {user?.name}
          </h1>
          <button
            onClick={handleLogout}
            className="text-red-500 font-bold hover:underline">
            
            Logout
          </button>
        </div>

        {items.length === 0 ?
        <div className="text-center py-20 bg-white/50 rounded-3xl border-4 border-dashed border-medium-brown">
            <Camera className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="brand-text text-2xl text-dark-brown mb-2">
              Galeri Masih Kosong!
            </h2>
            <p className="text-medium-brown mb-6">
              Yuk buat photo strip pertamamu sekarang!
            </p>
            <Link to="/create">
              <button className="px-8 py-3 bg-cherry-red text-cream rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform">
                Buat Foto Baru ✨
              </button>
            </Link>
          </div> :

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((item, index) =>
          <motion.div
            key={item.id}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index * 0.1
            }}
            className="bg-white p-4 rounded-2xl shadow-xl border-4 border-dark-brown flex flex-col">
            
                <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden mb-4 relative group">
                  <img
                src={item.image}
                alt="Photostrip"
                className="w-full h-auto object-contain max-h-[400px]" />
              

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                  onClick={() => handleDownload(item.image, item.id)}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform text-dark-brown"
                  title="Download">
                  
                      <Download className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-auto">
                  <p className="text-sm text-medium-brown font-bold">
                    {new Date(item.date).toLocaleDateString('id-ID')}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/edit/${item.id}`}>
                      <button
                    className="p-2 bg-butter-yellow text-dark-brown rounded-lg hover:scale-110 transition-transform"
                    title="Edit">
                    
                        <Edit3 className="w-5 h-5" />
                      </button>
                    </Link>
                    <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-100 text-red-500 rounded-lg hover:scale-110 transition-transform"
                  title="Hapus">
                  
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
          )}
          </div>
        }

        {/* Floating Create Button */}
        {items.length > 0 &&
        <motion.div
          initial={{
            y: 100
          }}
          animate={{
            y: 0
          }}
          className="fixed bottom-8 right-8 z-50">
          
            <Link to="/create">
              <button className="w-16 h-16 bg-cherry-red text-cream rounded-full shadow-[0_8px_30px_rgba(214,52,71,0.4)] flex items-center justify-center hover:scale-110 transition-transform border-4 border-white">
                <Camera className="w-8 h-8" />
              </button>
            </Link>
          </motion.div>
        }
      </div>
    </div>);

}