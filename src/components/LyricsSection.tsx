import React, { useEffect, useState, useRef } from 'react';
import { Music, Loader2 } from 'lucide-react';
import { VideoItem, CaptionSegment } from '../types';
import { getVideoCaption } from '../services/captionsAPI';
import usePlayerStore from '../stores/usePlayerStore';

interface LyricsSectionProps {
  currentVideo: VideoItem | null;
}

const LyricsSection: React.FC<LyricsSectionProps> = ({ currentVideo }) => {
  const [captions, setCaptions] = useState<CaptionSegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(-1);
  const { currentTime } = usePlayerStore();
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const currentLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentVideo) {
      setCaptions([]);
      return;
    }

    const fetchCaptions = async () => {
      setLoading(true);
      try {
        const captionData = await getVideoCaption(currentVideo.id);
        setCaptions(captionData);
      } catch (error) {
        console.error('Failed to fetch captions:', error);
        setCaptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCaptions();
  }, [currentVideo]);

  useEffect(() => {
    if (!currentVideo || captions.length === 0) {
      setCurrentCaptionIndex(-1);
      return;
    }

    // Calculate relative time from video start
    const relativeTime = currentTime - currentVideo.startTime;
    
    // Find current caption based on timing
    const index = captions.findIndex((caption, i) => {
      const captionStart = caption.start;
      const captionEnd = caption.start + caption.duration;
      return relativeTime >= captionStart && relativeTime < captionEnd;
    });

    setCurrentCaptionIndex(index);
  }, [currentTime, currentVideo, captions]);

  useEffect(() => {
    // Auto-scroll to current caption
    if (currentLineRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const currentLine = currentLineRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const lineRect = currentLine.getBoundingClientRect();
      
      if (lineRect.top < containerRect.top || lineRect.bottom > containerRect.bottom) {
        currentLine.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentCaptionIndex]);

  if (!currentVideo) {
    return (
      <div className="h-full flex flex-col">
        <h2 className="text-primary font-press-start text-lg p-4 border-b border-secondary/30">
          Lyrics
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Music className="w-12 h-12 text-primary mb-4" />
          <p className="text-center text-primary text-lg">No song selected</p>
          <p className="text-center text-primary text-md mt-3">
            Select a song to view lyrics
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <h2 className="text-primary font-press-start text-lg p-4 border-b border-secondary/30">
          Lyrics
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-center text-primary text-lg">Loading lyrics...</p>
        </div>
      </div>
    );
  }

  if (captions.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <h2 className="text-primary font-press-start text-lg p-4 border-b border-secondary/30">
          Lyrics
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Music className="w-12 h-12 text-primary mb-4" />
          <p className="text-center text-primary text-lg">No lyrics available</p>
          <p className="text-center text-primary text-md mt-3">
            Lyrics not found for this video
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-primary font-press-start text-lg p-4 border-b border-secondary/30">
        Lyrics
      </h2>
      
      <div 
        ref={lyricsContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-primary/20 p-4"
      >
        <div className="space-y-4">
          {captions.map((caption, index) => (
            <div
              key={index}
              ref={index === currentCaptionIndex ? currentLineRef : null}
              className={`transition-all duration-300 p-3 rounded-lg cursor-pointer ${
                index === currentCaptionIndex
                  ? 'bg-accent/20 text-accent font-bold transform scale-105 shadow-lg border-l-4 border-accent'
                  : index < currentCaptionIndex
                  ? 'text-primary/60'
                  : 'text-primary hover:bg-primary/10'
              }`}
              onClick={() => {
                // TODO: Implement seek to caption time
                // const targetTime = currentVideo.startTime + caption.start;
                // seekTo(targetTime);
              }}
            >
              <div className="font-vt323 text-lg leading-relaxed">
                {caption.text}
              </div>
              <div className="text-xs opacity-60 mt-1">
                {formatTime(caption.start)} - {formatTime(caption.start + caption.duration)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default LyricsSection;