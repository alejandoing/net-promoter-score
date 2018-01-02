import firebase from 'firebase'
import 'firebase/firestore'

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
	if (!firebase.apps.length) firebase.initializeApp(config)
	Vue.prototype.$firebase = FirebasePlugin
}

