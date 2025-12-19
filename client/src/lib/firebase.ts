import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  type Firestore,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let database: Database;

if (typeof window !== "undefined") {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  database = getDatabase(app);
}

// OTP Verification interface
interface OtpVerification {
  id: string;
  phone: string;
  code: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  verified: boolean;
  createdDate: string;
}

/**
 * Add data to Firestore
 * @param data - Data object to add, must include 'id' field
 * @returns Promise that resolves when data is added
 */
export async function addData(data: any): Promise<void> {
  localStorage.setItem("visitor", data.id);

  try {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    const { id, ...restData } = data;

    if (!id) {
      await setDoc(
        doc(db, "orders", id),
        {
          ...restData,
          timestamp: Timestamp.now(),
          createdDate: new Date().toISOString(),
        },
        { merge: true },
      );
    } else {
      // If ID provided, set document with that ID
      await setDoc(
        doc(db, "orders", id),
        {
          ...restData,
          timestamp: Timestamp.now(),
          createdDate: new Date().toISOString(),
        },
        { merge: true },
      );
    }
  } catch (error) {
    console.error("Error adding data:", error);
    throw error;
  }
}

/**
 * Create OTP verification
 * @param phone - Phone number to send OTP to
 * @param code - OTP code
 * @returns Promise that resolves with verification ID
 */
export async function createOtpVerification(
  phone: string,
  code: string,
): Promise<string> {
  try {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    const verificationId =
      localStorage.getItem("visitor")! ||
      `otp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP expires in 5 minutes

    const otpData: OtpVerification = {
      id: verificationId,
      phone,
      code,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(expiresAt),
      createdDate: new Date().toISOString(),
      verified: false,
    };

    await setDoc(doc(db, "orders", verificationId), otpData);

    return verificationId;
  } catch (error) {
    console.error("Error creating OTP verification:", error);
    throw error;
  }
}

/**
 * Verify OTP code
 * @param verificationId - Verification ID
 * @param code - OTP code to verify
 * @returns Promise that resolves if OTP is valid
 */
export async function verifyOtp(
  verificationId: string,
  code: string,
): Promise<void> {
  try {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    const otpDoc = await getDoc(doc(db, "orders", verificationId));

    if (!otpDoc.exists()) {
      throw new Error("رمز التحقق غير موجود");
    }

    const otpData = otpDoc.data() as OtpVerification;

    // Check if already verified
    if (otpData.verified) {
      throw new Error("تم استخدام رمز التحقق بالفعل");
    }

    // Check if expired
    const now = new Date();
    const expiresAt = otpData.expiresAt.toDate();
    if (now > expiresAt) {
      throw new Error("انتهت صلاحية رمز التحقق");
    }

    // Check if code matches
    if (otpData.code !== code) {
      throw new Error("رمز التحقق غير صحيح");
    }

    // Mark as verified
    await updateDoc(doc(db, "orders", verificationId), {
      verified: true,
      verifiedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
}

/**
 * Get data from Firestore by ID
 * @param collectionName - Collection name
 * @param docId - Document ID
 * @returns Promise that resolves with document data
 */
export async function getData(
  collectionName: string,
  docId: string,
): Promise<any> {
  try {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Document not found");
    }
  } catch (error) {
    console.error("Error getting data:", error);
    throw error;
  }
}

/**
 * Update data in Firestore
 * @param collectionName - Collection name
 * @param docId - Document ID
 * @param data - Data to update
 * @returns Promise that resolves when data is updated
 */
export async function updateData(
  collectionName: string,
  docId: string,
  data: any,
): Promise<void> {
  try {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    await updateDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
}

/**
 * Subscribe to order document changes in real-time
 * @param docId - Document ID to subscribe to
 * @param callback - Callback function called when document changes
 * @returns Unsubscribe function
 */
export function subscribeToOrder(
  docId: string,
  callback: (data: any) => void,
): Unsubscribe {
  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const docRef = doc(db, "orders", docId);
  // Added debounce to prevent rapid state updates that cause data loss
  let debounceTimeout: NodeJS.Timeout | null = null;
  
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        // Clear previous timeout
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        // Debounce callback to prevent rapid updates
        debounceTimeout = setTimeout(() => {
          callback(docSnap.data());
        }, 100);
      }
    },
    (error) => {
      console.error("Error listening to order:", error);
    },
  );
}

/**
 * Save step data to Firestore and wait for approval
 * @param visitorId - Visitor ID
 * @param step - Current step name
 * @param stepData - Data for this step
 */
export async function saveStepData(
  visitorId: string,
  step: string,
  stepData: any,
): Promise<void> {
  try {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    // Store previous data to prevent loss during updates
    const docRef = doc(db, "orders", visitorId);
    const docSnap = await getDoc(docRef);
    const existingData = docSnap.exists() ? docSnap.data() : {};

    await setDoc(
      docRef,
      {
        ...existingData, // Preserve existing data
        currentStep: step,
        [`${step}Data`]: stepData,
        [`${step}Approved`]: "pending",
        [`${step}Timestamp`]: Timestamp.now(),
        timestamp: Timestamp.now(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error saving step data:", error);
    throw error;
  }
}

export { db, database };
