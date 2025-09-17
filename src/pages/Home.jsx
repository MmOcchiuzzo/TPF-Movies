import React, { useEffect, useState } from 'react';
import { getData } from '../utils/getData';  
import { useNavigate } from 'react-router-dom';

const imagenUrl = 'https://image.tmdb.org/t/p/w500';

function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getData({ page: currentPage });
        setData(result);
        setTotalPages(result.total_pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div className="text-center text-xl text-emerald-900">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500"> Error loading data {error}</div>;

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const maxPagesVisible = 4;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesVisible - 1);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-6 py-12 bg-customBlueExtraLight min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-emerald-950">Popular Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data && data.results.map((movie) => (
          <div 
            key={movie.id} 
            className="bg-slate-300 p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer"
            onClick={() => handleMovieClick(movie.id)}
          >
            {movie.poster_path ? (
              <img
                src={`${imagenUrl}${movie.poster_path}`} 
                alt={movie.original_title} 
                className="w-full h-auto rounded-md mb-4"
              />
            ) : (
              <div className="bg-emerald-900 w-full h-64 rounded-md mb-4 flex items-center justify-center text-customBlueExtraLight">
                No Image Available
              </div>
            )}
            <h2 className="text-xl font-semibold text-emerald-900">{movie.original_title}</h2>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-8 space-x-1 overflow-hidden">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-900 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm"
          disabled={currentPage === 1}
        >
          Back
        </button>

        {startPage > 1 && <span className="flex-shrink-0 text-black px-1">…</span>}

        {pageNumbers.map((page) => (
          <button 
            key={page} 
            onClick={() => handlePageChange(page)} 
            className={`flex-shrink-0 px-2 s:px-3 py-1 rounded-md text-xs sm:text-sm ${
              currentPage === page 
                ? 'bg-emerald-900 text-white' 
                : 'bg-emerald-600 text-white hover:bg-emerald-800'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && <span className="flex-shrink-0 text-black px-1">…</span>}

        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-900 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;



