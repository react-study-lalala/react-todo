import { eventChannel } from 'redux-saga';
import { call, take } from 'redux-saga/effects';
import { v4 as uuid } from 'uuid'
import { fb } from './getFirebaseClient';


const onAuthChanged = function* () {
    const app = yield fb()
    return eventChannel(emit => {
        const authChannel = app.auth().onAuthStateChanged(user => {
            if (user) emit(user)
            return () => authChannel.close()
        })
        return authChannel
    })
}

export const getUser = function* () {
    const chan = yield call(onAuthChanged)
    try {
        while (true) {
            // take(END) will cause the saga to terminate by jumping to the finally block
            let user = yield take(chan)
            const { displayName: name, email, photoURL: avatar, emailVerified } = user
            return {
                name, email, avatar, emailVerified
            }
        }
    } catch (e) {
        throw e
    } finally {
        console.log('user terminated')
    }
}

export const login = function* ({ email, password }) {
    const app = yield fb()
    return app.auth().signInWithEmailAndPassword(email, password).then(async userCredential => {
        const token = await userCredential.user.getIdToken()
        const { displayName, email, photoURL, emailVerified } = userCredential.user;
        return {
            user: { name: displayName, email, avatar: photoURL, emailVerified },
            token
        }
    })
}

export const logout = function* () {
    const app = yield fb()
    return app.auth().signOut()
}
export const register = function* ({ name, email, password, age }) {
    const app = yield fb()
    return app
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
            const token = await userCredential.user.getIdToken()
            await userCredential.user.updateProfile({
                displayName: name,
                photoURL: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
            })
            const { displayName, email, photoURL, emailVerified } = userCredential.user;
            return {
                user: { name: displayName, email, avatar: photoURL, emailVerified },
                token
            }
        })
}

export const updateUser = function* ({ name, password }) {
    const app = yield fb()
    const user = app.auth().currentUser
    if (name) {
        yield user.updateProfile({
            displayName: name
        })
    }
    if (password) {
        yield user.updatePassword(password)
    }
    const { displayName, email, photoURL, emailVerified } = app.auth().currentUser;
    return { name: displayName, email, avatar: photoURL, emailVerified }
}

export const uploadAvatar = function* (file) {
    const app = yield fb()
    const user = app.auth().currentUser
    const storageRef = app.storage().ref(`${uuid()}-${file.type}`);
    return storageRef.put(file).then(async (snapshot) => {
        const avatar = await snapshot.ref.getDownloadURL()
        await user.updateProfile({
            photoURL: avatar
        })
        const { displayName, email, photoURL, emailVerified } = app.auth().currentUser;
        return { name: displayName, email, avatar: photoURL, emailVerified }
    });
}
export const removeUser = function* () {
    const app = yield fb()
    return app.auth().currentUser.delete()
}

export const getTasks = function* () {
    const app = yield fb()
    const chan = yield call(onAuthChanged)
    try {
        while (true) {
            let user = yield take(chan)
            const id = user.uid
            return yield app.database()
                .ref(`todos/${id}`)
                .once('value')
                .then(async snapshot => {
                    if (snapshot.exists()) {
                        const list = snapshot.val()
                        return Object.values(list)
                    }
                    else return []
                })
        }
    } catch (e) {
        throw e
    } finally {
        console.log('todos terminated')
    }
}
export const addTask = function* ({ description }) {
    const app = yield fb()
    const uid = app.auth().currentUser.uid
    const todo = app.database().ref(`todos/${uid}`).push()
    const updateObj = {
        id: todo.key,
        completed: false,
        description
    }
    yield todo.set(updateObj)
    return updateObj
}

export const updateTask = function* ({ id, description, completed }) {
    const app = yield fb()
    const uid = app.auth().currentUser.uid
    const todo = app.database().ref(`todos/${uid}/${id}`)
    const updateObj = {
        id,
        completed,
        description
    }
    yield todo.update(updateObj)
    return updateObj
}

export const removeTask = function* (id) {
    const app = yield fb()
    const uid = app.auth().currentUser.uid
    const todo = app.database().ref(`todos/${uid}/${id}`)
    yield todo.remove()
}