import React, { useEffect } from 'react'
import styled from 'styled-components'
import {ConnectionRejectedError, useWallet} from 'use-wallet'

import metamaskLogo from '../../assets/img/metamask-fox.svg'

import Button from '../Button'
import Modal, { ModalProps } from '../Modal'
import ModalActions from '../ModalActions'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'
import Spacer from '../Spacer'

import WalletCard from './components/WalletCard'

const WalletProviderModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const { account, connect, error } = useWallet()

  useEffect(() => {
    if (account) {
      console.log('calling onDismiss()')
      onDismiss()
    }
  }, [account, onDismiss])

  return (
    <Modal>
      <ModalTitle text="Select a wallet provider." />

      <ModalContent>
          { error?.name ?
            (
              <p style={{color: 'white'}}>
                {error instanceof ConnectionRejectedError
                  ? 'Connection error: the user rejected the activation'
                  : 'Error: ' + error.name + ', ' + error}
              </p>
            ) :
            (
              <StyledWalletsWrapper>
                <StyledWalletCard>
                  <WalletCard
                    icon={<img src={metamaskLogo} style={{ height: 32 }}  alt="metamask"/>}
                    onConnect={() => connect('injected')}
                    title="Metamask"
                  />
                </StyledWalletCard>
                <Spacer size="sm" />
                {/*<StyledWalletCard>*/}
                {/*  <WalletCard*/}
                {/*    icon={<img src={walletConnectLogo} style={{ height: 24 }}  alt="walletconnect"/>}*/}
                {/*    onConnect={() => connect('walletconnect')}*/}
                {/*    title="WalletConnect"*/}
                {/*  />*/}
                {/*</StyledWalletCard>*/}
              </StyledWalletsWrapper>
            )
          }

      </ModalContent>

      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
      </ModalActions>
    </Modal>
  )
}

const StyledWalletsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
    flex-direction: column;
    flex-wrap: none;
  }
`

const StyledWalletCard = styled.div`
  flex-basis: calc(50% - ${(props) => props.theme.spacing[2]}px);
`

export default WalletProviderModal
