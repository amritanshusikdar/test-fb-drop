import faker from "faker";
import firebaseAdmin from "firebase-admin";
import cors from "cors";
import express from "express";
const app = express();

app.use(cors());

process.env.GCLOUD_PROJECT = "interns-test-4269";
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199";

firebaseAdmin.initializeApp();
const db = firebaseAdmin.firestore();
const storage = firebaseAdmin.storage();

// ====================FIRE-STORAGE=============================
const bucket = storage.bucket("gs://default-bucket");
const img = async () => {
  try {
    // const a = await bucket.file('8.png').name;
    const a = await bucket.file("8.png").getMetadata();
    // const a = await bucket.upload("C:/Users/shrut/Downloads/6.png");
    // const a = await bucket.file('8.png').delete();
    // const a = await bucket.file('8.png').get();
    console.log(a);
  } catch (err) {
    console.log(err);
  }
};

img();

// ======================FIRESTORE=========================
const newUser = async (factor = 1) => {
  try {
    // console.log(new Date());
    for (let i = 0; i <= factor - 1; i++) {
      await db.collection("users").add({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        confirmPassword: faker.internet.password(),
        contact: "+91 " + faker.phone.phoneNumber(),
        dob: faker.internet.domainName(),
        address: faker.datatype.datetime(),
      });
    }
  } catch (err) {
    console.log(err);
  }
};
newUser(0);

// -------------------GET ALL USER-------------
const getAllUserData = async () => {
  const data = await db.collection("users").get();
  data.forEach((document) =>
    console.log(
      document.get("name")
      // console.log(
      //     document.get('email'),
      //     console.log(document.get('contact'))
      // )
    )
  );
};
getAllUserData();

// --------------UPDATE ONE DOC----------------------
const update = async () => {
  try {
    await db.collection("users").doc("mYb8yujDcLyHV5lDbvMI").update({
      name: "shruti",
    });
    console.log("updated!!");
  } catch (error) {
    console.log("error");
  }
};
update();
