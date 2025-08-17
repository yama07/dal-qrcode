<script lang="ts">
  import AppIcon from '~icons/assets/icon';

  type props = { file?: File; label: string };
  let { file = $bindable(), label }: props = $props();

  let isDragOver = $state(false);

  function extractAcceptFile(fileList: FileList): File | undefined {
    if (fileList.length > 0) {
      const f = fileList[0];
      if (f.type.startsWith('image/')) {
        return f;
      }
    }
    return undefined;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      file = extractAcceptFile(files);
    } else {
      console.error('No files dropped');
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragOver = true;
  }

  function handleDragEnter(event: DragEvent) {
    event.preventDefault();
    isDragOver = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    isDragOver = false;
  }

  function handleFileSelect(event: Event) {
    const files = (event.currentTarget as HTMLInputElement).files;
    if (files) {
      file = extractAcceptFile(files);
    } else {
      console.error('No files dropped');
    }
  }
</script>

<label
  class={`group flex flex-col items-center justify-center w-full aspect-3/2 border-2 border-dashed rounded-md cursor-pointer transition-colors
    ${isDragOver ? 'border-neutral-500 bg-neutral-100' : 'border-neutral-300 hover:border-neutral-500 hover:bg-neutral-100'}`}
  ondrop={handleDrop}
  ondragover={handleDragOver}
  ondragenter={handleDragEnter}
  ondragleave={handleDragLeave}
>
  <div
    class="flex flex-col items-center justify-center gap-4 h-full p-8 transition-colors"
  >
    <AppIcon
      role="img"
      aria-label="icon"
      class={`transition-colors
        ${isDragOver ? 'text-neutral-500' : 'text-neutral-300 group-hover:text-neutral-500'}`}
    />
    <p
      class={`text-sm transition-colors
        ${isDragOver ? 'text-neutral-500' : 'text-neutral-300 group-hover:text-neutral-500'}`}
    >
      {label}
    </p>
    <input
      type="file"
      class="hidden"
      onchange={handleFileSelect}
      accept="image/*"
    />
  </div>
</label>
