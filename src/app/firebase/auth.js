import { auth } from "@/app/firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";

const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "Account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/invalid-credential":
      return "Check your email and password.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/email-already-in-use":
      return "Account already exists.";
    case "auth/unauthorized-domain":
      return "Service temporarily unavailable.";
    case "auth/cancelled-popup-request":
      return "Popup was cancelled.";
    case "auth/too-many-requests":
      return "Too many login attempts. Please try again later.";
    default:
      return "An error occurred: " + errorCode;
  }
};

const loginWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const db = getFirestore();
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }

    const userData = {
      uid: user.uid,
      email: user.email,
      name: userDoc.data().name || "",
      role: userDoc.data().role || "user",
      imageURL: userDoc.data().imageURL || user.photoURL || null,
      accessToken: user.accessToken,
      lastLoginAt: Date.now(),
    };

    return { user: userData };
  } catch (error) {
    const formattedError = getErrorMessage(error.code);
    return { error: formattedError };
  }
};

const SignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user exists in Firestore
    const db = getFirestore();
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    let userData;

    const firstName = user.displayName?.split(" ")[0] || "";

    if (!userDoc.exists()) {
      // If user doesn't exist, create new user document
      userData = {
        name: firstName,
        email: user.email,
        role: "user",
        imageURL: user.photoURL || null,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };
      await setDoc(userDocRef, userData);
    } else {
      // For existing users, preserve their data and only update lastLoginAt
      userData = userDoc.data();
      await setDoc(
        userDocRef,
        { lastLoginAt: Date.now() },
        { merge: true }
      );
    }

    // Return user data with preserved role
    return {
      user: {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        role: userData.role,
        imageURL: userData.imageURL || user.photoURL || null,
        accessToken: user.accessToken,
        lastLoginAt: Date.now(),
      },
    };
  } catch (error) {
    const formattedError = getErrorMessage(error.code);
    return { error: formattedError };
  }
};

const registerWithEmailPassword = async (name, email, password) => {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create user document in Firestore
    const firstName = name?.split(" ")[0] || "";
    const db = getFirestore();
    const userDocRef = doc(db, "users", user.uid);

    const userData = {
      name: firstName,
      email,
      role: "user",
      imageURL: user?.photoURL || null,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    };

    // Save to Firestore
    await setDoc(userDocRef, userData);

    // Return complete user object
    return {
      user: {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        role: userData.role,
        imageURL: userData?.imageURL || null,
        accessToken: user.accessToken,
        lastLoginAt: userData.lastLoginAt,
      },
    };
  } catch (error) {
    const formattedError = getErrorMessage(error.code);
    return { error: formattedError };
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    toast.warning("Logged out", {
      autoClose: 1500,
    });
  } catch (error) {
    return { error: error.message };
  }
};

const AUTH = {
  LOGIN_WITH_EMAIL_PASSWORD: loginWithEmailPassword,
  REGISTER_WITH_EMAIL_PASSWORD: registerWithEmailPassword,
  SIGNIN_WITH_GOOGLE: SignInWithGoogle,
  LOGOUT: logout,
};

export default AUTH;
