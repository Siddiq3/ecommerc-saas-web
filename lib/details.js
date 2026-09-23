/**
 * Turns Zod issues into one `{ path, message }` per field.
 *
 * Mirrors the backend's own mapping so an error raised here reads exactly like one raised
 * there: an unrecognised-keys issue names several keys at once, and is split so each gets
 * its own entry that a form can show beside the right input.
 */
export const toDetails = (issues) =>
  issues.flatMap((issue) => {
    if (issue.code === 'unrecognized_keys') {
      const base = issue.path.join('.');
      return issue.keys.map((key) => ({
        path: base ? `${base}.${key}` : key,
        message: 'This field is not accepted',
      }));
    }
    return [{ path: issue.path.join('.') || '_', message: issue.message }];
  });

/** The same information keyed by field, for rendering beside inputs. */
export const fieldErrors = (issues) => {
  const errors = {};
  for (const { path, message } of toDetails(issues)) errors[path] ??= message;
  return errors;
};
