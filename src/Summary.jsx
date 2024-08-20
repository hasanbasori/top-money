import styled from 'styled-components';

import Header from './assets/Header';
import  { useState } from 'react';



function Summary() {
  const [principal, setPrincipal] = useState(1000);
  const [maxPrincipal, setMaxPrincipal] = useState(48000);
  const [outstandingLoan, setOutstandingLoan] = useState(2000);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [processingFee, setProcessingFee] = useState(null);
  const [loanNumber, setLoanNumber] = useState(null);


  const formatMoney = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const formatMoneyWithoutDecimal = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const generateLoanNumber = () => {
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const calculateLoan = (principal, interestRate) => {
    const principalAmount = parseFloat(principal);
    const monthlyInterestRate = parseFloat(interestRate);
    const fee = Math.max((principalAmount / 1000) * 10, 100);
    if (!isNaN(principalAmount) && !isNaN(monthlyInterestRate)) {
      const interestAmount = principalAmount * monthlyInterestRate;
      const totalPaymentAmount = principalAmount + interestAmount + fee;
      setProcessingFee(formatMoney(fee));
      setTotalPayment(formatMoney(totalPaymentAmount));
      setTotalInterest(formatMoney(interestAmount));
      setLoanNumber(generateLoanNumber());
    } else {
      alert('กรุณาใส่ค่าที่ถูกต้อง');
    }
  };
  const calculateDueDate = (startDate, startTime) => {
    const date = new Date(`${startDate}T${startTime}`);
    date.setMonth(date.getMonth() + 1);
    date.setDate(date.getDate() - 1);  // ลบ 1 วัน
    date.setHours(0, 0, 0, 0);  // ตั้งเวลาเป็น 00:00
    return formatDateTime(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const interestRate = 0.04111;
    if (principal >= 1000 && (maxPrincipal === '' || principal <= maxPrincipal)) {
      calculateLoan(principal, interestRate);
      setDueDate(calculateDueDate(startDate, startTime));
    } else {
      alert(`กรุณาใส่จำนวนเงินกู้ที่ถูกต้อง ขั้นต่ำ 1000 แต่ไม่เกิน ${maxPrincipal}`);
    }
  };

  const SummaryStyle = styled.div`
    margin: 0;
    /* position: absolute; */
    .btback {
      margin: 0;
    }
    /* left:50} */

    .p {
      color: #727272;
    }
    .textt {
      color: #1111;
    }

    .container {
      height: calc(100vh - 200px);

      .container {
        background-color: white;
        padding: 20px;
        font-family: Arial, sans-serif;
      }

      .content {
        padding-bottom: 0;
      }

      .centeredView {
        text-align: center;
        margin-top: 0px 0;
      }

      .loanAmount {
        font-size: 48px;
        font-weight: bold;
        margin-top: 25px;
        margin-bottom: 40px;
      }

      .loanText {
        margin-top: -30px;
        /* margin-left: 100px; */
      }

      .row {
        display: flex;
        justify-content: space-between;
        margin: -20px 0px 0px 0px;
      }

      .leftText {
        margin-left: 20px;
      }

      .rightText {
        margin-right: 0px;
      }

      .details {
        padding-left: 10px;
        display: flex;
        align-items: center;
        background-color: whitesmoke;
        width: 100%;
        margin: 20px 0;
        height: 40px;
      }

      .detailsText {
        font-size: 16px;
        font-weight: 500;
        margin-left: 10px;
      }

      .footerText {
        color: silver;
        margin-top: 50px;
      }
    }
    .footer {
      height: 100px;
      width: 100vw;
      background-image: url('../public/assets/images/bgfooter.svg');
    }
    /* Media query for iPhone 15 Pro Max */
    @media only screen 
    and (min-device-width: 430px) 
    and (max-device-width: 430px) 
    and (min-device-height: 932px) 
    and (max-device-height: 932px) 
    and (-webkit-device-pixel-ratio: 3) {
      .container {
        padding: 10px;
      }

      .loanAmount {
        font-size: 36px;
      }

      .loanText {
        font-size: 14px;
      }

      .row {
        margin: 10px 0;
      }

      .details {
        height: 35px;
      }

      .detailsText {
        font-size: 14px;
      }

      .footerText {
        font-size: 12px;
      }
    }
  `;
  return (
    <>
    <h1>Note: </h1>
 <div>
      <h2>Loan Calculator</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Max Principal Amount: </label>
          <input
            type="number"
            value={maxPrincipal}
            onChange={(e) => setMaxPrincipal(e.target.value)}
            placeholder="ใส่จำนวนเงินสูงสุด"
          />
        </div>
        <div>
          <label>ยอดเงินกู้คงเหลือ: </label>
          <input
            type="number"
            value={outstandingLoan}
            onChange={(e) => setOutstandingLoan(e.target.value)}
            placeholder="ยอดเงินกู้คงเหลือ"
          />
        </div>
        <div>
          <label>Principal Amount (min 1000): </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Date: </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Time: </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Calculate</button>
      </form>
      {totalPayment !== null && totalInterest !== null && processingFee !== null && dueDate !== null && loanNumber !== null && (
        <div>
          <h3>ผลลัพธ์</h3>
          <p>เลขที่เงินกู้: {loanNumber}</p>
          <p>ยอดชำระรวม: ${totalPayment}</p>
          <p>ดอกเบี้ยรวม: ${totalInterest}</p>
          <p>ค่าธรรมเนียมดำเนินการ: ${processingFee}</p>
          <p>วันและเวลาที่กำหนดชำระ: {dueDate}</p>
          <h3>สรุป</h3>
          <p>วันที่เริ่มต้น: {formatDateTime(`${startDate}T${startTime}`)}</p>
          <p>เงินต้น: ${formatMoney(principal)}</p>
          <p>ดอกเบี้ย: ${totalInterest}</p>
          <p>ยอดหนี้คงค้าง: ${formatMoney(outstandingLoan)}</p>
        </div>
      )}
    </div>

      <Header />
      <SummaryStyle>
        <div className='container'>
          <div title='สินเชื่อของฉัน' />

          <div className='content'>
            <div className='centeredView'>
              <p className='loanAmount text'>
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^จำนวนเงินกู้โดยรวม^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
                ฿{formatMoneyWithoutDecimal(principal)}
              </p>
              {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}

              <p className='loanText p'>จำนวนเงินกู้โดยรวม</p>
            </div>

            <div className='row'>
              <p style={{ marginLeft: '100px' }} className='leftText p'>
                วงเงินคงเหลือ
              </p>
              <p style={{ marginRight: '100px' }} className='rightText '>
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ วงเงินคงเหลือ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
                ฿{formatMoney(outstandingLoan)}
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
              </p>
            </div>

            <div className='details'>
              <p className='detailsText  '>รายละเอียดเงินกู้ และการชำระคืน</p>
            </div>

            <div className='row'>
              <p className='leftText p'>เลขที่เงินกู้</p>
              <p  className='rightText p'>
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^เลขที่เงินกู้^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
                {loanNumber}
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
              </p>
            </div>

            <div className='row'>
              <p className='leftText p'>เวลาที่สมัคร</p>
              <p className='rightText p'>
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^เวลาที่สมัคร^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
                {formatDateTime(`${startDate}T${startTime}`)}
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
              </p>
            </div>

            <div className='row'>
              <p className='leftText p'>จำนวนเงินที่ชำระก่อนกำหนด</p>
              <p className='rightText p'>฿0.00</p>
            </div>

            <div className='row'>
              <p className='leftText p'>เงินต้นคงค้าง</p>
              <p className='rightText p'>
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
                ฿{formatMoney(principal)}
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
              </p>
            </div>

            <div className='row'>
              <p className='leftText p'>ค่าธรรมเนียมดำเนินการ</p>
              <p className='rightText p'>฿{processingFee}</p>
            </div>

            <div className='row'>
              <p className='leftText p'>ดอกเบี้ยโดยรวม</p>
              <p className='rightText p'>
                {/* ^^^^^^0.04111^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ดอกเบี้ยโดยรวม^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
                ฿{totalInterest}
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
              </p>
            </div>

            <div className='row'>
              <p className='leftText p'>เงินต้น และดอกเบี้ยคงค้าง</p>
              <p className='rightText p'>
                {/* ^^^^^^^^^^^^^^^^^^^^^^^เงินต้น และดอกเบี้ยคงค้าง +ค่าธรรมเนียม^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
                ฿{totalPayment}
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
              </p>
            </div>

            <div className='row'>
              <p className='leftText p '>กำหนดชำระ</p>

              <p className='rightText p'>
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^กำหนดชำระ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
                {dueDate}
                {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
              </p>
            </div>

            <div style={{ marginTop: '200px' ,paddingBottom:'300px' }} className='centeredView'>
              <p className='footerText'>LEasy Money by tops money</p>
            </div>
          </div>
        </div>

        {/* <div className='footer'>Footer</div> */}
      </SummaryStyle>
    </>
  );
}

export default Summary;
