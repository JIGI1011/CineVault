
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL= import.meta.env.VITE_TMDB_BASE_URL
// DISCLAIMER: Keywords that are considered unsafe or adult content
const CONTENT_FILTERING = [
  "erotic",
  "erotic movie",
  "softcore",
  "nudity",
  "sex",
  "porn",
  "explicit",
  "pink film",
  "adult",
  "hentai",
  "nsfw",
  "18",
  "18+",
  "18 plus",
  "gay",
  "gay theme",
  "in the closet",
  "lgbtq",
  "lgbtq theme",
  "lgbtq+",
  "lesbian",
  "lesbian theme",
  "lgbt",
  "lgbt theme",
  "gay sex",
  "lesbian sex",
  "bisexual",
  "bisexual theme",
  "bisexuality"
];

function hasBlockedKeyword(keywords = []) {
  return keywords.some((kw) =>
    CONTENT_FILTERING.includes(kw.name.toLowerCase())
  );
}

async function hasUnsafeOrMissingKeywords(movieId) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/keywords?api_key=${API_KEY}`);
    const data = await res.json();

    const keywords = data.keywords || [];

    if (keywords.length === 0 || hasBlockedKeyword(keywords)) {
      return true;
    }

    return false;
  } catch (err) {
    console.warn("Keyword check failed for movie", movieId, err);
    return true;
  }
}

async function filterSafeMovies(movies) {
  const safe = [];

  for (const movie of movies) {
    if (movie.adult) continue;

    const isUnsafe = await hasUnsafeOrMissingKeywords(movie.id);
    if (!isUnsafe) {
      safe.push(movie);
    }
  }

  return safe;
}

export const getPopularMovies = async (page = 1) => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}&include_adult=false`
  );
  const data = await response.json();
  return await filterSafeMovies(data.results || []);
};

export const searchMovies = async (query, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  );
  const data = await response.json();
  return await filterSafeMovies(data.results || []);
};


export async function getMovieDetails(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return res.json();
}


export async function getMovieTrailer(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
  const data = await res.json();
  const trailer = data.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
  return trailer?.key || null;
}
