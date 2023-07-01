const express = require('express');
const app = express();
const PORT = process.env.port || 3000;

const artist = require('./artist');
const post = require('./post');
const song = require('./song');

app.use('/artists', artist)
app.use('/post', post)
app.use('/song', song)

app.listen(PORT, (err:any) =>{
  if (err){
    return console.log('ERROR', err)
  }
  console.log(`Listening on port ${PORT}`)
})
