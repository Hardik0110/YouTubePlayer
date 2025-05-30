import React, { useEffect, useState } from 'react';
import { Music, Loader2 } from 'lucide-react';
import { VideoItem } from '../types';
import { getLyrics, extractArtistAndTitle } from '../services/lyricsApi';

interface LyricsSectionProps {
  currentVideo: VideoItem | null;
}

const LyricsSection: React.FC<LyricsSectionProps> = ({ currentVideo }) => {
  const [lyrics, setLyrics] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentVideo) {
      setLyrics('');
      return;
    }

    const fetchLyrics = async () => {
      setLoading(true);
      try {
        const { artist, title } = extractArtistAndTitle(currentVideo.title);
        const lyricsText = await getLyrics(artist, title);
        // Clean up lyrics by removing special characters and empty lines
        const cleanedLyrics = lyricsText
          .replace(/[^\w\s\n]/g, '') // Remove special characters except newlines
          .split('\n')
          .filter(line => line.trim()) // Remove empty lines
          .join('\n');
        setLyrics(cleanedLyrics);
      } catch (error) {
        console.error('Failed to fetch lyrics:', error);
        setLyrics('Lyrics not available');
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [currentVideo]);

  if (!currentVideo) {
    return (
      <div className="flex items-center justify-center h-full text-primary/60">
        <Music className="w-8 h-8 mr-2" />
        <span>No video playing</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-primary/5 to-primary/10">
      <div className="flex items-center p-4 border-b border-primary/20">
        <Music className="w-5 h-5 mr-2 text-primary" />
        <h2 className="text-lg font-bold text-primary">Lyrics</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-primary/20 p-4">
        <div className="space-y-4">
          {lyrics.split('\n').map((line, index) => (
            <div
              key={index}
              className="p-3 rounded-lg text-primary/90 hover:bg-primary/10 transition-all duration-200"
            >
              <div className="font-vt323 text-lg leading-relaxed">
                {line}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LyricsSection;