import React, { useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"
import { logout } from '../modules/user'

const Logout = () => {
    const dispatch = useDispatch()

    const onLogout = useCallback(() => dispatch(logout()), [dispatch])
    useEffect(() => {
        const fn = async () => {
            try {
                onLogout()
            } catch (error) {
                alert(error)
            }
        }
        fn()
    })
    return <></>
}

export default React.memo(Logout)