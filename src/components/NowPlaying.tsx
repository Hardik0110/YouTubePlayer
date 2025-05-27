import React, { useImperativeHandle, forwardRef, Ref, useRef } from 'react';
import YouTube, { YouTubePlayer, YouTubeEvent } from 'react-youtube';
import { VideoPlayerRef, NowPlayingProps } from '../types';

const NowPlaying = forwardRef(
  ({ currentVideo, onPlayerReady }: NowPlayingProps, ref: Ref<VideoPlayerRef>) => {
    const playerRef = useRef<YouTubePlayer | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    useImperativeHandle(ref, () => ({
      get player() {
        return playerRef.current;
      },
      isPlaying() {
        return playerRef.current?.getPlayerState() === 1;
      },
      togglePlay() {
        const player = playerRef.current;
        if (!player) return;
        
        if (player.getPlayerState() === 1) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
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
      getIframe() {
        return iframeRef.current;
      }
    }));

    const handleReady = (event: YouTubeEvent) => {
      playerRef.current = event.target;
      iframeRef.current = event.target.getIframe();
      onPlayerReady(event);
    };

    // const handleStateChange = (event: YouTubeEvent) => {
    //   onPlayerStateChange(event);
    // };

    if (!currentVideo) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-white bg-opacity-50 rounded-lg shadow-retro m-4">
          <div className="loader mb-3" />
          <p className="font-press-start text-sm text-textColor text-center">
            No track selected
          </p>
          <p className="font-vt323 text-textColor text-center mt-2">
            Pick a song from the list to start playing
          </p>
        </div>
      );
    }

    return (
      <div className="p-4 h-full flex flex-col">
        <h2 className="font-press-start text-lg text-primary mb-4">
          Now Playing
        </h2>
        <div className="flex-grow relative w-full border-4 border-primary shadow-retro-lg rounded-lg overflow-hidden">
          <YouTube
            videoId={currentVideo.id}
            className="absolute top-0 left-0 w-full h-full"
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                controls: 0,
                modestbranding: 1,
                enablejsapi: 1
              }
            }}
            onReady={handleReady}
            // onStateChange={handleStateChange}
          />
        </div>
        <div className="mt-4 text-center">
          <h3 className="font-vt323 text-2xl text-accent font-bold">
            {currentVideo.title}
          </h3>
          <p className="font-vt323 text-lg text-red-700">
            {currentVideo.channelTitle}
          </p>
        </div>
      </div>
    );
  }
) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<NowPlayingProps> & React.RefAttributes<VideoPlayerRef>
>;

export default NowPlaying;