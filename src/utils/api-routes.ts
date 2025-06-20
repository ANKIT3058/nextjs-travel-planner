const baseRoute = `/api`;

export const ADMIN_API_ROUTES = {
  LOGIN: `${baseRoute}/admin/login`,
  CREATE_JOB: `${baseRoute}/admin/create-job`,
  JOB_DETAILS: `${baseRoute}/admin/job-details`,
};

export const USER_API_ROUTES = {
  GET_ALL_TRIPS: `${baseRoute}/all-trips`,
  GET_CITY_TRIPS: `${baseRoute}/city-trips`,
  GET_TRIP_DATA: `${baseRoute}/trips`,
  LOGIN: `${baseRoute}/auth/login`,
  SIGNUP: `${baseRoute}/auth/signup`,
  ME: `${baseRoute}/auth/me`,
};
