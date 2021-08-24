import { eventChannel } from 'redux-saga';
import { call, take } from 'redux-saga/effects';
import { app } from '..';
import client from './client'

const onAuthChanged = () => eventChannel(emit => {
    const authChannel = app.auth().onAuthStateChanged(user => {
        if (user) emit(user)
        return () => authChannel.close()
    })
    return authChannel
})

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

export const login = ({ email, password }) => app.auth().signInWithEmailAndPassword(email, password).then(async userCredential => {
    const token = await userCredential.user.getIdToken()
    const { displayName, email, photoURL, emailVerified } = userCredential.user;
    return {
        user: { name: displayName, email, avatar: photoURL, emailVerified },
        token
    }
})

export const logout = () => app.auth().signOut()
export const register = ({ name, email, password, age }) => app
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

export const updateUser = async ({ name, password }) => {
    const user = app.auth().currentUser
    if (name) {
        await user.updateProfile({
            displayName: name
        })
    }
    if (password) {
        await user.updatePassword(password)
    }
    const { displayName, email, photoURL, emailVerified } = app.auth().currentUser;
    return { name: displayName, email, avatar: photoURL, emailVerified }
}
export const uploadAvatar = (formData) => client('user/me/avatar', { body: formData })
export const removeUser = () => app.auth().currentUser.delete()

export const getTasks = function* () {
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
export const addTask = async ({ description }) => {
    const uid = app.auth().currentUser.uid
    const todo = app.database().ref(`todos/${uid}`).push()
    const updateObj = {
        id: todo.key,
        completed: false,
        description
    }
    await todo.set(updateObj)
    return updateObj
}
export const updateTask = async ({ id, description, completed }) => {
    const uid = app.auth().currentUser.uid
    const todo = app.database().ref(`todos/${uid}/${id}`)
    const updateObj = {
        id,
        completed,
        description
    }
    await todo.update(updateObj)
    return updateObj
}
export const removeTask = (id) => client(`task/${id}`, { method: 'DELETE' })