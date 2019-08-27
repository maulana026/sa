import React, { Component } from 'react';
import Turf, { distance, circle, point } from '@turf/turf';
import ConfigFirebase from '../ConfigFirebase';
import MapGL, { NavigationControl, Marker  } from 'react-map-gl';
import Firebase from 'firebase';

const infoStyle = {
    float: 'left',
    width: '20%',
    marginTop: '1em',
    borderRadius: '.1rem'
}

const infoStyle1 = {
    float: 'right',
    width: '80%'
}

const infoStyle2 = {
    width: '80%',
    height: 'auto'
}

export default class Infoangkot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            angkotTerdekat: [],
            angkotLain: [],
            angkotLainKOndisi: true,
            angkotTerdekatKOndisi: true,
            infoAngkotKet: 'Tidak ada unit angkot teregistrasi'
        }
    }

    componentWillMount () {
        
        if (navigator.geolocation) {
            var from;
            navigator.geolocation.getCurrentPosition((position) => {
                from = point([position.coords.latitude, position.coords.longitude]);
            })
            var db = Firebase.firestore();
            var to;
            var options = {units: 'meters'};
            db.collection("angkot").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    to = point([Number(doc.data().lat), Number(doc.data().lon)]);                    
                    var distance1 = distance(from, to, options);
                    if(distance1 <= 10) {
                        this.state.angkotTerdekat.push({
                            profilPict: doc.data().profilPict,
                            profilNama: doc.data().profilNama,
                            profilArea: Number(doc.data().profilArea),
                            profilTelepon: Number(doc.data().profilTelepon)
                        })
                    } 
                })
                if (this.state.angkotTerdekat.length > 0) {
                    this.setState({ angkotTerdekatKOndisi: false })
                    this.setState({ infoAngkotKet: '' })
                }
            })
            db.collection("angkot").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    to = point([Number(doc.data().lat), Number(doc.data().lon)]);                    
                    var distance1 = distance(from, to, options);
                    if(distance1 > 10) {
                        this.setState( state => {
                            state.angkotLain.push({
                                profilPict: doc.data().profilPict,
                                profilNama: doc.data().profilNama,
                                profilArea: Number(doc.data().profilArea),
                                profilTelepon: Number(doc.data().profilTelepon)
                            })
                        })
                    }
                })
                if (this.state.angkotLain.length > 0) {
                    this.setState({ angkotLainKOndisi: false })
                    this.setState({ infoAngkotKet: '' })
                }
            })
        }
    }

    _renderAngkotTerdekat = (angkotTerdekat, index) => {
        return(
            <div className="column">
                <div style={infoStyle}>
                    <img style={infoStyle2} src={angkotTerdekat.profilPict} />
                </div>
                <table class="ui table" style={infoStyle1}>
                    <tbody>
                        <tr>
                            <td class="collapsing">
                                Nama
                            </td>
                            <td>: {angkotTerdekat.profilNama}</td>
                            <td>Verified</td>
                        </tr>
                        <tr>
                            <td>
                                Area
                            </td>
                            <td>: {angkotTerdekat.profilArea}</td>
                            <td>Verified</td>
                        </tr>
                        <tr>
                            <td>
                                Telepon
                            </td>
                            <td>: {angkotTerdekat.profilTelepon}</td>
                            <td>Verified</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    _renderAngkotLain = (angkotLain, index) => {
        return(
            <div className="column">
                <div style={infoStyle}>
                    <img style={infoStyle2} src={angkotLain.profilPict} />
                </div>
                <table class="ui table" style={infoStyle1}>
                    <tbody>
                        <tr>
                            <td class="collapsing">
                                Nama
                            </td>
                            <td>: {angkotLain.profilNama}</td>
                            <td>Verified</td>
                        </tr>
                        <tr>
                            <td>
                                Area
                            </td>
                            <td>: {angkotLain.profilArea}</td>
                            <td>Verified</td>
                        </tr>
                        <tr>
                            <td>
                                Telepon
                            </td>
                            <td>: {angkotLain.profilTelepon}</td>
                            <td>Verified</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    render () {
        return(
            <div id="infoangkot">
                <h2>Info Angkot</h2>
                <p>{this.state.infoAngkotKet}</p>
                <div id="angkotTerdekat" hidden={ this.state.angkotTerdekatKOndisi}>
                    <h2 id="infoangkottitle" class="ui header">Unit Angkot Terdekat</h2>
                    <div className="ui three column divided grid">
                        {this.state.angkotTerdekat.map(this._renderAngkotTerdekat)}
                    </div>
                </div>
                <div id="angkotLain" hidden={ this.state.angkotLainKOndisi}>
                    <h2 id="infoangkottitle" class="ui header">Unit Angkot Lain</h2>
                    <div className="ui three column divided grid">
                        {this.state.angkotLain.map(this._renderAngkotLain)}
                    </div>
                </div>
            </div>
        )
    }
}