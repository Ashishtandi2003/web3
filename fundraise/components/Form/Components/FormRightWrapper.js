import styled from 'styled-components';
import { FormState } from '../Form';
import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

// Pinata API keys from environment variables
const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

const FormRightWrapper = () => {
    const Handler = useContext(FormState);

    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    // Helper function to upload files to Pinata
    const uploadToPinata = async (file) => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let data = new FormData();
        data.append('file', file);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey,
            },
            body: data,
        });

        const result = await response.json();
        return result;
    };

    const uploadFiles = async (e) => {
        e.preventDefault();
        setUploadLoading(true);

        // Upload Story
        if (Handler.form.story !== "") {
            try {
                const storyBlob = new Blob([Handler.form.story], { type: "application/json" });
                const storyResponse = await uploadToPinata(storyBlob);
                Handler.setStoryUrl(storyResponse.IpfsHash);
                toast.success("Story uploaded successfully!");
            } catch (error) {
                toast.warn("Error uploading story");
                console.error(error);
            }
        }

        // Upload Image
        if (Handler.image !== null) {
            try {
                const imageResponse = await uploadToPinata(Handler.image);
                Handler.setImageUrl(imageResponse.IpfsHash);
                toast.success("Image uploaded successfully!");
            } catch (error) {
                toast.warn("Error uploading image");
                console.error(error);
            }
        }

        setUploadLoading(false);
        setUploaded(true);
        Handler.setUploaded(true);
        
    };

    return (
        <FormRight>
            <FormInput>
                <FormRow>
                    <RowFirstInput>
                        <label>Required Amount</label>
                        <Input onChange={Handler.FormHandler} value={Handler.form.requiredAmount} name="requiredAmount" type={'number'} placeholder='Required Amount'></Input>
                    </RowFirstInput>
                    <RowSecondInput>
                        <label>Choose Category</label>
                        <Select onChange={Handler.FormHandler} value={Handler.form.category} name="category">
                            <option>Education</option>
                            <option>Health</option>
                            <option>Animal</option>
                        </Select>
                    </RowSecondInput>
                </FormRow>
            </FormInput>
            <FormInput>
                <label>Select Image</label>
                <Image alt="dapp" onChange={Handler.ImageHandler} type={'file'} accept='image/*'></Image>
            </FormInput>
            {uploadLoading === true ? (
                <Button><TailSpin color='#fff' height={20} /></Button>
            ) : (
                uploaded === false ? (
                    <Button onClick={uploadFiles}>Upload Files to IPFS</Button>
                ) : (
                    <Button style={{ cursor: "no-drop" }}>Files uploaded Successfully</Button>
                )
            )}
            <Button onClick={Handler.startCampaign}>
                Start Campaign
            </Button>
        </FormRight>
    );
};

const FormRight = styled.div`
  width: 45%;
`;

const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "poppins";
  margin-top: 10px;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Input = styled.input`
  padding: 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;
`;

const RowFirstInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const RowSecondInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const Select = styled.select`
  padding: 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;
`;

const Image = styled.input`
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;

  &::-webkit-file-upload-button {
    padding: 15px;
    background-color: ${(props) => props.theme.bgSubDiv};
    color: ${(props) => props.theme.color};
    outline: none;
    border: none;
    font-weight: bold;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 15px;
  color: white;
  background-color: #00b712;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
  border: none;
  margin-top: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: large;
`;

export default FormRightWrapper;
