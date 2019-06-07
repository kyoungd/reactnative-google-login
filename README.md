# Project files for the react native firebase tutorial series on youtube. 

- ## [React Native Firebase Tutorials ](https://www.youtube.com/watch?v=ZcaQJoXY-3Q&list=PLy9JCsy2u97nVN5GxrjC6rv9XfyxoDtB_)

- Learn how to add Expo Google Login to your app and then save it to your Firebase Realtime Database 

### Install Dependencies

```sh 
yarn 
```

### Configure config.js - Add your firebase app config keys
```sh


# app.js of a sample firestore
https://firebase.google.com/docs/firestore/query-data/queries
https://github.com/iamshaunjp/firebase-firestore-playlist/tree/lesson-9

# initialize database
var config = {
    apiKey: "AIzaSyBrItE-kYM4dU0kaft7WYjb3749lCv42uA", ...
};
firebase.initializeApp(config);
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true }); 

# id of a document
li.setAttribute('data-id', doc.id);

// deleting data
cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('cafes').doc(id).delete();
});

// getting data
db.collection('cafes').orderBy('city').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderCafe(doc);
    });
});

db.collection('cafes').where('city', '==', 'manchester').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderCafe(doc);
    });
});

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
});

// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    });
});

// updating records (console demo)
db.collection('cafes').doc('DOgwUvtEQbjZohQNIeMr').update({
    name: 'mario world'
});

db.collection('cafes').doc('DOgwUvtEQbjZohQNIeMr').update({
    city: 'hong kong'
});

// setting data
db.collection('cafes').doc('DOgwUvtEQbjZohQNIeMr').set({
    city: 'hong kong'
});
