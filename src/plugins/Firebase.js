import * as firebase from 'firebase/app'
require('firebase/auth')
require('firebase/firestore')
require('firebase/storage')

let config = {
	apiKey: "AIzaSyAg8xnIGkpKkSbcmfGMg2g2oqlTXiNMXA4",
	authDomain: "net-promoter-score-37352.firebaseapp.com",
	databaseURL: "https://net-promoter-score-37352.firebaseio.com",
	projectId: "net-promoter-score-37352",
	storageBucket: "net-promoter-score-37352.appspot.com",
	messagingSenderId: "872624347243"
}

let FirebasePlugin = {
  db: () => firebase.database(),
  firestore: () => firebase.firestore(),
  auth: () => firebase.auth(),
  storage: () => firebase.storage(),
}

export default function (Vue) {
	firebase.initializeApp(config)
	FirebasePlugin.firestore().settings({ timestampsInSnapshots: true })
	Vue.prototype.$firebase = FirebasePlugin
}
