# 🔥 firebaseScanner

`firebaseScanner` is a **custom VS Code extension** developed to **scan, validate, and report** on Firebase integration across frontend codebases — particularly useful for React + Firestore apps.

It helps ensure **Firestore usage, Firebase function calls, and telemetry events** are all correctly wired, and exposes misconfigurations or missing bindings via an interactive **TreeView** and JSON reports.

---

## ✅ Features

- 🔍 **Auto-detection of Firebase calls**, including:
  - `addDoc`, `setDoc`, `updateDoc`, `onSnapshot`, `collection`, `query`
- 🗂 **Firebase Integration Map** in VS Code:
  - Visualizes links between files and collections (e.g. `TripForm.tsx → addDoc → trips`)
- 📤 **Integration Report**:
  - Auto-generated `integration-report.json` file for audit + compliance
- 🧪 **Validation Command**:
  - Manual trigger to scan the `/src/` folder and flag inconsistencies
- 🌐 **Environment Checker**:
  - Warns when `.env` Firebase keys are missing or incomplete

---

## 📦 Installation

After packaging (`.vsix`), install manually with:

```bash
code --install-extension firebaseScanner-0.0.1.vsix
