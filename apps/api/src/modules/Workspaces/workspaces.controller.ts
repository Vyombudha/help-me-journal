import { WorkspacesService } from "./workspaces.service.js";

import { createFactory } from "hono/factory";
import type { AppEnv } from "../../shared/types/hono.js";
import { sValidator } from "@hono/standard-validator";
import {
  NewWorkspaceSchema,
  UpdateWorkspaceSchema,
  WorkspaceIdParamSchema,
  type NewWorkspaceInput,
  type UpdateWorkspaceInput,
} from "@help-me-journal/shared/schema";
import { Workspace } from "../../../db/schema.js";

const factory = createFactory<AppEnv>();

const newWorkspace = factory.createHandlers(
  sValidator("json", NewWorkspaceSchema),
  async (c) => {
    const userId = c.get("userId");
    const body: NewWorkspaceInput = c.req.valid("json");
    const newProject = await WorkspacesService.new(
      userId,
      body.name,
      body.description,
      body.icon,
    );
    return c.json(
      {
        success: true,
        data: newProject,
      },
      200,
    );
  },
);

const getAllWorkspaces = factory.createHandlers(async (c) => {
  const userId = c.get("userId");
  const data: Workspace[] =
    await WorkspacesService.getAllOrCreateDefault(userId);

  return c.json(
    {
      success: true,
      data,
    },
    200,
  );
});

const getWorkspace = factory.createHandlers(
  sValidator("param", WorkspaceIdParamSchema),
  async (c) => {
    const userId = c.get("userId");
    const { workspaceId } = c.req.valid("param");
    const workspace: Workspace = await WorkspacesService.get(
      userId,
      workspaceId,
    );

    return c.json(
      {
        success: true,
        data: workspace,
      },
      200,
    );
  },
);

const updateWorkspace = factory.createHandlers(
  sValidator("param", WorkspaceIdParamSchema),
  sValidator("json", UpdateWorkspaceSchema),
  async (c) => {
    const userId = c.get("userId");
    const { workspaceId } = c.req.valid("param");
    const body: UpdateWorkspaceInput = c.req.valid("json");

    const updatedWorkspace: Workspace = await WorkspacesService.update(
      userId,
      workspaceId,
      body.newName,
      body.newDescription,
      body.newIcon,
    );

    return c.json(
      {
        success: true,
        data: updatedWorkspace,
      },
      200,
    );
  },
);

const deleteWorkspace = factory.createHandlers(
  sValidator("param", WorkspaceIdParamSchema),
  async (c) => {
    const userId = c.get("userId");
    const { workspaceId } = c.req.valid("param");
    await WorkspacesService.delete(userId, workspaceId);

    return c.json(
      {
        success: true,
        data: null,
      },
      200,
    );
  },
);

export const WorkspacesController = {
  new: newWorkspace,
  get: getWorkspace,
  getAll: getAllWorkspaces,
  update: updateWorkspace,
  delete: deleteWorkspace,
};
