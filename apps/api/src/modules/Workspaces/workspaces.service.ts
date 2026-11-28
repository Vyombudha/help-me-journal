import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { users, workspaces, type Workspace } from "../../../db/schema";
import { NotFoundError } from "../../shared/errors/AppError";
import type { PageIconName } from "@help-me-journal/shared/icons";
import { WorkspaceStatus } from "@help-me-journal/shared/data/statuses";

const getAll = (ownerId: string): Promise<Workspace[]> =>
  db.select().from(workspaces).where(eq(workspaces.ownerId, ownerId));

const create = async (
  ownerId: string,
  name: string,
  description: string,
  icon: PageIconName,
): Promise<Workspace> => {
  const [ws] = await db
    .insert(workspaces)
    .values({ ownerId, name, description, icon })
    .returning();
  return ws!;
};

const getAllOrCreateDefault = async (ownerId: string): Promise<Workspace[]> => {
  const all = await getAll(ownerId);

  if (all.some((w) => w.isDefault)) return all;

  // Existing workspaces, but none is the default.
  if (all.length > 0) {
    await db
      .update(workspaces)
      .set({ isDefault: true })
      .where(eq(workspaces.id, all[0]!.id));
    return getAll(ownerId);
  }

  const [user] = await db.select().from(users).where(eq(users.id, ownerId));
  const [ws] = await db
    .insert(workspaces)
    .values({
      ownerId,
      name: `${user.name}'s Workspace`,
      description: `${user.name}'s default workspace. You can change this later.`,
      isDefault: true,
    })
    .returning();
  return [ws!];
};

const get = async (
  ownerId: string,
  workspaceId: string,
): Promise<Workspace> => {
  const [ws] = await db
    .select()
    .from(workspaces)
    .where(
      and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, ownerId)),
    );
  if (!ws) throw new NotFoundError();
  return ws;
};

const update = async (
  ownerId: string,
  workspaceId: string,
  newName: string,
  newDescription: string,
  newIcon: PageIconName,
  newStatus: WorkspaceStatus,
): Promise<Workspace> => {
  const [ws] = await db
    .update(workspaces)
    .set({
      name: newName,
      description: newDescription,
      icon: newIcon,
      status: newStatus,
    })
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, ownerId)))
    .returning();
  if (!ws) throw new NotFoundError();
  return ws;
};

const setDefaultWorkspace = async (
  ownerId: string,
  workspaceId: string,
): Promise<Workspace> => {
  const targetWs = await get(ownerId, workspaceId);
  if (targetWs.isDefault) return targetWs;
  const [, [updated]] = await db.batch([
    db
      .update(workspaces)
      .set({ isDefault: false })
      .where(
        and(eq(workspaces.ownerId, ownerId), eq(workspaces.isDefault, true)),
      ),
    db
      .update(workspaces)
      .set({ isDefault: true })
      .where(
        and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, ownerId)),
      )
      .returning(),
  ]);

  return updated;
};

const remove = async (ownerId: string, workspaceId: string): Promise<void> => {
  const deleted = await db
    .delete(workspaces)
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, ownerId)))
    .returning({ id: workspaces.id });
  if (deleted.length === 0) throw new NotFoundError();
};

export const WorkspacesService = {
  get,
  new: create,
  getAllOrCreateDefault,
  update,
  setDefault: setDefaultWorkspace,
  delete: remove,
};
