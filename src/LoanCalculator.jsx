import { useState } from 'react';

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState(1000);
  const [maxPrincipal, setMaxPrincipal] = useState(48000);
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

  return (
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
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;