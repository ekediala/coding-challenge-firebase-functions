const functions = require('firebase-functions');
const uuidv5 = require('uuid/v5');
const uuidv4 = require('uuid/v4');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const express = require('express');
const cors = require('cors');
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post('/create', (req, res) => {
  const userRef = admin.database().ref('/users');
  const uniqueIdentifier = uuidv4();
  const userData = req.body;
  const key = `${userData.firstName}-${userData.lastName}-${uniqueIdentifier}`;
  userData.key = key;
  userRef.push(userData);
  res.end();
});

// Expose Express API as a single Cloud Function:
exports.createUser = functions.https.onRequest(app);

exports.addUuid = functions.database
  .ref('/users/{userId}')
  .onCreate(snapshot => {
    const userRef = snapshot.ref;
    const uniqueIdentifier = uuidv4();
    const userData = snapshot.val();
    const name = `${userData.firstName} ${userData.lastName} ${uniqueIdentifier}`;
    const userId = uuidv5(name, uuidv5.DNS);
    return userRef.update({ userId });
  });
