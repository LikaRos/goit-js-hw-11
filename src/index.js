import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(readCountry, DEBOUNCE_DELAY));

function readCountry(event) {
  const countryInput = event.target.value.trim();
  if (countryInput) {
    fetchCountries(countryInput)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        Notiflix.Notify.failure('OOps, there is no  country with this name');
      })
      .then(data => {
        if (data.length === 1) {
          renderCountry(data[0]);
        } else if (data.length < 10) {
          renderCountries(data);
        } else {
          Notiflix.Notify.info(
            'Too many matches found. Please, enter more specific name'
          );
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('OOps, there is no  country with this name');
      });
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}

function renderCountries(countries) {
  const markup = countries
    .map(country => {
      return `<li class = "list-item">
						<img src="${country.flags.svg}" width='30' alt="country flag">
			         <h2 class="country-title">${country.name.official}</h2>
               </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountry(country) {
  const liMarkup = `<li class = "list-item">
						<img src="${country.flags.svg}" width='30' alt="country flag">
			         <h2 class="country-title">${country.name.official}</h2>
               </li>`;
  countryList.innerHTML = liMarkup;

  const divMarkup = `<p><b>Capital: </b>${country.capital}</p>
								 <p><b>Population: </b>${country.population}</p>
						 		<p><b>Languages: </b>${Object.values(country.languages).join(', ')}</p>`;
  countryInfo.innerHTML = divMarkup;
}
