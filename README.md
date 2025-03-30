## About 

**n8n × web3** is a suite of custom nodes designed for n8n — an open-source no-code platform. Our project provide seamless web3 integrations, enabling users to effortlessly interact with various blockchain protocols without writing a single line of code.

## Problem statement

While n8n excels in workflow automation for both non-technical users and professional developers, it currently lacks native integrations with blockchain technologies. 

Even submitting a simple transaction, such as sending a native blockchain token or invoking a smart contract method, is currently only possible using custom JavaScript code. Worse, it requires importing external NPM packages to perform cryptographic operations, which is impossible for cloud-hosted and quite challenging for self-hosted n8n deployments.

![n8n-web3-2025-01-21-1421](https://github.com/user-attachments/assets/783302c8-a6d2-4eba-9fbe-6db261ce7b4d)

This project was born to address these challenges. Our custom nodes simplify common blockchain interactions, such as data conversion between JavaScript and Solidity, ECDSA signing, raw transaction sending, automatic transaction data generation from Smart Contract ABIs, and event listening through custom workflow triggers.

![n8n-web3-2025-01-21-1422](https://github.com/user-attachments/assets/75af28ca-157a-4caf-9105-9858e9e12c42)

## Long-term Goals

Our long-term vision is to evolve the project into a comprehensive, community-owned toolkit that supports a wide range of blockchain protocols and advanced use cases. Eventually, these tools aim to be integrated as embedded nodes within n8n, comparable to the existing ~200 embedded web2 service nodes, thereby expanding n8n’s versatility and fostering innovation in the decentralized ecosystem.
