import { API_KEY } from './config'; 

export const getData = async ({ searchTerm = '', page = 1, id = null }) => {
  let url;

  if (id) {
    // Si se pasa un 'id', obtiene información de una película específica
    url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;
  } else if (searchTerm) {
    // Si hay 'searchTerm', realizar búsqueda por nombre
    url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${page}`;
  } else {
    // Si no hay 'searchTerm', buscar las películas populares con paginación
    url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error de fetching data');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};



