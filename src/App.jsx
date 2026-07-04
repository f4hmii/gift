import { useState, useEffect, useMemo, useRef } from 'react'
import './App.css'

const AnimatedText = ({ text }) => {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span 
          key={i} 
          className="animated-word" 
          style={{ transitionDelay: `${i * 0.08}s` }}
        >
          {word}&nbsp;
        </span>
      ))}
    </>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [showNextPage, setShowNextPage] = useState(false)
  const [showVideoPage, setShowVideoPage] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const [fade, setFade] = useState(false)
  const [fadingOutLetter, setFadingOutLetter] = useState(false)

  // Generate partikel acak untuk efek bintang/cahaya
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
      size: `${Math.random() * 5 + 2}px`
    }))
  }, [])

  const audioRef = useRef(null)

  useEffect(() => {
    // Mulai animasi fade out setelah 4.5 detik
    const fadeTimer = setTimeout(() => {
      setFade(true)
    }, 4500)

    // Hapus splash screen sepenuhnya setelah 5.5 detik
    const removeTimer = setTimeout(() => {
      setShowSplash(false)
    }, 5500)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  useEffect(() => {
    if (showNextPage && !showVideoPage) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      }, {
        threshold: 0.1
      });

      setTimeout(() => {
        const hiddenElements = document.querySelectorAll('.scroll-anim, .scroll-anim-left, .scroll-anim-parent');
        hiddenElements.forEach((el) => observer.observe(el));
      }, 100);

      return () => observer.disconnect();
    }
  }, [showNextPage, showVideoPage]);

  useEffect(() => {
    // Attempt to play on mount
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        // Autoplay is usually blocked by browsers without user interaction.
        // We wait for the first click/touch to play the music.
        const playMusic = () => {
          audioRef.current?.play()
          document.removeEventListener('click', playMusic)
          document.removeEventListener('touchstart', playMusic)
        }
        document.addEventListener('click', playMusic)
        document.addEventListener('touchstart', playMusic)
      })
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (showVideoPage) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e))
      }
    }
  }, [showVideoPage])

  const handleNextPageClick = () => {
    setFadingOutLetter(true)
    setTimeout(() => {
      setShowNextPage(true)
      setFadingOutLetter(false)
    }, 1000)
  }

  return (
    <>
      <audio ref={audioRef} src="/music/Hindia - everything u are.mp3" loop autoPlay />
      
      {showVideoPage ? (
        <div className="video-page-container">
          <button className="back-btn video-back-btn" onClick={() => {
            setShowVideoPage(false)
            setVideoEnded(false)
          }}>
            &larr; Kembali
          </button>
          <video 
            src="/ppppp.mp4" 
            controls 
            autoPlay 
            className={`full-video ${videoEnded ? 'blur-video' : ''}`}
            onEnded={() => setVideoEnded(true)}
            onPlay={() => setVideoEnded(false)}
          >
            Browser Anda tidak mendukung pemutaran video.
          </video>
          {videoEnded && (
            <div className="video-end-overlay">
              <h1 className="love-you-more-text">Love U More</h1>
            </div>
          )}
        </div>
      ) : showSplash ? (
        <div className={`splash-container ${fade ? 'fade-out' : ''}`}>
          <div className="particles">
            {particles.map((p, i) => (
              <div 
                key={i} 
                className="particle" 
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  animationDuration: p.animationDuration,
                  animationDelay: p.animationDelay
                }}
              ></div>
            ))}
          </div>
          <div className="splash-content">
            <h1 className="splash-text">
              Selamat bertambah usia <br /> <span className="highlight">MY LOVE</span>
            </h1>
            <p className="splash-date">05 Juli 2006 - 05 Juli 2026</p>
            <p className="sub-text">Semoga semua harapan dan mimpimu terwujud ✨</p>
            <div className="hearts-container">
              <div className="heart"></div>
              <div className="heart"></div>
              <div className="heart"></div>
            </div>
          </div>
        </div>
      ) : showNextPage ? (
        <div className="main-container scrollable">
          <div className="particles">
            {particles.map((p, i) => (
              <div 
                key={i} 
                className="particle" 
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  animationDuration: p.animationDuration,
                  animationDelay: p.animationDelay
                }}
              ></div>
            ))}
          </div>
          <div className="letter-container">
            <div className="letter-wrapper">
              <img src="/hal2.png" alt="Halaman 2" className="letter-image" />
            </div>
          </div>
          <div className="photo-dump-container">
            <h2 className="photo-dump-title scroll-anim">Photo Dump</h2>
            <div className="polaroid-grid scroll-anim">
              <div className="polaroid">
                <img src="/WhatsApp Image 2026-07-01 at 03.38.44.jpeg" alt="Foto 1" />
              </div>
              <div className="polaroid">
                <img src="/WhatsApp Image 2026-07-01 at 03.50.03.jpeg" alt="Foto 2" />
              </div>
              <div className="polaroid">
                <img src="/WhatsApp Image 2026-07-01 at 03.50.45.jpeg" alt="Foto 3" />
              </div>
              <div className="polaroid">
                <img src="/WhatsApp Image 2026-07-01 at 03.51.20.jpeg" alt="Foto 4" />
              </div>
            </div>
            <div className="storybook-container scroll-anim">
              <img src="/ucul.png" alt="Foto Ucul" className="storybook-image" />
              <div className="closing-message scroll-anim">
                <p>
                  Semoga tuhan selalu berkenan mengabulkan inginmu, aku hanya bisa mengurai doa-doa pada sang pencipta agar semua tentangmu selalu baik-baik saja. Apa yang menyangkut tentangmu bagiku suatu anugrah yang patut kusyukuri keberadaannya
                </p>
                <br />
                <p>
                  Disini aku mengaminkan doa-doa baik yang kau langitkan semoga segala permintaanmu dikabulkan oleh yang maha pemberi
                </p>
              </div>
            </div>
            <div className="video-container scroll-anim">
              <video 
                src="/WhatsApp Video 2026-07-01 at 03.37.51.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="birthday-video"
              >
                Browser Anda tidak mendukung pemutaran video.
              </video>
            </div>
            <div className="final-message">
              <p className="scroll-anim-parent"><AnimatedText text="Mungkin untuk saat ini kita tak bisa merayakan hari spesialmu bersama, aku harap pada tahun-tahun berikutnya ada kesempatan untuk merayakan bersama secara langsung." /></p>
              <br />
              <p className="scroll-anim-parent"><AnimatedText text="Terima Kasih sudah lahir kedunia." /></p>
              <p className="scroll-anim-parent"><AnimatedText text="Terima Kasih, semesta melahirkan sosok yang begitu indah untuk dicintai." /></p>
            </div>
            <div className="polaroid-wide scroll-anim">
              <img src="/WhatsApp Image 2026-07-01 at 03.48.32.jpeg" alt="Foto Terakhir" />
              <p className="polaroid-caption">
                pertanyaan mematikan: Jelek ngga? <br />
                Mau Bagaimanapun bentuk mu,, DI mataku kau tetap yang terbaik dan tercantik.
              </p>
            </div>
            
            <div className="scattered-gallery">
              <div className="scattered-polaroid scroll-anim"><img src="/TIA/869423_1774366778826.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/tia2/WhatsApp Image 2026-07-01 at 04.04.13.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/WhatsApp Image 2026-07-01 at 03.51.20.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/tia2/as.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/TIA/photo-1.jpg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/WhatsApp Image 2026-07-01 at 03.38.44.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/TIA/WhatsApp Image 2026-03-28 at 21.43.57.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/tia2/w.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/WhatsApp Image 2026-07-01 at 03.50.03.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/TIA/WhatsApp Image 2026-03-28 at 21.44.26.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/TIA/WhatsApp Image 2026-03-28 at 21.43.57 (1).jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/TIA/869423_1774366780395.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/tia2/WhatsApp Image 2026-07-01 at 04.04.13s.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/tia2/k.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/WhatsApp Image 2026-07-01 at 03.50.45.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/TIA/photo-3.jpg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/tia2/l.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/WhatsApp Image 2026-07-01 at 03.49.12.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/tia2/WhatsApp Image 2026-07-01 at 04.04.13sss.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/TIA/photo-2.jpg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/TIA/WhatsApp Image 2026-03-28 at 22.22.29.jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/TIA/WhatsApp Image 2026-03-28 at 21.43.57 (2).jpeg" alt="Memori Acak" /></div>
              <div className="scattered-polaroid scroll-anim"><img src="/WhatsApp Image 2026-07-01 at 03.38.13.jpeg" alt="Memori Acak" /></div>
            </div>
            
            <div className="movie-btn-container scroll-anim">
              <button className="movie-btn" onClick={() => setShowVideoPage(true)}>
                🎬 Watch Our Video
              </button>
            </div>

          </div>
        </div>
      ) : (
        <div className="main-container">
          <div className="particles">
            {particles.map((p, i) => (
              <div 
                key={i} 
                className="particle" 
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  animationDuration: p.animationDuration,
                  animationDelay: p.animationDelay
                }}
              ></div>
            ))}
          </div>
          <div className={`letter-container ${fadingOutLetter ? 'fade-out' : ''}`}>
            <div className="letter-wrapper">
              <img src="/suratt.png" alt="Surat untukmu" className="letter-image" />
              <button className="click-here-btn absolute-btn" onClick={handleNextPageClick}>Click Here</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
