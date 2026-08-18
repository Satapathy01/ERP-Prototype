// src/lib/storage/storage.ts

import fs from "fs/promises";
import path from "path";

import {
  STORAGE_ROOT,
  STORAGE_PATHS,
  STUDENT_FOLDERS,
  getStudentRoot,
} from "./paths";

import type { StudentFolder, StorageFolder } from "./types";

/**
 * Create a directory if it doesn't already exist.
 */
export async function ensureDirectory(dir: string): Promise<void> {
  await fs.mkdir(dir, {
    recursive: true,
  });
}

/**
 * Check if a directory or file exists.
 */
export async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates the top-level ERP storage structure.
 * Safe to call on every server startup.
 */
export async function ensureStorageStructure() {
  await Promise.all(
    Object.values(STORAGE_PATHS).map((dir) =>
      ensureDirectory(dir)
    )
  );
}

/**
 * Creates the complete folder structure for a student.
 */
export async function createStudentFolder(
  registrationNumber: string
): Promise<StudentFolder> {
  const root = getStudentRoot(registrationNumber);

  const folders = {
    root,

    admission: path.join(root, STUDENT_FOLDERS.admission),

    photos: path.join(root, STUDENT_FOLDERS.photos),

    identity: path.join(root, STUDENT_FOLDERS.identity),

    qualification: path.join(root, STUDENT_FOLDERS.qualification),

    certificates: path.join(root, STUDENT_FOLDERS.certificates),

    receipts: path.join(root, STUDENT_FOLDERS.receipts),

    idCard: path.join(root, STUDENT_FOLDERS.idCard),
  };

  await Promise.all(
    Object.values(folders).map((folder) =>
      ensureDirectory(folder)
    )
  );

  const makeFolder = (absolutePath: string): StorageFolder => ({
    absolutePath,
    relativePath: path.relative(
      STORAGE_ROOT,
      absolutePath
    ),
  });

  return {
    root: makeFolder(folders.root),
    admission: makeFolder(folders.admission),
    photos: makeFolder(folders.photos),
    identity: makeFolder(folders.identity),
    qualification: makeFolder(folders.qualification),
    certificates: makeFolder(folders.certificates),
    receipts: makeFolder(folders.receipts),
    idCard: makeFolder(folders.idCard),
  };
}

/**
 * Delete an entire student folder.
 * Use carefully.
 */
export async function deleteStudentFolder(
  registrationNumber: string
) {
  const root = getStudentRoot(registrationNumber);

  if (!(await exists(root))) return;

  await fs.rm(root, {
    recursive: true,
    force: true,
  });
}

/**
 * Returns every file/folder inside a directory.
 */
export async function listFiles(directory: string) {
  return fs.readdir(directory, {
    withFileTypes: true,
  });
}