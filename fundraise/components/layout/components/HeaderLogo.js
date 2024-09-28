import styled from 'styled-components';

const HeaderLogo = () => {
  return (
    <Logo>Fund.Hub</Logo>
  )
}

const Logo = styled.h1`
  font-weight: large;
  font-size: 40px;
  margin-left: 11px;
  font-family: 'Roboto';
  letter-spacing: 2px;
  cursor: pointer;
  color: purple;
`

export default HeaderLogo