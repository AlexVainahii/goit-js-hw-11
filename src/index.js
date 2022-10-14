import axios from 'axios';
import Notiflix from 'notiflix';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export class PixabayApi {
  #params = {
    params: {
      key: '30581887-eee3cf06f7a40c5ac298de631',
      q: 'yellow+flower',
      orientation: 'horizontal',
      image_type: 'photo',
      safesearch: true,
    },
  };

  async getPhotos() {
    const { data } = await axios.get('', this.#params);
    return data;
  }
}
const myGallery = new PixabayApi();
console.log(myGallery.getPhotos());
// myGallery.getPhotos().then((
//   {results})=>{
//     console.log(results);
//     const markup=createMarkup(results)
//     console.log(markup);
//     refs.list.insertAdjacentHTML('beforeend', markup);
//   }).catch()
async function get() {
  try {
    const data = await myGallery.getPhotos();
    console.log(data);
    const markup = createMarkup(data);
    console.log(markup);
    refs.list.insertAdjacentHTML('beforeend', markup);
  } catch (error) {
    console.log('Щось пішло не так!', error.message);
    //clearPage();
  }
}
get();
