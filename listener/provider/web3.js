import dotenv from "dotenv";
dotenv.config();

const { INFURA_API_KEY, INFURA_NET_URL, SAMPLE_CONTRACT_ADDRESS } = process.env;

import Web3 from "web3";
const web3 = new Web3([INFURA_NET_URL, INFURA_API_KEY].join("/"));

import sampleABI from "../sample-contract/sampleABI.json";
const sampleAddress = SAMPLE_CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(sampleABI, sampleAddress);
console.log(contract);
