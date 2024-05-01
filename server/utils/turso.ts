import { createClient } from "@libsql/client"
// You can optionally pass in the event to useRuntimeConfig
// import { H3Event } from "h3";

export function useTurso(/* event: H3Event */) {
  const { turso } = useRuntimeConfig(/* event */)

  return createClient({
    url: turso.dbUrl,
    authToken: turso.dbAuthToken,
  })
}
