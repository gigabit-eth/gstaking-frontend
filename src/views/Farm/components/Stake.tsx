import React from 'react'
import styled from 'styled-components'
import { Contract } from 'web3-eth-contract'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import IconButton from '../../../components/IconButton'
import { AddIcon } from '../../../components/icons'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useModal from '../../../hooks/useModal'
import useUnstake from '../../../hooks/useUnstake'
import UnstakeModal from './UnstakeModal'
import StakeModal from "./StakeModal";
import useStakeErc721 from "../../../hooks/useStakeErc721";
import useApproveErc721Farm from "../../../hooks/useApproveErc721Farm";
import ApproveModal from "./ApproveModal";
import useStakedQuantity from "../../../hooks/useStakedQuantity";

interface StakeProps {
  erc721TokenContract: Contract
  erc721FarmContract: Contract
  // pid: number
  tokenName: string
}

const Stake: React.FC<StakeProps> = ({ erc721TokenContract, erc721FarmContract, tokenName }) => {
  // const [requestedApproval, setRequestedApproval] = useState(false)

  // const allowance = useAllowance(lpContract)
  // const { onApprove } = useApprove(erc721FarmContract)

  // const tokenBalance = useTokenBalance(erc721FarmContract.options.address)
  const stakedQuantity = useStakedQuantity(erc721FarmContract)
  // const stakedBalance = new BigNumber(0);

  const { onStakeErc721 } = useStakeErc721(erc721FarmContract)
  const { onUnstake } = useUnstake(erc721FarmContract)
  const { onApproveErc721Farm } = useApproveErc721Farm(erc721TokenContract, erc721FarmContract)

  const [onPresentDeposit] = useModal(
    <StakeModal
      // max={tokenBalance}
      onConfirm={onStakeErc721}
      tokenName={tokenName}
    />,
  )

  const [onPresentUnstake] = useModal(
    <UnstakeModal
      // max={new BigNumber(stakedQuantity)}
      onConfirm={onUnstake}
      tokenName={tokenName}
    />,
  )

  const [onPresentApprove] = useModal(
    <ApproveModal
      // max={new BigNumber(10)}
      onConfirm={onApproveErc721Farm}
    />
  )

  // const handleApprove = useCallback(async () => {
  //   try {
  //     setRequestedApproval(true)
  //     const txHash = await onApprove()
  //     // user rejected tx or didn't go thru
  //     if (!txHash) {
  //       setRequestedApproval(false)
  //     }
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }, [onApprove, setRequestedApproval])

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <span aria-label="lock" role="img">
              🔒
              </span>
            </CardIcon>
            <Value value={stakedQuantity} />
            <Label text={`${tokenName} Staked`} />
          </StyledCardHeader>
          <StyledCardActions>
            <>
              <Button
                disabled={false}
                text="Approve"
                onClick={onPresentApprove}
              />
              <Button
                disabled={stakedQuantity === 0}
                text="Unstake"
                onClick={onPresentUnstake}
              />
              <StyledActionSpacer />
              <IconButton onClick={onPresentDeposit}>
                <AddIcon />
              </IconButton>
            </>
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default Stake
