import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getData } from '../utils/getData';
import { API_KEY } from '../utils/config';  // Importar la API_KEY desde config.js

const imagenUrl = 'https://image.tmdb.org/t/p/w500';

const Movies = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null); // Estado para el ID del tráiler
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const result = await getData({ id }); // Obtener datos de la película con el id
        setMovie(result);

        // Llamar a la API para obtener los videos de la película usando la API_KEY del config.js
        const videoResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
        const videoData = await videoResponse.json();
        const trailer = videoData.results.find(video => video.type === 'Trailer'); // Filtrar para obtener solo el tráiler
        if (trailer) {
          setVideoKey(trailer.key); // Almacenar el ID del tráiler
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]); // Aseguramos que el efecto se ejecute cada vez que cambie el id

  if (loading) return <div className="text-center text-xl text-customBlueMedium">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500">Error loading data {error}</div>;

  return (
    <div className='container mx-auto px-6 py-12 bg-customBlueExtraLight'>
      {movie && (
        <div className='max-w-4xl mx-auto bg-emerald-600 p-6 rounded-lg shadow-xl'>
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-8">
            <img
              src={`${imagenUrl}${movie.poster_path}`} 
              alt={movie.original_title} 
              className="w-full sm:w-1/3 h-auto rounded-lg mb-4 sm:mr-8 shadow-lg border-2 border-customBlueMedium"
            />
            <div className="sm:w-2/3 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-black mb-4">{movie.original_title}</h2>
              <p className="text-lg text-black mb-4">{movie.overview}</p>
              <p className="text-black text-sm mb-2"><strong>Release Date:</strong> {movie.release_date}</p>
              <p className="text-black text-sm mb-2"><strong>Runtime:</strong> {movie.runtime} minutos</p>
              <p className="text-black text-sm mb-2"><strong>Vote Average:</strong> {movie.vote_average}</p>
            </div>
          </div>

          {/* Mostrar el tráiler si es que existe */}
          {videoKey && (
            <div className="mt-8">
              <h3 className="text-2xl text-black mb-4">Trailer</h3>
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${videoKey}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-xl"
              ></iframe>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Movies;
