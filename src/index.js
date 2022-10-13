import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.baseURL = 'https://pixabay.com/api';

async function getPhotos() {
  const { data } = await axios.get('/?key=30581887-eee3cf06f7a40c5ac298de631', {
    params: {
      q: 'yellow+flower',
      image_type: 'photo',
      pretty: true,
    },
  });
  return data;
}
console.log(getPhotos());
