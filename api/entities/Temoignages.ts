import { Personne } from "./Personnes";

export type Temoignage = {
  id?: number,
  date?: string,
  contenu?: string,
  auteur?: Personne["prenom"],
  affaire?: string,
}