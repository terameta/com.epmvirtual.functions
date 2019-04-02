import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// admin.initializeApp( functions.config().firebase );
const auth = admin.auth();

// const db = admin.firestore();
// const corsHandler = cors( { origin: true } );

export const listAllUsers = functions.https.onRequest( async ( req, res ) => {
	// corsHandler( req, res, () => {

	res.set( 'Access-Control-Allow-Origin', '*' );

	// auth.listUsers().then( userRecords => {
	// 	res.status( 200 ).send( userRecords.users.map( u => u.toJSON() ) );
	// } ).catch( res.status( 500 ).send );
	let idToken: string = '';
	// if ( ( !req.headers.authorization || !req.headers.authorization.startsWith( 'Bearer ' ) ) && !( req.cookies && req.cookies.__session ) ) {
	// 	res.status( 403 ).send( 'Unauthorized' );
	// } else {
	// 	if ( req.headers.authorization && req.headers.authorization.startsWith( 'Bearer ' ) ) {
	// 		idToken = req.headers.authorization.split( 'Bearer ' )[1];
	// 	} else if ( req.cookies ) {
	// 		idToken = req.cookies.__session;
	// 	} else {
	// 		// No cookie
	// 		res.status( 403 ).send( 'Unauthorized' );
	// 		return;
	// 	}
	// }
	if ( req.cookies ) idToken = req.cookies.__session;
	if ( req.headers.authorization && req.headers.authorization.startsWith( 'Bearer ' ) ) idToken = req.headers.authorization.split( 'Bearer ' )[1];


	admin.auth().verifyIdToken( idToken ).then( ( decodedIdToken ) => {
		return auth.listUsers().then( userRecords => {
			res.status( 200 ).send( userRecords.users.map( u => u.toJSON() ) );
		} ).catch( res.status( 500 ).send );
	} ).catch( ( error ) => {
		console.error( 'Error while verifying Firebase ID token:', error );
		res.status( 403 ).send( 'Unauthorized' );
	} );
} );

/*
const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session)) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
        'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if(req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized');
    return;
  }
  admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    return next();
  }).catch((error) => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  });
};
*/
