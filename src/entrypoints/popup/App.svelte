<script lang="ts">
  import Input from '$lib/components/ui/input/input.svelte';
  import QrCodeImage from '$lib/QrCodeImage.svelte';

  let text: string = $state('');

  browser.tabs.query({ active: true, currentWindow: true }).then((tab) => {
    text = tab[0]?.url ?? '';
    console.debug('tab:', text);
  });
</script>

<main>
  <div class="grid gap-4 p-6">
    <QrCodeImage {text} size={256} />

    <Input
      bind:value={text}
      placeholder="Enter text or URL to generate QR code"
      aria-label="QR Code Input"
    />
  </div>
</main>
