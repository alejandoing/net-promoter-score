const firebase = require('firebase/app')
const mysql = require('mysql')
const fs = require('fs');

require("firebase/firestore")

const config = {
  apiKey: "AIzaSyAg8xnIGkpKkSbcmfGMg2g2oqlTXiNMXA4",
  authDomain: "net-promoter-score-37352.firebaseapp.com",
  databaseURL: "https://net-promoter-score-37352.firebaseio.com",
  projectId: "net-promoter-score-37352",
  storageBucket: "net-promoter-score-37352.appspot.com",
  messagingSenderId: "872624347243"
}

firebase.initializeApp(config)

const connection = mysql.createConnection({
  host: '174.36.119.3',
  user: 'root',
  password: 'labs.DWIT',
  database: 'npswu',
  port: 3306
})

connection.connect(error => {
  if (error) throw error
  else console.log('Conexion correcta.')
})

connection.query('SELECT max(date) as lastDate FROM assessments', (error, result) => {
  error ? console.log(error) : firebase.firestore().collection("assessments").where('date', '>', 
  new Date(result[0].lastDate).toISOString()).where('business', '==', 'laYzKoQfYSawreFPJHTx').get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      connection.query(
        ` INSERT INTO assessments(id, business_id, comment, complain, date, face, contact,
          justification, justificationtwo, local_id, poll_id, region_id, zone_id) 
          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `, 
        [doc.id, 'laYzKoQfYSawreFPJHTx', 
        doc.data().comment, doc.data().complain, doc.data().date, doc.data().face,
        doc.data().contact, doc.data().justification, doc.data().justificationTwo, doc.data().local, doc.data().poll,
        doc.data().region, doc.data().zone], (error, result) => {
        if (error) {
          throw error
        } else {
          console.log(result)
        }
      })
    })
  })
})

let indexA = 0
let indexT = 0

/* Begin transaction */
connection.beginTransaction(function(err) {
  if (err) { throw err; }
  connection.query('SELECT max(date) as lastDate FROM assessments', (error, result) => {
    error ? console.log(error) : firebase.firestore().collection("assessments").where('date', '>', 
    new Date(result[0].lastDate).toISOString()).where('business', '==', 'laYzKoQfYSawreFPJHTx').get()
    .then(querySnapshot => {
      console.log(new Date(result[0].lastDate))
      querySnapshot.forEach(doc => {
        console.log(doc.data().justificationTwo)
        connection.query(
          ` INSERT INTO assessments(id, business_id, comment, complain, date, face, contact,
            justification, justificationtwo, local_id, poll_id, region_id, zone_id) 
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `, 
          [doc.id, 'laYzKoQfYSawreFPJHTx', 
          doc.data().comment, doc.data().complain, doc.data().date, doc.data().face,
          doc.data().contact, doc.data().justification, doc.data().justificationTwo, doc.data().local, doc.data().poll,
          doc.data().region, doc.data().zone], (error, result) => {
          if (error) {
            connection.rollback(function() { throw error; });
          } else {
            indexA++
            console.log('ASSESSMENT ' + indexA)
          }
        })
      })
    })
  })

  connection.query(
    ` UPDATE assessments SET justification = 'Envio internacional'
      WHERE justification = 'Envío internacional'`, (error, result) => {
      if (error) {
        connection.rollback(function() { throw error; });
      } else {
        console.log(result)
      }
  })

  connection.query(
    ` UPDATE assessments SET justification = 'Envio nacional'
      WHERE justification = 'Envío nacional'`, (error, result) => {
      if (error) {
        connection.rollback(function() { throw error; });
      } else {
        console.log(result)
      }
  })

  connection.query('SELECT max(date) as lastDate FROM tickets', (error, result) => {
    error ? console.log(error) : firebase.firestore().collection("tickets").where('date', '>', 
    new Date(result[0].lastDate).toISOString()).where('business', '==', 'laYzKoQfYSawreFPJHTx').get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        connection.query(
          ` INSERT INTO tickets(id, answer, assessment_id, business_id, comment, complain, date,
            description, email, poll_id, region_id, status, telephone, zone_id, local_id) 
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `, [doc.id, doc.data().answer, 
          doc.data().assessment, doc.data().business, doc.data().comment, doc.data().complain,
          doc.data().date, doc.data().description, doc.data().email, doc.data().poll, doc.data().region,
          doc.data().status, doc.data().telephone, doc.data().zone, doc.data().local], (error, result) => {
          if (error) {
            connection.rollback(function() { throw error; });
          } else {
            indexT++
            console.log('TICKET ' + indexT)
          }
        })
      })
    })
  })

  connection.commit(function(err) {
    if (err) { 
      connection.rollback(function() {
        throw err;
      });
    }
    console.log('Transaction Complete.')
    fs.appendFile('migration.log', `\n${new Date()} - Transaction Complete.`, (err) => {  
      if (err) throw err;
      console.log('Log saved!');
    })
  })
})
/* End transaction */