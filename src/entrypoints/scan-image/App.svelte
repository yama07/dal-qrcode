<script lang="ts">
  import QrScanner from 'qr-scanner';
  import MdiAlertCircleOutline from '~icons/mdi/alert-circle-outline';
  import MdiClearCircle from '~icons/mdi/clear-circle';
  import MdiContentCopy from '~icons/mdi/content-copy';
  import MdiLinkVariant from '~icons/mdi/link-variant';
  import MdiLoading from '~icons/mdi/loading';
  import MdiQrcodeScan from '~icons/mdi/qrcode-scan';

  import Dropzone from '$lib/components/Dropzone.svelte';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent } from '$lib/components/ui/card';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import { copyToClipboard, isBrowsableUrl } from '$lib/utils/browser';

  type AppState =
    | { state: 'idle' }
    | { state: 'loaded' }
    | { state: 'scanning' }
    | { state: 'completed'; result: QrScanner.ScanResult }
    | { state: 'error'; error: string | Error };

  let appState = $state<AppState>({ state: 'idle' });
  let file = $state<File>();

  $effect(() => {
    if (file) appState = { state: 'loaded' };
  });

  function scanImage() {
    if (!file) {
      console.error('No files selected');
      return;
    }

    appState = { state: 'scanning' };

    QrScanner.scanImage(file, { returnDetailedScanResult: true })
      .then((result) => {
        appState = { state: 'completed', result };
      })
      .catch((error) => {
        console.error('Error', error);
        appState = { state: 'error', error };
      });
  }

  function clear() {
    file = undefined;
    appState = { state: 'idle' };
  }

  function handleOpenUrlClick() {
    if (appState.state === 'completed') {
      browser.tabs.create(
        {
          url: appState.result.data,
          active: true,
        },
        () => window.close(),
      );
    }
  }

  function handleCopyClick() {
    if (appState.state === 'completed') {
      copyToClipboard(appState.result.data, 'text');
    }
  }
</script>

<svelte:head>
  <title>{browser.i18n.getMessage('scanFromImage__title')}</title>
</svelte:head>

<main>
  <div
    class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
  >
    <div class="flex w-full max-w-lg flex-col gap-6">
      <Card>
        <CardContent class="flex justify-center">
          {#if file}
            <div class="relative">
              <img src={URL.createObjectURL(file)} alt="preview" />
              <MdiClearCircle
                class="text-neutral-500 hover:text-neutral-900 text-3xl absolute top-2 right-2"
                onclick={clear}
              />
            </div>
          {:else}
            <Dropzone
              bind:file
              label={browser.i18n.getMessage('scanFromImage__dropzone_label')}
            />
          {/if}
        </CardContent>
      </Card>

      {#if appState.state === 'idle' || appState.state === 'loaded' || appState.state === 'scanning'}
        <Button
          onclick={scanImage}
          disabled={appState.state !== 'loaded'}
          class="w-full"
        >
          {#if appState.state === 'scanning'}
            <MdiLoading class="animate-spin" />
          {:else}
            <MdiQrcodeScan />
          {/if}
          {browser.i18n.getMessage('scanFromImage__scan_button')}
        </Button>
      {:else if appState.state === 'completed'}
        <Textarea
          bind:value={
            () =>
              appState.state === 'completed' ? appState.result.data : undefined,
            (v) => {}
          }
          readonly
        />
        <div class="flex justify-end gap-4">
          <Button
            disabled={!isBrowsableUrl(appState.result.data)}
            onclick={handleOpenUrlClick}
          >
            <MdiLinkVariant />
            {browser.i18n.getMessage('scanFromImage__openUrl_button')}
          </Button>
          <Button variant="outline" onclick={handleCopyClick}>
            <MdiContentCopy />
            {browser.i18n.getMessage('scanFromImage__copy_button')}
          </Button>
        </div>
      {:else if appState.state === 'error'}
        <Alert variant="destructive">
          <MdiAlertCircleOutline />
          <AlertDescription>{appState.error}</AlertDescription>
        </Alert>
      {/if}
    </div>
  </div>
</main>
