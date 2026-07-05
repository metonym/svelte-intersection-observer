import { afterEach, beforeEach, vi } from "vitest";
import { MockIntersectionObserver } from "./mock-intersection-observer";

beforeEach(() => {
  MockIntersectionObserver.reset();
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});
