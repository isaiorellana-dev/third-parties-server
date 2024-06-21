import fs from "fs"

export const encodeFileToBase64 = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString("base64"))
      }
    })
  })
}

export const cleanEmails = (emails: string): string[] => {
  const cleanSlash = emails.replace(/\//g, ",")
  return cleanSlash.split(",")
}
