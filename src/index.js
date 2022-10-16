import axios from 'axios';
import Notiflix from 'notiflix';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
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
const io = new IntersectionObserver(nextPage, options);
export class PixabayApi {
  #params = {
    params: {
      key: '30581887-eee3cf06f7a40c5ac298de631',
      q: '',
      orientation: 'horizontal',
      image_type: 'photo',
      safesearch: true,
      page: 1,
      per_page: 40,
    },
  };
  constructor() {
    this.maxP = 0;
  }

  async getPhotos() {
    const { data } = await axios.get('', this.#params);
    console.log(data);
    return data;
  }
  get search() {
    return this.#params.params.q;
  }
  set search(q) {
    this.#params.params.q = q;
  }
  get maxPages() {
    return this.maxP;
  }
  set maxPages(max) {
    this.maxP = max;
  }

  incPage() {
    this.#params.params.page += 1;
  }
  resetPage() {
    this.#params.params.page = 1;
  }
  ShowLoadMore() {
    console.log(this.#params.params.page, this.maxP);
    return this.#params.params.page > this.maxP;
  }
}

const myGallery = new PixabayApi();

async function get() {
  refs.btn.addEventListener('click', searchSubmit);
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
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
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
get();

function clearPage() {
  refs.list.innerHTML = '';
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
