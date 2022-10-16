import axios from 'axios';
import Notiflix from 'notiflix';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabayApi } from './js/pixabay';
axios.defaults.baseURL = 'https://pixabay.com/api/';
const options = {
  root: null,
  rootMargin: '400px',
  threshold: 1.0,
};
const Lightbox = new SimpleLightbox('.gallery a', {
  loadingTimeout: 0,
  showCaptions: true,
});

function clearPage() {
  refs.list.innerHTML = '';
}
async function searchSubmit(event) {
  event.preventDefault();
  clearPage();
  const inputSearch = refs.input.value.trim().toLowerCase();
  if (!inputSearch) {
    Notiflix.Notify.failure('Enter data for search!');
    return;
  }
  myGallery.search = inputSearch;
  try {
    myGallery.resetPage();
    const { hits, totalHits } = await myGallery.getPhotos();
    myGallery.maxPages = Math.ceil(totalHits / 40);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    const markup = createMarkup(hits);
    refs.list.insertAdjacentHTML('beforeend', markup);
    Lightbox.refresh();
    const target = document.querySelector('.photo-card:last-child');
    io.observe(target);
  } catch (error) {
    if (error) {
      Notiflix.Notify.failure(error.message);
      clearPage();
    } else {
      Notiflix.Notify.failure('error');
      clearPage();
    }
  }
}
async function nextPage(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      if (!myGallery.ShowLoadMore()) {
        myGallery.incPage();
      } else {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
      observer.unobserve(entry.target);
      try {
        const { hits } = await myGallery.getPhotos();
        const markup = createMarkup(hits);
        refs.list.insertAdjacentHTML('beforeend', markup);
        Lightbox.refresh();
        const target = document.querySelector('.photo-card:last-child');
        io.observe(target);
      } catch (error) {
        if (error) {
          Notiflix.Notify.failure(error.message);
        } else {
          Notiflix.Notify.failure('error catch');
        }
      }
    }
  });
}
const myGallery = new PixabayApi();
refs.btn.addEventListener('click', searchSubmit);
const io = new IntersectionObserver(nextPage, options);
