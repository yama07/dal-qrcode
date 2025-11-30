<h1 align="center">
  <br>
  <a href="https://github.com/yama07/dal-qrcode">
    <img src="src/assets/icon.svg" alt="Dal QRcode" width="140">
  </a>
  <br>
  Dal QRcode
  <br>
</h1>

<p align="center">A simple QR code generation and scanning web browser extension 🐾</p>

<div align="center">

  [![chrome web store](https://github.com/user-attachments/assets/682b0083-311f-45d1-ac40-bd02fdd87e09)](https://chromewebstore.google.com/detail/dal-qrcode/afoepdfabajnbbkckponmbdjbadkaogi)
  [![firefox browser add-ons](https://github.com/user-attachments/assets/7f03b498-0e15-44e5-b3fc-c7f6326c84be)](https://addons.mozilla.org/ja/firefox/addon/dal-qrcode)

</div>

## Overview

This extension provides a simple and intuitive way to generate QR codes from URLs or scan QR codes from images or the camera. It's designed for ease of use and quick access to QR code functionality.

## Features

- 🌐 **URL QR Code Generation**: Generate QR codes for the current tab's URL.
- ⌨️ **Manual Text Input**: Manually enter text to generate QR code.
- 🖼 **Image QR Code Reading**: Read QR codes from image files.
- 📸 **Camera QR Code Reading**: Read QR codes directly from the device's camera feed.
- ⚡️ **Offline Support**: QR code generation and scanning work completely offline—no internet connection required.
- 🔒 **Privacy & Security**: All QR code processing is done locally. No data is sent outside your device, keeping your information safe and private.
- 🐶 **Simple Interface**: Clean and intuitive user interface.
- 🌐 **Localized UI**: User interface supports both English and Japanese.
- 🐾 **Cross-Platform Support**: Compatible with both Google Chrome and Firefox.

## Development

```sh
npm install

## Google Chrome
npm run dev
npm run build
npm run zip

## Firefox
npm run dev:firefox
npm run build:firefox
npm run zip:firefox
```

## Testing

```sh
## Unit Testing (Vitest)
npm run test

## End-to-End Testing (Playwright)
npm run build  # Build before e2e
npm run e2e
```

## License

This project is licensed under the [MIT License](LICENSE).

---

**QR Code** is a registered trademark of DENSO WAVE INCORPORATED in Japan and in other countries.
