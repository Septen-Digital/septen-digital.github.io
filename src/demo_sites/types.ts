export type DemoContainer = {
  innerHTML: string;
  querySelector<E extends Element = Element>(selectors: string): E | null;
  querySelectorAll<E extends Element = Element>(selectors: string): { forEach(callback: (element: E) => void): void };
};
