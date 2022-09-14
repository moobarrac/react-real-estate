import React, { useState, useEffect, createContext } from 'react';

import {housesData} from '../data';

export const HouseContext = createContext()

const HouseContextProvider = ({children}) => {
  const [houses, setHouses] = useState(housesData)
  const [country, setCountry] = useState('Location (any)')
  const [countries, setCountries] = useState([])
  const [property, setProperty] = useState('Property type (any)')
  const [properties, setProperties] = useState([])
  const [price, setPrice] = useState('Price range (any)')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const allCountries = houses.map(house => house.country)
    const singleCountries = ['Location (any)', ...new Set(allCountries)]
    setCountries(singleCountries)

    const allProperties = houses.map(house => house.type)
    const singleProperties = ['Property type (any)', ...new Set(allProperties)]
    setProperties(singleProperties)
  }, [])

  const handleClick = () => {
    const isDefault = (str) => {
      return str.split(' ').includes('(any)')
    }

    const minPrice = parseInt(price.split(' ')[0])
    const maxPrice = parseInt(price.split(' ')[2])

    const newHouses = housesData.filter(house => {
      setLoading(true)
      const housePrice = parseInt(house.price)
      if (
        house.country === country && 
        house.type === property && 
        housePrice >= minPrice && 
        housePrice <= maxPrice
      ) {
        return house;
      }
      if (isDefault(country) && isDefault(property) && isDefault(price)){
        return house;
      }

      if (!isDefault(country) && isDefault(property) && isDefault(price)) {
        return house.country === country;
      }
      if (isDefault(country) && !isDefault(property) && isDefault(price)) {
        return house.type === property;
      }
      if (isDefault(country) && isDefault(property) && !isDefault(price)) {
        return housePrice >= minPrice && housePrice <= maxPrice;
      }
      if (!isDefault(country) && !isDefault(property) && isDefault(price)) {
        return house.type === property && house.country === country;
      }
      if (!isDefault(country) && isDefault(property) && !isDefault(price)) {
        return housePrice >= minPrice && housePrice <= maxPrice  && house.country === country;
      }
      if (isDefault(country) && !isDefault(property) && !isDefault(price)) {
        return housePrice >= minPrice && housePrice <= maxPrice  && house.type === property;
      }
      if (!isDefault(country) && !isDefault(property) && !isDefault(price)) {
        return housePrice >= minPrice && housePrice <= maxPrice  && house.type === property && house.country === country;
      }
      return house;
    })

    setTimeout(() => {
      setHouses(newHouses)
      setLoading(false)
    }, 500)
  }

  return (
    <HouseContext.Provider value={{
      country,
      setCountry,
      countries,
      property,
      setProperty,
      properties,
      price,
      setPrice,
      houses,
      loading,
      handleClick
    }}>
      {children}
    </HouseContext.Provider>
  )
}

export default HouseContextProvider