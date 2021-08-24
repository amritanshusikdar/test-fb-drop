import { Request, Response } from "express"
// import firebase from "firebase"
import {  firebase } from './admin/init'
// import functions = require('firebase-functions')
// firebase.initializeApp(functions.config())

interface Users {
  email: string;
  password: string;
}

const createUser  = async (req: Request, res: Response) => {
    
    try {
      const newUser: Users = {
        email: req.body.email,
        password: req.body.password,
      };
      const newUserRef = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
      newUserRef.user?.sendEmailVerification();
      const newUserId = newUserRef.user?.uid;
      console.log(newUserId);

      const authToken = await newUserRef.user?.getIdToken()        
      res.status(200).send({
        status: 'success',
        message: 'entry added successfully',
        auth_token: authToken
      })
    } catch(error) {
        res.status(500).json(error.message)
    }
  }
  
  const  UserSignin  = async (req: Request, res: Response) => {

    try {
      const newUser: Users = {
        email: req.body.email,
        password: req.body.password,
      };
      const newUserRef = await firebase.auth().signInWithEmailAndPassword(newUser.email, newUser.password);
      
   const newUserId = newUserRef.user?.uid;
      console.log(newUserId);
      

    const authToken = await newUserRef.user?.getIdToken()
      res.status(200).send({
        status: 'success',
        message: 'entry added successfully',
        auth_token: authToken
      })
    } catch(error) {
        res.status(500).json(error.message)
    }
  }
              

 const  UserLogout  = async (req: Request, res: Response) => {
    
    try {
     
      firebase.auth().signOut();
      res.status(200).send({
        status: 'success',
        message: 'logout successfully',  
      })
    } catch(error) {
        res.status(500).json(error.message)
    }
  }
  
 const  Userdetails  = async (req: Request, res: Response) => {

    try {
     
      const newUserRef = await firebase.auth().currentUser;
      
        const newUserId = newUserRef?.email;
      console.log(newUserId);
 
      res.status(200).send({
        status: 'success',
        message: 'request successfully executed',
        email : newUserId
      })
    } catch(error) {
        res.status(500).json(error.message)
    }
  }

  const  checkIfAuthenticated  = async (req: Request, res: Response) => {
    try {
     
       firebase.auth().onAuthStateChanged((user) => {
        if (user) {  
          var uid = user.uid;
          res.status(200).send({
            status: 'success',
            message: 'is already signed in you can access the data ',
            uid : uid ,
           // check : check.name
           
          })
          // ...
        } else {
          // User is signed out
          // ...
          res.send("not signed in ")
        }
      });
     
     
    } catch(error) {
        res.status(500).json(error.message)
    }
  }

  const  deleteuser  = async (req: Request, res: Response) => {

    try {
     
      const user = firebase.auth().currentUser;

      user?.delete().then(() => {
        // User deleted.
        res.status(200).send({
          status: 'success',
          message: 'deleted successfully',
         
        })
      }).catch((error) => {
        // An error ocurred
        // ...
        res.send({
          status: 'not deleted',
          message: ' error in deleting user ',
         
        })
        
      });
 
     
    } catch(error) {
        res.status(500).json(error.message)
    }
  }

 
  const updatepassword  = async (req: Request, res: Response) => {
    
    try {
     
      const user = firebase.auth().currentUser;
      const newPassword =req.body.password;
      
      user?.updatePassword(newPassword)
      res.send({
        status: 'successful ',
        message: ' password updated '   
      })

      
    } catch(error) {
        res.status(500).json(error.message)
    }
  }

  const  sendEmailVerification = async (req: Request, res: Response) => {
    
    try {
     
      firebase.auth().currentUser?.sendEmailVerification()
      
      res.status(200).send({
        status: 'success',
        message: 'email sent  successfully',  
      })
    } catch(error) {
        res.status(500).json(error.message)
    }
  }
  
 

  
  export { createUser , UserSignin , UserLogout, Userdetails , checkIfAuthenticated  , deleteuser  , updatepassword , sendEmailVerification}

