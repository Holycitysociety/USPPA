// netlify/functions/mint-patron.js
const { ethers } = require("ethers");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { address, usdAmount } = body;

    const RPC_URL = process.env.RPC_URL;
    const TOKEN_ADDRESS = process.env.PATRON_TOKEN_ADDRESS;
    const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY;
    const DECIMALS = Number(process.env.PATRON_DECIMALS || "18");
    const PATRON_PER_USD = Number(process.env.PATRON_PER_USD || "1");

    if (!address || !ethers.isAddress(address)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid address" }),
      };
    }

    const usdNum = Number(usdAmount);
    if (!usdNum || usdNum <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid usdAmount" }),
      };
    }

    // 1 USD = 1 PATRON (configurable)
    const patronAmount = usdNum * PATRON_PER_USD;
    const amountWei = ethers.parseUnits(String(patronAmount), DECIMALS);

    console.log(
      `Transferring ${patronAmount} PATRON to ${address} (wei=${amountWei.toString()})`
    );

    if (!RPC_URL || !TOKEN_ADDRESS || !TREASURY_PRIVATE_KEY) {
      console.error("Missing one or more required env vars");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server misconfiguration" }),
      };
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(TREASURY_PRIVATE_KEY, provider);

    // Treasury wallet must already hold pre-minted PATRON
    const patronAbi = [
      "function transfer(address to, uint256 amount) public returns (bool)",
    ];

    const patron = new ethers.Contract(TOKEN_ADDRESS, patronAbi, signer);

    const tx = await patron.transfer(address, amountWei);
    const receipt = await tx.wait();

    console.log(
      `Transfer successful: ${patronAmount} PATRON to ${address}, tx=${receipt.transactionHash}`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        to: address,
        usdAmount,
        patronAmount,
        transferredAmountHuman: `${patronAmount} PATRON`,
        txHash: receipt.transactionHash,
      }),
    };
  } catch (err) {
    console.error("Mint/transfer error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Mint failed" }),
    };
  }
};