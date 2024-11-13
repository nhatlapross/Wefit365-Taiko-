// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.2;

interface IERC20 {
    function balanceOf(address owner) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
    function adminTransferFrom(address from, address to, uint tokens) external returns(bool success);
}

contract WeFitChallenge{
    struct Challenge {
        string date;               // Date of the challenge creation
        address owner;             // Address of the challenge creator
        uint256 challenge_type;     // Type of challenge (e.g., distance, time, pace)
        uint256 pool_prize;         // Total prize pool for the challenge
        uint256 price;              // Entry price for participants
        uint256 expected_return;    // Expected return for participants (rewards)
        uint256 expire_date;        // Expiry date of the challenge
        uint256 distance_goal;      // Distance goal to be completed in the challenge (in meters)
        uint256 participants_limit; // Maximum number of participants
        bool is_active;             // Status of the challenge (active/inactive)
    }       

    address public owner; //Person who deploys and uses the contract
    IERC20 public wefit = IERC20(0x8Dc5B2Ccb8F325898832129e5507237268d561A8);
    address[] public whiteListAddress;
    Challenge[] public challenges;

    mapping(address => bool) public isWhiteList;                 // Addresses that are whitelisted for challenges
    mapping(address => bool) public isDonor;                     // Addresses flagged as donors who contribute to the prize pool
    mapping(address => uint256) public donationPackage;           // Donation packages tied to specific challenge types
    mapping(address => uint256) public donorShare;                // Share percentage for donors from the prize pool

    mapping(address => uint256) public userProgress;             // Tracks the distance covered by participants in meters
    mapping(address => bool) public isParticipant;               // Whether a user is currently a participant in an active challenge
    mapping(address => uint256) public rewardsEarned;            // Tracks the rewards earned by each participant
    mapping(address => uint256) public participationCount;       // Number of challenges each address has participated in


    event DepositToChallenge(address donor, uint256 amount, address challenge, uint256 depositedAt);    // When a donor deposits to a challenge
    event WithdrawFromChallenge(address receiver, uint256 amount, address challenge, uint256 withdrawnAt); // When a user or donor withdraws from the challenge prize pool

    constructor(address _wefit) {
        owner = msg.sender;

        wefit = IERC20(_wefit);
        whiteListAddress.push(msg.sender);
        isWhiteList[msg.sender] = true;
    }

    modifier onlyAdmin(){
        require(isWhiteList[msg.sender] == true, "Invalid admin");
        _;
    }

    function create_challenge(
        string calldata date,
        address _owner,
        uint256 challenge_type,
        uint256 pool_prize,
        uint256 price,
        uint256 expected_return,
        uint256 expire_date,
        uint256 distance_goal,
        uint256 participants_limit
    ) external onlyAdmin {
        Challenge memory challenge = Challenge(
            date,
            _owner,
            challenge_type,
            pool_prize,
            price,
            expected_return,
            expire_date,
            distance_goal,
            participants_limit,
            true  // Challenge is active upon creation
        );

        challenges.push(challenge);  // Assuming there is an array of challenges
    }

    function get_list_challenge() external view returns(Challenge[] memory){
        return challenges;
    }

    function donateToChallenge(address donor, uint256 _donationPackage) external {
        donationPackage[donor] = _donationPackage;
        donorShare[donor] += 1;  // Increment donor's share or participation count
    }

    function getDonorShare(address donor) external view returns (uint256) {
        return donorShare[donor];
    }

    function getUserDonationPackage(address donor) external view returns (uint256) {
        return donationPackage[donor];
    }

    function setWefitToken(address _wefit) external onlyAdmin{
        wefit = IERC20(_wefit);
    }

    function joinChallenge(address _participant, uint256 _amount) external {
        require(wefit.balanceOf(_participant) >= _amount, "Insufficient balance to join challenge");
       
        wefit.adminTransferFrom(_participant, address(this), _amount * 10**18);
        isParticipant[_participant] = true;  // Mark the user as a participant
        userProgress[_participant] = 0;  // Initialize the participant's progress (distance covered)
        participationCount[_participant] += 1;  // Increment participation count

        emit DepositToChallenge(_participant, _amount, address(this), block.timestamp);  // Emit event with challenge ID
    }

    // function calculateReward(uint256 challengeId, address participant) internal view returns (uint256) {
    //     // Logic for reward calculation (e.g., based on ranking, distance covered, etc.)
    //     // For simplicity, let's assume equal distribution of the prize pool for now
    //     uint256 totalPrizePool = challenges[challengeId].pool_prize;
    //     uint256 numParticipants = getChallengeParticipantsCount(challengeId);

    //     // Equal distribution of rewards for participants who completed the challenge
    //     return totalPrizePool / numParticipants;
    // }

    // function getChallengeParticipantsCount(uint256 challengeId) internal view returns (uint256) {
    //     // Logic to count how many participants completed the challenge (or total participants)
    //     uint256 count = 0;
    //     // Iterate through participants and count those who completed the challenge
    //     for (uint256 i = 0; i < participants.length; i++) {
    //         if (userProgress[participants[i]] >= challenges[challengeId].distance_goal) {
    //             count++;
    //         }
    //     }
    //     return count;
    // }

    function balanceOfContract() external view returns(uint256) {
        return address(this).balance;
    }
}