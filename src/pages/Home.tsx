import React from 'react'
import { Link } from 'react-router-dom'
import { Camera, Sparkles, Heart, Image, Edit3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

export function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cream via-dusty-pink/20 to-baby-blue/20 flex flex-col">
      {/* Header - Tombol navigasi sudah dihapus bersih */}
      <header className="w-full bg-dark-brown text-cream py-4 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="brand-text text-3xl md:text-4xl flex items-center gap-2">
            <Camera className="w-8 h-8" />
            LensaLoka
            <Sparkles className="w-6 h-6 text-butter-yellow" />
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <h2 className="brand-text text-5xl md:text-7xl text-dark-brown mb-4">
            Welcome to LensaLoka! 📸
          </h2>
          <p className="text-xl md:text-2xl text-medium-brown mb-8 max-w-3xl mx-auto">
            Create cute, decorative photo strips with fun filters, stickers, and
            Y2K vibes!
          </p>

          {/* Wrapper Tombol Aksi Utama */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to={isAuthenticated ? '/create' : '/register'}>
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="px-8 py-4 bg-cherry-red text-cream rounded-full text-xl font-bold shadow-lg"
              >
                {isAuthenticated ? 'Start Creating ✨' : 'Get Started 🎉'}
              </motion.button>
            </Link>

            {/* Tombol Gallery dipindah ke sini (hanya muncul saat user sudah login) */}
            {isAuthenticated && (
              <Link to="/gallery">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="px-8 py-4 bg-sage-green text-dark-brown rounded-full text-xl font-bold shadow-lg flex items-center gap-2 border-4 border-dark-brown"
                >
                  <Image className="w-5 h-5" />
                  Buka Gallery
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-dark-brown"
        >
          <h3 className="brand-text text-4xl text-dark-brown mb-6 flex items-center gap-3">
            <Heart className="w-10 h-10 text-cherry-red" />
            About LensaLoka
          </h3>
          <p className="text-lg text-medium-brown leading-relaxed mb-4">
            LensaLoka adalah aplikasi photobooth online yang memungkinkan kamu
            membuat photo strips lucu dan dekoratif dengan berbagai template
            aesthetic, filter, dan sticker!
          </p>
          <p className="text-lg text-medium-brown leading-relaxed">
            Simpan semua kreasi kamu di galeri pribadi, edit kapan saja, dan
            bagikan dengan teman-teman! Perfect untuk kenangan manis dan momen
            spesial. 💕
          </p>
        </motion.div>
      </section>

      {/* How to Use Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 mb-16">
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          className="bg-gradient-to-br from-butter-yellow/30 to-dusty-pink/30 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-medium-brown"
        >
          <h3 className="brand-text text-4xl text-dark-brown mb-8 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-cherry-red" />
            Cara Penggunaan
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{
                scale: 1.02,
              }}
              className="bg-white/90 rounded-2xl p-6 border-3 border-dark-brown shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cherry-red text-cream rounded-full flex items-center justify-center brand-text text-2xl flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="brand-text text-xl text-dark-brown mb-2">
                    Register & Login
                  </h4>
                  <p className="text-medium-brown">
                    Buat akun terlebih dahulu untuk menyimpan semua foto kamu.
                    Tanpa akun, kamu tidak bisa mengakses fitur photobooth!
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.02,
              }}
              className="bg-white/90 rounded-2xl p-6 border-3 border-dark-brown shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-butter-yellow text-dark-brown rounded-full flex items-center justify-center brand-text text-2xl flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="brand-text text-xl text-dark-brown mb-2">
                    Pilih Template
                  </h4>
                  <p className="text-medium-brown">
                    Pilih dari berbagai template lucu dan dekoratif! Ada yang
                    bertema strawberry, camera, hearts, dan banyak lagi. Kamu
                    bisa kembali dan ganti template kapan saja.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.02,
              }}
              className="bg-white/90 rounded-2xl p-6 border-3 border-dark-brown shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sage-green text-dark-brown rounded-full flex items-center justify-center brand-text text-2xl flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="brand-text text-xl text-dark-brown mb-2 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Foto atau Upload
                  </h4>
                  <p className="text-medium-brown">
                    Ambil foto langsung dengan kamera (dengan timer 3 detik!)
                    atau upload foto yang sudah ada. Pilih filter untuk foto
                    kamu (hitam putih, sepia, dll).
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.02,
              }}
              className="bg-white/90 rounded-2xl p-6 border-3 border-dark-brown shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-baby-blue text-dark-brown rounded-full flex items-center justify-center brand-text text-2xl flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="brand-text text-xl text-dark-brown mb-2 flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Hias & Simpan
                  </h4>
                  <p className="text-medium-brown">
                    Tambahkan text dan emoticon lucu ke foto kamu! Setelah
                    selesai, simpan ke galeri. Kamu bisa edit atau hapus foto
                    kapan saja di galeri.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.02,
              }}
              className="bg-white/90 rounded-2xl p-6 border-3 border-dark-brown shadow-lg md:col-span-2"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-dusty-pink text-dark-brown rounded-full flex items-center justify-center brand-text text-2xl flex-shrink-0">
                  5
                </div>
                <div>
                  <h4 className="brand-text text-xl text-dark-brown mb-2 flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Lihat di Galeri
                  </h4>
                  <p className="text-medium-brown">
                    Semua foto kamu tersimpan di galeri pribadi! Kamu bisa
                    melihat, mengedit (ganti foto atau template), atau menghapus
                    foto kapan saja.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-dark-brown text-cream py-6 px-6 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="brand-text text-lg">
            Made with <Heart className="inline w-5 h-5 text-cherry-red" /> by
            LensaLoka Team
          </p>
          <p className="text-sm mt-2 opacity-80">
            © 2024 LensaLoka. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
