<script lang="ts">
  import QrScanner from 'qr-scanner';
  import AppIcon from '~icons/assets/icon';
  import MdiAlertCircleOutline from '~icons/mdi/alert-circle-outline';
  import MdiClearCircle from '~icons/mdi/clear-circle';
  import MdiContentCopy from '~icons/mdi/content-copy';
  import MdiLinkVariant from '~icons/mdi/link-variant';
  import MdiRecordCircleOutline from '~icons/mdi/record-circle-outline';
  import MdiStopCircleOutline from '~icons/mdi/stop-circle-outline';

  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent } from '$lib/components/ui/card';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
  } from '$lib/components/ui/select';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import { copyToClipboard, isBrowsableUrl } from '$lib/utils/browser';

  type AppState =
    | { state: 'initializing' }
    | { state: 'idle' }
    | { state: 'scanning' }
    | {
        state: 'completed';
        result: QrScanner.ScanResult & { imgDataUrl: string };
      }
    | { state: 'error'; error: string | Error };

  let videoElement: HTMLVideoElement;
  let scanner: QrScanner | undefined;
  let appState = $state<AppState>({ state: 'initializing' });
  let cameraList = $state<QrScanner.Camera[]>([]);
  let cameraId = $state<string | undefined>();
  let cameraLabel = $derived(
    cameraList.find((f) => f.id === cameraId)?.label ?? '-',
  );
  let isCameraAvailable = $derived(cameraList.length > 0);

  $effect(() => {
    scanner = new QrScanner(videoElement, onDecode, {
      onDecodeError,
      highlightScanRegion: true,
      highlightCodeOutline: true,
    });

    return () => {
      scanner?.stop();
      scanner?.destroy();
    };
  });

  $effect(() => {
    QrScanner.listCameras(true)
      .then((cameras) => {
        if (cameras.length > 0 && cameras[0].id) {
          cameraList = cameras;
          cameraId = cameras[0].id;
          appState = { state: 'idle' };
        } else {
          cameraList = [];
          cameraId = undefined;
          appState = {
            state: 'error',
            error: browser.i18n.getMessage(
              'scanWithCamera__notAvailableCamera_error',
            ),
          };
        }
      })
      .catch((error) => {
        console.error('Error', error);
        appState = {
          state: 'error',
          error: browser.i18n.getMessage('scanWithCamera__unknownCamera_error'),
        };
      });
  });

  $effect(() => {
    if (scanner && cameraId) {
      console.log('Setting camera:', cameraId);
      scanner.setCamera(cameraId);
    }
  });

  function onDecode(result: QrScanner.ScanResult) {
    console.log('Decoded QR code:', result.data);

    if (!scanner) return;
    scanner.stop();
    const imgDataUrl = scanner.$canvas.toDataURL('image/png');

    appState = {
      state: 'completed',
      result: {
        ...result,
        imgDataUrl,
      },
    };
  }

  function onDecodeError(error: string | Error) {
    if (error === QrScanner.NO_QR_CODE_FOUND) return;

    console.error('Error decoding QR code:', error);
    appState = {
      state: 'error',
      error: browser.i18n.getMessage('scanWithCamera__unknown_error'),
    };
  }

  function startScanning() {
    scanner?.start();
    appState = { state: 'scanning' };
  }

  function stopScanning() {
    scanner?.stop();
    appState = { state: 'idle' };
  }

  function clear() {
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
  <title>{browser.i18n.getMessage('scanWithCamera__title')}</title>
</svelte:head>

<main>
  <div
    class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
  >
    <div class="flex w-full max-w-lg flex-col gap-6">
      <Card>
        <CardContent class="flex justify-center">
          <div id="video-container" hidden={appState.state !== 'scanning'}>
            <video bind:this={videoElement}><track kind="captions" /></video>
          </div>

          {#if appState.state === 'initializing' || appState.state === 'error'}
            <AppIcon
              role="img"
              aria-label="icon"
              class="text-neutral-300 size-1/2"
            />
          {:else if appState.state === 'idle'}
            <AppIcon
              role="img"
              aria-label="icon"
              class="text-neutral-600 size-1/2"
            />
          {:else if appState.state === 'completed'}
            <div class="relative">
              <img src={appState.result.imgDataUrl} alt="Scanned QR Code" />
              <MdiClearCircle
                class="text-neutral-500 hover:text-neutral-900 text-3xl absolute top-2 right-2"
                onclick={clear}
              />
            </div>
          {/if}
        </CardContent>
      </Card>

      <div class="w-full">
        <label for="camera-select" class="text-sm font-medium">
          {browser.i18n.getMessage('scanWithCamera__cameraSelect_label')}
        </label>
        <Select
          type="single"
          bind:value={cameraId}
          disabled={!isCameraAvailable}
        >
          <SelectTrigger class="w-full">{cameraLabel}</SelectTrigger>
          <SelectContent>
            {#each cameraList as camera}
              <SelectItem value={camera.id}>
                <span class="flex items-center gap-2"> {camera.label} </span>
              </SelectItem>
            {/each}
          </SelectContent>
        </Select>
      </div>

      {#if appState.state === 'initializing' || appState.state === 'idle' || appState.state === 'scanning'}
        <Button
          onclick={() => {
            if (appState.state === 'scanning') {
              stopScanning();
            } else {
              startScanning();
            }
          }}
          class="w-full"
          disabled={!isCameraAvailable}
        >
          {#if appState.state === 'scanning'}
            <MdiStopCircleOutline />
            {browser.i18n.getMessage('scanWithCamera__stop_button')}
          {:else}
            <MdiRecordCircleOutline />
            {browser.i18n.getMessage('scanWithCamera__start_button')}
          {/if}
        </Button>
      {:else if appState.state === 'completed'}
        <Textarea bind:value={appState.result.data} readonly />
        <div class="flex justify-end gap-4">
          <Button
            disabled={!isBrowsableUrl(appState.result.data)}
            onclick={handleOpenUrlClick}
          >
            <MdiLinkVariant />
            {browser.i18n.getMessage('scanWithCamera__openUrl_button')}
          </Button>
          <Button variant="outline" onclick={handleCopyClick}>
            <MdiContentCopy />
            {browser.i18n.getMessage('scanWithCamera__copy_button')}
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

<style>
  :global(#video-container) {
    position: relative;
    width: max-content;
    height: max-content;
    overflow: hidden;
  }
  :global(#video-container .scan-region-highlight) {
    border-radius: 16px;
    outline: rgba(0, 0, 0, 0.25) solid 50vmax;
  }
  :global(#video-container .scan-region-highlight-svg) {
    display: none;
  }
</style>
