"use server";

import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:gotest.rz@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

let subscription = null;

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function subscribeUser(sub) {
  // Convert ArrayBuffer keys to base64 strings
  if (!sub) {
    throw new Error("Subscription object is required");
  }
  subscription = {
    endpoint: sub.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(sub.keys.p256dh), // Convert to base64 string
      auth: arrayBufferToBase64(sub.keys.auth), // Convert to base64 string
    },
  };
  // Store subscription in local storage only if in the browser
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })

  if (typeof window !== "undefined") {
    localStorage.setItem("pushSubscription", JSON.stringify(subscription));
  }
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
}

export async function sendNotification(message) {
  console.log("Current subscription:", subscription);
  if (!subscription) {
    // Attempt to retrieve subscription from local storage only if in the browser
    if (typeof window !== "undefined") {
      const storedSubscription = localStorage.getItem("pushSubscription");
      if (storedSubscription) {
        subscription = JSON.parse(storedSubscription);
      } else {
        throw new Error("No subscription available");
      }
    } else {
      throw new Error("No subscription available and not in a browser context");
    }
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Test Notification",
        body: message,
        icon: "/icon.png",
      })
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
