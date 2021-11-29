import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import useFarm from '../../hooks/useFarm'
import Harvest from './components/Harvest'
import Stake from './components/Stake'

const Farm: React.FC = () => {
  const { farmId } = useParams()
  const farm = useFarm(farmId);
  // const {
  //   // pid,
  //   erc721TokenAddress,
  //   erc721FarmAddress,
  //   earnTokenName,
  //   name,
  //   icon,
  // } = useFarm(farmId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // const sushi = useSushi()
  // const { ethereum } = useWallet()

  console.log('Farm.tsx: ', farm);

  // const erc721FarmContract: Contract = useMemo(() => {
  //   return getErc721Contract(ethereum as provider, farm.erc721FarmAddress)
  // }, [ethereum, farm.erc721FarmAddress]) as any;

  // const { onRedeem } = useRedeem(getMasterChefContract(sushi))

  // const erc721TokenName = useMemo(() => {
  //   return farm.erc721TokenAddress
  // }, [farm.erc721TokenAddress])

  // const earnTokenNameDisplay = useMemo(() => {
  //   return farm.earnTokenName.toUpperCase()
  // }, [farm.earnTokenName])


  return (
    <>
      <PageHeader
        icon={farm.icon}
        subtitle={`Deposit ${farm.erc721TokenName}  NFTs and earn ${farm.earnTokenName}`}
        title={farm.name}
      />
      <StyledFarm>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <Harvest />
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <Stake erc721FarmContract={farm.erc721FarmContract} tokenName={farm.erc721TokenName} />
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg" />
        <StyledInfo>
        <span role="img" aria-label="bolt">⚡</span> Unstake an NFT, and the contract will
          automatically harvest $RNG rewards for you!
        </StyledInfo>
        <Spacer size="md" />
        <StyledLink
          target="__blank"
          href={`https://etherscan.io/address/${farm.erc721FarmAddress}`}
        >
          {farm.erc721TokenName} Info
        </StyledLink>
      </StyledFarm>
    </>
  )
}

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`

export default Farm
