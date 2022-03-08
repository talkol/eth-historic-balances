# Historic ERC20 Balances on Ethereum

A simple script to extract historic ERC20 token balances on Ethereum. The script relies on on-chain data only and uses an archive node to run state queries on a specific historic date.

## Instructions

1. Make sure you have Node.js installed and run in terminal:
    ```
    npm install
    ```

2. Go over the code (balances.js) and review all the TODOs

3. Run in terminal (replacing 0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2 with your wallet address):
    ```
    node . 0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2 > output.csv
    ```

4. Open `output.csv` in Excel