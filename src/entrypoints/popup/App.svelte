<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import Input from '$lib/components/ui/input/input.svelte';
  import QrCodeImage from '$lib/QrCodeImage.svelte';

  let text: string = $state('');
  let dataUrl: string = $state('');

  browser.tabs.query({ active: true, currentWindow: true }).then((tab) => {
    text = tab[0]?.url ?? '';
    console.debug('tab:', text);
  });

  function dataUrlToBlob(dataUrl: string) {
    const base64 = dataUrl.split(',')[1];
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray], { type: mimeString });
  }

  function onDownloadClick() {
    const blob = dataUrlToBlob(dataUrl);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Dal-QRcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  async function onCopyClick() {
    const blob = dataUrlToBlob(dataUrl);
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
  }
</script>

<main>
  <div class="grid gap-4 p-6">
    <QrCodeImage {text} size={256} bind:dataUrl />

    <Input
      bind:value={text}
      placeholder="Enter text or URL to generate QR code"
      aria-label="QR Code Input"
    />

    <Button disabled={dataUrl === ''} onclick={onDownloadClick}>
      Download
    </Button>

    <Button disabled={dataUrl === ''} onclick={onCopyClick}>Copy</Button>
  </div>
</main>
