import React, { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addTask, getTasks } from "../modules/todo"
import useInput from "../lib/useInput"
import TodoItem from '../components/TodoItem'
import useFetchInfo from "../lib/useFetchInfo"
import { Types } from '../modules/todo'
import { Box, Container, IconButton, TextField } from "@material-ui/core"
import { AddCircle } from "@material-ui/icons"

const Todo = () => {
    const dispatch = useDispatch()
    const tasks = useSelector(state => state.todo.tasks)
    const { value: text, onChange: onChangeText, setValue: setText } = useInput('')

    const onLoadTask = useCallback(() => dispatch(getTasks()), [dispatch])
    const onAddTask = useCallback(data => dispatch(addTask(data)), [dispatch])
    const { isFetched } = useFetchInfo(Types.GET_TASKS)

    const onSubmit = (e) => {
        e.preventDefault()
        if (!text) {
            window.alert('내용을 입력하세요')
            return
        }
        onAddTask({ description: text })
        setText('')
    }

    useEffect(() => {
        if (!isFetched) onLoadTask()
    }, [onLoadTask, isFetched])

    return <Container maxWidth="md">
        <Box component='section' textAlign="center">
            <form onSubmit={onSubmit}>
                <TextField
                    value={text}
                    onChange={onChangeText} autoFocus
                    placeholder="할 일 입력..."
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        endAdornment: <IconButton type="submit" color="primary">
                            <AddCircle />
                        </IconButton>
                    }} />
            </form>
        </Box>
        <ul>
            {tasks.map?.(({ id, completed, description }) => <TodoItem
                key={id}
                id={id}
                completed={completed}
                description={description} />)}
        </ul>
    </Container>
}

export default React.memo(Todo)