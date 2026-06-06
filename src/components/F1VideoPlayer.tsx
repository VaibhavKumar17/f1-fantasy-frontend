import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

type F1VideoPlayerProps = {
  videoUrl: string;
  start?: number;
  title?: string;
  className?: string;
};

export default function F1VideoPlayer({
  videoUrl,
  start = 0,
  title = "F1 Highlight",
  className = "absolute top-1/2 left-1/2 w-[115%] h-[115%] -translate-x-1/2 -translate-y-1/2 scale-105 border-0 opacity-80",
}: F1VideoPlayerProps) {
  // Check localStorage for mute preference. Default to true (muted) for compliance with browser autoplay rules.
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem("f1-fantasy-audio-unmuted") !== "true";
    } catch {
      return true;
    }
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isMp4 = videoUrl.endsWith(".mp4") || videoUrl.includes("/");

  // Sync volume state when iframe/video changes or isMuted changes
  useEffect(() => {
    if (isMp4) {
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
        if (videoRef.current.paused) {
          videoRef.current.play().catch(err => {
            console.warn("HTML5 autoplay blocked or failed:", err);
          });
        }
      }
    } else {
      const timer = setTimeout(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const command = isMuted ? "mute" : "unMute";
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: "command",
              func: command,
              args: [],
            }),
            "*"
          );
        }
      }, 800); // Small delay to let the iframe load first

      return () => clearTimeout(timer);
    }
  }, [isMuted, videoUrl, isMp4]);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (isMp4) {
      if (videoRef.current) {
        videoRef.current.muted = nextMuted;
      }
    } else {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const command = nextMuted ? "mute" : "unMute";
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: command,
            args: [],
          }),
          "*"
        );
      }
    }

    try {
      localStorage.setItem("f1-fantasy-audio-unmuted", nextMuted ? "false" : "true");
    } catch (err) {
      console.warn("Could not save mute preference:", err);
    }
  };

  // Embed URL for YouTube
  const embedUrl = `https://www.youtube.com/embed/${videoUrl}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoUrl}&start=${start}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden group/video select-none">
      {isMp4 ? (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover opacity-80 scale-100"
        />
      ) : (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title}
          className={`${className} pointer-events-none`}
          allow="autoplay; encrypted-media"
        />
      )}
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

      {/* Floating Audio Control Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 rounded-full bg-black/70 hover:bg-black/90 active:scale-95 px-3 py-1.5 border border-white/10 hover:border-white/20 transition-all backdrop-blur-md text-white shadow-lg pointer-events-auto cursor-pointer"
        title={isMuted ? "Click to unmute for sound" : "Click to mute"}
      >
        {isMuted ? (
          <>
            <VolumeX className="h-3.5 w-3.5 text-red-500 animate-pulse" />
            <span className="text-[0.65rem] font-bold uppercase tracking-wider font-mono">UNMUTE AUDIO</span>
          </>
        ) : (
          <>
            <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[0.65rem] font-bold uppercase tracking-wider font-mono text-emerald-400">UNMUTED</span>
          </>
        )}
      </button>

      {/* Status indicator when muted */}
      {isMuted && (
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded px-2 py-0.5 border border-white/10 flex items-center gap-1.5 z-10 pointer-events-none">
          <VolumeX className="h-3 w-3 text-red-500 animate-bounce" />
          <span className="text-[0.65rem] text-white/90 font-mono uppercase tracking-wider">Immersive Audio Muted</span>
        </div>
      )}
    </div>
  );
}
