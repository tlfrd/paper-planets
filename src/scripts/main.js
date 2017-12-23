import style from '../styles/main.scss';

const bodyTemplate = require("../templates/body.handlebars");

document.addEventListener("DOMContentLoaded", function() {
  document.body.innerHTML = bodyTemplate();
});
