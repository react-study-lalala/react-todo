async function getFirebaseClient() {
    const { default: firebase } = await import("firebase/app")

    await Promise.all([
        import("firebase/auth"),
        import('firebase/database'),
        import("firebase/storage"),
    ])

    firebase.initializeApp({
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
    })

    return firebase
}

let cached = null

export function fb() {

    if (cached || process.server) return cached

    cached = getFirebaseClient()
    return cached
}