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
    Scan from Image
  </Button>
  <Button onclick={openScanCamera}>
    <MdiCameraOutline />
    Scan with Came
  </Button>
</div>
