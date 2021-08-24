import cors from 'cors';
import express, {Request, Response} from 'express';
import * as functions from 'firebase-functions';
 import { createUser,  UserSignin , UserLogout , Userdetails, checkIfAuthenticated , deleteuser ,  updatepassword , sendEmailVerification} from './entrycontroller'
 // import {checkIfAuthenticated } from './authmiddleware'
 // import { admin } from '@admin/init';

const app = express();

app.use(cors());

// never do this
// app.use(validateFirebaseIdToken);





app.get('/', (req : Request , res:Response) => {
    res.status(200).json({ message: 'Hey Abhishek!' });
});

// app.post("/register", async (req: Request, res: Response) => {
//     const user = req.body;
//     await admin.firestore().collection("users").add(user);
//     res.status(201).send('successful registration ');
//    });

app.post('/createUser', createUser)
 app.post('/UserSignin', UserSignin)
app.post('/UserLogout',UserLogout)
app.post('/Userdetails',Userdetails)
app.post('/checkIfAuthenticated',checkIfAuthenticated)
app.post('/deleteuser',deleteuser)
app.post('/updatepassword',updatepassword)
app.post('/sendEmailVerification',sendEmailVerification)






exports.api = functions.https.onRequest(app);
