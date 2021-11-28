import React from 'react'
import styled from 'styled-components'

import Input, { InputProps } from '../Input'

interface TokenInputProps extends InputProps {
  // max: number | string,
  symbol: string,
  onSelectMax?: () => void,
}

const NFTInput: React.FC<TokenInputProps> = ({
  // max,
  symbol,
  onChange,
  // onSelectMax,
  value,
}) => {
  return (
    <StyledTokenInput>
      {/*<StyledMaxText>{max.toLocaleString()} {symbol} Available</StyledMaxText>*/}
      <Input
        startAdornment={(
          <StyledTokenAdornmentWrapper>
            <StyledTokenSymbol>{symbol} ID</StyledTokenSymbol>
            <StyledSpacer />
            {/*<div>*/}
            {/*  <Button size="sm" text="Max" onClick={onSelectMax} />*/}
            {/*</div>*/}
          </StyledTokenAdornmentWrapper>
        )}
        onChange={onChange}
        placeholder="0"
        value={value}
      />
    </StyledTokenInput>
  )
}

/*
            <div>
              <Button size="sm" text="Max" />
            </div>
*/

const StyledTokenInput = styled.div`

`

const StyledSpacer = styled.div`
  width: ${props => props.theme.spacing[3]}px;
`

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`

const StyledTokenSymbol = styled.span`
  color: ${props => props.theme.color.grey[600]};
  font-weight: 700;
`

export default NFTInput
