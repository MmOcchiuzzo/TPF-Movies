import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getData } from '../utils/getData';
import { API_KEY } from '../utils/config';  

const imagenUrl = 'https://image.tmdb.org/t/p/w500';

const Movies = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const result = await getData({ id }); 
        setMovie(result);

        
        const videoResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
        const videoData = await videoResponse.json();
        const trailer = videoData.results.find(video => video.type === 'Trailer');
        if (trailer) {
          setVideoKey(trailer.key); 
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  if (loading) return <div className="text-center text-xl text-customBlueMedium">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500">Error loading data {error}</div>;

  return (
    <div className="container mx-auto px-6 py-12 bg-customBlueExtraLight">
      {movie && (
        <div className="max-w-4xl mx-auto bg-emerald-600 p-6 rounded-lg shadow-xl mb-12">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-8">
            <img
              src={`${imagenUrl}${movie.poster_path}`}
              alt={movie.original_title}
              className="w-full sm:w-1/3 h-auto rounded-lg mb-4 sm:mr-8 shadow-lg border-2 border-customBlueMedium"
            />
            <div className="sm:w-2/3 text-center sm:text-left">
              <h2 className="text-4xl font-bold text-black mb-4">{movie.original_title}</h2>
              <p className="text-lg text-black mb-6">{movie.overview}</p>
              <p className="text-black text-lg mb-4"><strong>Release Date:</strong> {movie.release_date}</p>
              <p className="text-black text-lg mb-4"><strong>Runtime:</strong> {movie.runtime} minutos</p>
              <p className="text-black text-lg mb-4"><strong>Vote Average:</strong> {movie.vote_average}</p>
            </div>
          </div>
        </div>
      )}
  
      {/* Contenedor separado para trailers */}
      {videoKey && (
        <div className="max-w-4xl mx-auto bg-emerald-600 p-6 rounded-lg shadow-xl">
          <h3 className="text-2xl text-black mb-4">Trailer</h3>
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${videoKey}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-xl"
          ></iframe>
        </div>
      )}
    </div>
  );
  
};

export default Movies;
