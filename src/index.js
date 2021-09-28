import './sass/main.scss';
import { info, defaults } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/Material.css';
import fetchImages from './js/apiService';
import galleryTemplate from './templates/cart.hbs';

const basicLightbox = require('basiclightbox');

defaults.styling = 'material';
defaults.icons = 'material';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryList: document.querySelector('.gallery'),
  showMoreBtn: document.querySelector('#load-more-btn'),
};

let page = 1;
let searchData = '';

const renderImagesList = function (images) {
  refs.galleryList.insertAdjacentHTML('beforeend', galleryTemplate(images));
};

const clearImagesList = function () {
  refs.galleryList.innerHTML = '';
};

const manageFetchImages = async function (searchData, page) {
  try {
    const images = await fetchImages(searchData, page);

    if (images.hits.length === 0) {
      info({
        text: 'No results were found for your search. Please try again.',
      });
      toogleShowMoreBtn(true);

      return;
    }

    renderImagesList(images.hits);
  } catch (error) {
    console.log(error);
  }
};

function toogleShowMoreBtn(value) {
  refs.showMoreBtn.classList.toggle('display', value);
}

refs.searchForm.addEventListener('submit', e => {
  searchData = e.target.firstElementChild.value;
  e.preventDefault();

  if (e.target.firstElementChild.value === '' || e.target.firstElementChild.value === ' ') {
    info({
      text: 'Please enter any value.',
    });
    return;
  }
  toogleShowMoreBtn(false);
  page = 1;
  clearImagesList();
  manageFetchImages(e.target.firstElementChild.value, page);
});

refs.showMoreBtn.addEventListener('click', () => {
  page += 1;
  manageFetchImages(searchData, page);
  refs.galleryList.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
});

refs.galleryList.addEventListener('click', e => {
  if (e.target.nodeName !== 'IMG') {
    return;
  }

  basicLightbox
    .create(
      `
    <img src=${e.target.dataset.src}>
`,
    )
    .show();
});
