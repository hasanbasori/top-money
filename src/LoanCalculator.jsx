import { useState} from 'react';
import { Download, Scissors, Copy, Check, ShieldCheck } from 'lucide-react';

const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');";

const PAPER = '#FBFAF6';
const PAGE_BG = '#EAE6DC';
const INK = '#211F1B';
const INK_MUTED = '#8B8478';
const LINE = '#DAD4C6';
const STAMP = '#B5432A';
const TOTAL_BG = '#E9F1EA';
const TOTAL_INK = '#1F6F4A';

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
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const formatMoney = (amount) =>
    parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const generateLoanNumber = () => {
    let result = '';
    for (let i = 0; i < 16; i++) result += Math.floor(Math.random() * 10);
    return result;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const thaiMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes} น.`;
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(loanNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      // ignore
    }
  };

  const groupedLoanNumber = loanNumber ? loanNumber.match(/.{1,4}/g).join('  ') : '';

  const showResult =
    totalPayment !== null && totalInterest !== null && processingFee !== null && dueDate !== null && loanNumber !== null;

  // ---------- Canvas download ----------
  const handleDownloadSlip = async () => {
    setDownloading(true);
    try {
      if (document.fonts) {
        await Promise.all([
          document.fonts.load('700 22px "JetBrains Mono"'),
          document.fonts.load('500 14px "JetBrains Mono"'),
          document.fonts.load('600 14px "Space Grotesk"'),
          document.fonts.load('700 22px "Space Grotesk"'),
        ]).catch(() => {});
      }

      const W = 440;
      const rows = [
        ['เงินต้น', `$${formatMoney(principal)}`],
        ['ดอกเบี้ย (4.111%)', `$${totalInterest}`],
        ['ค่าธรรมเนียมดำเนินการ', `$${processingFee}`],
        ['กำหนดชำระ', dueDate],
      ];
      const H = 720;
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = W * scale;
      canvas.height = H * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);

      const drawZigzag = (y, up) => {
        ctx.fillStyle = PAPER;
        ctx.beginPath();
        const step = 14;
        ctx.moveTo(0, y);
        for (let x = 0; x <= W; x += step) {
          const peak = up ? y - 7 : y + 7;
          ctx.lineTo(x + step / 2, peak);
          ctx.lineTo(x + step, y);
        }
        if (up) { ctx.lineTo(W, y + 40); ctx.lineTo(0, y + 40); }
        else { ctx.lineTo(W, y - 40); ctx.lineTo(0, y - 40); }
        ctx.closePath();
        ctx.fill();
      };

      // page bg
      ctx.fillStyle = PAGE_BG;
      ctx.fillRect(0, 0, W, H);

      // card body
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 24, W, H - 48);
      drawZigzag(24, false);
      drawZigzag(H - 24, true);

      let y = 70;
      const padX = 32;

      // eyebrow
      ctx.fillStyle = INK_MUTED;
      ctx.font = '600 11px "Space Grotesk"';
      ctx.textBaseline = 'alphabetic';
      ctx.letterSpacing = '2px';
      ctx.fillText('ใบยืนยันสัญญาเงินกู้', padX, y);
      ctx.letterSpacing = '0px';

      // stamp
      ctx.save();
      ctx.translate(W - 92, y - 6);
      ctx.rotate((-8 * Math.PI) / 180);
      ctx.strokeStyle = STAMP;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(-4, -14, 96, 24);
      ctx.fillStyle = STAMP;
      ctx.font = '700 11px "Space Grotesk"';
      ctx.textAlign = 'center';
      ctx.fillText('อนุมัติแล้ว', 44, 2);
      ctx.textAlign = 'left';
      ctx.restore();

      y += 30;
      ctx.fillStyle = INK;
      ctx.font = '700 24px "JetBrains Mono"';
      ctx.fillText(groupedLoanNumber, padX, y);

      y += 22;
      ctx.fillStyle = INK_MUTED;
      ctx.font = '400 12px "JetBrains Mono"';
      ctx.fillText(`ทำรายการเมื่อ ${formatDateTime(`${startDate}T${startTime}`)}`, padX, y);

      // tear line
      y += 26;
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(W - padX, y);
      ctx.stroke();
      ctx.setLineDash([]);

      y += 34;

      // rows
      ctx.font = '400 13px "JetBrains Mono"';
      rows.forEach(([label, value]) => {
        ctx.fillStyle = INK_MUTED;
        ctx.font = '400 13px "Space Grotesk"';
        ctx.fillText(label, padX, y);
        ctx.fillStyle = INK;
        ctx.font = '600 13px "JetBrains Mono"';
        const vw = ctx.measureText(value).width;
        ctx.fillText(value, W - padX - vw, y);
        y += 20;
        ctx.strokeStyle = LINE;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(padX, y);
        ctx.lineTo(W - padX, y);
        ctx.stroke();
        ctx.setLineDash([]);
        y += 18;
      });

      // total band
      y += 6;
      const bandH = 60;
      ctx.fillStyle = TOTAL_BG;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(padX - 8, y, W - (padX - 8) * 2, bandH, 8);
        ctx.fill();
      } else {
        ctx.fillRect(padX - 8, y, W - (padX - 8) * 2, bandH);
      }
      ctx.fillStyle = TOTAL_INK;
      ctx.font = '600 12px "Space Grotesk"';
      ctx.fillText('ยอดชำระทั้งหมด', padX + 8, y + 24);
      ctx.font = '700 24px "JetBrains Mono"';
      const totalStr = `$${totalPayment}`;
      const totalW = ctx.measureText(totalStr).width;
      ctx.fillText(totalStr, W - padX - 8 - totalW, y + 42);

      y += bandH + 40;

      // barcode
      const barcodeX = padX;
      const barcodeW = W - padX * 2;
      const digits = loanNumber.split('').map(Number);
      let bx = barcodeX;
      const barGap = barcodeW / digits.length;
      ctx.fillStyle = INK;
      digits.forEach((d) => {
        const barW = 1 + (d % 4);
        ctx.fillRect(bx, y, barW, 46);
        bx += barGap;
      });
      y += 62;
      ctx.fillStyle = INK_MUTED;
      ctx.font = '400 11px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '3px';
      ctx.fillText(loanNumber, W / 2, y);
      ctx.letterSpacing = '0px';

      y += 26;
      ctx.font = '400 10px "Space Grotesk"';
      ctx.fillText('กรุณาเก็บสลิปนี้ไว้เป็นหลักฐานการทำธุรกรรม', W / 2, y);
      ctx.textAlign = 'left';

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `slip-${loanNumber}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloading(false);
      }, 'image/png');
    } catch (err) {
      setDownloading(false);
    }
  };

  return (
    <div style={{ background: PAGE_BG, minHeight: '100%', fontFamily: 'Space Grotesk, sans-serif' }} className="p-6">
      <style>{FONT_IMPORT}</style>

      <div className="max-w-sm mx-auto mb-8">
        <h2 style={{ color: INK }} className="text-xl font-semibold mb-4">
          คำนวณเงินกู้
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label style={{ color: INK_MUTED }} className="block text-xs mb-1">วงเงินสูงสุด</label>
            <input
              type="number"
              value={maxPrincipal}
              onChange={(e) => setMaxPrincipal(e.target.value)}
              className="w-full px-3 py-2 rounded border outline-none"
              style={{ borderColor: LINE, background: PAPER, color: INK }}
            />
          </div>
          <div>
            <label style={{ color: INK_MUTED }} className="block text-xs mb-1">จำนวนเงินกู้ (ขั้นต่ำ 1000)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border outline-none"
              style={{ borderColor: LINE, background: PAPER, color: INK }}
            />
          </div>
          <div>
            <label style={{ color: INK_MUTED }} className="block text-xs mb-1">วันที่เริ่มต้น</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border outline-none"
              style={{ borderColor: LINE, background: PAPER, color: INK }}
            />
          </div>
          <div>
            <label style={{ color: INK_MUTED }} className="block text-xs mb-1">เวลาเริ่มต้น</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border outline-none"
              style={{ borderColor: LINE, background: PAPER, color: INK }}
            />
          </div>
          <button
            type="submit"
            className="mt-2 py-2.5 rounded font-semibold text-sm"
            style={{ background: INK, color: PAPER }}
          >
            คำนวณ
          </button>
        </form>
      </div>

      {showResult && (
        <div className="max-w-sm mx-auto">
          {/* Slip card */}
          <div
            className="relative overflow-hidden"
            style={{ background: PAPER, boxShadow: '0 20px 40px -14px rgba(33,31,27,0.28)' }}
          >
            <ZigzagEdge flip />
            <div className="px-8 pt-7 pb-6">
              <div className="flex items-start justify-between">
                <span
                  style={{ color: INK_MUTED, letterSpacing: '0.14em' }}
                  className="text-[11px] font-semibold uppercase"
                >
                  ใบยืนยันสัญญาเงินกู้
                </span>
                <span
                  style={{ color: STAMP, borderColor: STAMP, transform: 'rotate(-8deg)' }}
                  className="text-[11px] font-bold border rounded px-2 py-1 flex items-center gap-1"
                >
                  <ShieldCheck size={12} /> อนุมัติแล้ว
                </span>
              </div>

              <div
                style={{ color: INK, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.03em' }}
                className="text-2xl font-bold mt-3"
              >
                {groupedLoanNumber}
              </div>
              <div style={{ color: INK_MUTED, fontFamily: 'JetBrains Mono, monospace' }} className="text-xs mt-2">
                ทำรายการเมื่อ {formatDateTime(`${startDate}T${startTime}`)}
              </div>
            </div>

            {/* tear line */}
            <div className="flex items-center px-8">
              <div className="flex-1 border-t border-dashed" style={{ borderColor: LINE }} />
              <Scissors size={13} style={{ color: INK_MUTED }} className="mx-2 rotate-90" />
              <div className="flex-1 border-t border-dashed" style={{ borderColor: LINE }} />
            </div>

            <div className="px-8 pt-5 pb-2">
              {[
                ['เงินต้น', `$${formatMoney(principal)}`],
                ['ดอกเบี้ย (4.111%)', `$${totalInterest}`],
                ['ค่าธรรมเนียมดำเนินการ', `$${processingFee}`],
                ['กำหนดชำระ', dueDate],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-dashed"
                  style={{ borderColor: LINE }}
                >
                  <span style={{ color: INK_MUTED }} className="text-sm">{label}</span>
                  <span
                    style={{ color: INK, fontFamily: 'JetBrains Mono, monospace' }}
                    className="text-sm font-semibold"
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-8 pt-4 pb-6">
              <div style={{ background: TOTAL_BG }} className="rounded-lg px-4 py-3 flex items-center justify-between">
                <span style={{ color: TOTAL_INK }} className="text-xs font-semibold">ยอดชำระทั้งหมด</span>
                <span
                  style={{ color: TOTAL_INK, fontFamily: 'JetBrains Mono, monospace' }}
                  className="text-2xl font-bold"
                >
                  ${totalPayment}
                </span>
              </div>
            </div>

            {/* barcode */}
            <div className="px-8 pb-6 flex flex-col items-center">
              <div className="flex items-end gap-[2px] h-11">
                {loanNumber.split('').map((d, i) => (
                  <div
                    key={i}
                    style={{ background: INK, width: `${1 + (Number(d) % 4)}px`, height: '100%' }}
                  />
                ))}
              </div>
              <div
                style={{ color: INK_MUTED, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em' }}
                className="text-[11px] mt-2"
              >
                {loanNumber}
              </div>
              <div style={{ color: INK_MUTED }} className="text-[10px] mt-2 text-center">
                กรุณาเก็บสลิปนี้ไว้เป็นหลักฐานการทำธุรกรรม
              </div>
            </div>

            <ZigzagEdge />
          </div>

          {/* actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDownloadSlip}
              disabled={downloading}
              className="flex-1 py-2.5 rounded font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: INK, color: PAPER }}
            >
              <Download size={15} />
              {downloading ? 'กำลังสร้างไฟล์...' : 'ดาวน์โหลดสลิป'}
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded font-semibold text-sm flex items-center justify-center gap-2 border"
              style={{ borderColor: LINE, color: INK, background: PAPER }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ZigzagEdge = ({ flip = false }) => (
  <svg
    viewBox="0 0 400 10"
    preserveAspectRatio="none"
    style={{ width: '100%', height: 10, display: 'block', transform: flip ? 'scaleY(-1)' : 'none' }}
  >
    <polygon
      points={Array.from({ length: 29 }, (_, i) => {
        const x = i * 14;
        const y = i % 2 === 0 ? 0 : 8;
        return `${x},${y}`;
      }).join(' ') + ' 400,10 0,10'}
      fill={PAGE_BG}
    />
  </svg>
);

export default LoanCalculator;
