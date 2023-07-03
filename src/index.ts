const express = require('express');
const app = express();
const PORT = process.env.port || 3000;


const artist = require('./routes/artist');
const post = require('./routes/post');
const song = require('./routes/song');

app.use(express.json())
app.use('/artists', artist)
app.use('/post', post)
app.use('/song', song)

app.listen(PORT, (err:any) =>{
  if (err){
    return console.log('ERROR', err)
  }
  console.log(`Listening on port ${PORT}`)
})
