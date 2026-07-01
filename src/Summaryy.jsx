import styled from 'styled-components';
import { toPng } from 'html-to-image';

import Header from './assets/Header';
import { useState, useRef } from 'react';

const IconDownload = (props) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconScissors = (props) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);
const IconCopy = (props) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconCheck = (props) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconShieldCheck = (props) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const PAPER = '#F6F6F7';
const PAGE_BG = '#E7E7EA';
const INK = '#232326';
const INK_MUTED = '#87878C';
const LINE = '#D6D6DA';
const ACCENT = '#E23A63';
const TOTAL_BG = '#EAF0F8';
const TOTAL_INK = '#1E3A5F';

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
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const slipRef = useRef(null);

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
    date.setDate(date.getDate() - 1); // ลบ 1 วัน
    date.setHours(0, 0, 0, 0); // ตั้งเวลาเป็น 00:00
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(loanNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      // ignore
    }
  };

  const showResult =
    totalPayment !== null && totalInterest !== null && processingFee !== null && dueDate !== null && loanNumber !== null;

  const groupedLoanNumber = loanNumber ? loanNumber.match(/.{1,4}/g).join('') : '';

  // ---------- DOM -> PNG download ----------
  // Instead of re-drawing the whole slip by hand on a <canvas> (which has to be
  // kept perfectly in sync with the JSX/CSS and easily drifts out of sync,
  // as happened before), we snapshot the actual rendered node.
  // This guarantees the downloaded image always matches what's on screen.
  //
  // NOTE: html-to-image (like dom-to-image before it) has a known quirk where
  // styles applied directly on the *root* node passed to toPng() — things like
  // background-color, border-radius, box-shadow — can fail to render, even
  // though the exact same styles on any *child* node render fine. That's why
  // the ref below is attached to a plain, unstyled ".captureWrap" div instead
  // of directly to ".slipFrame" (which carries the pink background/frame).
  // Wrapping it one level deeper sidesteps the bug entirely.
  const handleDownloadSlip = async () => {
    if (!slipRef.current) return;
    setDownloading(true);
    try {
      // Make sure web fonts are actually ready before rasterizing,
      // otherwise text can be captured with a fallback font.
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Wait for the QR <img> to finish loading (it's fetched from a remote
      // API), so it isn't captured blank/broken.
      const qrImgEl = slipRef.current.querySelector('.qrCode');
      if (qrImgEl && !qrImgEl.complete) {
        await new Promise((resolve) => {
          qrImgEl.onload = resolve;
          qrImgEl.onerror = resolve;
        });
      }

      const dataUrl = await toPng(slipRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: PAGE_BG,
        // Give the browser a beat to paint fonts/images before capture.
        skipFonts: false,
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `slip-${loanNumber}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('ดาวน์โหลดสลิปไม่สำเร็จ', err);
      alert('ดาวน์โหลดสลิปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setDownloading(false);
    }
  };

  const SummaryStyle = styled.div`
    margin: 0;
    font-family: 'IBM Plex Sans Thai', Arial, sans-serif;

    .container {
      background: ${PAGE_BG};
      padding: 24px 16px 60px;
    }

    .debugNote {
      color: #a19a8c;
      font-size: 12px;
      margin: 0 0 8px;
    }

    .slipWrap {
      max-width: 400px;
      margin: 0 auto;
    }

    /* Plain, unstyled wrapper used only as the target for screenshotting.
       Do not add background/border/radius/etc. here — see the comment on
       handleDownloadSlip for why this needs to stay a "dumb" pass-through
       element rather than styled directly. */
    .captureWrap {
      display: block;
    }
   

    .slipFrame {
      background: ${ACCENT};
      border-radius: 20px;
      padding: 14px;
      box-shadow: 0 20px 40px -14px rgba(35, 35, 38, 0.24);
    }

    .slipCard {
      position: relative;
      background: ${PAPER};
      border-radius: 8px;
      overflow: hidden;
    }

    .watermark {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    .slipCard > *:not(.watermark) {
      position: relative;
      z-index: 1;
    }

    .logoHeader {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 22px 32px 0;
    }

    .logoMark {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: ${ACCENT};
      color: #ffffff;
      font-weight: 700;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .logoText {
      display: flex;
      flex-direction: column;
      line-height: 1.25;
    }

    .logoTitle {
      color: ${INK};
      font-weight: 700;
      font-size: 15px;
    }

    .logoSub {
      color: ${INK_MUTED};
      font-size: 10px;
    }

    .eyebrowRow {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 18px 32px 0;
    }

    .eyebrow {
      color: ${INK_MUTED};
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .stamp {
      color: ${ACCENT};
      border: 1px solid ${ACCENT};
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 700;
      transform: rotate(-8deg);
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }

    .hero {
      text-align: center;
      padding: 18px 24px 8px;
    }

    .heroAmount {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 40px;
      font-weight: 700;
      color: ${INK};
      margin: 0;
    }

    .heroLabel {
      color: ${INK_MUTED};
      font-size: 12px;
      margin: 4px 0 14px;
    }

    .tearLine {
      display: flex;
      align-items: center;
      padding: 22px 32px 0;
    }

    .tearLine .line {
      flex: 1;
      border-top: 1px dashed ${LINE};
    }

    .tearLine svg {
      margin: 0 8px;
      color: ${INK_MUTED};
      transform: rotate(90deg);
    }

    .sectionLabel {
      color: ${INK_MUTED};
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      padding: 20px 32px 6px;
    }

    .detailRow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 32px;
      border-bottom: 1px dashed ${LINE};
    }

    .detailLabel {
      color: ${INK_MUTED};
      font-size: 13px;
    }

    .detailValue {
      font-family: 'IBM Plex Mono', monospace;
      color: ${INK};
      font-size: 13px;
      font-weight: 600;
      text-align: right;
    }

    .totalBandWrap {
      padding: 18px 24px 6px;
    }

    .totalBand {
      background: ${TOTAL_BG};
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .totalLabel {
      color: ${TOTAL_INK};
      font-size: 12px;
      font-weight: 600;
    }

    .totalValue {
      font-family: 'IBM Plex Mono', monospace;
      color: ${TOTAL_INK};
      font-size: 22px;
      font-weight: 700;
    }

    .qrWrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 22px 32px 28px;
    }

    .qrCode {
      border: 1px solid ${LINE};
      border-radius: 8px;
      padding: 8px;
      background: #ffffff;
    }

    .qrCaption {
      color: ${INK_MUTED};
      font-size: 11px;
      margin-top: 10px;
    }

    .brandFooter {
      color: #b7b0a2;
      font-size: 10px;
      margin-top: 10px;
      text-align: center;
    }

    .actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }

    .downloadBtn {
      flex: 1;
      background: ${INK};
      color: ${PAPER};
      border: none;
      border-radius: 6px;
      padding: 12px;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
    }
    .downloadBtn:disabled {
      opacity: 0.6;
      cursor: default;
    }

    .copyBtn {
      background: ${PAPER};
      color: ${INK};
      border: 1px solid ${LINE};
      border-radius: 6px;
      padding: 12px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .zigzag {
      width: 100%;
      height: 10px;
      display: block;
    }
    .zigzag.flip {
      transform: scaleY(-1);
    }

    .footer {
      height: 100px;
      width: 100vw;
      background-image: url('../public/assets/images/bgfooter.svg');
    }

    @media only screen
      and (min-device-width: 430px)
      and (max-device-width: 430px)
      and (min-device-height: 932px)
      and (max-device-height: 932px)
      and (-webkit-device-pixel-ratio: 3) {
      .heroAmount {
        font-size: 32px;
      }
      .container {
        padding: 16px 12px 40px;
      }
    }
  `;

  const ZigzagEdge = ({ flip = false }) => (
    <svg
      className={`zigzag${flip ? ' flip' : ''}`}
      viewBox="0 0 400 10"
      preserveAspectRatio="none"
    >
      <polygon
        points={
          Array.from({ length: 29 }, (_, i) => {
            const x = i * 14;
            const yy = i % 2 === 0 ? 0 : 8;
            return `${x},${yy}`;
          }).join(' ') + ' 400,10 0,10'
        }
        fill={ACCENT}
      />
    </svg>
  );

  const Watermark = () => (
    <svg className="watermark" width="100%" height="100%">
      <defs>
        <pattern id="wmPattern" width="210" height="110" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
          <text
            x="0"
            y="60"
            fontFamily="'IBM Plex Sans Thai', sans-serif"
            fontSize="18"
            fontWeight="700"
            fill={ACCENT}
            opacity="0.07"
          >
            L EASY MONEY
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wmPattern)" />
    </svg>
  );

  return (
    <>
      <style>
        {"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');"}
      </style>
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
      </div>

      <Header />
      <SummaryStyle>
        <div className="container">
          {!showResult && (
            <p className="debugNote">กรอกแบบฟอร์มด้านบนแล้วกด Calculate เพื่อดูสลิป</p>
          )}

          {showResult && (
            <div className="slipWrap">
              <div className="captureWrap" ref={slipRef}>
              <div className="slipFrame">
              <div className="slipCard">
                <Watermark />
                <ZigzagEdge />
<div className="headerbox">
                <div className="logoHeader">
                  <div className="logoMark">L</div>
                  <div className="logoText">
                    <span className="logoTitle">Easy Money</span>
                    <span className="logoSub">by tops money</span>
                  </div>
                
                </div>


               
                </div>

           

             

                <div className="hero">
                  <p className="heroAmount">฿{formatMoneyWithoutDecimal(principal)}</p>
                  <p className="heroLabel">จำนวนเงินกู้โดยรวม</p>
                </div>

                <div className="detailRow" style={{ borderTop: `1px dashed ${LINE}`, marginTop: 4 }}>
                  <span className="detailLabel">วงเงินคงเหลือ</span>
                  <span className="detailValue">฿{formatMoney(outstandingLoan)}</span>
                </div>

                <div className="tearLine">
                  <span className="line" />
                  <IconScissors />
                  <span className="line" />
                </div>

                <p className="sectionLabel">รายละเอียดเงินกู้ และการชำระคืน</p>

                {[
                  ['เลขที่เงินกู้', groupedLoanNumber],
                  ['เวลาที่สมัคร', formatDateTime(`${startDate}T${startTime}`)],
                  ['จำนวนเงินที่ชำระก่อนกำหนด', '฿0.00'],
                  ['เงินต้นคงค้าง', `฿${formatMoney(principal)}`],
                  ['ค่าธรรมเนียมดำเนินการ', `฿${processingFee}`],
                  ['ดอกเบี้ยโดยรวม', `฿${totalInterest}`],
                ].map(([label, value]) => (
                  <div className="detailRow" key={label}>
                    <span className="detailLabel">{label}</span>
                    <span className="detailValue">{value}</span>
                  </div>
                ))}

                <div className="totalBandWrap">
                  <div className="totalBand">
                    <span className="totalLabel">เงินต้น และดอกเบี้ยคงค้าง</span>
                    <span className="totalValue">฿{totalPayment}</span>
                  </div>
                </div>

                <div className="detailRow" style={{ marginTop: 4 }}>
                  <span className="detailLabel">กำหนดชำระ</span>
                  <span className="detailValue">{dueDate}</span>
                </div>

                <div className="qrWrap">
                  <img
                    className="qrCode"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(loanNumber)}`}
                    alt="QR Code สำหรับตรวจสอบเลขที่เงินกู้"
                    width={110}
                    height={110}
                    crossOrigin="anonymous"
                  />
                  <div className="qrCaption">สแกน QR เพื่อตรวจสอบเลขที่เงินกู้</div>
                  <div className="brandFooter">© Easy Money</div>
                </div>

                <ZigzagEdge flip />
              </div>
              </div>
              </div>

              <div className="actions">
                <button className="downloadBtn" onClick={handleDownloadSlip} disabled={downloading}>
                  <IconDownload />
                  {downloading ? 'กำลังสร้างไฟล์...' : 'ดาวน์โหลดสลิป'}
                </button>
                <button className="copyBtn" onClick={handleCopy}>
                  {copied ? <IconCheck /> : <IconCopy />}
                </button>
              </div>
            </div>
          )}
        </div>
      </SummaryStyle>
    </>
  );
}

export default Summary;
