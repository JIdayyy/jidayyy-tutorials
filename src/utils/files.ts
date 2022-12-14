/* eslint-disable import/prefer-default-export */
import { promises as fs } from "fs";

export const readFilesAndDirRecursively: (
  dir: string
) => Promise<string[]> = async (dir: string) => {
  const dirents = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = `${dir}/${dirent.name}`;

      return dirent.isDirectory() ? readFilesAndDirRecursively(res) : res;
    })
  );

  return Array.prototype
    .concat(...files)
    .filter(
      (file) =>
        !file.includes("page") ||
        !file.includes("Layout") ||
        !file.includes("index") ||
        !file.includes("Loader")
    );
};
