import { app } from '..';
import client from './client'

export const getUser = () => {
    const { displayName: name, email, photoURL: avatar, emailVerified } = app.auth().currentUser
    return {
        name, email, avatar, emailVerified
    }
}
export const login = ({ email, password }) => client('user/login', { body: { email, password } })
export const logout = () => client('user/logout', { method: 'POST' })
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