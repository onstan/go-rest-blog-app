const baseURL = 'https://gorest.co.in/public-api/';

function createListEl() {
  const list = document.createElement('ul');
  list.classList.add('list-group');
  return list
}

function createLinkEl(item) {
  const itemEl = document.createElement('li');
  itemEl.classList.add('list-group-item');
  const link = document.createElement('a');
  link.href = `post.html?id=${item.id}`;
  link.textContent = item.title;
  itemEl.append(link);
  return itemEl
}

async function createLinksList(container) {
  // let response;
  const maxPages = 5;
  const pagination = document.getElementById('pagination');
  const pageParams = new URLSearchParams(window.location.search);
  const currentPageNum = Number(pageParams.get('page')) || 1; //index.html не имеет параметров поэтому
  // результатом get будет null а Number преобразует null в 0
  // т.о. текущая стр должна принять значение 1 (для выполнения запроса ниже)
  const list = createListEl()
  container.append(list)

  const response = await (await fetch(`${baseURL}posts?page=${currentPageNum}`)).json()

  const posts = response.data;
  posts.forEach(post => {
    const postEl = createLinkEl(post)
    list.append(postEl)

  });
  const totalPages = response.meta.pagination.pages;
  const pageNumbers = [];

  let startPageNum = currentPageNum - Math.floor(maxPages / 2);
  let endPageNum = currentPageNum + Math.floor(maxPages / 2);
  if (startPageNum < 1) {
    startPageNum = 1;
    endPageNum = maxPages
  };
  if (endPageNum > totalPages) endPageNum = totalPages;
  console.log(startPageNum, endPageNum)

  for (let p = startPageNum; p <= endPageNum; p++) {
    pageNumbers.push(p)
  }

  pageNumbers.forEach(num => {
    const pageEl = createPageEl(num);
    pagination.append(pageEl);
  })

  setActivePageClass(currentPageNum)
}

function setActivePageClass(pageNum) {
  const pageElements = Array.from(document.getElementsByClassName('page-item'))
  const activePageElements = pageElements.filter(p => Number(Array.from(p.children)[0].textContent) === pageNum)
  activePageElements[0].classList.add('active')
}

function createPageEl(num) {
  const page = document.createElement('li');
  page.classList.add('page-item');
  const pageLink = document.createElement('a');
  pageLink.classList.add('page-link');
  if (num === 1) pageLink.href = "index.html"
  else pageLink.href = `index.html?page=${num}`;
  pageLink.textContent = num;
  page.append(pageLink);

  return page
}

// creating post element for post.html
async function createPost(container) {
  const pageParams = new URLSearchParams(window.location.search);
  const id = pageParams.get('id');

  const postEl = createPostElement();

  const postItem = (await (await fetch(`${baseURL}posts/${id}`)).json()).data;

  const postTitle = postEl.title;
  postTitle.textContent = postItem.title;

  const postBody = postEl.body;
  postBody.textContent = postItem.body;

  container.append(postEl.element);

  const response = await (await (fetch(`${baseURL}comments?post_id=${id}`))).json()
  const comments = response.data;

  const commentsSection = createCommentsSection({
    commentsArr: comments,
    number: comments.length
  });

  container.append(commentsSection);
}

function createPostElement() {
  const element = document.createElement('article');
  element.classList.add('mt-5', 'mb-5');

  const title = document.createElement('h1');
  title.classList.add('card-title');

  const body = document.createElement('p');
  body.classList.add('card-text');

  element.append(title, body)
  return {
    element,
    title,
    body
  }
}

function createCommentEl({author, text}) {
  const element = document.createElement('li');
  element.classList.add('mb-3', 'card', 'card-body', 'border-dark', 'bg-light');

  const authorEl = document.createElement('span');
  authorEl.classList.add('h4', 'mb-3');
  authorEl.textContent = author;

  const body = document.createElement('p');
  body.classList.add('card-body','w-75', 'list-group-item');
  body.textContent = text;

  element.append(authorEl, body);

  return element
}

function createCommentsTitle() {
  const title = document.createElement('h2');
  title.textContent = 'Comments';

  return title
}

function createCommentsSection({
  commentsArr,
  number
}) {
  const section = document.createElement('section');
  section.append(createCommentsTitle())
  if (number === 0) {
    section.append(createEmptyCommentsItem())
  } else {
    const list = createCommentsListEl()

    commentsArr.forEach(commentsObj => {
      const comment = createCommentEl({
        author: commentsObj.name,
        text: commentsObj.body
      })
      list.append(comment);
    })

    section.append(list)
  }

  return section
}

function createCommentsListEl() {
  const list = document.createElement('ul');
  return list
}

function createEmptyCommentsItem() {
  const item = document.createElement('p');
  item.textContent = 'No comments here yet';
  item.classList.add('list-group-item');
  return item
}
