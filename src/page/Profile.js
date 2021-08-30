import useInput from "../lib/useInput"
import useFile from "../lib/useFile"
import React, { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUser, updateUser, uploadAvatar, removeUser, Types } from '../modules/user'
import useFetchInfo from "../lib/useFetchInfo"
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Box, Button, Container, FormControl, Input, InputLabel } from "@material-ui/core"
const useStyles = makeStyles((theme) => ({
    centeredImg: {
        width: theme.spacing(16),
        height: theme.spacing(16),
        margin: '0 auto'
    },
    formGutter: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));


const Profile = () => {
    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const { isFetched } = useFetchInfo(Types.GET_USER)
    const classes = useStyles();

    const { value: file, onChange: onChangeFile } = useFile(undefined)
    const { value: email, setValue: setEmail } = useInput('')
    const { value: name, onChange: onChangeName, setValue: setName } = useInput('')
    const { value: password, onChange: onChangePassword } = useInput('')

    const upload = useCallback((file) => dispatch(uploadAvatar(file)), [dispatch])
    const onLoadUser = useCallback(() => dispatch(getUser()), [dispatch])
    const onUpdateUser = useCallback((data) => dispatch(updateUser(data)), [dispatch])

    const onSubmit = (e) => {
        e.preventDefault()
        onUpdateUser({ name, password: password.length > 0 ? password : undefined })
    }

    const onRemoveUser = () => {
        if (window.confirm('Do you want to remove this account?')) {
            dispatch(removeUser())
            // history.push('/')
        }
    }

    useEffect(() => {
        if (!isFetched) {
            onLoadUser()
        }
    }, [dispatch, onLoadUser, isFetched])

    useEffect(() => {
        if (user) {
            setEmail(user.email)
            setName(user.name)
        }
    }, [user, setEmail, setName])

    useEffect(() => {
        if (file) {
            upload(file)
        }
    }, [file, upload])

    return <Container maxWidth="sm" style={{ paddingTop: 16 }}>
        <form onSubmit={onSubmit}>
            {user && <Avatar className={classes.centeredImg} src={user.avatar} alt="profile avatar" />}
            <FormControl className={classes.formGutter} fullWidth>
                <InputLabel htmlFor="avatar">Avatar</InputLabel>
                <Input id="avatar" type="file" onChange={onChangeFile} />
            </FormControl>
            <FormControl className={classes.formGutter} fullWidth>
                <InputLabel htmlFor='email'>Email</InputLabel>
                <Input id='email' type='email' value={email} disabled />
            </FormControl>
            <FormControl className={classes.formGutter} fullWidth>
                <InputLabel htmlFor='name'>
                    Name
                </InputLabel>
                <Input id='name' type='text' onChange={onChangeName} value={name} />
            </FormControl>
            <FormControl className={classes.formGutter} fullWidth>
                <InputLabel htmlFor='password'>
                    Password
                </InputLabel>
                <Input id='password' type='password' onChange={onChangePassword} value={password} minLength="7" />
            </FormControl>
            <Box style={{ textAlign: 'center' }}>
                <Button color="primary" type="submit">수정</Button>
                <Button color="secondary" type="button" onClick={onRemoveUser}>회원 탈퇴</Button>
            </Box>
        </form>
    </Container>
}

export default React.memo(Profile)