import cors from "cors";
import express, { Request, Response } from "express";
import * as functions from "firebase-functions";
import firebaseAdmin from "firebase-admin";
import Busboy from "busboy";
import fs from "fs";
import path from "path";
import os from "os";
import { uuid } from "uuidv4";
const app = express();

app.use(cors());

firebaseAdmin.initializeApp();
const db = firebaseAdmin.firestore();
const storage = firebaseAdmin.storage();
const bucket = storage.bucket("gs://default-bucket");

// ---------------INTERFACE--------------------------
interface Users {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  contact: string;
  dob: string;
  address: string;
}

// --------------------FUNCTIONS----------------------
const newUser = async (data: any) => {
  try {
    await db.collection("users").add({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      contact: data.contact,
      dob: data.dob,
      address: data.address,
    });
  } catch (err) {
    console.log(err);
  }
};

const getAllUserData = async (reqEmail: string) => {
  try {
    const data = await db.collection("users").get();
    let names;
    data.forEach((document) => {
      names = document.get("email");
    });
    if (names == reqEmail) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

// ---------------------ROUTES-------------------------

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hey Shruti!" });
});

// ------------FIRE-STORE-----------
app.post("/register", async (req: Request, res: Response) => {
  try {
    const newRegister: Users = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      contact: "+91 " + req.body.contact,
      dob: req.body.dob,
      address: req.body.address,
    };
    const exist = await getAllUserData(newRegister.email);
    if (exist == true) {
      res.status(200).json({
        message: "User already exist with this Email-ID.",
      });
    } else {
      await newUser(newRegister);
      res.status(200).json({ message: "Registered Successfully!" });
    }
  } catch (err) {
    res.status(400).json({ message: "Server Error!!" });
  }
});

// -----------FIRE-STORAGE--------------

// app.post("/uploadFiles", async (req: Request, res: Response) => {
//   try {
//     console.log("Headers", req.headers);
//     const busboy = new Busboy({ headers: req.headers });

//     let imageToBeUploaded: { filepath: string; mimetype: string } = {
//       filepath: "",
//       mimetype: "",
//     };
//     console.log(imageToBeUploaded);
//     let imageFileName: string;
//     const generatedToken = uuid();

//     console.log("GeneratedToken", { generatedToken });
//     busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
//       console.log("On File", {
//         fieldname,
//         file,
//         filename,
//         encoding,
//         mimetype,
//       });
//       console.log("ON__FILE");
//       // if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
//       //     return res
//       //         .status(400)
//       //         .json({ error: 'Wrong file type submitted' });
//       // }
//       const imageExtension =
//         filename.split(".")[filename.split(".").length - 1];
//       imageFileName = `${Math.round(
//         Math.random() * 1000000000000
//       ).toString()}.${imageExtension}`;

//       const filepath = path.join(os.tmpdir(), imageFileName);
//       imageToBeUploaded = { filepath, mimetype };
//       file.pipe(fs.createWriteStream(filepath));
//       console.log("Image Extension");
//     });
//     busboy.on("finish", async () => {
//       try {
//         console.log("LINE-210: ON__FINISH");
//         console.log("LINE-212: GOT STORAGE BUCKET");
//         await bucket.upload(imageToBeUploaded.filepath, {
//           resumable: false,
//           metadata: {
//             metadata: {
//               contentType: imageToBeUploaded.mimetype,
//               firebaseStorageDownloadTokens: generatedToken,
//             },
//           },
//         });
//         console.log("LINE-222: UPLOAD CALLED SUCCESSFULLY");

//         const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;
//         await db.collection("images").add({ imageUrl: imageUrl });
//         res.status(200).json({
//           message: "image uploaded successfully",
//         });
//       } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "something went wrong" });
//       }
//     });
//     busboy.end(req.baseUrl);
//     console.log(req.pipe(busboy));
//     req.pipe(busboy);
//   } catch (err) {
//     res.status(400).json({
//       message: "Error Uploading the files!",
//       error: err,
//     });
//   }
// });

// ------------SECOND TRY (FIRE-STORAGE)-------------
// app.post('/uploadFiles2', (req: Request, res: Response) => {
//     console.log('LINE-260--Into route', req.headers);
//     const busboy = new Busboy({ headers: req.headers });

//     const imageToBeUploaded: { filepath: string; mimetype: string } = {
//         filepath: '',
//         mimetype: '',
//     };

//     const generatedToken = uuid();
//     console.log(generatedToken, imageToBeUploaded);

//     busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
//         console.log({ fieldname, file, filename, encoding, mimetype });
//         console.log('LINE-273--ON__FILE');
//         console.log('FILE EVENT');
//         res.status(200).send({ done: 'DONE_FILE' });
//     });

//     busboy.on('finish', () => {
//         console.log('FINISH EVENT');
//         res.status(200).send({ done: 'DONE_FINISH' });
//     });
// });

exports.api = functions.https.onRequest(app);
