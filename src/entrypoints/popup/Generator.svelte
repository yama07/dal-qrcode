<script lang="ts">
  import QRCode from 'qrcode';
  import AppIcon from '~icons/assets/icon';
  import MdiAlertCircleOutline from '~icons/mdi/alert-circle-outline';
  import MdiContentCopy from '~icons/mdi/content-copy';
  import MdiTrayDownload from '~icons/mdi/tray-download';

  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Card, CardContent } from '$lib/components/ui/card';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';

  type AppState =
    | { state: 'idle' }
    | { state: 'scanning' }
    | { state: 'error'; error: Error }
    | {
        state: 'completed';
        result: { imgDataUrl: string };
      };

  let appState = $state<AppState>({ state: 'idle' });
  let text: string = $state('');

  browser.tabs.query({ active: true, currentWindow: true }).then((tab) => {
    text = tab[0]?.url ?? '';
    console.debug('tab:', text);
  });

  $effect(() => {
    appState = { state: 'scanning' };
    QRCode.toDataURL(text, {
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      scale: 4,
      width: 512,
    })
      .then((result) => {
        appState = { state: 'completed', result: { imgDataUrl: result } };
      })
      .catch((error: Error) => {
        appState =
          error.message === 'No input text'
            ? { state: 'idle' }
            : { state: 'error', error };
      });
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

  function download(dataUrl: string) {
    const blob = dataUrlToBlob(dataUrl);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Dal-QRcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  async function copyToClipboard(dataUrl: string) {
    const blob = dataUrlToBlob(dataUrl);
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
  }
</script>

<div class="grid gap-4">
  <Card class="aspect-square p-0">
    <CardContent class="p-0">
      {#if appState.state === 'idle' || appState.state === 'scanning' || appState.state === 'error'}
        <AppIcon
          role="img"
          aria-label="icon"
          class="text-neutral-600 size-full p-8"
        />
      {:else if appState.state === 'completed'}
        <img
          src={appState.result.imgDataUrl}
          alt="QR Code"
          class="size-full p-1"
        />
      {/if}
    </CardContent>
  </Card>

  <Textarea
    bind:value={text}
    placeholder={browser.i18n.getMessage('popup.generate.textarea-placeholder')}
    aria-label="QR Code Input"
  />

  {#if appState.state === 'error'}
    <Alert variant="destructive">
      <MdiAlertCircleOutline />
      <AlertDescription>{appState.error.message}</AlertDescription>
    </Alert>
  {:else}
    <div class="flex justify-end gap-4">
      <Button
        disabled={appState.state !== 'completed'}
        onclick={() => {
          if (appState.state === 'completed') {
            download(appState.result.imgDataUrl);
          }
        }}
      >
        <MdiTrayDownload />
        {browser.i18n.getMessage('popup.generate.download_button')}
      </Button>
      <Button
        disabled={appState.state !== 'completed'}
        onclick={() => {
          if (appState.state === 'completed') {
            copyToClipboard(appState.result.imgDataUrl);
          }
        }}
      >
        <MdiContentCopy />
        {browser.i18n.getMessage('popup.generate.copy_button')}
      </Button>
    </div>
  {/if}
</div>
