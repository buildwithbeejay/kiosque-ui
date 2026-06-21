// fetch.js
fetch("http://localhost:5000/")
  .then((res) => res.text())
  .then((text) => console.log(text.substring(0, 500)))
  .catch((err) => console.error(err));
