const generateHTML = require('./generateHTML');
const inquirer = require('inquirer');
const fs = require('fs');
const axios = require('axios');
const pdf = require('pdf-creator-node');

const userData = {
  user: '',
  name: '',
  color: '',
  location: '',
  company: '',
  bio: '',
  following: '',
  followers: '',
  public_repos: '',
  public_gists: '',
  html_url: '',
  avatar_url: '',
};

function writeToFile(fileName, html) {
  fs.writeFile(fileName, html, (err) => {
    if (err) {
      return console.log(err);
    }
  });
  const options = {
    format: 'A3',
    orientation: 'portrait',
    border: '10mm',
  };

  const document = {
    html: html,
    path: `./${userData.user}.pdf`,
  };

  pdf.create(document, options)
    .then((res) => {
      // console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
}

function init() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'user',
      message: 'What is your GitHub Username?',
    },
    {
      type: 'list',
      message: 'Pick a color?',
      name: 'color',
      choices: [
        'green',
        'blue',
        'pink',
        'red',
      ],
    },
  ]).then((data) => {
    const filename = data.user.toLowerCase().split(' ').join('') + '.html';
    userData.user = data.user;
    userData.color = data.color;

    axios
      .get(`https://api.github.com/users/${data.user}`)
      .then((res) => {
        if (res.status === 200) {
          // console.log(res.data);
          userData.name = res.data.name;
          userData.location = res.data.location;
          userData.company = res.data.company;
          userData.bio = res.data.bio;
          userData.public_repos = res.data.public_repos;
          userData.public_gists = res.data.public_gists;
          userData.followers = res.data.followers;
          userData.following = res.data.following;
          userData.html_url = res.data.html_url;
          userData.avatar_url = res.data.avatar_url;
          const html = generateHTML.generateHTML(userData);
          writeToFile(filename, html);
        }
      });
  });
}

init();
