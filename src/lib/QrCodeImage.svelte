<script lang="ts">
  import QRCode from 'qrcode';

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
    margin = 4,
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

{#await qrcode}
  <p>generating</p>
{:then datastring}
  <img src={datastring} alt="QR Code" width={size} height={size} />
{:catch error}
  <p>{error}</p>
{/await}
