import * as ethers from "ethers";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

const MNEMONIC = process.env.MNEMONIC;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const URL = process.env.URL;
const ABI = [
  "function newCertificate(string, string) public",
  "function getCertificate(string) public view returns (string)",
];

function verifyJWT(req, res, next) {
  const token = req.headers["x-token"];
  if (!token)
    return res.status(401).json({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err)
      return res
        .status(403)
        .json({ auth: false, message: "Failed to authenticate token." });

    next();
  });
}

const provider = new ethers.providers.JsonRpcProvider(URL);

app.post("/set", verifyJWT, async (req, res) => {
  const wallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  try {
    const response = await contract.newCertificate(
      req.body.content,
      req.body.key,
      {
        gasLimit: 150000,
        gasPrice: 15000000000,
      }
    );
    res.send(response);
  } catch (e) {
    res.send(e);
  }
});

app.get("/get/:key", verifyJWT, async (req, res) => {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  try {
    const value = await contract.getCertificate(req.params.key);
    res.send(value);
  } catch (e) {
    res.send(e);
  }
});

app.listen();
