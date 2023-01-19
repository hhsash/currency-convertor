import React, { useState, useEffect } from 'react';
import { Block } from './components/Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = useState('UAH')
  const [toCurrency, setToCurrency] = useState('USD')
  const [fromPrice, setFromPrice] = useState(0)
  const [toPrice, setToPrice] = useState(0)
  const [rates, setRates] = useState([])
  let data

  useEffect(() => {
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
    .then(res => res.json())
    .then((json) => {
      data = json
      const currency = {
        'UAH': 1,
        'USD': data.find(item => item.cc === 'USD').rate,
        'EUR': data.find(item => item.cc === 'EUR').rate,
        'ILS': data.find(item => item.cc === 'ILS').rate
      }
      setRates(currency)
    })
    .catch((error) => {
      console.warn(error)
    })
  }, [])

  const onChangeFromPrice = (value) => {
    const price = value / rates[toCurrency] 
    const result = price * rates[fromCurrency]
    setFromPrice(value)
    setToPrice(result)
  }

  const onChangeToPrice = (value) => {
    const price = value / rates[fromCurrency] 
    const result = price * rates[toCurrency]
    setFromPrice(result)
    setToPrice(value)
  }

  return (
    <div className="App">
      <Block 
        value={fromPrice} 
        currency={fromCurrency} 
        onChangeValue={onChangeFromPrice}
        onChangeCurrency={(cur) => console.log(cur)} 
      />
      <Block 
        value={toPrice} 
        currency={toCurrency}  
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
