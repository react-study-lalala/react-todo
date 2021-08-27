import React, { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import useInput from "../lib/useInput"
import { removeTask, updateTask } from "../modules/todo"
import { Button, Checkbox, TextField } from "@material-ui/core"
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const TodoWrapper = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 50%;
    margin: 1rem auto;
    padding: 1rem;
    border: 1px solid;
    font-size: 2rem;
`;

const TodoItem = ({ id, completed, description }) => {
    const [isModifying, setIsModifying] = useState(false)
    const { value: text, onChange: onChangeText } = useInput(description)
    const dispatch = useDispatch()

    const onUpdateTask = useCallback((data) => dispatch(updateTask(data)), [dispatch])
    const onChangeChecked = useCallback((e) => dispatch(updateTask({ id, description, completed: e.target.checked })), [id, description, dispatch])
    const onRemove = useCallback(() => {
        if (window.confirm('정말 삭제하시겠습니까?')) dispatch(removeTask(id))
    }, [id, dispatch])

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            onUpdate()
        }
    }

    const onUpdate = () => {
        onUpdateTask({ id, completed, description: text })
        onToggle()
    }

    const onToggle = () => {
        setIsModifying(val => !val)
    }

    return <TodoWrapper>
        <Checkbox color="primary" onChange={onChangeChecked} checked={completed} />
        {isModifying
            ? <ClickAwayListener onClickAway={onToggle}><TextField onChange={onChangeText} onKeyDown={onKeyDown} value={text} variant="outlined" /></ClickAwayListener>
            : <span onClick={onToggle}>{description}</span>}
        <div>
            {isModifying && <Button type="button" onClick={onUpdate}>💾</Button>}
            <Button type="button" onClick={onRemove}>❌</Button>
        </div>
    </TodoWrapper>
}

export default React.memo(TodoItem)