import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import * as Random from "expo-random";
import "fast-text-encoding";
import "text-encoding-polyfill";
import { ethers } from "ethers";
import "@ethersproject/shims";
import CryptoES from "crypto-es";
import {
  Web3Storage,
  File,
  getFilesFromPath,
} from "web3.storage/dist/bundle.esm.min.js";
// import { Web3Storage } from "web3.storage";
import { Buffer } from "buffer";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { type } from "os";
import web3Photos from "./api/web3photos";

const createWallet = async () => {
  const wallet = ethers.Wallet.createRandom();
  console.log("address:", wallet.address);
  console.log("mnemonic:", wallet.mnemonic.phrase);
  console.log("privateKey:", wallet.privateKey);
};

const encryptFile = async () => {
  const mytexttoEncryption = "Hello";
  const E = CryptoES.AES.encrypt(
    mytexttoEncryption,
    "your password"
  ).toString();

  var C = require("crypto-js");

  var Decrypted = C.AES.decrypt(E, "your password");
  var result = Decrypted.toString(C.enc.Utf8);
};
function getAccessToken() {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGMwQWFhZWIyMWIxMUVkODdhYzNDMDNBQTY2ZWE4N2I4MjdlYjg3REUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTU3NzQ1NjUyMTIsIm5hbWUiOiJ3ZWIzLnBob3RvcyJ9.17S1JFkXZh1MSvYq0tLywarEddhqodecQVcoZW_wE5A";
}

export default function App() {
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [client, setClient] = useState(false);
  useEffect(() => {
    MediaLibrary.requestPermissionsAsync();
    // createWallet();
    // encryptFile();
  }, []);

  const getGallery = async () => {
    let gallery = await MediaLibrary.getAssetsAsync({
      mediaType: "photo",
      first: 99999999,
    });
    console.log(gallery.assets[0]);
    setImage(gallery.assets[0].uri);
    return;
  };
  
  const base64toFile = async (baseImage) => {
    console.log(baseImage);
    const buf = Buffer.from(baseImage, "base64");
    const file = new File([baseImage], "image.txt");
    return file;
  };

  async function getFiles(path) {
    const files = await getFilesFromPath(path);
    console.log(`read ${files.length} file(s) from ${path}`);
    setFiles(files);
    return files;
  }

 
  const storeFile = async () => {
    let web3Photos = new web3Photos(getAccessToken(),'password');
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      let upload = await web3Photos.storeImage(result.base64);
    }
    
    return;
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button
        onPress={() => {
          storeFile();
        }}
        title="storeFile"
        color="#841584"
      />
      {/* {image && (
        <Image source={{ localUri: image }} style={{ width: 200, height: 200 }} />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
