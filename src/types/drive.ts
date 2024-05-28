type File = {
  kind?: string | null | undefined
  driveId?: string | null | undefined
  mimeType?: string | null | undefined
  id?: string | null | undefined
  name?: string | null | undefined
  teamDriveId?: string | null | undefined
}

export type FileListResponse = {
  kind?: string | null | undefined
  incompleteSearch?: boolean | null | undefined
  files?: File[] | undefined
}

export type Path = {
  year: { value: string; id: string; parentId: string }
  store: { value: string; id: string; parentId: string }
  month: { value: string; id: string; parentId: string }
  dateRange: { value: string; id: string; parentId: string }
  designer: { value: string; id: string; parentId: string }
}
