export const credentialsOracleDb = {
  // user: process.env.USER,
  // password: process.env.PASS,
  user: "DRSAIPS",
  password: "SPIASRD",
  connectString:
    //"(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = pirasoft.top)(PORT = 1521))(CONNECT_DATA =(SID= xe)))",
    //"(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 52.146.8.64)(PORT = 1521))(CONNECT_DATA =(SID= xe)))",
    "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 127.0.0.1)(PORT = 1521))(CONNECT_DATA =(SID= xe)))",
  externalAuth: false,
};
