let config = {
  apiKey: 'AIzaSyAuB9uI_Lm-STlNHd1ppScQl318q6-ox-Y',
  authDomain: 'hush-hush-cogito.firebaseapp.com',
  databaseURL: 'https://hush-hush-cogito.firebaseio.com',
  projectId: 'hush-hush-cogito',
  storageBucket: '',
  messagingSenderId: '9978573571'
}

const authenticate = async (email, password) => {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
  const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
  console.log(`Nice to see you again ${userCredential.user.uid}!`)
}

async function startFirebase (password) {
  const email = 'firebase@hush-hush.com'

  try {
    firebase.initializeApp(config)
    await authenticate(email, password)
  } catch (e) {
    if (!/already exists/.test(e.message)) {
      console.error('Firebase initialization error:', e.stack)
    }
  }
}

export { startFirebase }

// use this code to manually add new users
// var newUserRef = usersRef.push()
// newUserRef.set({
//   address: 'address...',
//   email: 'email...'
// })
