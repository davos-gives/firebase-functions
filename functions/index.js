const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

// // Take the text parameter passed to this HTTP endpoint and insert it into the
// // Realtime Database under the path /messages/:pushId/original
// exports.addMessage = functions.https.onRequest((req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
//     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     return res.redirect(303, snapshot.ref.toString());
//   });
// });

exports.pushRecurringsToDonorEvents = functions.database.ref('/recurrings/{pushId}')
    .onCreate((snapshot, context) => {
      const original = snapshot.val();
      return admin.database().ref(`/histories`).push(
        {
          type: "recurring",
          status: "success",
          frequency: `${original.frequency}`,
          timestamp: Date.now(),
          amount: `${original.amount}`,
          donor: `${original.donor}`,
        }
      )
    });

exports.pushDonationsToDonorEvents = functions.database.ref('/donations/{pushId}')
    .onCreate((snapshot, context) => {
      const original = snapshot.val();
      return admin.database().ref(`/histories`).push(
        {
          type: "payment",
          status: "success",
          frequency: `${original.frequency}`,
          timestamp: Date.now(),
          amount: `${original.amount}`,
          donor: `${original.donor}`,
        }
      )
    });


exports.pushRecurringsDeletionsToDonorEvents = functions.database.ref('/recurrings/{pushId}')
    .onDelete((snapshot, context) => {
      const original = snapshot.val();
      return admin.database().ref(`/histories`).push(
        {
          type: "recurring",
          status: "cancellation",
          frequency: `${original.frequency}`,
          timestamp: Date.now(),
          amount: `${original.amount}`,
          donor: `${original.donor}`,
        }
      )
    });

exports.pushRecurringsChangesToDonorEvents = functions.database.ref('/recurrings/{pushId}')
    .onUpdate((snapshot, context) => {
      const before = snapshot.before._data;
      const after = snapshot.after._data;
      const beforeAmount = before.amount;
      const beforeFrequency = before.frequency;
      const afterAmount = after.amount;
      const afterFrequency = after.frequency;


      if ( beforeAmount === afterAmount ) {
        return admin.database().ref(`/histories`).push(
          {
            type: "recurring",
            status: "updatedFrequency",
            timestamp: Date.now(),
            donor: `${before.donor}`,
            beforeAmount: `${beforeAmount}`,
            afterAmount: `${afterAmount}`,
            beforeFrequency: `${beforeFrequency}`,
            afterFrequency: `${afterFrequency}`,
          }
        )
      }

      if (beforeAmount > afterAmount && beforeFrequency === afterFrequency) {
        return admin.database().ref(`/histories`).push(
          {
            type: "recurring",
            status: "updateIncreaseAmountNotFrequency",
            timestamp: Date.now(),
            donor: `${before.donor}`,
            beforeAmount: `${beforeAmount}`,
            afterAmount: `${afterAmount}`,
            beforeFrequency: `${beforeFrequency}`,
            afterFrequency: `${afterFrequency}`,
          }
        )
      }

      if (beforeAmount > afterAmount && beforeFrequency !== afterFrequency) {
        return admin.database().ref(`/histories`).push(
          {
            type: "recurring",
            status: "updateIncreaseAmountAndFrequency",
            timestamp: Date.now(),
            donor: `${before.donor}`,
            beforeAmount: `${beforeAmount}`,
            afterAmount: `${afterAmount}`,
            beforeFrequency: `${beforeFrequency}`,
            afterFrequency: `${afterFrequency}`,
          }
        )
      }

      if (beforeAmount < afterAmount && beforeFrequency === afterFrequency) {
        return admin.database().ref(`/histories`).push(
          {
            type: "recurring",
            status: "updateDecreaseAmountNotFrequency",
            timestamp: Date.now(),
            donor: `${before.donor}`,
            beforeAmount: `${beforeAmount}`,
            afterAmount: `${afterAmount}`,
            beforeFrequency: `${beforeFrequency}`,
            afterFrequency: `${afterFrequency}`,
          }
        )
      }

      if (beforeAmount < afterAmount && beforeFrequency !== afterFrequency) {
        return admin.database().ref(`/histories`).push(
          {
            type: "recurring",
            status: "updateDecreaseAmountAndFrequency",
            timestamp: Date.now(),
            donor: `${before.donor}`,
            beforeAmount: `${beforeAmount}`,
            afterAmount: `${afterAmount}`,
            beforeFrequency: `${beforeFrequency}`,
            afterFrequency: `${afterFrequency}`,
          }
        )
      }
});


exports.pushHistoryToDonors = functions.database.ref('/histories/{pushId}')
    .onCreate((snapshot, context) => {
      const original = snapshot.val();

      console.log(original);
      console.log(context);
      let donor = original.donor;


      return admin.database().ref(`/donors/${donor}/histories`).update({[`${context.params.pushId}`]: true});

    });
