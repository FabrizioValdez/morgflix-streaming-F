// src/types/movie.ts

export interface MovieItem {
  id: string | number;
  title: string;
  slug?: string;
  description?: string;
  bannerUrl?: string;
  posterUrl?: string;
  tag?: string;
  hue?: [number, number];
  progress?: number;
  format?: 'hls' | 'mp4';    // <--- Opcional con ?
  streamUrl?: string;         // <--- Opcional con ?
}

export interface RowData {
  title: string;
  items: MovieItem[];
}