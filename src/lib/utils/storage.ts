type ContextData = {
  action: 'generate' | 'scan';
  data: string;
};

export const contextData = storage.defineItem<ContextData | null>(
  'local:context-data',
);
