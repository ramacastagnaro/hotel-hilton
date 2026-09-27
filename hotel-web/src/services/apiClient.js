// Single HTTP entry point for the whole application.
//
// The backend origin is sourced exclusively from `REACT_APP_API_URL`. There is
// no hardcoded fallback: if the variable is missing the module throws at load
// time so the misconfiguration is explicit instead of silently pointing at a
// developer machine.

export class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
  }
}

export class ApiError extends Error {
  constructor(status, message, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

const configuredUrl = process.env.REACT_APP_API_URL;

if (!configuredUrl || !configuredUrl.trim()) {
  throw new ConfigError(
    'REACT_APP_API_URL is not defined. Define it in hotel-web/.env ' +
      '(see .env.example) — the app will not fall back to a hardcoded origin.'
  );
}

export const API_BASE_URL = configuredUrl.trim().replace(/\/+$/, '');

// Optional bearer-token provider. Auth wiring (Firebase ID token) is added in a
// later work unit; until then requests are sent unauthenticated.
let authTokenProvider = null;

export function setAuthTokenProvider(provider) {
  authTokenProvider = provider;
}

async function resolveAuthHeaders() {
  if (!authTokenProvider) return {};
  try {
    const token = await authTokenProvider();
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (error) {
    return {};
  }
}

/**
 * Perform an HTTP request against the configured backend.
 *
 * @param {string} path - Absolute API path, e.g. `/api/rooms`.
 * @param {object} [options] - `{ method, body, headers, signal }`.
 * @returns {Promise<any>} Parsed JSON payload (or text/`null` when not JSON).
 * @throws {ApiError} When the server responds with a non-2xx status.
 */
export async function request(path, options = {}) {
  const { method = 'GET', body, headers = {}, signal } = options;
  const authHeaders = await resolveAuthHeaders();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...(signal ? { signal } : {}),
  });

  let payload = null;
  if (response.status !== 204) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      payload = await response.json().catch(() => null);
    } else {
      payload = await response.text().catch(() => null);
    }
  }

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && payload.error
        ? payload.error
        : `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, payload);
  }

  return payload;
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export default apiClient;
