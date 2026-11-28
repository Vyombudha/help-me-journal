import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../../db";
import {
  pages,
  users,
  WORKSPACE_STATUSES,
  workspaces,
  WorkspaceStatus,
} from "../../db/schema";
import { eq } from "drizzle-orm";
import { USER_1, USER_2, makeApp, json } from "./test.setup";
import { UpdateWorkspaceSchema } from "@help-me-journal/shared/schema";

beforeEach(async () => {
  await db.delete(users);
});

describe("POST /api/v1/workspaces", () => {
  it("creates a new workspace for user", async () => {
    const app = makeApp();
    const res = await app.request(
      "/api/v1/workspaces",
      json("POST", {
        name: "WORKSPACE FOR USER 1",
        description: "IT IS THE WORKSPACE FOR TEST STUFF",
        icon: "book-open",
      }),
    );
    expect(res.status).toBe(200);

    const rows = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.ownerId, USER_1.id));
    expect(rows.some((w) => w.name === "WORKSPACE FOR USER 1")).toBe(true);
  });

  it("rejects an invalid body", async () => {
    const res = await makeApp().request(
      "/api/v1/workspaces",
      json("POST", { name: "" }),
    );
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/v1/workspaces/:workspaceId", () => {
  it("replaces the given fields", async () => {
    const app = makeApp();
    await app.request("/api/v1/workspaces");

    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.ownerId, USER_1.id));

    const res = await app.request(
      `/api/v1/workspaces/${ws!.id}`,
      json("PUT", {
        newName: "Renamed",
        newDescription: ws!.description + "replaced",
        newIcon: "book-open",
        newStatus: "IN_PROGRESS",
      }),
    );
    expect(res.status).toBe(200);

    const [after] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, ws!.id));
    expect(after?.name).toBe("Renamed"); // replaced with new
    expect(after?.description).toBe(ws!.description + "replaced"); // replaced with new
  });

  it("rejects invalidated body as a whole", async () => {
    const app = makeApp();
    await app.request("/api/v1/workspaces");

    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.ownerId, USER_1.id));

    const res = await app.request(
      `/api/v1/workspaces/${ws!.id}`,
      json("PUT", {
        newName: "", //  this is unvalid
        newDescription: "this is completely valid updated description body", // valid
        newIcon: "invalid-icon", // this is also invalid
        newStatus: ws.status, // valid
      }),
    );
    expect(res.status).toBe(400);

    const [after] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, ws!.id));
    expect(after).toEqual(ws); // nothing changed at all
  });
});

describe("PUT /api/v1/workspaces/:workspaceId/set-default", () => {
  it("sets given workspace as new default", async () => {
    const app = makeApp();
    await app.request("/api/v1/workspaces");
    const [oldDefaultWs] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.ownerId, USER_1.id));
    expect(oldDefaultWs!.isDefault).toBe(true);
    const [newWs] = await db
      .insert(workspaces)
      .values({
        ownerId: USER_1.id,
        name: "new-default-ws",
        description: "this will now be default workspace",
        icon: "book-open",
      })
      .returning();

    expect(newWs.isDefault).toBe(false);
    const res = await app.request(
      `/api/v1/workspaces/${newWs!.id}/set-default`,
      json("PUT"),
    );
    expect(res.status).toBe(200);

    const all = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.ownerId, USER_1.id));
    expect(all.filter((w) => w.isDefault)).toHaveLength(1);
    expect(all.find((w) => w.isDefault)?.id).toBe(newWs!.id);
  });
});

describe("DELETE /api/v1/workspaces/:workspaceId", () => {
  it("removes the workspace and its pages", async () => {
    const app = makeApp();

    // 1. create a workspace through the API
    const createRes = await app.request(
      "/api/v1/workspaces",
      json("POST", {
        name: "my workspace",
        description: "This workspace exists",
        icon: "book-open",
      }),
    );
    expect(createRes.status).toBe(200);

    const created = (await createRes.json()) as any;
    const id: string = created.data.id;

    const res = await makeApp().request(`/api/v1/workspaces/${id}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(200);

    const rows = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id));
    expect(rows).toHaveLength(0);
  });
});

describe("IDOR: user 2 cannot touch user 1's workspace", () => {
  let wsId: string;

  beforeEach(async () => {
    // user 1 creates a workspace
    const res = await makeApp(USER_1).request(
      "/api/v1/workspaces",
      json("POST", {
        name: "private",
        description: "user 1 only",
        icon: "book-open",
      }),
    );
    const body = (await res.json()) as any;
    wsId = body.data.id;
    await makeApp(USER_2).request("/api/v1/workspaces");
  });

  it("cannot read it", async () => {
    const ownerRes = await makeApp(USER_1).request(
      `/api/v1/workspaces/${wsId}`,
    );
    expect(ownerRes.status).toBe(200);

    const res = await makeApp(USER_2).request(`/api/v1/workspaces/${wsId}`);
    expect(res.status).toBe(404);
  });

  it("cannot rename it", async () => {
    const ownerRes = await makeApp(USER_1).request(
      `/api/v1/workspaces/${wsId}`,
    );
    expect(ownerRes.status).toBe(200);

    const res = await makeApp(USER_2).request(
      `/api/v1/workspaces/${wsId}`,
      json("PUT", {
        newName: "hacked",
        newDescription: "hacked workspace",
        newIcon: "book-open",
        newStatus: "ABANDONED",
      }),
    );
    expect(res.status).toBe(404);

    const [row] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, wsId));
    expect(row?.name).toBe("private"); // unchanged
    expect(row?.status).toBe("IN_PROGRESS"); // untouched
  });

  it("cannot delete it", async () => {
    const ownerRes = await makeApp(USER_1).request(
      `/api/v1/workspaces/${wsId}`,
    );
    expect(ownerRes.status).toBe(200);

    const res = await makeApp(USER_2).request(`/api/v1/workspaces/${wsId}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(404);

    const rows = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, wsId));
    expect(rows).toHaveLength(1); // still there
  });
  it("cannot list or create pages in it", async () => {
    const ownerRes = await makeApp(USER_1).request(
      `/api/v1/workspaces/${wsId}`,
    );
    expect(ownerRes.status).toBe(200);

    const list = await makeApp(USER_2).request(
      `/api/v1/workspaces/${wsId}/pages`,
    );
    expect(list.status).toBe(404);

    const create = await makeApp(USER_2).request(
      `/api/v1/workspaces/${wsId}/pages`,
      json("POST", { title: "injected", moods: [] }),
    );
    expect(create.status).toBe(404);

    const injected = await db
      .select()
      .from(pages)
      .where(eq(pages.workspaceId, wsId));
    expect(injected.some((p) => p.title === "injected")).toBe(false);
  });
});
