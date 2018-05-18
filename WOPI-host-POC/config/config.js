const privateCert = fs.readFileSync(
    path.join(__dirname, './ssl-cert/ssl-cert.key')
  ); // get private key
  
  const publicCert = fs.readFileSync(
    path.join(__dirname, './ssl-cert/ssl-cert.crt')
  ); // get public key