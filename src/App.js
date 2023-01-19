import React, { useState, useEffect, useRef } from 'react';
import { Block } from './components/Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = useState('UAH')
  const [toCurrency, setToCurrency] = useState('USD')
  const [fromPrice, setFromPrice] = useState(0)
  const [toPrice, setToPrice] = useState(1)
  const rates = useRef({})

  // Get currency from API
  useEffect(() => {
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
    .then(res => res.json())
    .then((json) => {
      let data = json
      const currency = {
        'UAH': 1,
        'USD': data.find(item => item.cc === 'USD').rate,
        'EUR': data.find(item => item.cc === 'EUR').rate,
        'ILS': data.find(item => item.cc === 'ILS').rate
      }
      rates.current = currency
      onChangeToPrice(1)
    })
    .catch((error) => {
      console.warn(error)
      alert('Error connection')
    })
  }, [])

  // Change first price method
  const onChangeFromPrice = (value) => {
    const price = value / rates.current[toCurrency] 
    const result = price * rates.current[fromCurrency]
    setFromPrice(value)
    setToPrice(result.toFixed(2))
  }

  // Change second price method
  const onChangeToPrice = (value) => {
    const price = value / rates.current[fromCurrency] 
    const result = price * rates.current[toCurrency]
    setFromPrice(result.toFixed(2))
    setToPrice(value)
  }

  // Change first currency method
  const onChangeFromCurrency = (cur) => {
    setFromCurrency(cur)
    onChangeFromPrice(fromPrice)
  }

  // Change second currency method
  const onChangeToCurrency = (cur) => {
    setToCurrency(cur)
    onChangeToPrice(toPrice)
  }

  // Listening changes of price
  useEffect(() => {
    onChangeFromPrice(fromPrice)
  }, [fromCurrency])
  
  // Listening changes of price
  useEffect(() => {
    onChangeToPrice(toPrice)
  }, [toCurrency])

  return (
    <div className="App">
      <Block 
        value={fromPrice} 
        currency={fromCurrency} 
        onChangeValue={onChangeFromPrice}
        onChangeCurrency={onChangeFromCurrency} 
      />
      <Block 
        value={toPrice} 
        currency={toCurrency}  
        onChangeValue={onChangeToPrice}
        onChangeCurrency={onChangeToCurrency} 
      />
    </div>
  );
}

export default App;
