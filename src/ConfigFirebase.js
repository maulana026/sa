import Firebase from 'firebase';

const ConfigFirebase = {
    apiKey: "AIconstyD0TP7PnIPGSl2yEl_plnnsHT7-lNk2gjw",
	authDomain: "smartangkot.firebaseapp.com",
	databaseURL: "https://smartangkot.firebaseio.com",
	projectId: "smartangkot",
	storageBucket: "smartangkot.appspot.com",
	messagingSenderId: "1052207778717",
	appId: "1:1052207778717:web:553fafdd3044fe3f"
}

Firebase.initializeApp(ConfigFirebase);

export default ConfigFirebase;