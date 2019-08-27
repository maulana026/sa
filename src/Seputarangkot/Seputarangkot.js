import React, { Component } from 'react';
import Firebase from 'firebase';
import ConfigFirebase from '../ConfigFirebase';

export default class Seputarangkot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            angkotBahaya: [],
            angkotBahayaKOndisi: 'Tidak ada angkot dalam keadaan bahaya',
        }
    }

    componentWillMount () {
        var db = Firebase.firestore();
        db.collection("angkot").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var berbahaya = Boolean(doc.data().berbahaya);
                if(berbahaya) {
                    this.setState( state => {
                        state.angkotBahaya.push({
                            nama: doc.data().nama,
                            latitude: doc.data().lat,
                            longitude: doc.data().lon,
                        })
                    })
                }
            })
            if (this.state.angkotBahaya.length > 0) {
                this.setState({ angkotBahayaKOndisi: "Unit angkot dalam keadaan bahaya:" })
            }
        })
    }

    _renderAngkotBahaya = (angkotBahaya, index) => {
        var parameter = "https://www.google.com/maps/search/?api=1&query=" + angkotBahaya.latitude + ',' + angkotBahaya.longitude;
        return(
            <div class="ui red message">{angkotBahaya.nama} di <a href={parameter} target="_blank">lokasi</a> dalam keadaan berbahaya.</div>
        )
    }

    render () {
        return(
            <div id="seputarangkot">
                <h2>Seputar Angkot</h2>
                <p>{this.state.angkotBahayaKOndisi}</p>
                {this.state.angkotBahaya.map(this._renderAngkotBahaya)}
            </div>
        )
    }
}