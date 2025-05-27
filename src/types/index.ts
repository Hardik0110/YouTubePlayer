import { YouTubePlayer, YouTubeEvent } from 'react-youtube';

/**
 * Core Video Types
 */
export interface VideoItem {
  id: string;                // Unique YouTube video ID
  title: string;             // Video title
  channelTitle: string;      // Name of the channel that published the video
  thumbnail: string;         // URL to the video thumbnail image
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
  currentVideo: VideoItem | null; // Currently playing video
  queue: VideoItem[];        // Playlist/queue of videos
}

export interface VideoPlayerRef {
  player: YouTubePlayer | null; // Reference to the actual YouTube player
  isPlaying(): boolean;      // Check if video is currently playing
  togglePlay(): void;        // Toggle between play and pause
  getCurrentTime(): number;  // Get current playback position in seconds
  getDuration(): number;     // Get total video duration in seconds
  seekTo(seconds: number): void; // Jump to a specific time in the video
  setVolume(volume: number): void; // Set player volume (0-100)
  mute(): void;              // Mute audio
  unMute(): void;            // Unmute audio
  isMuted(): boolean;        // Check if audio is muted
  getIframe(): HTMLIFrameElement | null;
}

export interface PlayerProps {
  currentVideo: VideoItem | null;
  onPrevVideo: () => void;   // Handler for previous video
  onNextVideo: () => void;   // Handler for next video in queue
  videoPlayerRef: React.RefObject<VideoPlayerRef>;
}

export interface NowPlayingProps {
  currentVideo: VideoItem | null; // Currently playing video
  onPlayerReady(event: YouTubeEvent): void; // Called when player is ready
}

/**
 * YouTube API Response Types
 */
export interface SearchResponse {
  kind: string;              // Resource type identifier
  etag: string;              // ETag for caching purposes
  nextPageToken?: string;    // Token for fetching the next page of results
  prevPageToken?: string;    // Token for fetching the previous page of results
  regionCode?: string;       // Country code where the search was performed
  pageInfo: {
    totalResults: number;    // Total number of results that match the query
    resultsPerPage: number;  // Number of results included in the response
  };
  items: YouTubeSearchItem[]; // Array of search results
}

export interface VideoDetailResponse {
  nextPageToken?: string;
  kind: string;              // Resource type identifier
  etag: string;              // ETag for caching purposes
  items: VideoDetailItem[];  // Array of video details
  pageInfo: {
    totalResults: number;    // Total number of results
    resultsPerPage: number;  // Number of results included in the response
  };
}

/**
 * YouTube API Item Types
 */
export interface YouTubeSearchItem {
  kind: string;              // Resource type identifier
  etag: string;              // ETag for caching purposes
  id: {
    kind: string;            // Type of resource (video, channel, playlist)
    videoId?: string;        // ID if result is a video
    channelId?: string;      // ID if result is a channel
    playlistId?: string;     // ID if result is a playlist
  };
  snippet: VideoSnippet;
}

export interface VideoDetailItem {
  kind: string;              // Resource type identifier
  etag: string;              // ETag for caching purposes
  id: string;                // Unique video ID
  snippet: VideoSnippet;
  contentDetails: {
    duration: string;        // Video duration in ISO 8601 format (PT1H2M3S)
    dimension: string;       // Video dimension (2d, 3d)
    definition: string;      // Video quality (hd, sd)
    caption: string;         // Caption availability (has captions or not)
    licensedContent: boolean; // Whether the video has licensed content
    contentRating: boolean;  // Content rating information
  };
  statistics: {
    viewCount: string;       // Number of views
  };
}

/**
 * Common Types
 */
interface VideoSnippet {
  publishedAt: string;     // Publishing date and time
  channelId: string;       // ID of the channel that published the content
  title: string;           // Title of the content
  description: string;     // Description of the content
  thumbnails: {            // Various thumbnail sizes
    default?: Thumbnail;    // Small thumbnail
    medium?: Thumbnail;     // Medium thumbnail
    high?: Thumbnail;       // High quality thumbnail
    standard?: Thumbnail;  // Standard quality thumbnail (optional)
    maxres?: Thumbnail;    // Maximum resolution thumbnail (optional)
  };
  channelTitle: string;    // Name of the channel
  tags?: string[];         // List of video tags (optional)
  categoryId?: string;      // Video category ID (optional)
}

interface Thumbnail {
  url: string;               // URL to the thumbnail image
  width: number;             // Width of the thumbnail in pixels
  height: number;            // Height of the thumbnail in pixels
}