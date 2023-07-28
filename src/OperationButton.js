import React from 'react'
import { ACTION } from './App'

const OperationButton = ({ operation, dispatch }) => {
    return (
        <button onClick={() => dispatch({ type: ACTION.CHOOSE_OPERATION, payload: { operation } })}>
            {operation}
        </button>
    )
}

export default OperationButton