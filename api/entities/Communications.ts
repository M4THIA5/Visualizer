export type Communication = {
  operateur?: string,
  localisation?: string,
  date?: string,
  duree?: number,
  type?: AppelType,
}

enum AppelType {
  APPEL = "APPEL",
  SMS = "SMS",
  MMS = "MMS"
}