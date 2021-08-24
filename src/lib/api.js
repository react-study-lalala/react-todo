import { eventChannel } from 'redux-saga';
import { call, take } from 'redux-saga/effects';
import { app } from '..';
import client from './client'

export const getUser = function* () {
    const onAuthChanged = () => eventChannel(emit => {
        const authChannel = app.auth().onAuthStateChanged(user => {
            emit(user)
            return () => authChannel.close()
        })
        return authChannel
    })

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

export const updateUser = ({ name, password, age }) => client('user/me', { method: 'PUT', body: { name, password, age } })
export const uploadAvatar = (formData) => client('user/me/avatar', { body: formData })
export const removeUser = () => client('user/me', { method: 'DELETE' })

export const getTasks = () => client('task')
export const addTask = ({ description }) => client('task', { body: { description } })
export const updateTask = ({ id, description, completed }) => client(`task/${id}`, { method: 'PUT', body: { description, completed } })
export const removeTask = (id) => client(`task/${id}`, { method: 'DELETE' })