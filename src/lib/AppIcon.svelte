<script lang="ts">
  import AppIcon from '~icons/assets/icon';

  type props = {
    size?: number;
    label?: string;
    color?: string;
  };

  let { size = 128, label = 'app icon', color = 'black' }: props = $props();
</script>

<AppIcon height={size} width={size} role="img" aria-label={label} {color} />
