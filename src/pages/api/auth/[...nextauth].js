import NextAuth from "next-auth";
import { getDataOfOracle } from "@server/getDataOfOracle";
import CredentialsProvider from "next-auth/providers/credentials";

const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { username, password } = credentials;
        console.log("username, password :>> ", username, password);

        const query = `SELECT LOGIN AS LOG, DECODE (PWD('${username}','${password}'), CLAVE, 1, 0) AS Acceso FROM USUARIOS WHERE LOGIN = '${username}'`;
        const result = await getDataOfOracle(query);
        if (result && result.length > 0) {
          const user = result[0];
          console.log("user :>> ", user);
          if (user && user.ACCESO === 1) {
            return Promise.resolve({
              id: user.LOG,
              name: user.LOG,
              redirect: "/admin",
            });
          }
        }
        return Promise.resolve(null);
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_JWT_SECRET,
  callbacks: {
    session: ({ session, token }) => {
      return session;
    },
    redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
