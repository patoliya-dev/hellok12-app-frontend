// Diff original vs current UI lessons
export function buildLessonMutations(original = [], current = []) {
  const byId = new Map(original.filter(x => x._id).map(x => [x._id, x]));
  const deletes = [];
  const updates = [];
  const creates = [];

  // Detect deletions
  for (const o of original) {
    if (o._id && !current.some(n => n._id === o._id)) {
      deletes.push(o._id);
    }
  }

  // Detect creates & updates
  for (const n of current) {
    if (!n._id) {
      creates.push(n);
    } else {
      const old = byId.get(n._id);
      if (old) {
        // buildPartialUpdate is imported by caller (to avoid cycle)
        // we’ll call it there
        // updates.push( buildPartialUpdate(old, n) );
      }
    }
  }

  return { creates, updates, deletes };
}
