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
  import { copyToClipboard, saveDataUrlAsFile } from '$lib/utils/browser';

  type AppState =
    | { state: 'idle' }
    | { state: 'scanning' }
    | {
        state: 'completed';
        result: { imgDataUrl: string };
      }
    | { state: 'error'; error: Error };

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

  function handleDownloadClick() {
    if (appState.state === 'completed') {
      saveDataUrlAsFile(appState.result.imgDataUrl, 'Dal-QRcode.png');
    }
  }

  function handleCopyClick() {
    if (appState.state === 'completed') {
      copyToClipboard(appState.result.imgDataUrl, 'image');
    }
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
        onclick={handleDownloadClick}
      >
        <MdiTrayDownload />
        {browser.i18n.getMessage('popup.generate.download_button')}
      </Button>
      <Button
        disabled={appState.state !== 'completed'}
        onclick={handleCopyClick}
      >
        <MdiContentCopy />
        {browser.i18n.getMessage('popup.generate.copy_button')}
      </Button>
    </div>
  {/if}
</div>
