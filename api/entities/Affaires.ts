export type Affaire = {
  numero?: number,
  titre?: string
  dateOuverture?: string,
  dateFermeture?: string,
  description?: string,
  statut?: Statut,
  type?: AffaireType,
  lieu?: string,
}

enum Statut {
  OUVERT = "OUVERT",
  FERME = "FERME",
  SUSPENDU = "SUSPENDU"
}

enum AffaireType {
  CIVIL = "CIVIL",
  PENAL = "PENAL",
  COMMERCIAL = "COMMERCIAL"
}