import { YouTubePlayer, YouTubeEvent } from 'react-youtube';

/**
 * Core Video Types
 */
export interface VideoItem {
  id: string;                // Unique YouTube video ID
  title: string;             // Video title
  channelTitle: string;      // Name of the channel that published the video
  thumbnail: string;         // URL to the video thumbnail image
  thumbnailHigh: string;     // High quality thumbnail for audio mode
  duration: string;          // Formatted duration (e.g. "3:45")
  viewCount: string;         // Formatted view count (e.g. "1.5M views")
  startTime: number;         // Start time for playback in seconds
  endTime: number;           // End time for playback in seconds
}

/**
 * Player Related Types
 */
export interface PlayerState {
  isPlaying: boolean;        // Whether the video is currently playing
  currentTime: number;       // Current playback position in seconds
  duration: number;          // Total duration of the video in seconds
  volume: number;            // Player volume (0-100)
  isMuted: boolean;          // Whether audio is muted
  isVideoMode: boolean;      // Whether in video or audio mode
  showCaptions: boolean;     // Whether captions are shown
  currentVideo: VideoItem | null; // Currently playing video
  queue: VideoItem[];        // Playlist/queue of videos
}

export interface VideoPlayerRef {
  player: YouTubePlayer | null;
  isPlaying(): boolean;
  togglePlay(): void;
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(seconds: number): void;
  setVolume(volume: number): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  captureStream(): MediaStream | null;
}

export interface PlayerProps {
  currentVideo: VideoItem | null;
  onPrevVideo: () => void;
  onNextVideo: () => void;
  videoPlayerRef: React.RefObject<VideoPlayerRef>;
}

export interface NowPlayingProps {
  currentVideo: VideoItem | null;
  onPlayerReady(event: YouTubeEvent): void;
}

/**
 * YouTube API Response Types
 */
export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default?: YouTubeThumbnail;
    medium?: YouTubeThumbnail;
    high?: YouTubeThumbnail;
    standard?: YouTubeThumbnail;
    maxres?: YouTubeThumbnail;
  };
  channelTitle: string;
  tags?: string[];
  categoryId?: string;
}

export interface YouTubeSearchItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId?: string;
    channelId?: string;
    playlistId?: string;
  };
  snippet: VideoSnippet;
}

export interface VideoDetailItem {
  kind: string;
  etag: string;
  id: string;
  snippet: VideoSnippet;
  contentDetails: {
    duration: string;
    dimension: string;
    definition: string;
    licensedContent: boolean;
    projection: string;
  };
  statistics: {
    viewCount: string;
  };
}

export interface SearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeSearchItem[];
}

export interface VideoDetailResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  items: VideoDetailItem[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

/**
 * App State Types
 */
export interface AppState {
  videos: VideoItem[];
  queueVideos: VideoItem[];
  currentVideo: VideoItem | null;
  isLoading: boolean;
  searchTerm: string;
  error: string | null;
  activeCategory: string | null;
  lastVideoRef: ((node: HTMLDivElement | null) => void) | null;

  setVideos: (videos: VideoItem[]) => void;
  setQueueVideos: (queueVideos: VideoItem[]) => void;
  setCurrentVideo: (video: VideoItem | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSearchTerm: (searchTerm: string) => void;
  setError: (error: string | null) => void;
  setActiveCategory: (category: string | null) => void;
  setLastVideoRef: (ref: ((node: HTMLDivElement | null) => void) | null) => void;

  handleSearch: (query: string) => Promise<void>;
  handleCategorySelect: (category: string) => Promise<void>;

  selectVideo: (video: VideoItem) => void;
  addToQueue: (video: VideoItem) => void;
  removeFromQueue: (videoId: string) => void;
  playNextVideo: () => void;
  playPrevVideo: () => void;
}

export interface VideoLibraryProps {
  currentVideo: VideoItem | null;
  searchTerm: string;
  searchResults: VideoItem[];
  categoryVideos: VideoItem[];
  activeCategory: string | null;
  isLoading: boolean;
  onSelectVideo: (video: VideoItem) => void;
  onAddToQueue: (video: VideoItem) => void;
}