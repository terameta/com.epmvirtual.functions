import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import * as cors from 'cors';

admin.initializeApp( functions.config().firebase );

const db = admin.firestore();
// const corsHandler = cors( { origin: true } );

export const previewMailTemplate = functions.https.onRequest( ( req, res ) => {
	// corsHandler( req, res, () => {
	db.doc( 'mailtemplates/' + req.query.id ).get().then( ( result ) => {
		res.set( 'Access-Control-Allow-Origin', '*' );
		res.status( 200 ).send( ( result.data() as any ).content );
	} ).catch( reason => {
		console.error( 'Hey you catch' );
		console.error( reason );
		res.status( 500 ).end();
	} );
	// } );
} );
