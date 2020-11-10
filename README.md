# Quick Chat app 

## Getting Started

To get started and run the app, you need to follow these simple steps:

1. Clone and then fork this repo on your machine locally.
   `git clone https://github.com/nandkk05/superchat-web-app`
2. `cd superchat-web-app`
3. `npm install` for installing all dependencies and `cd functions` then again run `npm install` + `npm install bad-words --save`
4. `npm start` this will serve this chat app on local port 3000

##Deploying on Firebase
1. Go to [Firebase](https://firebase.google.com) and create new project.
2. Select "Add Firebase to your web app" option, now copy the config keys and paste your keys.
    `firebase.initializeApp({
      apiKey: "AIzaSyCqdS8gpqMnLo7I1ljT7WwxN1VvOacSLYY",
      authDomain: "rgbgearbox.firebaseapp.com",
      databaseURL: "https://rgbgearbox.firebaseio.com",
      projectId: "rgbgearbox",
      storageBucket: "rgbgearbox.appspot.com",
      messagingSenderId: "304327962656",
      appId: "1:304327962656:web:e379426be7415643414c45"
    })
    `
3. Change the project name in **.firebaserc** file.
4. Go to [Firebase Console](https://console.firebase.google.com), select your project, choose "Authentication" from left menu, select "SIGN-IN METHOD" and enable "Google Sign in" option. 
5. Set rules for Cloud Firestore 
    `rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {

        match /{documents=**} {
          allow read, write: if true;
        }

        match /messages/{docId} {
          allow read: if request.auth.uid != null;
          allow create: if canCreateMeassage();
        }

        function canCreateMessage() {
          let isSignedIn = request.auth.uid != null;
          let isOwner = request.auth.uid == request.resource.data.uid;

          let isNotBanned = exists(
            /databases/$(database)/documents/banned/$(request.auth.uid)
            ) == false;

          return isSignedIn && isOwner && isNotBanned;
        }
      }
    }
    `
6. You're all set! Build your app `npm run build` and deploy it on firebase using `firebase deploy`.

## Author

* [Nand Kishor](https://twitter.com/nandkk05)
