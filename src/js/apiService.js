const BASE_URL = 'https://pixabay.com/api/';
const KEY = '23598591-bbf9fc426017fbba5b00fa283';

export default async function fetchImages(searchQuery, pageNumber) {
  const response = await fetch(
    `${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${pageNumber}&per_page=12&key=${KEY}`,
  );
  const image = await response.json();

  return image;
}
