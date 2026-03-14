import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const audio = new Audio("/audio/ambient-bg.mp3");
    audio.loop = true;
    audio.volume = 0.15;
    audioRef.current = audio;

    const tryPlay = () => {
      if (!userInteracted) {
        setUserInteracted(true);
        audio.play().then(() => setPlaying(true)).catch(() => {});
      }
    };

    // Autoplay on first user interaction (browser policy requires gesture)
    document.addEventListener("click", tryPlay, { once: true });
    document.addEventListener("scroll", tryPlay, { once: true });
    document.addEventListener("keydown", tryPlay, { once: true });

    return () => {
      audio.pause();
      audio.src = "";
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("scroll", tryPlay);
      document.removeEventListener("keydown", tryPlay);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 right-4 z-50 rounded-full border border-border bg-card/80 backdrop-blur-sm p-3 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all shadow-lg"
      aria-label={playing ? "Silenciar música" : "Reproducir música"}
      title={playing ? "Silenciar" : "Reproducir música de fondo"}
    >
      {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
};

export default BackgroundMusic;
