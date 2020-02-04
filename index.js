const generateHTML = require('./generateHTML');
const inquirer = require('inquirer');
const fs = require('fs');
const axios = require('axios');
const pdf = require('html-pdf');

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
  blog: '',
};

function writeToFile(fileName, html) {
  console.log('Generating PDF file ...');
  fs.writeFile(fileName, html, (err) => {
    if (err) {
      return console.log(err);
    }
  });
  const options = {
    format: 'A3',
  };
  pdf.create(html, options).toFile(`./${userData.user}.pdf`, (err) => {
    if (err) return console.log(err);
    console.log('Success!');
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
          console.log(res.data);
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
          userData.blog = res.data.blog;
          const html = generateHTML.generateHTML(userData);
          writeToFile(filename, html);
        }
      });
  });
}

init();
