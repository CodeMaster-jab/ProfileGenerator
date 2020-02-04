const fs = require('fs');
const pdf = require('pdf-creator-node');

const html = fs.readFileSync('codemaster-jab.html', 'utf8');

const options = {
  format: 'A3',
  orientation: 'portrait',
  border: '10mm',
};

const document = {
  html: html,
  path: './output.pdf',
};

pdf.create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });
