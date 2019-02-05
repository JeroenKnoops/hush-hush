import getConfig from 'next/config'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// We use different firebase when developing locally and
// a different one in production
let config = {
  apiKey: 'AIzaSyAuB9uI_Lm-STlNHd1ppScQl318q6-ox-Y',
  authDomain: 'hush-hush-cogito.firebaseapp.com',
  databaseURL: 'https://hush-hush-cogito.firebaseio.com',
  projectId: 'hush-hush-cogito',
  storageBucket: '',
  messagingSenderId: '9978573571'
}

// const usersRef = firebase.database().ref('events/')

const authenticate = async (email, password) => {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
  const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
  console.log(`Nice to see you again ${userCredential.user.uid}!`)
}

// const getCurrentlySignedUser = () => {
//   const user = firebase.auth().currentUser
//   if (user) {
//     return user.uid
//   } else {
//     return null
//   }
// }

async function startFirebase () {
  const email = 'firebase@hush-hush.com'

  try {
    firebase.initializeApp(config)
    const { publicRuntimeConfig } = getConfig()
    await authenticate(email, publicRuntimeConfig.firebasePwd)
    // const db = firebase.firestore()
    // const uid = getCurrentlySignedUser()
    // if (uid) {
    //   console.log('uid=', uid)
    //   const doc = await db.collection('users').doc(uid).get()
    //   console.log('doc=', doc.data())
    //   const tag = 'tag-aaa-ccc'
    //   db.collection('users').doc(uid).set({
    //     [`${tag}`]: {
    //       sender: {
    //         epub: 'sender public key'
    //       }
    //     }
    //   }, { merge: true })
    // }
  } catch (e) {
    if (!/already exists/.test(e.message)) {
      console.error('Firebase initialization error', e.stack)
    }
  }
}

// startFirebase()

export { startFirebase }

// use this code to manually add new users
// var newUserRef = usersRef.push()
// newUserRef.set({
//   address: 'address...',
//   email: 'email...'
// })
