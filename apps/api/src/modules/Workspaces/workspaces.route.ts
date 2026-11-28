import { Hono } from "hono";
import type { AppEnv } from "../../shared/types/hono.js";
import { WorkspacesController } from "./workspaces.controller.js";
const WorkspacesRouter = new Hono<AppEnv>();

WorkspacesRouter.get("/", ...WorkspacesController.getAll);

WorkspacesRouter.post("/", ...WorkspacesController.new);

WorkspacesRouter.get("/:workspaceId", ...WorkspacesController.get);

WorkspacesRouter.put("/:workspaceId", ...WorkspacesController.put);

WorkspacesRouter.put(
  "/:workspaceId/set-default",
  ...WorkspacesController.setDefault,
);
WorkspacesRouter.delete("/:workspaceId", ...WorkspacesController.delete);

export { WorkspacesRouter };
