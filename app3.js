document.addEventListener('DOMContentLoaded', async () => {
	const connectButton = document.getElementById('connectButton');
	const contributeButton = document.getElementById('contributeButton');
	const refundButton = document.getElementById('refundButton');
	const withdrawButton = document.getElementById('withdrawButton');
	const balanceElement = document.getElementById('balance');
	const raisedAmountElement = document.getElementById('raisedAmount');
	const targetElement = document.getElementById('target');
	const deadlineElement = document.getElementById('deadline');

	// for about us content 
	const raisedAmountAboutUsElement = document.getElementById('raisedAmountAboutUs');
	const targetAboutUsElement = document.getElementById('targetAboutUs');
	const deadlineAboutUsElement = document.getElementById('deadlineAboutUs');
	const noOfContributionsElement = document.getElementById('noOfContributions');




	let web3;
	let contract;
	// YOUR CONTRACT ABI 
	const contractABI = [
		{
			"inputs": [],
			"name": "contribute",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getRefund",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_target",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_deadLine",
					"type": "uint256"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [],
			"name": "withDraw",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "Contributors",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "deadLine",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getBalance",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "noOfContributors",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "Owner",
			"outputs": [
				{
					"internalType": "address payable",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "raisedAmount",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "target",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	];
	const contractAddress = "0x355D79d1448A7e92893E029ad442ea666934Fd82";

	// YOUR CONTRACT ADDRESS 
	const updateButtonStatus = async () => {
		const connectedAddress = ethereum.selectedAddress;
		const contractOwner = await contract.methods.Owner().call();

		if (connectedAddress) {
			// Enable buttons for connected users
			contributeButton.disabled = false;
			if (connectedAddress.toLowerCase() === contractOwner.toLowerCase()) {
				refundButton.disabled = true;
				withdrawButton.disabled = false;
				contributeButton.disabled = true;
			} else {
				refundButton.disabled = false;
				withdrawButton.disabled = true;
				contributeButton.disabled = false;
			}
		} else {
			// Disable buttons for users not connected
			contributeButton.disabled = true;
			refundButton.disabled = true;
			withdrawButton.disabled = true;
		}
	};

	// Check if MetaMask is available
	if (typeof window.ethereum !== 'undefined') {
		web3 = new Web3(window.ethereum);
		contract = new web3.eth.Contract(contractABI, contractAddress);

		// connectButton.addEventListener('click', async () => {
		// 	await ethereum.request({ method: 'eth_requestAccounts' });
		// 	alert('Connected to MetaMask!');
		// 	updateUI();
		// });

		connectButton.addEventListener('click', async () => {
			await ethereum.request({ method: 'eth_requestAccounts' });
			alert('Connected to MetaMask!');
			updateButtonStatus();
			updateUI();
		});

		contributeButton.addEventListener('click', async () => {
			const value = web3.utils.toWei('1', 'ether');
			await contract.methods.contribute().send({ from: ethereum.selectedAddress, value });
			alert('Contribution successful!');
			updateUI();
		});



		refundButton.addEventListener('click', async () => {
			await contract.methods.getRefund().send({ from: ethereum.selectedAddress });
			alert('Refund successful!');
			updateUI();
		});

		withdrawButton.addEventListener('click', async () => {
			await contract.methods.withDraw().send({ from: ethereum.selectedAddress });
			alert('Withdrawal successful!');
			updateUI();
		});
	} else {
		connectButton.disabled = true;
		connectButton.innerText = 'MetaMask Not Available';
	}



	const updateUI = async () => {
		if (!contract) return;

		try {
			const balanceWei = await web3.eth.getBalance(contractAddress);
			balanceElement.textContent = web3.utils.fromWei(balanceWei, 'ether');

			const raisedAmountValue = await contract.methods.raisedAmount().call();
			raisedAmountElement.textContent = web3.utils.fromWei(raisedAmountValue, 'ether');

			const targetValue = await contract.methods.target().call();
			targetElement.textContent = web3.utils.fromWei(targetValue, 'ether');

			const deadlineValue = (await contract.methods.deadLine().call()).toString();
			deadlineElement.textContent = new Date(deadlineValue * 1000).toLocaleString();

			// about us
			const raisedAmountAboutUsValue = await contract.methods.raisedAmount().call();
			raisedAmountAboutUsElement.textContent = web3.utils.fromWei(raisedAmountAboutUsValue, 'ether');

			const targetAboutUsValue = await contract.methods.target().call();
			targetAboutUsElement.textContent = web3.utils.fromWei(targetAboutUsValue, 'ether');

			const deadlineAboutUsValue = await contract.methods.deadLine().call();
			deadlineAboutUsElement.textContent = new Date(deadlineAboutUsValue * 1000).toLocaleString();

			const noOfContributionsValue = await contract.methods.noOfContributors().call();
			noOfContributionsElement.textContent = noOfContributionsValue;


		} catch (error) {
			console.error('Error updating UI:', error);
		}





	};

	updateButtonStatus();
	updateUI();
});
