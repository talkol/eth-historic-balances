# Historic ERC20 Balances on Ethereum

A simple script to extract historic ERC20 token balances on Ethereum and similar chains like Binance Smart Chain (BSC) and Polygon. The script relies on on-chain data only and uses an archive node to run state queries on a specific historic date.

`balances-eth.js` - calculates historic balances on Ethereum mainnet

`balances-bsc.js` - calculates historic balances on Binance Smart Chain mainnet

`balances-polygon.js` - calculates historic balances on Polygon mainnet

## Instructions

1. Make sure you have Node.js installed and run in terminal:
    ```
    npm install
    ```

2. Go over the code (balances-eth.js, balances-bsc.js, balances-polygon.js) and review all the TODOs

3. Run in terminal (replacing 0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2 with your wallet address):
    ```
    node balances-eth 0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2 > output-eth.csv
    node balances-bsc 0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2 > output-bsc.csv
    node balances-polygon 0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2 > output-polygon.csv
    ```

4. Open `output-eth.csv`, `output-bsc.csv`, `output-polygon.csv` in Excel