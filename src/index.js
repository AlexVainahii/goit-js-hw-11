import axios from 'axios';
import Notiflix from 'notiflix';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const options = {
  root: null,
  rootMargin: '400px',
  threshold: 1.0,
};
const io = new IntersectionObserver(nextPage, options);
export class PixabayApi {
  #params = {
    params: {
      key: '30581887-eee3cf06f7a40c5ac298de631',
      q: '',
      orientation: 'horizontal',
      image_type: 'photo',
      safesearch: true,
      page: 3,
      perpage: 30,
    },
  };

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

  incPage() {
    this.#params.params.page += 1;
  }
}

const myGallery = new PixabayApi();
async function get() {
  refs.form.addEventListener('click', searchSubmit);
}
async function searchSubmit(event) {
  clearPage();
  event.preventDefault();
  const inputSearch = refs.input.value.trim().toLowerCase();
  if (!inputSearch) {
    Notiflix.Notify.failure('Введітть дані для пошуку!');
    return;
  }
  myGallery.search = inputSearch;
  try {
    const data = await myGallery.getPhotos();
    const markup = createMarkup(data);
    refs.list.insertAdjacentHTML('beforeend', markup);
    const target = document.querySelector('.photo-card:last-child');
    io.observe(target);
  } catch (error) {
    Notiflix.Notify.failure('Щось пішло не так!');
    clearPage();
  }
}
get();
function clearPage() {
  refs.list.innerHTML = '';
}

async function nextPage(entries, observer) {
  console.log('ghfjhffygfjg');
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      myGallery.incPage();
      observer.unobserve(entry.target);
      try {
        const data = await myGallery.getPhotos();
        const markup = createMarkup(data);
        refs.list.insertAdjacentHTML('beforeend', markup);
        const target = document.querySelector('.photo-card:last-child');
        io.observe(target);
      } catch (error) {
        if (error) {
          Notiflix.Notify.failure('Щось пішло не так!', error.message);
        } else {
          Notiflix.Notify.failure('Щось пішло не так! Try');
        }
      }
    }
  });
}
