pragma solidity ^0.8.0;

contract CampaignFactory {
    address[] public deployedCampaigns;
    mapping(address => bool) public isCampaignDeployed; // Add mapping to track deployed campaigns

    event campaignCreated(
        string title,
        uint requiredAmount,
        address indexed owner,
        address campaignAddress,
        string imgURI,
        uint indexed timestamp,
        string indexed category
    );

    event campaignDeleted(address campaignAddress, address owner);

    function createCampaign(
        string memory campaignTitle, 
        uint requiredCampaignAmount, 
        string memory imgURI, 
        string memory category,
        string memory storyURI) public {

        Campaign newCampaign = new Campaign(
            campaignTitle, requiredCampaignAmount, imgURI, storyURI, msg.sender);

        deployedCampaigns.push(address(newCampaign));
        isCampaignDeployed[address(newCampaign)] = true;

        emit campaignCreated(
            campaignTitle, 
            requiredCampaignAmount, 
            msg.sender, 
            address(newCampaign),
            imgURI,
            block.timestamp,
            category
        );
    }

    function deleteCampaign(address campaignAddress) public {
        require(isCampaignDeployed[campaignAddress], "Campaign does not exist");
        Campaign campaign = Campaign(campaignAddress);
        require(msg.sender == campaign.owner(), "Only the campaign owner can delete");

        // Find the campaign in the array and remove it
        for (uint i = 0; i < deployedCampaigns.length; i++) {
            if (deployedCampaigns[i] == campaignAddress) {
                deployedCampaigns[i] = deployedCampaigns[deployedCampaigns.length - 1];
                deployedCampaigns.pop();
                break;
            }
        }

        isCampaignDeployed[campaignAddress] = false; // Remove from deployed mapping

        emit campaignDeleted(campaignAddress, msg.sender);
    }
}

contract Campaign {
    string public title;
    uint public requiredAmount;
    string public image;
    string public story;
    address payable public owner;
    uint public receivedAmount;

    event donated(address indexed donar, uint indexed amount, uint indexed timestamp);

    constructor(
        string memory campaignTitle, 
        uint requiredCampaignAmount, 
        string memory imgURI,
        string memory storyURI,
        address campaignOwner
    ) {
        title = campaignTitle;
        requiredAmount = requiredCampaignAmount;
        image = imgURI;
        story = storyURI;
        owner = payable(campaignOwner);
    }

    function donate() public payable {
        require(requiredAmount > receivedAmount, "Required amount fulfilled");
        owner.transfer(msg.value);
        receivedAmount += msg.value;
        emit donated(msg.sender, msg.value, block.timestamp);
    }
}
