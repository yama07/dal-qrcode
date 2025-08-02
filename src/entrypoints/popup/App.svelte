<script lang="ts">
  import QrCodeImage from '@/lib/QrCodeImage.svelte';

  let text: string = $state('');

  browser.tabs.query({ active: true, currentWindow: true }).then((tab) => {
    text = tab[0]?.url ?? '';
    console.debug('tab:', text);
  });
</script>

<main>
  {#if text === ''}
    <p>No active tab found.</p>
  {:else}
    <QrCodeImage {text} size={128} />
  {/if}

  <div>
    <input
      type="text"
      bind:value={text}
      placeholder="Enter text or URL to generate QR code"
    />
  </div>
</main>
