import React, { useCallback, useState } from 'react'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'

interface ApproveModalProps extends ModalProps {
  // max: BigNumber
  onConfirm: (tokenId: number) => void
  tokenName?: string
}

const ApproveModal: React.FC<ApproveModalProps> = ({
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
      <ModalTitle text={`Approve ${tokenName}`} />
      <TokenInput
        // onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={0}
        symbol={tokenName}
      />
      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
        <Button
          disabled={pendingTx}
          text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
          onClick={async () => {
            const tokenId = parseInt(val);
            if (isNaN(tokenId)) {
              throw new Error('Invalid tokenId: ' + val);
            }
            setPendingTx(true)
            await onConfirm(tokenId)
            setPendingTx(false)
            onDismiss()
          }}
        />
      </ModalActions>
    </Modal>
  )
}

export default ApproveModal
