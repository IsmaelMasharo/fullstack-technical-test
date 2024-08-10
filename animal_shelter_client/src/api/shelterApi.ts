export const Animals = {
  get: (animalId: string) => `/api/animals/${animalId}/`,
  update: (animalId: string) => `/api/animals/${animalId}/`,
  delete: (animalId: string) => `/api/animals/${animalId}/`,
  create: "/api/animals/",
  list: "/api/animals/",
  listAvailable: "/api/animals/available_for_adoption/",
  requestAdoption: (animalId: string) =>
    `/api/animals/${animalId}/request_adoption/`,
}

export const Adoptions = {
  get: (adoptionId: string) => `/api/adoptions/${adoptionId}/`,
  list: "/api/adoptions/",
  changeStatus: (adoptionId: string) =>
    `/api/adoptions/${adoptionId}/change_status/`,
  userRequests: "/api/adoptions/user/requests/",
}

export const Volunteers = {
  get: (volunteerId: string) => `/api/volunteers/${volunteerId}/`,
  list: "/api/volunteers/",
  create: "/api/volunteers/",
  update: (userId: string) => `/api/volunteers/${userId}/`,
  delete: (userId: string) => `/api/volunteers/${userId}/`,
}

export const Adopters = {
  get: (adopterId: string) => `/api/adopters/${adopterId}/`,
  list: "/api/adopters/",
  create: "/api/adopters/",
  update: (userId: string) => `/api/adopters/${userId}/`,
  delete: (userId: string) => `/api/adopters/${userId}/`,
}
