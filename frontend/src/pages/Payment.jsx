import React from "react";
import { FaTimes } from "react-icons/fa";

export default function PaymentModal({ onClose }) {
  return (
    <>
      <div className="overlay">
        <div className="modal">

          {/* LEFT */}
          <div className="left">
            <div className="brand">
              <div className="logo">VT</div>
              <div>
                <h2>Viz Travels</h2>
                <p>Secure Payment Gateway</p>
              </div>
            </div>

            <div className="priceBox">
              <p>Total Payable</p>
              <h1>₹27,000</h1>
              <small>Including all taxes</small>
            </div>

            <div className="userBox">
              <p>Logged in via</p>
              <span>+91 98765 43210</span>
            </div>

            <div className="offerBox">
              🎉 Offers available on UPI, Cards & Wallets
            </div>
          </div>

          {/* RIGHT */}
          <div className="right">
            <div className="topBar">
              <h3>Choose Payment Method</h3>
              <FaTimes className="close" onClick={onClose} />
            </div>

            <div className="grid">
              <div className="card">
                <h4>UPI</h4>
                <p>GPay • PhonePe • Paytm</p>
                <span>Instant & Secure</span>
              </div>

              <div className="card">
                <h4>Cards</h4>
                <p>Visa • Mastercard</p>
                <span>1% Cashback</span>
              </div>

              <div className="card">
                <h4>EMI</h4>
                <p>Easy Monthly Payments</p>
                <span>0% Interest</span>
              </div>

              <div className="card">
                <h4>Net Banking</h4>
                <p>All Major Banks</p>
                <span>Safe Transfer</span>
              </div>

              <div className="card full">
                <h4>Wallets</h4>
                <p>Paytm • Amazon Pay • Mobikwik</p>
              </div>
            </div>

            <div className="qrBox">
              <div className="qr"></div>
              <p>Scan & Pay using any UPI App</p>
            </div>

            <button className="payBtn">Proceed to Pay ₹27,000</button>
          </div>

        </div>
      </div>

      {/* CSS */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Inter", Arial, sans-serif;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 15, 25, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(8px);
        }

        .modal {
          width: 920px;
          height: 540px;
          background: #fff;
          display: flex;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 70px rgba(0,0,0,0.25);
        }

        /* LEFT */
        .left {
          width: 35%;
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          color: white;
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .logo {
          width: 48px;
          height: 48px;
          background: white;
          color: #2563eb;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 12px;
        }

        .brand p {
          font-size: 13px;
          opacity: 0.85;
        }

        .priceBox h1 {
          font-size: 34px;
          margin-top: 6px;
        }

        .priceBox small {
          font-size: 12px;
          opacity: 0.8;
        }

        .userBox, .offerBox {
          background: rgba(255,255,255,0.12);
          padding: 12px;
          border-radius: 12px;
          font-size: 13px;
          margin-top: 12px;
          backdrop-filter: blur(10px);
        }

        /* RIGHT */
        .right {
          width: 65%;
          padding: 22px;
          display: flex;
          flex-direction: column;
        }

        .topBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .topBar h3 {
          font-size: 18px;
        }

        .close {
          cursor: pointer;
          font-size: 18px;
          opacity: 0.6;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 18px;
        }

        .card {
          border: 1px solid #eee;
          padding: 14px;
          border-radius: 14px;
          transition: 0.25s;
          cursor: pointer;
          background: #fff;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.08);
          border-color: #c7d2fe;
        }

        .card h4 {
          font-size: 15px;
        }

        .card p {
          font-size: 12px;
          color: #555;
          margin-top: 4px;
        }

        .card span {
          display: inline-block;
          margin-top: 6px;
          font-size: 12px;
          color: #16a34a;
          font-weight: 500;
        }

        .qrBox {
          margin-top: 18px;
          text-align: center;
        }

        .qr {
          width: 110px;
          height: 110px;
          background: #f3f4f6;
          margin: auto;
          border-radius: 12px;
          border: 1px dashed #cbd5e1;
        }

        .payBtn {
          margin-top: auto;
          padding: 12px;
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          border: none;
          color: white;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: 0.2s;
        }

        .payBtn:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
}
