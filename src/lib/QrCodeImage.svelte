<script lang="ts">
  import QRCode from 'qrcode';
  import AppIcon from './AppIcon.svelte';
  import CardContent from './components/ui/card/card-content.svelte';
  import Card from './components/ui/card/card.svelte';

  type props = {
    text?: string;
    size?: number;
    margin?: number;
    colorDark?: string;
    colorLight?: string;
    scale?: number;
    dataUrl?: string;
  };

  let {
    text = '',
    size = 128,
    margin = 0,
    colorDark = '#000000',
    colorLight = '#ffffff',
    scale = 4,
    dataUrl = $bindable<string>(''),
  }: props = $props();

  let qrcode: Promise<string> = $derived(
    QRCode.toDataURL(text, {
      margin,
      color: {
        dark: colorDark,
        light: colorLight,
      },
      scale,
      width: size,
    }),
  );

  async function generateDownloadableImage() {
    try {
      dataUrl = await QRCode.toDataURL(text, {
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        scale: 4,
        width: 512,
      });
    } catch (e) {
      dataUrl = '';
    }
  }
  $effect(() => {
    generateDownloadableImage();
  });
</script>

<Card>
  {#await qrcode}
    <CardContent>
      <AppIcon {size} color="gray" label="Loading" />
    </CardContent>
  {:then datastring}
    <CardContent>
      <img src={datastring} alt="QR Code" width={size} height={size} />
    </CardContent>
  {:catch error}
    <CardContent>
      {#if !text}
        <AppIcon {size} color="gray" label="No data" />
      {:else}
        <AppIcon {size} color="pink" label="Error" />
      {/if}
    </CardContent>
  {/await}
</Card>
