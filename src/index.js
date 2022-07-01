import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const input = document.querySelector('input[name]');
const divImage = document.querySelector('.gallery');
let search;
let page = 1;

const form = document.querySelector('.search-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const value = input.value;
  if (value === search) {
    page += 1;
  } else {
    search = value;
    page = 1;
  }

  getPictures(search).then(response => renderImages(response.data.hits));
});

// .then(response => response.status)
// .catch(err => console.warn(err)););

function getPictures(value) {
  return axios.get('https://pixabay.com/api/', {
    params: {
      key: '28374254-5de68685754f9202717c426c0',
      q: value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
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
  divImage.innerHTML = markup;
}

const ligthbox = new SimpleLightbox('.photo-card a', {
  captionData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});
ligthbox.refresh();

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        fetch();
      }
    });
  },
  {
    threshold: 0.5,
  }
);
