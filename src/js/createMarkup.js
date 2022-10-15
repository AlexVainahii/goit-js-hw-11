export function createMarkup(photos) {
  return photos.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" width="350px" height="250px" data-source="${largeImageURL}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <b>${likes}</b>
          </p>
          <p class="info-item">
            <b>Views</b>
            <b>${views}</b>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <b>${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <b>${downloads}</b>
          </p>
        </div>
      </div>`;
      }
    )
    .join('');
}
