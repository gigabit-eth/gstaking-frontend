import { useContext } from 'react'
import { Context as FarmsContext, Farm } from '../contexts/Farms'

const useFarm = (id: string): Farm => {
  const { farms } = useContext(FarmsContext)
  console.log(farms);
  const farm = farms.find((farm) => farm.id === id)
  if (!farm) {
    console.warn('Warning, couldnt find farm ', id);
  }
  return farm
}

export default useFarm
