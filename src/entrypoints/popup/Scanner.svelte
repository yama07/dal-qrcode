<script lang="ts">
  import MdiCameraOutline from '~icons/mdi/camera-outline';
  import MdiFileImageOutline from '~icons/mdi/file-image-outline';

  import Button from '$lib/components/ui/button/button.svelte';

  async function openScanImage() {
    browser.tabs.create(
      {
        url: browser.runtime.getURL('/scan-image.html'),
        active: true,
      },
      () => window.close(),
    );
  }

  async function openScanCamera() {
    browser.tabs.create(
      {
        url: browser.runtime.getURL('/scan-camera.html'),
        active: true,
      },
      () => window.close(),
    );
  }
</script>

<div class="grid gap-4">
  <Button onclick={openScanImage}>
    <MdiFileImageOutline />
    {browser.i18n.getMessage('popup_scan__scanFromImage_button')}
  </Button>
  <Button onclick={openScanCamera}>
    <MdiCameraOutline />
    {browser.i18n.getMessage('popup_scan__scanWithCamera_button')}
  </Button>
</div>
