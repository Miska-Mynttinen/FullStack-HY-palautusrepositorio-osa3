const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
} 

const password = process.argv[2]

const url = 
  `mongodb+srv://miska_mongo:${password}@cluster0.cbuze.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})


/*Kun annetaan vain command: node mongo.js yourpassword, niin tulostaa kaikki tietokannassa olevat numerotiedot.
Kun muoto on pidempi ja command: node mongo.js yourpassword "Arto Vihavainen" 040-1234556, tai jokin samanlainen niin lisää henkilön tiedot tietokantaan.
Palauttaa added Arto Vihavainen 040-1234556 to phonebook*/
if (process.argv.length === 5) {
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook!`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
