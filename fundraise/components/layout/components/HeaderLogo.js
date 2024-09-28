import styled from 'styled-components';

const HeaderLogo = () => {
  return (
    <Logo>FundRaise</Logo>
  )
}

const Logo = styled.h1`
  font-weight: normal;
  font-size: 35px;
  margin-left: 11px;
  font-family: 'Roboto';
  letter-spacing: 2px;
  cursor: pointer;
`

export default HeaderLogo