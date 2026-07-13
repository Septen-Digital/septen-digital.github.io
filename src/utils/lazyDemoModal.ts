let demoModalModulePromise: Promise<typeof import('../components/DemoModal')> | null = null;

function loadDemoModal() {
  demoModalModulePromise ??= import('../components/DemoModal');
  return demoModalModulePromise;
}

export async function openDemoModalLazy(businessName: string): Promise<void> {
  const { openDemoModal } = await loadDemoModal();
  openDemoModal(businessName);
}
