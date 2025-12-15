//Evita erro de tipagem do arquivo...

declare module "file-saver" {
  export function saveAs(
    data: Blob | File,
    filename?: string,
    options?: any
  ): void;
}
