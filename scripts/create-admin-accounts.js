const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDEI2A9AtV9PjVXN7WJCoATdbCBHFVcBe8",
  authDomain: "eksul-229ec.firebaseapp.com",
  projectId: "eksul-229ec",
  storageBucket: "eksul-229ec.appspot.com",
  messagingSenderId: "336428655837",
  appId: "1:336428655837:web:d1052473b9b76f910aa734",
  measurementId: "G-4QCD0L2LVC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const adminAccounts = [
  {
    email: "admin@smktibazma.sch.id",
    password: "admin123456",
    name: "Super Administrator",
    role: "super_admin"
  },
  {
    email: "robotik@smktibazma.sch.id", 
    password: "robotik123",
    name: "Admin Robotik",
    role: "robotik_admin"
  },
  {
    email: "silat@smktibazma.sch.id",
    password: "silat123", 
    name: "Admin Pencak Silat",
    role: "silat_admin"
  },
  {
    email: "futsal@smktibazma.sch.id",
    password: "futsal123",
    name: "Admin Futsal", 
    role: "futsal_admin"
  },
  {
    email: "band@smktibazma.sch.id",
    password: "band123",
    name: "Admin Band",
    role: "band_admin"
  },
  {
    email: "hadroh@smktibazma.sch.id",
    password: "hadroh123",
    name: "Admin Hadroh",
    role: "hadroh_admin"
  },
  {
    email: "qori@smktibazma.sch.id",
    password: "qori123",
    name: "Admin Qori",
    role: "qori_admin"
  },
  {
    email: "paskib@smktibazma.sch.id",
    password: "paskib123",
    name: "Admin Paskibra",
    role: "paskib_admin"
  },
  {
    email: "softwaredev@smktibazma.sch.id",
    password: "softwaredev123",
    name: "Admin Software Development",
    role: "software_dev_admin"
  }
];

async function createAdminAccounts() {
  console.log('🚀 Creating admin accounts...');
  
  for (const admin of adminAccounts) {
    try {
      console.log(`Creating account for ${admin.email}...`);
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, admin.email, admin.password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: admin.email,
        name: admin.name,
        role: admin.role,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        lastLogin: null
      });
      
      console.log(`✅ Successfully created ${admin.role}: ${admin.email}`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  Account ${admin.email} already exists`);
      } else {
        console.error(`❌ Error creating ${admin.email}:`, error.message);
      }
    }
  }
  
  console.log('🎉 Admin account creation completed!');
  console.log('\n📋 Login Credentials:');
  adminAccounts.forEach(admin => {
    console.log(`${admin.role}: ${admin.email} / ${admin.password}`);
  });
}

createAdminAccounts().catch(console.error);