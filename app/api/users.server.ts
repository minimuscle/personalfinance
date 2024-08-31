/**
 * Each of these files will be used to create api routes in which data can be grabbed
 */
import { getSupabase } from "~/util/db.server"

export const API = {
  users: {
    GET: {
      user: (request: Request) => {
        return getSupabase(request).from("test_table").select().single()
      },
    },
    POST: {
      login: async (id: string, request: Request) => {
        const { data, error } = await getSupabase(request).auth.signUp({
          email: "example@email.com",
          password: "password",
          // options: {
          //   emailRedirectTo: "https://example.com/welcome",
          // },
        })

        console.log(data, "error: ", error)

        return data
      },
    },
  },
}