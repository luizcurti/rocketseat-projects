import { useState } from 'react'
import { calculate, formatNumber, parseNumber } from '../utils/calculator'

const KEY_BASE =
  'rounded-2xl py-4 text-lg font-medium text-[#e7e3ee] bg-[#3a3649] cursor-pointer transition hover:brightness-110 active:scale-95'

function Calculator({ onResult }) {
  const [display, setDisplay] = useState('0')
  const [storedValue, setStoredValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [expression, setExpression] = useState('')

  function inputDigit(digit) {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
      return
    }
    setDisplay(display === '0' ? digit : display + digit)
  }

  function inputComma() {
    if (waitingForOperand) {
      setDisplay('0,')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes(',')) setDisplay(display + ',')
  }

  function clear() {
    setDisplay('0')
    setStoredValue(null)
    setOperator(null)
    setWaitingForOperand(false)
    setExpression('')
  }

  function clearEntry() {
    setDisplay('0')
  }

  function handleOperator(nextOperator) {
    const inputValue = parseNumber(display)

    if (storedValue === null) {
      setStoredValue(inputValue)
    } else if (!waitingForOperand) {
      const result = calculate(storedValue, inputValue, operator)
      setStoredValue(result)
      setDisplay(formatNumber(result))
    }

    setExpression(`${formatNumber(storedValue ?? inputValue)} ${nextOperator}`)
    setOperator(nextOperator)
    setWaitingForOperand(true)
  }

  function handleEquals() {
    if (operator === null || waitingForOperand) return

    const inputValue = parseNumber(display)
    const result = calculate(storedValue, inputValue, operator)
    const formatted = formatNumber(result)

    onResult(`${expression} ${display} = ${formatted}`)
    setDisplay(formatted)
    setStoredValue(null)
    setOperator(null)
    setExpression('')
    setWaitingForOperand(true)
  }

  return (
    <section className="w-[250px] flex flex-col gap-5 rounded-3xl bg-[#262330] p-6 shadow-2xl">
      <div className="flex min-h-16 flex-col justify-end gap-1.5 px-1">
        <div className="min-h-[18px] break-all text-right text-sm text-[#948d9f]">{expression}</div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-base text-[#7e778c]">=</span>
          <span className="break-all text-right text-3xl font-semibold text-white">{display}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        <button type="button" className={`${KEY_BASE} text-[#cfc9dc]`} onClick={clearEntry}>
          CE
        </button>
        <button type="button" className={`${KEY_BASE} col-span-2 text-[#cfc9dc]`} onClick={clear}>
          C
        </button>
        <button type="button" className={`${KEY_BASE} bg-[#6c56a8] text-white`} onClick={() => handleOperator('÷')}>
          ÷
        </button>

        <button type="button" className={KEY_BASE} onClick={() => inputDigit('7')}>7</button>
        <button type="button" className={KEY_BASE} onClick={() => inputDigit('8')}>8</button>
        <button type="button" className={KEY_BASE} onClick={() => inputDigit('9')}>9</button>
        <button type="button" className={`${KEY_BASE} bg-[#6c56a8] text-white`} onClick={() => handleOperator('×')}>×</button>

        <button type="button" className={KEY_BASE} onClick={() => inputDigit('4')}>4</button>
        <button type="button" className={KEY_BASE} onClick={() => inputDigit('5')}>5</button>
        <button type="button" className={KEY_BASE} onClick={() => inputDigit('6')}>6</button>
        <button type="button" className={`${KEY_BASE} bg-[#6c56a8] text-white`} onClick={() => handleOperator('−')}>−</button>

        <button type="button" className={KEY_BASE} onClick={() => inputDigit('1')}>1</button>
        <button type="button" className={KEY_BASE} onClick={() => inputDigit('2')}>2</button>
        <button type="button" className={KEY_BASE} onClick={() => inputDigit('3')}>3</button>
        <button type="button" className={`${KEY_BASE} bg-[#6c56a8] text-white`} onClick={() => handleOperator('+')}>+</button>

        <button type="button" className={`${KEY_BASE} col-span-2`} onClick={() => inputDigit('0')}>0</button>
        <button type="button" className={KEY_BASE} onClick={inputComma}>,</button>
        <button type="button" className={`${KEY_BASE} bg-[#7c5cff] text-white`} onClick={handleEquals}>=</button>
      </div>
    </section>
  )
}

export default Calculator
