require("dotenv").config();
const fs = require('fs');
import axios from "axios";
const FormData = require('form-data');

const form = new FormData();
const fileStream = fs.createReadStream('./0.png');
form.append('file', fileStream);

const url = "https://api.nftport.xyz/v0/files"

const options = {
  method: 'POST',
  url: url,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: process.env.NFTPORT_API_KEY,
    'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
  },
  data: '[form]'
};

async function mainer() {
  const resp = await axios(options)
  // const resp = await fetch(url, options)
  const data = await resp.json();
  console.log(data)
}

mainer()

// fetch("https://api.nftport.xyz/v0/files", options)
//   .then(response => {
//     return response.json()
//   })
//   .then(responseJson => {
//     // Handle the response
//     console.log(responseJson);
//   })