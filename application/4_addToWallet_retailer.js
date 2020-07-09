"use strict";

/**
 * This is a Node.JS module to load a user's Identity to his wallet.
 * This Identity will be used to sign transactions initiated by this user.
 * Defaults:
 *  User Name: RETAILER_ADMIN
 *  User Organization: RETAILER
 *  User Role: Admin
 *
 */

const fs = require("fs"); // FileSystem Library
const { FileSystemWallet, X509WalletMixin } = require("fabric-network"); // Wallet Library provided by Fabric
const path = require("path"); // Support library to build filesystem paths in NodeJs

const crypto_materials = path.resolve(__dirname, "../network/crypto-config"); // Directory where all Network artifacts are stored

// A wallet is a filesystem path that stores a collection of Identities
const wallet = new FileSystemWallet("./identity/retailer");

async function main(certificatePath, privateKeyPath) {
  // Main try/catch block
  try {
    // Fetch the credentials from our previously generated Crypto Materials required to create this user's identity
    const certificate = fs.readFileSync(certificatePath).toString();
    // IMPORTANT: Change the private key name to the key generated on your computer
    const privatekey = fs.readFileSync(privateKeyPath).toString();

    // Load credentials into wallet
    const identityLabel = "RETAILER_ADMIN";
    const identity = X509WalletMixin.createIdentity("retailerMSP", certificate, privatekey);

    await wallet.import(identityLabel, identity);
  } catch (error) {
    console.log(`Error adding to wallet. ${error}`);
    console.log(error.stack);
    throw new Error(error);
  }
}

main(
  "/home/rohit/workspace/pharma-net/network/crypto-config/peerOrganizations/retailer.pharma-supply-network.com/users/Admin@retailer.pharma-supply-network.com/msp/signcerts/Admin@retailer.pharma-supply-network.com-cert.pem",
  "/home/rohit/workspace/pharma-net/network/crypto-config/peerOrganizations/retailer.pharma-supply-network.com/users/Admin@retailer.pharma-supply-network.com/msp/keystore/d50aa3388dd2399c3519eef2055323074f35e510c53501e680e9c95bec2f4176_sk"
).then(() => {
  console.log("Retailer identity added to wallet.");
});

module.exports.execute = main;
