// seedFleet.mjs - For use with Node.js to seed fleet data into Firestore
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from 'fs';

// Check if service account key file exists and load it
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));
  console.log('✅ Service account key loaded successfully');
} catch (error) {
  console.error('❌ Error loading service account key:', error.message);
  console.log('\n📝 INSTRUCTIONS:');
  console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Save the file as "serviceAccountKey.json" in the project root directory');
  console.log('4. Run this script again\n');
  process.exit(1);
}

// Initialize Firebase Admin
try {
  initializeApp({
    credential: cert(serviceAccount)
  });
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = getFirestore();

// Driver authorization data - flat array for storing in Firestore
const authorisationMapping = [



module.exports = [
  {
    "client": "CRYSTAL CANDY",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "CBC",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "BV",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "STEINWEG SA",
    "city": "Johannesburg",
    "address": "1 BRIDGE CLOSE",
    "area": "CITY DEEP",
    "zipCode": "2049",
    "poBox": "PO BOX 86033",
    "postalCity": "Johannesburg",
    "postalZip": "2049",
    "companyReg": "2008/003471/07",
    "vatNo": "4430247694",
    "contact": "Candy Valerio",
    "telNo1": "+27 11 625 3272",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": "candy.valerio@za.steinweg.com"
  },
  {
    "client": "NATIONAL FOODS",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "MEGA MARKET",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "FWZ CARGO",
    "city": "Johannesburg",
    "address": "UNIT H6 JHI ROUTE 24, BUSINESS PARK, 50 HERMAN ROA",
    "area": "MEADOWDALE",
    "zipCode": "1614",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "PACIBRITE",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "TARONDALE",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "CASHEL VALLEY",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "WILLOTON",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "MANICA",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "TRADE LOGISTICS",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "JACOBS",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "SOUTHERN HEMISPHERE",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "NYAMAGAYA",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "CRAKE VALLEY",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "ETG",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "EMMAND",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "MAKANDI",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "MAKANDE ESTATES",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "BULWAYO DEPOT",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "HFR",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "APL",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "CAINS",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "AGROUTH",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "FANGUDU",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "BRANDHILL",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "BOMPONI",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "MATANUSKA FARM",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "BURMA ESTATE",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "ADMIN",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "DP WORLD",
    "city": "Johannesburg",
    "address": "Building J Clearwater Business Park",
    "area": "Boksburg Aston Manor",
    "zipCode": "1630",
    "poBox": "1630",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "1993/003465/07",
    "vatNo": "4240172140",
    "contact": "Karabo Tonyane",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": "karabo.tonyane@dpworld.com"
  },
  {
    "client": "BV FARM LMV",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "FALCON GATE",
    "city": "Johannesburg",
    "address": "17 5th Avenue",
    "area": "Bredell Kempton Park",
    "zipCode": "1630",
    "poBox": "1630",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "TERALCO",
    "city": "Johannesburg",
    "address": "Eastport Logistics Park, R21, Glen marais",
    "area": "KEMPTON",
    "zipCode": "1619",
    "poBox": "PO BOX 10475",
    "postalCity": "Johannesburg",
    "postalZip": "1630",
    "companyReg": "",
    "vatNo": "",
    "contact": "Gk Sanje",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": "ops.gk@teralco.co.za"
  },
  {
    "client": "BIG DUTCHEMAN",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "BIG DUTCHMAN",
    "city": "Johannesburg",
    "address": "edenvale",
    "area": "gauteng",
    "zipCode": "2049",
    "poBox": "PO BOX 276",
    "postalCity": "Johannesburg",
    "postalZip": "2049",
    "companyReg": "1966/002964/07",
    "vatNo": "4770105338",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "FX Logistics",
    "city": "Harare",
    "address": "Airport Rd",
    "area": "AP80",
    "zipCode": "",
    "poBox": "",
    "postalCity": "Harare",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "Denias Mukazi",
    "telNo1": "+263 78 263 9379",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": "denias.mukazi@fxlogistics.biz"
  },
  {
    "client": "DS Healthcare",
    "city": "Johannesburg",
    "address": "253 Aintree Road",
    "area": "Hoogland Ext 41 Northriding",
    "zipCode": "2169",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "Jacques Lourens",
    "telNo1": "+27 82 495 3358",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": "jacquesl@healthcareds.co.za"
  },
  {
    "client": "FEEDMIX",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "SPF",
    "city": "Cape Town",
    "address": "12 SAPPHIRE ST, VOGELVLEI BELLVILLE, WESTERN CAPE",
    "area": "BELLVILLE",
    "zipCode": "7530",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "Ane Coetzee",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": "anec@spfexport.com"
  },
  {
    "client": "Kroots Logistics",
    "city": "Cape Town",
    "address": "Unit 20, Bubesi House, Wellington Office Park, Wel",
    "area": "Wellington",
    "zipCode": "7550",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "Anika",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": "anika@koortsvervoer.co.za"
  },
  {
    "client": "Jakson",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "MARKETING",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "MARKETING EXPORT",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  },
  {
    "client": "FreightCo",
    "city": "",
    "address": "",
    "area": "",
    "zipCode": "",
    "poBox": "",
    "postalCity": "",
    "postalZip": "",
    "companyReg": "",
    "vatNo": "",
    "contact": "Pieter",
    "telNo1": "",
    "telNo2": "",
    "fax": "",
    "smsNo": "",
    "email": ""
  }
];