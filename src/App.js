import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCqdS8gpqMnLo7I1ljT7WwxN1VvOacSLYY",
  authDomain: "rgbgearbox.firebaseapp.com",
  databaseURL: "https://rgbgearbox.firebaseio.com",
  projectId: "rgbgearbox",
  storageBucket: "rgbgearbox.appspot.com",
  messagingSenderId: "304327962656",
  appId: "1:304327962656:web:e379426be7415643414c45"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>🔥 RGB GearBox 🔥</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

if (!firebase.apps.length) {
  firebase.initializeApp({});
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Chat Application Using Firebase, React js. Sending images functionality will be added soon.</p>
      
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(20);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="type something..." />

      <button type="submit" disabled={!formValue}><img src="https://user-images.githubusercontent.com/33036554/98664308-36585500-2370-11eb-95d4-5839f2f0b8b1.png" /></button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://i.pinimg.com/originals/79/77/67/797767f830f9571a3cf61886f47a6701.gif'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;