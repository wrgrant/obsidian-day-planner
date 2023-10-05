import { ItemView, WorkspaceLeaf } from "obsidian";
import { Readable } from "svelte/store";

import { obsidianContext, viewTypeTimeline } from "../constants";
import type { ObsidianFacade } from "../service/obsidian-facade";
import type { PlanEditor } from "../service/plan-editor";
import type { DayPlannerSettings } from "../settings";
import { PlacedPlanItem } from "../types";

import Timeline from "./components/timeline.svelte";

export default class TimelineView extends ItemView {
  private timeline: Timeline;

  constructor(
    leaf: WorkspaceLeaf,
    private readonly settings: () => DayPlannerSettings,
    private readonly obsidianFacade: ObsidianFacade,
    private readonly planEditor: PlanEditor,
    private readonly initWeeklyView: () => Promise<void>,
    private readonly timelineTasks: Readable<PlacedPlanItem[]>,
  ) {
    super(leaf);
  }

  getViewType(): string {
    return viewTypeTimeline;
  }

  getDisplayText(): string {
    return "Day Planner Timeline";
  }

  getIcon() {
    return this.settings().timelineIcon;
  }

  async onOpen() {
    const contentEl = this.containerEl.children[1];
    this.timeline = new Timeline({
      target: contentEl,
      context: new Map([
        [
          obsidianContext,
          {
            obsidianFacade: this.obsidianFacade,
            onUpdate: this.planEditor.syncTasksWithFile,
            initWeeklyView: this.initWeeklyView,
            timelineTasks: this.timelineTasks,
          },
        ],
      ]),
    });
  }

  async onClose() {
    this.timeline?.$destroy();
  }
}
