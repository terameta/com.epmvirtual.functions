import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as Handlebars from 'handlebars';

admin.initializeApp( functions.config().firebase );

const db = admin.firestore();
// const corsHandler = cors( { origin: true } );

export const previewMailTemplate = functions.https.onRequest( async ( req, res ) => {
	// corsHandler( req, res, () => {

	res.set( 'Access-Control-Allow-Origin', '*' );

	const settings = ( await db.doc( 'settings/general' ).get() ).data();
	const template = ( ( await db.doc( 'mailtemplates/' + req.query.id ).get() ).data() as any );
	const templateContent = template.content;
	const templateData = ( await db.doc( template.boundCollection + '/' + template.boundDocument ).get() ).data();
	const templateBase = Handlebars.compile( templateContent );
	const body = templateBase( { ...templateData, settings } );

	res.status( 200 ).send( body );

	// const template = Handlebars.compile( templateContent );
	// const body = template( { settings } );

	// db.doc( 'mailtemplates/' + req.query.id ).get().then( ( result ) => {
	// 	const source = ( result.data() as any ).content;

	// 	console.log( source );
	// 	console.log( body );

	// 	res.status( 200 ).send( body + source );
	// } ).catch( reason => {
	// 	console.error( 'Hey you catch' );
	// 	console.error( reason );
	// 	res.status( 500 ).end();
	// } );

	// } );
} );
