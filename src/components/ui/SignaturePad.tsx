import React, { useEffect, useRef, useState } from "react";
import SignaturePadBase from "signature_pad";
import Button from "./Button";
import { Card, CardContent, CardHeader } from "./Card";

interface SignaturePadProps {
  onChange?: (signatureData: string) => void;
  value?: string;
  title?: string;
  width?: number;
  height?: number;
  readOnly?: boolean;
  penColor?: string;
  backgroundColor?: string;
  className?: string;
  required?: boolean;
  id?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  onChange,
  value,
  title = "Signature",
  width = 400,
  height = 200,
  readOnly = false,
  penColor = "#000000",
  backgroundColor = "#ffffff",
  className = "",
  required = false,
  id = "signature-pad",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePadBase | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Adjust canvas for high DPI displays
    const canvas = canvasRef.current;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(ratio, ratio);
    }

    // Initialize the signature pad
    signaturePadRef.current = new SignaturePadBase(canvas, {
      backgroundColor: backgroundColor,
      penColor: penColor,
      velocityFilterWeight: 0.7,
    });

    // If in readOnly mode or we have an initial value
    if (readOnly) {
      signaturePadRef.current.off();
    }

    if (value) {
      signaturePadRef.current.fromDataURL(value);
      setIsEmpty(false);
    }

    // Clean up
    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, [width, height, backgroundColor, penColor, readOnly]);

  // Load signature from data URL when value changes
  useEffect(() => {
    if (value && signaturePadRef.current) {
      signaturePadRef.current.fromDataURL(value);
      setIsEmpty(false);
    }
  }, [value]);

  const clear = () => {
    if (signaturePadRef.current && !readOnly) {
      signaturePadRef.current.clear();
      setIsEmpty(true);
      if (onChange) {
        onChange("");
      }
    }
  };

  const save = () => {
    if (signaturePadRef.current && !readOnly) {
      const dataURL = signaturePadRef.current.toDataURL("image/png");
      if (onChange) {
        onChange(dataURL);
      }
    }
  };

  const checkEmpty = () => {
    if (signaturePadRef.current) {
      setIsEmpty(signaturePadRef.current.isEmpty());
    }
  };

  return (
    <Card className={`signature-pad-container ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {title} {required && <span className="text-red-500">*</span>}
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="border rounded-md mb-4">
            <canvas
              id={id}
              ref={canvasRef}
              className="cursor-crosshair"
              onMouseUp={checkEmpty}
              onTouchEnd={checkEmpty}
            />
          </div>
          {!readOnly && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={clear} disabled={isEmpty} type="button">
                Clear
              </Button>
              <Button variant="default" size="sm" onClick={save} disabled={isEmpty} type="button">
                Save Signature
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignaturePad;
