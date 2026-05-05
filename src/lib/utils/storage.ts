type ContextData = {
  action: 'generate';
  data: string;
};

export const contextData = storage.defineItem<ContextData | null>(
  'local:context-data',
);
