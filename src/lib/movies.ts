import { MovieItem, RowData } from '@/types/movie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Obtiene el catálogo completo agrupado para el Home
 */
export async function getMoviesCatalog(): Promise<RowData[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies`, {
      next: { revalidate: 60 } // Revalida cada 60 segundos (Server Components)
    });

    if (!res.ok) throw new Error('Error al obtener el catálogo');

    const { data }: { data: MovieItem[] } = await res.json();

    // Organizar los datos recibidos de Laravel en filas para la interfaz
    return [
      {
        title: "",
        items: data
      }
    ];
  } catch (error) {
    console.error(error);
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