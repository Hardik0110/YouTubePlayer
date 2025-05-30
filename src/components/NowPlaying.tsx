import { useImperativeHandle, forwardRef, useRef, useState } from 'react';
import YouTube, { YouTubePlayer, YouTubeEvent } from 'react-youtube';
import { VideoPlayerRef, NowPlayingProps } from '../types';
import usePlayerStore from '../stores/usePlayerStore';

const NowPlaying = forwardRef<VideoPlayerRef, NowPlayingProps>(
  ({ currentVideo, onPlayerReady }, ref) => {
    const playerRef = useRef<YouTubePlayer | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const { isVideoMode } = usePlayerStore();

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
      <div className="relative h-full" ref={containerRef}>
        {/* Player Section */}
        <div className="w-full h-full">
          {/* Video Mode */}
          {isVideoMode && (
            <div className="w-full h-full">
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
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center space-y-1 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="font-vt323 text-2xl text-white font-bold line-clamp-2">
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