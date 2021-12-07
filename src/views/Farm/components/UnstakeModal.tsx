import React, { useCallback, useState } from 'react'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import NFTInput from "../../../components/NFTInput";

interface WithdrawModalProps extends ModalProps {
  // max: BigNumber
  onConfirm: (tokenId: number) => void
  tokenName?: string
}

const UnstakeModal: React.FC<WithdrawModalProps> = ({
  onConfirm,
  onDismiss,
  // max,
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
      <ModalTitle text={`Unstake ${tokenName} NFT by Token ID`} />
      <NFTInput
        // onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
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

export default UnstakeModal
