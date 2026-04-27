import { get, set, del, keys } from "idb-keyval";

export interface OfflineAction {
  id: string; // e.g. timestamp or UUID
  type: "trade" | "journal";
  method: "POST" | "PUT" | "DELETE";
  url: string;
  payload: any;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = "tradeforge_offline_queue";

export async function addToOfflineQueue(action: Omit<OfflineAction, "id" | "timestamp">) {
  const currentQueue = await getOfflineQueue();
  const newAction: OfflineAction = {
    ...action,
    id: Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9),
    timestamp: Date.now(),
  };
  
  currentQueue.push(newAction);
  await set(OFFLINE_QUEUE_KEY, currentQueue);
  return newAction;
}

export async function getOfflineQueue(): Promise<OfflineAction[]> {
  const queue = await get(OFFLINE_QUEUE_KEY);
  return queue || [];
}

export async function removeFromOfflineQueue(id: string) {
  const currentQueue = await getOfflineQueue();
  const newQueue = currentQueue.filter((action) => action.id !== id);
  await set(OFFLINE_QUEUE_KEY, newQueue);
}

export async function clearOfflineQueue() {
  await del(OFFLINE_QUEUE_KEY);
}

/**
 * Attempts to process all queued actions.
 * Should be called when the app comes back online.
 */
export async function processOfflineQueue() {
  if (!navigator.onLine) return;

  const queue = await getOfflineQueue();
  if (queue.length === 0) return;

  console.log(`Processing ${queue.length} offline actions...`);

  // We process sequentially to maintain order 
  for (const action of queue) {
    try {
      const res = await fetch(action.url, {
        method: action.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      });

      if (res.ok) {
        // Success, remove from queue
        await removeFromOfflineQueue(action.id);
      } else {
        // Stop processing to avoid out-of-order execution if a critical error occurs
        console.error("Failed to sync offline action", action);
        break;
      }
    } catch (e) {
      console.error("Network error while syncing Offline Queue", e);
      // Stop and retry later if network fails again
      break;
    }
  }
}
