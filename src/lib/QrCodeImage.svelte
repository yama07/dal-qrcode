<script lang="ts">
  import QRCode from 'qrcode';
  import AppIcon from './AppIcon.svelte';
  import CardContent from './components/ui/card/card-content.svelte';
  import CardFooter from './components/ui/card/card-footer.svelte';
  import Card from './components/ui/card/card.svelte';

  type props = {
    text?: string;
    size?: number;
    margin?: number;
    colorDark?: string;
    colorLight?: string;
    scale?: number;
  };

  let {
    text = '',
    size = 128,
    margin = 0,
    colorDark = '#000000',
    colorLight = '#ffffff',
    scale = 4,
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
</script>

<Card>
  {#await qrcode}
    <CardContent>
      <AppIcon {size} color="gray" alt="Loading" />
    </CardContent>
    <CardFooter class="flex-col gap-2">generating</CardFooter>
  {:then datastring}
    <CardContent>
      <img src={datastring} alt="QR Code" width={size} height={size} />
    </CardContent>
  {:catch error}
    <CardContent>
      {#if !text}
        <AppIcon {size} color="gray" alt="No data" />
      {:else}
        <AppIcon {size} color="pink" alt="Error" />
      {/if}
    </CardContent>
  {/await}
</Card>
