import { useImperativeHandle, forwardRef,  useRef, useState } from 'react';
import YouTube, { YouTubePlayer, YouTubeEvent } from 'react-youtube';
import { VideoPlayerRef, NowPlayingProps } from '../types';
import { Monitor, Music2 } from 'lucide-react';
import usePlayerStore from '../stores/usePlayerStore';

const NowPlaying = forwardRef<VideoPlayerRef, NowPlayingProps>(
  ({ currentVideo, onPlayerReady }, ref) => {
    const playerRef = useRef<YouTubePlayer | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const { isVideoMode, setVideoMode } = usePlayerStore();

    // Player API methods
    useImperativeHandle(ref, () => ({
      get player() {
        return playerRef.current;
      },
      isPlaying() {
        return playerRef.current?.getPlayerState() === 1;
      },
      togglePlay() {
        const player = playerRef.current;
        if (!player || !isPlayerReady) return;
        
        return player.getPlayerState() === 1 
          ? player.pauseVideo() 
          : player.playVideo();
      },
      getCurrentTime() {
        return playerRef.current?.getCurrentTime() ?? 0;
      },
      getDuration() {
        return playerRef.current?.getDuration() ?? 0;
      },
      seekTo(seconds) {
        playerRef.current?.seekTo(seconds, true);
      },
      setVolume(vol) {
        playerRef.current?.setVolume(vol);
      },
      mute() {
        playerRef.current?.mute();
      },
      unMute() {
        playerRef.current?.unMute();
      },
      isMuted() {
        return playerRef.current?.isMuted() ?? false;
      },
      captureStream() {
        const video = containerRef.current?.querySelector('video');
        return (video as HTMLVideoElement & { captureStream(): MediaStream })?.captureStream() ?? null;
      }
    }), [isPlayerReady]);

    const handleReady = (event: YouTubeEvent) => {
      playerRef.current = event.target;
      setIsPlayerReady(true);
      onPlayerReady(event);
    };

    const toggleVideoMode = () => setVideoMode(!isVideoMode);

    // YouTube player options
    const youtubeOpts = {
      height: '100%',
      width: '100%',
      playerVars: {
        controls: 0,
        modestbranding: 1,
        enablejsapi: 1,
        origin: window.location.origin,
      }
    };

    return (
      <div className="p-4 h-full flex flex-col" ref={containerRef}>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-press-start text-lg text-primary">
            Now Playing
          </h2>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-white">Choose Mode Here - </span>
            <button
              onClick={toggleVideoMode}
              className={`
                p-2 rounded-full transition-all duration-200 hover:scale-105
                ${isVideoMode 
                  ? 'bg-accent text-white shadow-lg' 
                  : 'bg-white text-accent border-2 border-accent'
                }
              `}
              title={isVideoMode ? 'Switch to audio mode' : 'Switch to video mode'}
              aria-label={isVideoMode ? 'Switch to audio mode' : 'Switch to video mode'}
            > 
              {isVideoMode ? <Monitor size={20} /> : <Music2 size={20} />}
            </button>
          </div>
        </div>

        {/* Player Section */}
        <div className="flex-grow relative w-full border-4 border-primary shadow-retro-lg rounded-lg overflow-hidden bg-white">
          {/* Video Mode */}
          {isVideoMode && (
            <div className="absolute inset-0">
              <YouTube
                videoId={currentVideo?.id}
                className="w-full h-full"
                opts={youtubeOpts}
                onReady={handleReady}
              />
            </div>
          )}

          {/* Audio Mode */}
          {!isVideoMode && (
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
              {currentVideo && (
                <>
                  <div className="relative mb-6">
                    <img
                      src={currentVideo.thumbnailHigh || currentVideo.thumbnail}
                      alt={currentVideo.title}
                      className="w-full h-full object-cover rounded-lg shadow-retro"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                  </div>
                  
                  <div className="animate-pulse-slow">
                    <Music2 className="w-8 h-8 text-accent" />
                  </div>
                </>
              )}
              
              {/* Hidden YouTube player for audio playback */}
              <div className="absolute opacity-0 pointer-events-none">
                <YouTube
                  videoId={currentVideo?.id}
                  opts={{ ...youtubeOpts, height: '1', width: '1' }}
                  onReady={handleReady}
                />
              </div>
            </div>
          )}
        </div>

        {/* Track Info Section */}
        {currentVideo && (
          <div className="mt-4 text-center space-y-1">
            <h3 className="font-vt323 text-2xl text-accent font-bold line-clamp-2">
              {currentVideo.title}
            </h3>
            <p className="font-vt323 text-lg text-primary">
              {currentVideo.channelTitle}
            </p>
          </div>
        )}
      </div>
    );
  }
);

NowPlaying.displayName = 'NowPlaying';

export default NowPlaying;