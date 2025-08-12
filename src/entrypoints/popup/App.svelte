<script lang="ts">
  import MdiMagnifyScan from '~icons/mdi/magnify-scan';
  import MdiQrcode from '~icons/mdi/qrcode';

  import { Tabs, TabsContent } from '$lib/components/ui/tabs';
  import TabsList from '$lib/components/ui/tabs/tabs-list.svelte';
  import TabsTrigger from '$lib/components/ui/tabs/tabs-trigger.svelte';

  import Generator from './Generator.svelte';
  import Scanner from './Scanner.svelte';
</script>

<main>
  <div class="w-88 p-6">
    <Tabs value="generate" class="gap-4">
      <TabsList class="w-full">
        <TabsTrigger value="generate">
          <MdiQrcode />
          Generate
        </TabsTrigger>
        <TabsTrigger value="scan">
          <MdiMagnifyScan />
          Scan
        </TabsTrigger>
      </TabsList>
      <TabsContent value="generate">
        <Generator />
      </TabsContent>
      <TabsContent value="scan">
        <Scanner />
      </TabsContent>
    </Tabs>
  </div>
</main>
