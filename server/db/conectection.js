export const credentialsOracleDb = {
  user: process.env.USER,
  password: process.env.PASS,
  connectString:
    "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = pirasoft.top)(PORT = 1521))(CONNECT_DATA =(SID= xe)))",
  externalAuth: false,
};
