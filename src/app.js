const path = require('path');
const express = require('express');

const app = express();
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

app.get('/*', (req, res) => {
  res.redirect('/');
});
app.listen(3000, () => {
  console.log('App is up and running on port 3000');
});
