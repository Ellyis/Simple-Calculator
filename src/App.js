import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTION = {
  ADD_DIGIT: 'add-digit',
  DELETE_DIGIT: 'delete-digit',
  CLEAR: 'clear',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate',
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }        
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTION.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        }
      }
      if (state.currentOperand == null)
        return state
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
          isNegative: false,
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTION.CLEAR:
      return {}
    case ACTION.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        if (payload.operation === "-") {
          return {
            ...state,
            isNegative: true,
          }
        }
        return state
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          // isNegative: false,
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.isNegative ? convertNegative(state.currentOperand) : state.currentOperand,
          currentOperand: null,
          isNegative: false,
        }
      }
      return {
        ...state,
        operation: payload.operation,
        previousOperand: evaluate(state),
        currentOperand: null,
        isNegative: false,
      }
    case ACTION.EVALUATE:
      if (state.operation == null || state.previousOperand == null || state.currentOperand == null) {
        return state
      }
      return {
        ...state,
        operation: null,
        previousOperand: null,
        currentOperand: evaluate(state),
        overwrite: true,
      }
    default: return state
  }
}

const convertNegative = (currentOperand) => {
  const current = parseFloat(currentOperand);
  const converted = current * -1;

  return converted.toString();
}

const evaluate = ({ currentOperand, previousOperand, operation }) => {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) 
    return ""
  
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    default:
      return "" 
  }
  
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us")

const formatOperand = (operand) => {
  console.log(typeof operand === "number")
  if (operand == null) return
  const [integer, decimal] = operand.split('.')

  if (decimal == null)
    return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation, isNegative }, dispatch] = useReducer(reducer, {
    currentOperand: null,
    isNegative: false,
  })

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand"> {isNegative ? '-' : ''}{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTION.CLEAR})}>AC</button>
      <button onClick={() => dispatch({ type: ACTION.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation={`÷`} dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation={`*`} dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation={`+`} dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation={`-`} dispatch={dispatch} />
      <DigitButton digit={`.`} dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTION.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
