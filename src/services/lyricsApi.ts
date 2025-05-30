import axios from 'axios';

const BASE_URL = 'https://api.lyrics.ovh/v1';

export interface LyricsResponse {
  lyrics: string;
  error?: string;
}

export async function getLyrics(artist: string, title: string): Promise<string> {
  try {
    const response = await axios.get<LyricsResponse>(`${BASE_URL}/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    return response.data.lyrics;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return 'Lyrics not found';
  }
}

// Helper function to extract artist and title from video title
export function extractArtistAndTitle(videoTitle: string): { artist: string; title: string } {
  // Common patterns in YouTube video titles
  const patterns = [
    // "Artist - Title"
    /^([^-]+)\s*-\s*(.+)$/,
    // "Artist: Title"
    /^([^:]+)\s*:\s*(.+)$/,
    // "Title (by Artist)"
    /^(.+?)\s*\(by\s+([^)]+)\)$/,
    // "Title - Artist"
    /^(.+?)\s*-\s*([^-]+)$/
  ];

  for (const pattern of patterns) {
    const match = videoTitle.match(pattern);
    if (match) {
      return {
        artist: match[1].trim(),
        title: match[2].trim()
      };
    }
  }

  return {
    artist: 'Unknown Artist',
    title: videoTitle
  };
} 