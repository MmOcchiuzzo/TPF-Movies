import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons'; 

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [searchResults, setSearchResults] = useState([]); // Estado para los resultados de búsqueda
  const [loading, setLoading] = useState(false); // Estado para el cargando
  const [error, setError] = useState(null); // Estado para errores

  const logo = <FontAwesomeIcon icon={faTicket} style={{color: "#065F46",}} size="2xl"/>;

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
  
  return (
    <header className="bg-emerald-900 text-white">
      <div className="sticky top-0 z-50 bg-emerald-600 p-4 shadow-md">
        <div className="container mx-auto flex justify-center items-center">
          <div className="logo flex items-center space-x-4">
            {logo}
            <a className="text-4xl font-bold text-transparent bg-clip-text bg-emerald-800">
              Movies App
            </a>
          </div>
        </div>
      </div>

    {/* Barra de navegación y búsqueda */}
      <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center p-4 gap-3">
        {/* Menú de navegación */}
        <nav className={`flex space-x-2 ${menuOpen ? 'block' : 'hidden md:flex'}`}>
        <button
            onClick={handleSearch}
            className="bg-emerald-600 hover:bg-emerald-900 text-white p-4 rounded-md"
          >
            <a href="/" className="hover:text-emerald-400">Home</a>
          </button>
          
        </nav>

        {/* Input de búsqueda y botón */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="w-400 p-2 rounded-md bg-slate-400 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            onClick={handleSearch}
            className="bg-emerald-600 hover:bg-emerald-900 text-white p-2 rounded-md"
          >
            Search
          </button>
        </div>

        <div className="md:hidden">
          <button
            className="text-emerald-600 hover:text-white focus:outline-none focus:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Contenido dinámico */}
      {loading && (
        <p className="text-center text-xl text-customBlueMedium">Loading...</p>
      )}
      {error && <p className="text-center text-xl text-red-500">{error}</p>}

      <div>
        {searchResults.length > 0 ? (
          <div className="px-4 md:px-8 lg:px-16 pb-8">
          {/* Fondo transparente con blur sobre toda la grilla */}
          <div className="bg-emerald-900 bg-opacity-40 backdrop-blur-md rounded-xl p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="p-2 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto rounded-md mb-2"
                  />
                  <h2 className="text-sm font-semibold text-white text-center truncate">
                    {movie.title}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        ) : searchTerm && !loading && !error ? (
          <p className="text-center text-xl text-red-300">No results found</p>
        ) : null}
      </div>
  </header>
  );
};

export default Header;

