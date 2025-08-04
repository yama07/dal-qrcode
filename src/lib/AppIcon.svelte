<script lang="ts">
  import AppIcon from '~icons/assets/icon';

  type props = {
    size?: number;
    alt?: string;
    color?: string;
  };

  let { size = 128, alt = 'app icon', color = 'black' }: props = $props();
</script>

<AppIcon height={size} width={size} {alt} {color} />
