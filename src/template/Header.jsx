import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const logoRef = useRef(null);
  const [logoHeight, setLogoHeight] = useState(0);

  const logo = <FontAwesomeIcon icon={faTicket} style={{ color: "#065F46" }} size="2xl" />;

  // Detectar altura del logo
  useEffect(() => {
    if (logoRef.current) {
      setLogoHeight(logoRef.current.offsetHeight);
    }
  }, []);

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Limpiar resultados si input queda vacío
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setError(null);
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm.trim() !== '') {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=e2744d03410fc77deeba1202f8a50cfb&query=${encodeURIComponent(searchTerm)}`
        );
        const data = await response.json();
        console.log('Resultados de la API:', data); // para verificar en consola
        if (data.results && data.results.length > 0) {
          setSearchResults(data.results);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        setError('Error searching for movies');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectMovie = () => {
    setSearchResults([]);
    setSearchTerm('');
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Barra del logo */}
      <div
        ref={logoRef}
        className={`bg-emerald-600 p-4 shadow-md flex justify-center items-center transition-transform duration-300 ${
          scrolled ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="logo flex items-center space-x-4">
          {logo}
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-emerald-800">
            Movies App
          </span>
        </div>
      </div>

      {/* Barra de navegación y búsqueda */}
      <div
        className={`bg-customBlueExtraLight p-4 container mx-auto flex flex-row flex-wrap items-center justify-between gap-2 transition-transform duration-300`}
        style={{
          transform: scrolled ? `translateY(-${logoHeight}px)` : 'translateY(0)',
        }}
      >
        {/* Menú de navegación */}
        <nav className="flex flex-shrink-0 space-x-2">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-emerald-600 hover:bg-emerald-800 text-white px-3 py-2 rounded-md text-sm sm:text-base"
          >
            Home
          </button>
        </nav>

        {/* Input de búsqueda */}
        <div className="flex flex-1 min-w-[200px] items-center space-x-2">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 p-2 rounded-md bg-gray-400 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
          />
          <button
            onClick={handleSearch}
            className="bg-emerald-600 hover:bg-emerald-800 text-white px-3 py-2 rounded-md text-sm sm:text-base"
          >
            Search
          </button>
          
        </div>
        

      </div>

      {/* Mensajes de carga y error */}
      {loading && <p className="text-center text-xl text-customBlueMedium mt-2">Loading...</p>}
      {error && <p className="text-center text-xl text-red-500 mt-2">{error}</p>}

      {/* Grilla de resultados */}
      {searchResults.length > 0 && (
        <div
          className="absolute left-0 right-0 bg-emerald-900 bg-opacity-60 backdrop-blur-md p-6 overflow-y-auto z-40 max-h-[75vh]"
          style={{ top: scrolled ? `${logoHeight}px` : `${logoHeight + 75}px` }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {searchResults.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                onClick={handleSelectMovie}
                className="p-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 bg-emerald-800 bg-opacity-50 hover:bg-opacity-70"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto rounded-md mb-2"
                />
                <h2 className="text-sm font-semibold text-white text-center truncate">
                  {movie.title}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;








