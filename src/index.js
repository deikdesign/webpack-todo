import './main.css';

const listsContainer = document.querySelector('[data-lists]');
const newListFormat = document.querySelector('[data-new-list-form]');
const newListInp = document.querySelector('[data-new-list-input]');
const deleteListButt = document.querySelector('[data-delete-list-button]');
const btnComplete = document.querySelector('[data-clear-complete-tasks-button]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECT_LIST_ID_KEY = 'task.selectListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectListId = localStorage.getItem(LOCAL_STORAGE_SELECT_LIST_ID_KEY);

let isEdit = false;

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECT_LIST_ID_KEY, selectListId);
}
/* eslint-disable no-use-before-define */
function saveAndRender() {
  save();
  render();
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement('li');
    listElement.id = list.index;
    const inputCheck = document.createElement('input');
    inputCheck.setAttribute('type', 'checkbox');
    inputCheck.addEventListener('click', (ev) => {
      const itemId = ev.target.parentNode.id;
      const index = lists.findIndex((l) => l.index === itemId);
      if (lists[index].completed) {
        lists[index].completed = false;
      } else {
        lists[index].completed = true;
      }
    });
    if (list.completed) {
      inputCheck.checked = true;
    }
    listElement.appendChild(inputCheck);
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'delete';
    const label = document.createElement('label');
    deleteButton.addEventListener('click', (ev) => {
      const taskId = ev.target.parentNode.id;
      const index = lists.findIndex((l) => l.index === taskId);
      lists.splice(index, 1);
      saveAndRender();
    });
    label.innerHTML = list.description;
    listElement.appendChild(label);
    listElement.appendChild(deleteButton);
    const editBtn = document.createElement('button');
    editBtn.innerHTML = 'Edit';
    editBtn.addEventListener('click', (ev) => {
      const itemId = ev.target.parentNode.id;
      const index = lists.findIndex((l) => l.index === itemId);
      const desc = lists[index].description;
      newListInp.value = desc;
      isEdit = true;
    });
    listElement.appendChild(editBtn);
    listElement.classList.add('list-name');
    if (list.index === selectListId) listElement.classList.add('active-list');
    listsContainer.appendChild(listElement);
    listsContainer.appendChild(listElement);
  });
}
/* eslint-disable no-continue */
function render() {
  clearElement(listsContainer);
  renderLists();
}

listsContainer.addEventListener('click', (ev) => {
  if (ev.target.tagName.toLowerCase() === 'li'
        || ev.target.tagName.toLowerCase() === 'button'
        || ev.target.tagName.toLowerCase() === 'label'
        || ev.target.tagName.toLowerCase() === 'input') {
    selectListId = ev.target.parentNode.id;

    if (selectListId === '') {
      selectListId = ev.target.id;
    }

    saveAndRender();
  }
});

deleteListButt.addEventListener('click', (ev) => {
  ev.preventDefault();
  lists = lists.filter((list) => list.index !== selectListId);
  selectListId = null;
  saveAndRender();
});

newListFormat.addEventListener('submit', (ev) => {
  ev.preventDefault();

  if (isEdit) {
    const index = lists.findIndex((l) => l.index === selectListId);
    const desc = newListInp.value;
    lists[index].description = desc;
    newListInp.value = ' ';
    isEdit = false;
    saveAndRender();
    return;
  }

  const listName = newListInp.value;
  if (listName == null || listName === '') return;
  const list = createList(listName);
  newListInp.value = null;
  lists.push(list);
  render();
});

btnComplete.addEventListener('click', (ev) => {
  ev.preventDefault();
  const items = document.getElementsByTagName('li');
  let isChanged = false;
  for (let i = 0; i < items.length; i += 1) {
    const itemId = items[i].id;
    const itemCheck = items[i].childNodes[0];

    if (itemCheck === undefined) {
      continue;
    }

    if (itemCheck.checked) {
      const index = lists.findIndex((l) => l.index === itemId);
      lists.splice(index, 1);
      isChanged = true;
    }
  }

  if (isChanged) {
    saveAndRender();
  }
});

function createList(name) {
  const dateString = Date.now().toString();
  const newIndex = lists.length + dateString;
  return { description: name, completed: false, index: newIndex };
}

render();
