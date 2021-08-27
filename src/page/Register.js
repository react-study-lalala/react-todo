import useInput from '../lib/useInput'
import { useDispatch } from "react-redux"
import { register } from '../modules/user'
import { useHistory } from 'react-router-dom'
import React, { useCallback, useState } from 'react'
import { Button, Container, IconButton, TextField } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
const Register = () => {
    const { value: name, onChange: onChangeName } = useInput('')
    const { value: email, onChange: onChangeEmail } = useInput('')
    const { value: password, onChange: onChangePassword } = useInput('')
    const [showPassword, setShowPassword] = useState(false)

    const dispatch = useDispatch()
    const history = useHistory()
    const onRegister = useCallback(data => dispatch(register(data)), [dispatch])

    async function onSubmit(e) {
        e.preventDefault();
        try {
            onRegister({ name, email, password })
            history.push('/')
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }

    function onClickShowPassword() {
        setShowPassword(val => !val)
    }

    return <Container maxWidth="sm">
        <form onSubmit={onSubmit} style={{ textAlign: 'center' }}>
            <TextField label="Email" type="email" onChange={onChangeEmail} value={email} required fullWidth />
            <TextField label="Name" type="text" onChange={onChangeName} value={name} required fullWidth />
            <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                minLength="7"
                onChange={onChangePassword}
                value={password}
                required
                fullWidth
                InputProps={{
                    endAdornment: <IconButton type="button" color="primary" onClick={onClickShowPassword}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                }}
            />
            <Button type="submit">Register</Button>
        </form>
    </Container>
}

export default React.memo(Register)