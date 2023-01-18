const $wrapper = document.querySelector('[data-wrapper]');
const $addButton = document.querySelector('[data-add_button]');
const $modal = document.querySelector('[data-modal]');
const $spinner = document.querySelector('[data-spinner]')

//TODO: свое api вставить
const api = new Api('SMAKOLDIN-DV')

const gerenationCatCard = (cat) => `<div data-card_id=${cat.id} class="card mx-2" style="width: 18rem;">
<img src="${cat.image}" class="card-img-top" alt="${cat.name}">
<div class="card-body">
  <div style="display: flex;">
    <h5 class="card-title">${cat.name}</h5>
    ${cat.favorite ?  '<svg clip-rule="evenodd" fill-rule="evenodd" fill="goldenrod" width="24"height="24" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44z" fill-rule="nonzero"/></svg>' : ''}
  </div>

  <p class="card-text">${cat.description}</p>
  <p class="card-text-black">ID: ${cat.id}</p>
  <p class="card-text">Рейтинг: ${cat.rate}</p>
  <p class="card-text">Возраст: ${cat.age}</p>
  
  <button data-action="show" class="btn btn-primary">Show</button>
  <button data-action="delete" class="btn btn-danger">Delete</button>
</div>
</div>`

$wrapper.addEventListener('click', (event) => {
  switch (event.target.dataset.action) {
    case 'delete':
      const $currentCard = event.target.closest("[data-card_id]");
      const catId = $currentCard.dataset.card_id;
      api.delCat(catId);
      $currentCard.remove()
      break;

    case 'show':
      //TODO: onclick modal should be open (подробная информация о коте в новой модалке)
      break;

    default:
      break;
  }
})

document.forms.catsForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(event.target).entries());

  data.age = Number(data.age)
  data.id = Number(data.id)
  data.rate = Number(data.rate)
  data.favorite = data.favorite === 'on'

  console.log(data);

  api.addCat(data)
    .then(res => res.ok && $modal.classList.add('hidden'))
    .then(data => {
      console.log('IN THEN')
      $spinner.classList.remove('hidden');
      $wrapper.innerHTML = ''
      return getCats()})
    .catch((error) => alert(error))
  
  // TODO: catch (отследить ошибку при создании кота и обрабоать, сообщить пользователю)
})

$addButton.addEventListener('click', () => {
  $modal.classList.remove('hidden')
})

function getCats() {
  return api.getCats()
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    setTimeout(() => {
      $spinner.classList.add('hidden')
      console.log(data);
      data.forEach(cat => {
        $wrapper.insertAdjacentHTML('beforeend', gerenationCatCard(cat))
      })
    }, 2000);
  });
}

getCats();


//TODO: после добавления кота через форму, делать новый запрос на бэк и обновлять список котов
//TODO: добавить форму редактирования
//TODO: сделать закрытие модалок по клику на крестик или на пространство вокруг
//TODO: чистить форму если человек ее закрыл сам
