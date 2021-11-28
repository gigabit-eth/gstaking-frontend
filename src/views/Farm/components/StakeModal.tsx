import React, { useCallback, useState } from 'react'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import NFTInput from "../../../components/NFTInput";

interface StakeModalProps extends ModalProps {
  // max: BigNumber
  onConfirm: (tokenId: number) => void
  tokenName?: string
}

const StakeModal: React.FC<StakeModalProps> = ({
  // max,
  onConfirm,
  onDismiss,
  tokenName = '',
}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)

  // const fullBalance = useMemo(() => {
  //   return getFullDisplayBalance(max)
  // }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  // const handleSelectMax = useCallback(() => {
  //   setVal(fullBalance)
  // }, [fullBalance, setVal])

  return (
    <Modal>
      <ModalTitle text={`Stake ${tokenName} NFT by Token ID`} />
      <NFTInput
        value={val}
        // onSelectMax={handleSelectMax}
        onChange={handleChange}
        // max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
        <Button
          disabled={pendingTx}
          text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
          onClick={async () => {
            setPendingTx(true)
            console.log('sending onConfirm: ', val);
            const tokenId = parseInt(val);
            if (isNaN(tokenId)) {
              throw new Error('Invalid token ID: ' + val);
            }
            await onConfirm(tokenId)
            setPendingTx(false)
            onDismiss()
          }}
        />
      </ModalActions>
    </Modal>
  )
}

export default StakeModal
