import style from '../styles/main.scss';
const paperplanets = require('./paperplanets');
const bodyTemplate = require("../templates/body.handlebars");

document.addEventListener("DOMContentLoaded", function() {
  document.body.innerHTML = bodyTemplate();
  paperplanets();
});
