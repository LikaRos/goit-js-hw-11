import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const API_KEY = '28374254-5de68685754f9202717c426c0';
const PER_PAGE = 40;
const input = document.querySelector('input[name]');
const divImage = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const noMoreMessage = document.querySelector('.no-more');
const zeroResultsMessage = document.querySelector('.zero-results');
const form = document.querySelector('.search-form');

let search;
let page = 1;

form.addEventListener('submit', event => {
  event.preventDefault();
  clearContainer();
  page = 1;

  getPictures(input.value).then(response => {
    renderImages(response.data.hits);
    if (response.data.totalHits === 0) {
      zeroResultsMessage.classList.remove('hide');
    } else if (response.data.totalHits - PER_PAGE * page > 0) {
      loadMoreButton.classList.remove('hide');
    } else {
      noMoreMessage.classList.remove('hide');
    }
  });
});

loadMoreButton.addEventListener('click', event => {
  page += 1;
  loadMoreButton.classList.add('hide');

  getPictures(input.value).then(response => {
    renderImages(response.data.hits);
    if (response.data.totalHits - PER_PAGE * page > 0) {
      loadMoreButton.classList.remove('hide');
    } else {
      noMoreMessage.classList.remove('hide');
    }
  });
});

// .then(response => response.status)
// .catch(err => console.warn(err)););

function getPictures(value) {
  return axios.get('https://pixabay.com/api/', {
    params: {
      key: API_KEY,
      q: value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: PER_PAGE,
      page: page,
    },
  });
}

function renderImages(images) {
  const markup = images
    .map(image => {
      return `<div class="photo-card">
	 <a href="${image.largeImageURL}"><img class ="picture"  src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/></a>	
  
  <div class="info">
    <p class="info-item">
      <b>Likes</b> 
		<span>${image.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
		<span class = "description">${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
		<span>${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
		<span>${image.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');

  divImage.innerHTML += markup;
}

const ligthbox = new SimpleLightbox('.photo-card a', {
  captionData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});
ligthbox.refresh();

function clearContainer() {
  divImage.innerHTML = '';
  loadMoreButton.classList.add('hide');
  noMoreMessage.classList.add('hide');
  zeroResultsMessage.classList.add('hide');
}
