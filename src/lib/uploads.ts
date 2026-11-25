/**
 * WHAT MAY BE UPLOADED, AND HOW BIG — one list, used by the forms (to say no
 * before anything is sent) and by the server (which decides).
 *
 * Nothing secret in here; it is safe to use in a browser.
 *
 * WHY UPLOADS GO STRAIGHT TO THE STORE. The portal's host refuses any request
 * bigger than about 4.5 MB, and a photograph off a modern phone is often more.
 * So a file does not travel through the portal at all: the server hands the
 * browser a one-time permission to put ONE file at ONE address in the private
 * store, the browser puts it there, and then tells the server it has. The
 * server checks the file really is there, and is what it claims to be, before
 * anything is saved. The permission is only given to somebody entitled to it
 * (a controller for news; a signed-in member for the Flying Blog and Gallery).
 */

export const MB = 1024 * 1024;

export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_PHOTO = 15 * MB;

/** Files a notice may carry, and what to call each kind. A PDF opens in the browser; the others download. */
export const FILE_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'Word document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word document',
  'application/vnd.ms-excel': 'Excel spreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel spreadsheet',
  'application/vnd.ms-powerpoint': 'PowerPoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
  'text/plain': 'text file',
  'text/csv': 'CSV file',
};
export const MAX_FILE = 25 * MB;

export const MAX_NOTICE_PHOTOS = 4;
export const MAX_NOTICE_FILES = 4;

export type UploadKind = 'photo' | 'file';

/** A file name that is safe as part of an address. Keeps the extension. */
export const safeFileName = (name: string) =>
  (name.normalize('NFKD').replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^[._]+/, '').slice(-80) || 'file').toLowerCase();

/** Why this file cannot be uploaded, or null if it can. */
export function uploadProblem(kind: UploadKind, f: { name: string; type: string; size: number }): string | null {
  if (!f || typeof f.size !== 'number' || f.size <= 0) return `“${f?.name ?? 'That file'}” is empty.`;
  if (kind === 'photo') {
    if (!PHOTO_TYPES.includes(f.type)) return `“${f.name}” is not a photograph the portal can show. Use a JPG, PNG or WEBP.`;
    if (f.size > MAX_PHOTO) return `“${f.name}” is over ${MAX_PHOTO / MB} MB. Please use a smaller copy.`;
    return null;
  }
  if (!FILE_TYPES[f.type]) return `“${f.name}” is not a kind of file a notice can carry. Use a PDF, or a Word, Excel or PowerPoint file.`;
  if (f.size > MAX_FILE) return `“${f.name}” is over ${MAX_FILE / MB} MB.`;
  return null;
}
