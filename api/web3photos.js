// import { File } from "web3.storage/dist/bundle.esm.min.js"
import * as FileSystem from "expo-file-system";
import { uploadAsync } from "expo-file-system";
import CryptoES from "crypto-es";

class web3Photos {
  constructor(token, key) {
    //to do -check if token and key are provided if not throw error
    this.token = token;
    this.key = key;
    this.dir = FileSystem.documentDirectory + "temp.txt";
  }

  encryptBase64 = async (base64) => {
    return CryptoES.AES.encrypt(base64, this.key).toString();
  };

  writeBase64toFile = async (base64) => {
    return FileSystem.writeAsStringAsync(this.dir, base64, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  };

  upload = async () => {
    let options = {
      httpMethod: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + this.token,
        "Content-Type": "multipart/form-data",
      },
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "file",
    };
    let response = await uploadAsync(
      "https://api.web3.storage/upload",
      this.dir,
      options
    );
    return response;
  };

  storeImage = async (base64Image) => {
    console.log("Encrypting...");
    let encryptedBase64 = await this.encryptBase64(base64Image);
    console.log("Writing to file...");
    let base64File = await this.writeBase64toFile(encryptedBase64);
    console.log("Uploading...");
    let response = await this.upload(base64File);
    if (response.status === 200) {
      console.log("Upload succesful at:", response.body.cid);
    } else {
      console.log(
        "Upload failed:",
        response.status,
        response.body.name,
        response.body.message
      );
      return response;
    }
  };
}

export default rnWeb3Photos;
