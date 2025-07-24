import React, { useState } from "react";
import { QRCode } from "qrcode.react";

const QRGenerator = () => {
  const [text, setText] = useState("");
  const [qrValue, setQrValue] = useState("");

  return (
    <div>
      <h1>QR Generator</h1>
      <input
        type="text"
        placeholder="Enter text to encode"
        value={text}
        onChange={e => setText(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button onClick={() => setQrValue(text)} disabled={!text}>
        Generate QR
      </button>
      <div style={{ marginTop: 24 }}>
        {qrValue && <QRCode value={qrValue} size={200} />}
      </div>
    </div>
  );
};

export default QRGenerator;
