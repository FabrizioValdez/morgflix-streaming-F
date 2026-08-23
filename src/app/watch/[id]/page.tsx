"use client";

import { use, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Tv } from "lucide-react";

interface MovieData {
  id: number | string;
  title: string;
  streamUrl: string;
}

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const [movie, setMovie] = useState<MovieData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // 1. Obtener la URL desde Laravel
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setHasError(false);

    const cargarVideo = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${apiUrl}/movies/${id}/stream-url`);
        if (!res.ok) throw new Error("No se pudo obtener la URL del servidor");

        const data = await res.json();
        if (!isMounted) return;

        const movieData: MovieData = {
          id: data.movie?.id || id,
          title: data.movie?.title || "Película",
          streamUrl: data.streamUrl,
        };

        setMovie(movieData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    cargarVideo();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // 2. Controlar la reproducción de HLS o MP4 cuando cambia 'movie'
  useEffect(() => {
    const video = videoRef.current;
    if (!movie?.streamUrl || !video) return;

    let hlsInstance: any = null;

    const inicializarVideo = async () => {
      video.muted = false;
      setIsMuted(false);

      // Si es un manifiesto de transmisión adaptativa HLS (.m3u8)
      if (movie.streamUrl.includes(".m3u8")) {
        const Hls = (await import("hls.js")).default;
        if (Hls.isSupported()) {
          hlsInstance = new Hls({ enableWorker: true });
          hlsInstance.loadSource(movie.streamUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            ejecutarPlay(video);
          });
          hlsInstance.on(Hls.Events.ERROR, () => setHasError(true));
        }
      } else {
        // Para MP4: Recargamos los elementos <source> hijos
        video.load();
        ejecutarPlay(video);
      }
    };

    inicializarVideo();

    return () => {
      if (hlsInstance) hlsInstance.destroy();
    };
  }, [movie]);

  const ejecutarPlay = (video: HTMLVideoElement) => {
    playPromiseRef.current = video.play();
    if (playPromiseRef.current !== undefined) {
      playPromiseRef.current
        .then(() => setIsPlaying(true))
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.warn("Autoplay prevenido por el navegador:", err);
          }
          setIsPlaying(false);
        });
    }
  };

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (playPromiseRef.current !== null) {
      await playPromiseRef.current.catch(() => {});
    }

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      ejecutarPlay(video);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nuevoMute = !isMuted;
    videoRef.current.muted = nuevoMute;
    setIsMuted(nuevoMute);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    if (total > 0) setProgress((current / total) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const toggleFullScreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const handleCast = () => {
    if (!movie?.streamUrl) return;
    const videoUrl = encodeURIComponent(movie.streamUrl);
    const videoTitle = encodeURIComponent(movie.title);
    window.location.href = `wvc-x-callback://open?url=${videoUrl}&title=${videoTitle}`;
  };

  return (
    <div className="relative w-screen h-screen bg-[#0E0B0A] overflow-hidden flex items-center justify-center font-sans">
      <Link
        href="/"
        className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-black/40 text-[#F5EFE6] border border-white/10 hover:bg-black/60 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Volver</span>
      </Link>

      {hasError ? (
        <div className="text-center text-red-400 p-4 z-10">
          <p className="font-semibold">Error al cargar o reproducir el archivo multimedia.</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          playsInline
          crossOrigin="anonymous"
          preload="auto"
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setHasError(true)}
        >
          {/* La etiqueta <source> dentro del DOM asegura que el navegador acepte el archivo MP4 */}
          {movie?.streamUrl && !movie.streamUrl.includes(".m3u8") && (
            <source src={movie.streamUrl} type="video/mp4" />
          )}
        </video>
      )}

      {!isPlaying && !hasError && !isLoading && (
        <button
          onClick={togglePlay}
          className="absolute z-10 p-5 rounded-full bg-black/60 text-white hover:scale-110 transition-transform backdrop-blur-sm"
        >
          <Play size={40} fill="currentColor" />
        </button>
      )}

      {movie && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 z-20 flex flex-col gap-3">
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF6A3D]"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="text-[#F5EFE6] hover:text-[#FF6A3D] transition-colors">
                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
              </button>

              <button onClick={toggleMute} className="text-[#F5EFE6] hover:text-[#FF6A3D] transition-colors">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>

              <span className="text-xs text-[#B8AC9E] uppercase tracking-wider font-semibold">
                {movie.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCast}
                title="Transmitir a la TV con Web Video Caster"
                className="p-2 rounded-full bg-white/10 text-[#F5EFE6] hover:bg-[#FF6A3D] transition-colors flex items-center gap-2"
              >
                <Tv size={20} />
              </button>

              <button onClick={toggleFullScreen} className="text-[#F5EFE6] hover:text-[#FF6A3D] transition-colors">
                <Maximize size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}