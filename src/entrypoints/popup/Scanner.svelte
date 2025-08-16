<script lang="ts">
  import MdiCameraOutline from '~icons/mdi/camera-outline';
  import MdiFileImageOutline from '~icons/mdi/file-image-outline';

  import Button from '$lib/components/ui/button/button.svelte';

  async function openScanImage() {
    await browser.tabs.create({
      url: browser.runtime.getURL('/scan-image.html'),
      active: true,
    });
  }

  async function openScanCamera() {
    await browser.tabs.create({
      url: browser.runtime.getURL('/scan-camera.html'),
      active: true,
    });
  }
</script>

<div class="grid gap-4">
  <Button onclick={openScanImage}>
    <MdiFileImageOutline />
    {browser.i18n.getMessage('popup.scan.scan-from-image_button')}
  </Button>
  <Button onclick={openScanCamera}>
    <MdiCameraOutline />
    {browser.i18n.getMessage('popup.scan.scan-with-camera_button')}
  </Button>
</div>
