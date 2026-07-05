type EntryOverride = Partial<IntersectionObserverEntry> & {
  target: Element;
  isIntersecting: boolean;
};

/**
 * jsdom has no native IntersectionObserver. This stand-in lets tests drive
 * the callback with synthetic entries instead of relying on real scroll
 * geometry (which is what the Playwright e2e suite covers).
 */
export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly callback: IntersectionObserverCallback;
  readonly options: IntersectionObserverInit;
  observedElements = new Set<Element>();
  disconnected = false;

  constructor(
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {},
  ) {
    this.callback = callback;
    this.options = options;
    MockIntersectionObserver.instances.push(this);
  }

  observe(element: Element): void {
    this.observedElements.add(element);
  }

  unobserve(element: Element): void {
    this.observedElements.delete(element);
  }

  disconnect(): void {
    this.observedElements.clear();
    this.disconnected = true;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  get root(): Element | Document | null {
    return this.options.root ?? null;
  }

  get rootMargin(): string {
    return this.options.rootMargin ?? "0px";
  }

  get thresholds(): number[] {
    const threshold = this.options.threshold ?? 0;
    return Array.isArray(threshold) ? threshold : [threshold];
  }

  /** Simulate the browser invoking the callback with synthetic entries. */
  trigger(entries: EntryOverride[]): void {
    const fullEntries = entries.map(({ target, isIntersecting, ...rest }) => {
      const entry: IntersectionObserverEntry = {
        target,
        isIntersecting,
        intersectionRatio: isIntersecting ? 1 : 0,
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRect: target.getBoundingClientRect(),
        rootBounds: null,
        time: 0,
        ...rest,
      };

      return entry;
    });

    this.callback(fullEntries, this);
  }

  static reset(): void {
    MockIntersectionObserver.instances = [];
  }

  /** The most recently constructed instance — components in this repo only ever hold one at a time. */
  static last(): MockIntersectionObserver {
    const instance =
      MockIntersectionObserver.instances[
        MockIntersectionObserver.instances.length - 1
      ];

    if (!instance) throw new Error("No MockIntersectionObserver was created.");

    return instance;
  }
}
