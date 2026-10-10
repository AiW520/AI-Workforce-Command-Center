export type SceneSelection = { kind: "agent" | "skill" | "city"; id: string; source?: string };
export const SCENE_SELECTION_EVENT = "nexus:scene-selection";
export function emitSceneSelection(selection: SceneSelection) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent<SceneSelection>(SCENE_SELECTION_EVENT, { detail: selection }));
}
export function subscribeSceneSelection(listener: (selection: SceneSelection) => void) {
  if (typeof window === "undefined") return () => undefined;
  const handler = (event: Event) => listener((event as CustomEvent<SceneSelection>).detail);
  window.addEventListener(SCENE_SELECTION_EVENT, handler);
  return () => window.removeEventListener(SCENE_SELECTION_EVENT, handler);
}
