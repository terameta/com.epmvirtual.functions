import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// admin.initializeApp( functions.config().firebase );
const auth = admin.auth();

const db = admin.firestore();
// const corsHandler = cors( { origin: true } );

export const updateUserCollection = functions.https.onRequest( async ( req, res ) => {

	res.set( 'Access-Control-Allow-Origin', '*' );

	auth.listUsers().then( async ( userRecords ) => {
		console.log( userRecords.users );
		// var setWithMerge = cityRef.set( {
		// 	capital: true
		// }, { merge: true } );

		for ( const user of userRecords.users ) {
			const uItem = { email: user.email, displayName: user.displayName };
			await db.doc( 'users/' + user.uid ).set( uItem, { merge: true } ).catch( console.error );
		}

		res.status( 200 ).send( 'OK' );
	} ).catch( res.status( 500 ).send );

} );
