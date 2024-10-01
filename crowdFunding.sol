// SPDX-License-Identifier: GPL-3.0

pragma solidity  >0.8.0;

contract crowdFunding{
    mapping(address =>uint) public Contributors;
    address payable public Owner; // owner of  the contract
    uint public target;
    uint public raisedAmount;
    uint public deadLine;
    uint public noOfContributors;
    uint minimumContributions;

    // event ContributionMade(address indexed contributor, uint amount, uint timestamp, string transactionHash);


    // constructors
    constructor(uint _target , uint _deadLine){
        target = _target;
        deadLine = block.timestamp + _deadLine;
        minimumContributions = 100 wei;
        Owner = payable(msg.sender);
    }


    modifier onlyOwner { // modifier for the owner 
        require(Owner == msg.sender , "You are not the Owner");
        _;
    }

    // function to contribute to crowdfunding 
    function contribute() payable public {
        require(block.timestamp < deadLine , "deadLine is passed ");
        require(msg.value >= minimumContributions , "minimum value is not met");
        require(raisedAmount < target , "given terget is completed");

        if(Contributors[msg.sender]==0){
            noOfContributors++;
        }
        Contributors[msg.sender] += msg.value;
        raisedAmount += msg.value;

        // emit ContributionMade(msg.sender, msg.value, block.timestamp, tx.hash);


    }

    // function to get the balance 
    function getBalance() view public returns(uint){
        return address(this).balance;
    }

    // function to getRefund
    function getRefund() public{
        require(block.timestamp > deadLine && raisedAmount < target , "you are not eligiblr ");
        require(Contributors[msg.sender] > 0 , "you have not contributed");
        address payable user = payable(msg.sender);
        user.transfer(Contributors[msg.sender]);
        Contributors[msg.sender] =0;
        // raisedAmount -= Contributors[msg.sender];
    }

    // function to withdraw the amount by the owner
    function withDraw() public onlyOwner{
        require(block.timestamp >= deadLine , "DeadLine is not passed ");
        require(raisedAmount >= target , "Target is not reached");
        Owner.transfer(address(this).balance);

    }



}