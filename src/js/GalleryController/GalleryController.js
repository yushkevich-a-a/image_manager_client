import FieldImages from '../FieldImages/FieldImages';

export default class GalleryController {
  constructor(form, type = 'text') {
    this.input = document.querySelector('.file');
    this.wrapper = document.querySelector('.wrapper-input');
    this.type = type;

    this.init();
  }

  init() {
    this.drawGalleryContainer();
    this.getAllFiles()
    this.addListeners();
  }

  drawGalleryContainer() {
    this.GalleryContainer = document.createElement('div');
    this.GalleryContainer.classList.add('gallery-container');
    document.body.appendChild(this.GalleryContainer);
  }

  addListeners() {
    this.wrapper.addEventListener('click', (event) => {
      this.input.dispatchEvent(new MouseEvent('click'));
    });

    this.wrapper.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    this.wrapper.addEventListener('drop', (event) => {
      event.preventDefault();
      const form = event.target.closest('.form')
      console.log(event)
      this.uploadFile(form);
    });

    this.input.addEventListener('input', (event) => {
      const form = event.target.closest('.form')
      this.uploadFile(form, event.target);
    });

    document.addEventListener('click', (event) => {

      if (event.target.closest('.button')) {
        this.checkValidityURL();
      }

      if (event.target.closest('.remove-button')) {
        const imgContainer = event.target.closest('.container-img');
        const containerID = imgContainer.dataset.id;
        this.deleteImg(containerID, imgContainer);
      }
    });
  }

  drawAllImages(data) {
    for(let i of data) {
      new FieldImages(`http://localhost:7070/${i}`, i);
    }
  }

  uploadFile(value, element) {
    const formData = new FormData(value);
    formData.append('method', 'addImage');
    console.log(formData.get('file'));
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:7070/')
    xhr.addEventListener('load', () => {
      if (element) {
        element.value = '';
      }
      new FieldImages(`http://localhost:7070/${xhr.responseText}`, xhr.responseText);
    });

    xhr.send(formData);
  }

  getAllFiles() {
    const method = 'getAllImages';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:7070/?method=${method}`);

    xhr.addEventListener('load', () => {
      const arrData = JSON.parse(xhr.responseText);
      this.drawAllImages(arrData)
    });
    xhr.send();
  }

  deleteImg(value, element) {
    const formData = new FormData();
    formData.append('method', 'deleteImage');
    formData.append('fileId', value);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:7070/')

    xhr.responseType = 'json'

    xhr.addEventListener('load', () => {
      if (xhr.response) {
        this.GalleryContainer.removeChild(element);
      }
    });

    xhr.send(formData);
}
}
