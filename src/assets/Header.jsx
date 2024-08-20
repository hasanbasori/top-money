import styled from 'styled-components';
import { RxHamburgerMenu } from 'react-icons/rx';

function Header() {
    const HeaderStyle = styled.div`
 
      padding-bottom: -30px;
      height: 60px;
      width: 101vw;
      background-color: #ea1c4e;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      font-size: 20px;
      font-weight: bold;
    
    .ham-buger {
      margin-right: 20px;
      font-size: 40px;
    } 

    .myloan-title {
      margin-left: -150px;
    }

    @media only screen and (max-width: 430px) {
  .menu {
    display: none !important;
  }
  .myloan-title {margin-left :150px}
}
    
    `

  return (
    <HeaderStyle className='header'>
      <div className='menu' style={{display:'flex' ,gap:'20px' ,marginLeft:'20px'}}>
        <p>หน้าแรก</p>
        <p>สำรวจ</p>
        <p>ของฉัน</p>
      </div>
      <div className='myloan-title' >สินเชื่อของฉัน</div>
     
      <div> <RxHamburgerMenu className='ham-buger' /></div>
    </HeaderStyle>
  );
}

export default Header;
