import { MovieItem, RowData } from '@/types/movie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://morgflix-streaming.onrender.com/api';

/**
 * Obtiene el catálogo completo agrupado para el Home
 */
export async function getMoviesCatalog(): Promise<RowData[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) throw new Error(`Error al obtener el catálogo: ${res.status}`);

    const { data }: { data: MovieItem[] } = await res.json();

    return [
      {
        title: "",
        items: data || []
      }
    ];
  } catch (error) {
    console.error('Error obteniendo el catálogo de películas:', error);
    return [];
  }
}

/**
 * Obtiene los metadatos y la URL de streaming para un video específico (por SLUG o ID)
 */
export async function getMovieStream(identifier: string): Promise<{ streamUrl: string; format: 'hls' | 'mp4'; movie: MovieItem } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/${identifier}/stream-url`, {
      cache: 'no-store' // Sin cache para obtener siempre la URL firmada/fresca
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error(`Error obteniendo stream para ${identifier}:`, error);
    return null;
  }
}