import useInput from "../lib/useInput"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login, Types } from '../modules/user'
import React, { useCallback, useEffect } from "react"
import useFetchInfo from "../lib/useFetchInfo"
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Container, Link, TextField } from "@material-ui/core"
const Login = () => {
    const history = useHistory()
    const { value: email, onChange: onChangeEmail } = useInput('')
    const { value: password, onChange: onChangePassword } = useInput('')
    const dispatch = useDispatch()
    const onLogin = useCallback((data) => dispatch(login(data)), [dispatch])
    const { isFetched } = useFetchInfo(Types.LOGIN)
    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            onLogin({ email, password })
        } catch (error) {
            alert(error)
        }
    }

    useEffect(() => {
        if (isFetched) {
            history.push('/')
        }
    }, [history, isFetched])

    return <Container maxWidth="sm">
        <form onSubmit={onSubmit}>
            <ul>
                <TextField label='Email' type='email' onChange={onChangeEmail} value={email} required fullWidth />
                <TextField label='Password' type='password' onChange={onChangePassword} value={password} required fullWidth />
            </ul>
            <Box textAlign="center">
                <Button type='submit'>Login</Button>
            </Box>
            <Box textAlign="center">
                아이디가 없으신가요? <Link component={RouterLink} to="/register">회원가입</Link>
            </Box>
        </form>
    </Container>

}

export default React.memo(Login)