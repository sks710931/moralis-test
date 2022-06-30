import logo from './logo.svg';
import './App.css';
import {useMoralis} from "react-moralis";
import React,{useEffect, useState} from 'react'
import Moralis from 'moralis';
import abi from "./abi.json";
import { ethers } from 'ethers';

function App() {
  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();
  const addr = "0xdfB00e816bC17f46f90aeD507f9e36C3C1db1f53";
    useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const login = async () => {

    
    if (!isAuthenticated) {

      await authenticate({signingMessage: "Log in using Moralis", chainId: 3 })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  const logOut = async () => {
    await logout();
    console.log("logged out");
  }
  const [price, setPrice] = useState(0);
  const [err, setErr] = useState(0);
const getPrice = async () => {
  const web3Provider = await Moralis.enableWeb3();
  console.log(web3Provider);
  const library = Moralis.web3Library;
  const contract =  new library.Contract(addr, abi, web3Provider);
  console.log(contract);
  const value = await contract.salePrice(1);
  setPrice(library.utils.formatEther(value));
  
}
const getPriceNetwork = async () => {
  const rpc = "https://ropsten.infura.io/v3/12351ae7b81b4899bf671dfc4f732b16";
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  //const web3Provider = await Moralis.enableWeb3({urls:["https://ropsten.infura.io/v3/12351ae7b81b4899bf671dfc4f732b16"]});
  console.log(provider);
  const contract =  new ethers.Contract(addr, abi, provider);
  console.log(contract);
  const value = await contract.salePrice(1);
  setPrice(ethers.utils.formatEther(value));
  
}
const mint = async () => {
  //mints 2 nfts
  try{
    const web3Provider = await Moralis.enableWeb3();
  console.log(web3Provider);
  const library = Moralis.web3Library;
  const signer = await web3Provider.getSigner();
  const contract =  new library.Contract(addr, abi, signer);
  const price2Nft = await contract.salePrice(2);
  const overrides = {
    value: price2Nft
  }
  const value = await contract.mint(2, overrides);
  await value.wait();
  alert("Minting Successfull!");
  }
  catch(e){
setErr(JSON.stringify(e));
  }
}
  return (
    <div className="App">
      <div>
      <h1>Moralis Hello World!</h1>
      <button onClick={login}>Moralis Metamask Login</button>
      <button onClick={logOut} disabled={isAuthenticating}>Logout</button>
      <p>Account :{account}</p>
      <p>User data: {JSON.stringify(user)}</p>
      <br />
      <br />
      <button onClick={getPrice}>getPrice Moralis Metamask</button>
      <button onClick={getPriceNetwork}>Get Price Without Wallet</button>
      <br />
      <span>Price: {price} ETH</span>
      <br />
      <button onClick={mint}>Mint NFT</button>
      <br />
      <span>Error: {err}</span>
    </div>
    </div>
  );
}

export default App;
