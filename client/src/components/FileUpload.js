import {useState} from 'react';
import axios from 'axios';
import "./FileUpload.css";

const FileUpload = ({contract,account,provider}) => {
    const [file,setFile] = useState(null);
    const [fileName, setFileName] = useState("No Image Selected");

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (file) {
            try {
                const formData = new FormData();

                formData.append("file", file);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        pinata_api_key: `17c7f52207d9142722d0`,
                        pinata_secret_api_key: `ff9199a1eef01f396c549ba19f144e518b4e879f53efa246b198f3cef115aeec`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                // const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

                // const signer = contract.connect(provider.getSigner());
                contract.add(account,ImgHash);

                alert("Successfully uploaded");

                setFileName("No Image Selected");
                setFile(null);
            } catch(e) {
                alert("unable to upload image to pinanta");
            }
        }
    };
    const retriveFile = (e) => {
        const data = e.target.files[0];
        // console.log(data);
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend=()=>{
            setFile(e.target.files[0]);
        };

        setFileName(e.target.files[0].name);

        e.preventDefault();
    };

    return <div className="top">
        <form className='form' onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="choose">
                Choose Image
            </label>
            <input disabled={!account} type="file" id="file-upload" name="data" onChange={retriveFile} />
            <span className='textArea'>Image: {fileName}</span>
            <button type="submit" className='upload' disabled={!file}>Upload File</button>
        </form>
    </div>
};
export default FileUpload;