# Signature Pad Implementation Guide

This guide explains how to use the SignaturePad component that has been added to the Matanuska Transport Platform.

## Overview

The SignaturePad component is a reusable component that allows capturing and displaying signatures in the application. It's built on top of the popular `signature_pad` library and wrapped in a React component for easy integration with your forms.

## Implementation

The SignaturePad component has been added to:

1. **Job Cards** (`src/components/Models/Workshop/JobCard.tsx`)
2. **Inspection Forms** (`src/components/forms/InspectionForm.tsx`)

## How to Use the Signature Pad

The SignaturePad component is available at `src/components/ui/SignaturePad.tsx` and can be used in any form or component that requires signature capture.

### Basic Usage

```tsx
import SignaturePad from "../ui/SignaturePad";

// In your component
const [signature, setSignature] = useState<string>("");

// In your JSX
<SignaturePad
  title="Customer Signature"
  onChange={setSignature}
  value={signature}
  id="customer-signature"
  required
/>;
```

### Props

The SignaturePad component accepts the following props:

| Prop              | Type                              | Description                                                |
| ----------------- | --------------------------------- | ---------------------------------------------------------- |
| `onChange`        | `(signatureData: string) => void` | Callback function when signature changes                   |
| `value`           | `string`                          | The signature data URL                                     |
| `title`           | `string`                          | Title displayed above the signature pad                    |
| `width`           | `number`                          | Width of the signature pad in pixels (default: 400)        |
| `height`          | `number`                          | Height of the signature pad in pixels (default: 200)       |
| `readOnly`        | `boolean`                         | If true, signature pad is read-only (default: false)       |
| `penColor`        | `string`                          | Color of the signature pen (default: "#000000")            |
| `backgroundColor` | `string`                          | Background color of the signature pad (default: "#ffffff") |
| `className`       | `string`                          | Additional CSS class names                                 |
| `required`        | `boolean`                         | If true, displays a red asterisk (default: false)          |
| `id`              | `string`                          | HTML ID for the canvas element (default: "signature-pad")  |

## Saving Signatures

Signatures are saved as data URLs, which can be stored in your database. When the user clicks the "Save Signature" button, the `onChange` callback is triggered with the signature data URL.

The signature data URL is in PNG format by default, but you can also get it in other formats:

```tsx
// In your component
const handleSaveSignature = (dataURL: string) => {
  // Save the PNG data URL
  setSignature(dataURL);

  // Alternatively, you could convert it to other formats using the underlying library
  // See the signature_pad documentation for more details
};
```

## Advanced Usage

For more advanced usage, you can refer to the [signature_pad documentation](https://github.com/szimek/signature_pad).

## Known Limitations

- The SignaturePad component requires a modern browser that supports the HTML5 Canvas API.
- Mobile support is provided via touch events, but performance may vary across devices.
- The signature data URL can be large, especially for complex signatures, so be mindful of storage requirements.

## Support

For any issues or questions regarding the SignaturePad component, please contact the development team.
