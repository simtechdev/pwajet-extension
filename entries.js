export default ({ options }) => ([
  /**
   * RenderSubscriber is a required postfix
   */
  {
    name: 'exampleAddonRenderSubscriber',
    file: `./src/index.tsx`
  },
  {
    name: `${options.vendorId}-${options.extensionId}InternalApi`,
    file: `./src/internals.ts`
  },
])
