// Import the required libraries
const solanaWeb3 = require('@solana/web3.js');

// Define the network endpoint
const networkEndpoint = 'https://api.devnet.solana.com';

// Connect to the Solana network
const connection = new solanaWeb3.Connection(networkEndpoint);

// Function to generate a new wallet address
function generateWalletAddress() {
  const keyPair = solanaWeb3.Keypair.generate();
  const publicKey = keyPair.publicKey.toString();
  const privateKey = Buffer.from(keyPair.secretKey).toString('hex');

  return { publicKey, privateKey };
}

// Function to airdrop SOL to a wallet address
async function airdropSol(walletAddress) {
  // Request an airdrop of 1 SOL to the wallet address
  await connection.requestAirdrop(new solanaWeb3.PublicKey(walletAddress), solanaWeb3.LAMPORTS_PER_SOL);

  console.log(`Airdrop successful. Wallet address: ${walletAddress}`);
}

// Function to calculate the wallet balance of the sender
async function getSenderWalletBalance(senderWalletAddress) {
  // Get the balance of the sender wallet
  const balance = await connection.getBalance(new solanaWeb3.PublicKey(senderWalletAddress));

  // Convert the balance to SOL
  const senderWalletBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;

  return senderWalletBalance;
}

// Function to generate a new wallet keypair
function generateWalletKeypair() {
    return solanaWeb3.Keypair.generate();
  }
  
  // ...
  
  // Function to transfer 50% of the balance to another wallet
async function transferBalance(senderWalletAddress, recipientWalletAddress, senderKeypair) {
    // Fetch the recent blockhash
    const recentBlockhash = await connection.getRecentBlockhash();
  
    // Calculate the sender wallet balance
    const senderWalletBalance = await getSenderWalletBalance(senderWalletAddress);
  
    // Calculate the amount to transfer (50% of the balance)
    const transferAmount = senderWalletBalance * 0.5;
  
    // Create a transaction instruction to transfer SOL
    const transaction = new solanaWeb3.Transaction({ recentBlockhash }).add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: new solanaWeb3.PublicKey(recipientWalletAddress),
        lamports: transferAmount * solanaWeb3.LAMPORTS_PER_SOL,
      })
    );
  
    // Sign the transaction with the sender's keypair
    transaction.partialSign(senderKeypair);
  
    // Send the transaction
    const signature = await connection.sendRawTransaction(transaction.serialize());
  
    // Confirm the transaction
    await connection.confirmTransaction(signature);
  
    console.log(`Transfer successful. Transaction Signature: ${signature}`);
  }
  
  

  

// Generate a new sender wallet address
const senderWallet = generateWalletAddress();

// Generate a new recipient wallet address
const recipientWallet = generateWalletAddress();

// Airdrop SOL to the sender wallet
airdropSol(senderWallet.publicKey).then(() => {
  // Run the program
  transferBalance(senderWallet.publicKey, recipientWallet.publicKey, senderWallet.privateKey);

  console.log(`Sender Wallet Address: ${senderWallet.publicKey}`);
  console.log(`Recipient Wallet Address: ${recipientWallet.publicKey}`);
}).catch((error) => {
  console.error(error);
});
