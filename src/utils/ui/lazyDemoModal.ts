let demoModalModulePromise: Promise<typeof import("@components/modals/DemoModal")> | null = null;

function loadDemoModal() {
  demoModalModulePromise ??= import("@components/modals/DemoModal");
  return demoModalModulePromise;
}

export async function openDemoModalLazy(businessName: string): Promise<void> {
  const { openDemoModal } = await loadDemoModal();
  openDemoModal(businessName);
}
