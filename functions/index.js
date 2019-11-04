const functions = require('firebase-functions');
const uuidv5 = require('uuid/v5');
const uuidv4 = require('uuid/v4');

exports.addUUid = functions.database
  .ref('/users/{userId}')
  .onCreate(snapshot => {
    const userRef = snapshot.ref;
    const userData = snapshot.val();
    const uniqueIdentifier = uuidv4();
    const uuidName = `${userData.firstName} ${userData.lastName} ${uniqueIdentifier}`;
    const userId = uuidv5(uuidName, uuidv5.URL);
    return userRef.update({
      userId,
    });
  });
