const express = require('express');
const app = express();
const PORT = process.env.port || 3000;

// app.use(express.json())
// app.listen(PORT, () =>
//   console.log('REST API server ready at: http://localhost:3000'),
// )
app.get('/', (req, res)=>{

})

app.listen(PORT, err =>{
  if (err){
    return console.log('ERROR', err)
  }
  console.log(`Listening on port ${PORT}`)
})
