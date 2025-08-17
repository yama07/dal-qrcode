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

  let file = $state<File>();
  let scanResult = $state<QrScanner.ScanResult>();
  let errorMessage = $state('');
  let isScanning = $state(false);

  async function scanImage() {
    if (!file) {
      console.error('No files selected');
      return;
    }

    isScanning = true;
    QrScanner.scanImage(file, {
      returnDetailedScanResult: true,
    })
      .then((res) => {
        scanResult = res;
        isScanning = false;
        console.log('Scan result:', res.cornerPoints);
      })
      .catch((error) => {
        errorMessage = (
          typeof error === 'string' ? error : error.message
        ) as string;
        isScanning = false;
        console.error('Error scanning image:', error);
      });
  }

  function clear() {
    file = undefined;
    scanResult = undefined;
    errorMessage = '';
  }

  async function copyToClipboard(varlue: string | undefined) {
    if (!varlue) {
      return;
    }
    await navigator.clipboard.writeText(varlue);
  }

  function isURL(value: string | undefined): boolean {
    if (!value) {
      return false;
    }
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol);
    } catch (error) {
      return false;
    }
  }

  async function openUrl(url: string | undefined) {
    if (!url) {
      return;
    }
    await browser.tabs.create({
      url,
      active: true,
    });
  }
</script>

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
              label={browser.i18n.getMessage('scan-from-image.dropzone_label')}
            />
          {/if}
        </CardContent>
      </Card>

      {#if scanResult}
        <Textarea bind:value={() => scanResult?.data, (v) => {}} readonly />
        <div class="flex justify-end gap-4">
          <Button
            disabled={!isURL(scanResult?.data)}
            onclick={() => openUrl(scanResult?.data)}
          >
            <MdiLinkVariant />
            {browser.i18n.getMessage('scan-from-image.open-url_button')}
          </Button>
          <Button
            variant="outline"
            onclick={() => copyToClipboard(scanResult?.data)}
          >
            <MdiContentCopy />
            {browser.i18n.getMessage('scan-from-image.copy_button')}
          </Button>
        </div>
      {:else if errorMessage}
        <Alert variant="destructive">
          <MdiAlertCircleOutline />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      {:else}
        <Button
          onclick={scanImage}
          disabled={!file || isScanning}
          class="w-full"
        >
          {#if isScanning}
            <MdiLoading class="animate-spin" />
          {:else}
            <MdiQrcodeScan />
          {/if}
          {browser.i18n.getMessage('scan-from-image.scan_button')}
        </Button>
      {/if}
    </div>
  </div>
</main>
