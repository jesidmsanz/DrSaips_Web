import NextAuth from "next-auth";
import { getDataOfOracle } from "@server/getDataOfOracle";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiUrl } from "@utils/axiosConfig";

const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;

        const query = `SELECT pri_nombre || ' ' || pri_apellido as nombre, LOGIN AS LOG, DECODE (PWD('${username}','${password}'), CLAVE, 1, 0) AS Acceso FROM USUARIOS WHERE LOGIN = '${username}'`;
        console.log("query login", query);
        const result = await getDataOfOracle(query);
        if (result && result.length > 0) {
          const user = result[0];
          const permissionsQuery = `Select * from USUARIOS_PERMISOS WHERE USUARIO = '${user.LOG}'`;
          const permissions = await getDataOfOracle(permissionsQuery);
          if (user && user.ACCESO === 1) {
            const userData = {
              id: user.LOG,
              name: user.LOG,
              fullName: user.NOMBRE,
              permissions: permissions,
              redirect: "/admin/audit_trail",
            };
            return userData;
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_JWT_SECRET,

  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.user = {
          fullName: user.fullName || "",
          login: user.name || false,
          permissions: user.permissions || null,
        };
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.user = token.user;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
