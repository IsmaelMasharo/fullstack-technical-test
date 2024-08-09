export const Animals = {
  list: "/api/animals/",
  listAvailable: "/api/animals/available_for_adoption/",
  requestAdoption: (animalId: number) =>
    `/api/animals/${animalId}/request_adoption/`,
}

export const Adoptions = {
  list: "/api/adoptions/",
  changeStatus: (adoptionId: number) =>
    `/api/adoptions/${adoptionId}/change_status/`,
}

export const Volunteers = {
  list: "/api/volunteers/",
}

export const Adopters = {
  list: "/api/adopters/",
}
