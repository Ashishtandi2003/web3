import styled from 'styled-components';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaidIcon from '@mui/icons-material/Paid';
import EventIcon from '@mui/icons-material/Event';
import Image from 'next/image';
import { ethers } from 'ethers';
import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function Dashboard() {
  const [campaignsData, setCampaignsData] = useState([]);
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    const Request = async () => {
      // Your logic to fetch campaigns
    };
    Request();
  }, []);

  // Function to delete campaign (put it here)
  const deleteCampaign = async (campaignAddress) => {
    const confirmDeletion = confirm("Are you sure you want to delete this campaign?");
    if (!confirmDeletion) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const factoryContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        signer
      );

      // Initiate the transaction to delete the campaign
      const tx = await factoryContract.deleteCampaign(campaignAddress);
      await tx.wait();

      // Update the state to remove the deleted campaign from the UI
      const updatedCampaigns = campaignsData.filter(c => c.address !== campaignAddress);
      setCampaignsData(updatedCampaigns);

      console.log('Campaign deleted successfully');
    } catch (error) {
      console.error("Error deleting campaign: ", error);
    }
  };

  return (
    <HomeWrapper>
      {/* Rendering campaign cards */}
      <CardsWrapper>
        {campaignsData.map((e) => {
          return (
            <Card key={e.title}>
              <CardImg>
                <Image 
                  alt="crowdfunding dapp"
                  layout='fill' 
                  src={`https://gateway.pinata.cloud/ipfs/${e.image}`} 
                />
              </CardImg>
              <Title>{e.title}</Title>
              <CardData>
                <Text>Owner<AccountBoxIcon /></Text>
                <Text>{e.owner.slice(0, 6)}...{e.owner.slice(39)}</Text>
              </CardData>
              <CardData>
                <Text>Amount<PaidIcon /></Text>
                <Text>{e.amount} Matic</Text>
              </CardData>
              <CardData>
                <Text><EventIcon /></Text>
                <Text>{new Date(e.timeStamp * 1000).toLocaleString()}</Text>
              </CardData>
              <Link passHref href={`/${e.address}`}>
                <Button>Go to Campaign</Button>
              </Link>
              
              {/* Show Delete button only if user is the owner */}
              {e.owner.toLowerCase() === userAddress.toLowerCase() && (
                <DeleteButton onClick={() => deleteCampaign(e.address)}>
                  Delete Campaign
                </DeleteButton>
              )}
            </Card>
          );
        })}
      </CardsWrapper>
    </HomeWrapper>
  );
}


const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 80%;
  margin-top: 25px;
`;
const Card = styled.div`
  width: 30%;
  margin-top: 20px;
  background-color: ${(props) => props.theme.bgDiv};

  &:hover {
    transform: translateY(-10px);
    transition: transform 0.5s;
  }
  
  &:not(:hover) {
    transition: transform 0.5s;
  }
`;
const CardImg = styled.div`
  position: relative;
  height: 120px;
  width: 100%;
`;
const Title = styled.h2`
  font-family: 'Roboto';
  font-size: 18px;
  margin: 2px 0px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 5px;
  cursor: pointer;
  font-weight: normal;
`;
const CardData = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2px 0px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 5px;
  cursor: pointer;
`;
const Text = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  font-family: 'Roboto';
  font-size: 18px;
  font-weight: bold;
`;
const Button = styled.button`
  padding: 8px;
  text-align: center;
  width: 100%;
  background-color: #00b712;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%); 
  border: none;
  cursor: pointer;
  font-family: 'Roboto';
  text-transform: uppercase;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;
const DeleteButton = styled.button`
  padding: 8px;
  text-align: center;
  width: 100%;
  background-color: #ff5e57;
  border: none;
  cursor: pointer;
  font-family: 'Roboto';
  text-transform: uppercase;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
`;
