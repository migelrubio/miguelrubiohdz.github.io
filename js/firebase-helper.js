function initFirebase(){
    var config = {
        apiKey: "AIzaSyB0ofoVFnPIFF54IJYwTFj6z68ukvi_dOw",
        authDomain: "marh-mopp.firebaseapp.com",
        databaseURL: "https://marh-mopp.firebaseio.com",
        projectId: "marh-mopp",
        storageBucket: "",
        messagingSenderId: "660767149105",
        timestampsInSnapshots: true
    };
    firebase.initializeApp(config);

    return firebase.firestore();
}