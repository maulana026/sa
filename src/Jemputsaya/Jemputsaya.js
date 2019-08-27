import React, { Component } from 'react';
import Parse from 'html-react-parser';
import Firebase from 'firebase';
import ConfigFirebase from '../ConfigFirebase';

const infoStyle = {
    float: 'left',
    width: '20%',
    marginTop: '1em',
    borderRadius: '.1rem'
}

const infoStyle1 = {
    float: 'right',
    width: '80%',
    margin: 0
}

const infoStyle2 = {
    width: '80%',
    height: 'auto'
}

export default class Jemputsaya extends Component {

    constructor(props) {
        super(props);
        const { match: { params } } = this.props;
        this.state = {
            profilArea: "",
            profilNama: "",
            profilPict: "",
            profilTelepon: "",
            angkot: params.idAngkot,
            harga: "",
            naik: false,
            turun: false,
            tokenne: params.toknn,
            statuse: "menunggu",
            selese: ''
        }
    }

    componentWillMount () {
        var db = Firebase.firestore();
        var data = db.collection("penumpang").doc(this.state.tokenne);
        data.get().then(doc => {
            if (!doc.exists) {
                data.set({
                    id: this.state.tokenne,
                    naik: this.state.naik,
                    turun: this.state.turun,
                    angkot: this.state.angkot
                });
            } else {
                var naikKet = Boolean(doc.data().naik);
                    var turunKet = Boolean(doc.data().turun);
                    if (!doc.exists) {
                        console.log('No such document!');
                    } else {             
                        if (naikKet) {
                            this.setState({ naik: true });
                            this.setState({ statuse: 'naik' });
                            if (turunKet) {
                                this.setState({ turun: true });
                                this.setState({ statuse: 'turun' });
                                this.setState({ selese: '<div id="infoo"><div id="infoocontent1"><i className="close icon"></i><div className="header">Terimakasih telah menggunakan layanan kami. Klik menu Home untuk kembali ke laman awal.</div></div></div>' });
                            }
                        } else if(!naikKet && turunKet) {
                            this.setState({ selese: '<div id="infoo"><div id="infoocontent1"><i className="close icon"></i><div className="header">Miskomunikasi. Harap kembali ke laman awal dengan klik menu Home untuk melakukan penjemputan ulang.</div></div></div>' });
                        }
                    }
            }
        })
        db.collection("angkot").doc(this.state.angkot).get().then(doc => {
            if (doc.data().berbahaya) {
                this.setState({ selese: '<div id="infoo"><div id="infoocontent1"><i className="close icon"></i><div className="header">Angkot yang bersangkutan telah ditandai dalam kondisi bahaya untuk kemudian dilakukan penanganan lanjutan. Harap tenang, hati-hati dan tetap waspada. Kami mohon maaf atas segala yang telah terjadi.</div></div></div>' });
            }
            this.setState({ profilArea: doc.data().profilArea });
            this.setState({ profilTelepon: doc.data().profilTelepon });
            this.setState({ profilPict: doc.data().profilPict });
            this.setState({ profilNama: doc.data().profilNama });
            this.setState({ harga: doc.data().harga });
        })
    }

    componentDidMount () {
        var db1 = Firebase.firestore();
        
        var angkotRef = db1.collection("penumpang").doc(this.state.tokenne);
        let menungguID = setInterval(
            () => {
                var getDoc = angkotRef.get().then(doc => {
                    var naikKet = Boolean(doc.data().naik);
                    var turunKet = Boolean(doc.data().turun);
                    if (!doc.exists) {
                        console.log('No such document!');
                    } else {             
                        if (naikKet) {
                            this.setState({ naik: true });
                            this.setState({ statuse: 'naik' });
                            if (turunKet) {
                                this.setState({ turun: true });
                                this.setState({ statuse: 'turun' });
                                this.setState({ selese: '<div id="infoo"><div id="infoocontent1"><i className="close icon"></i><div className="header">Terimakasih telah menggunakan layanan kami. Klik menu Home untuk kembali ke laman awal.</div></div></div>' });
                                clearInterval(this.menungguID);
                            }
                        }
                    }
                })
            },10000
        )
    }

    keadaanBahayasi = () => {
        var db = Firebase.firestore();
        var data = db.collection("angkot").doc(this.state.angkot);
        data.update({ berbahaya: true });
        data.get().then(doc => {
            if (doc.data().berbahaya) {
                this.setState({ selese: '<div id="infoo"><div id="infoocontent1"><i className="close icon"></i><div className="header">Angkot yang bersangkutan telah ditandai dalam kondisi bahaya untuk kemudian dilakukan penanganan lanjutan. Harap tenang, hati-hati dan tetap waspada. Kami mohon maaf atas segala yang telah terjadi.</div></div></div>' });
            }
        })
    }


    render () {
        return(
            <div id="jemputsaya">
                {Parse(this.state.selese)}
                <h2>Jemput Saya - Order</h2>
                <br />
                <div  className="ui two column divided grid">
                    <div className="column six wide">
                        <div style={infoStyle}>
                            <img style={infoStyle2} src={this.state.profilPict} />
                        </div>
                        <table class="ui table" style={infoStyle1}>
                            <tbody>
                                <tr>
                                    <td class="collapsing">
                                        Nama
                                    </td>
                                    <td>: {this.state.profilNama}</td>
                                    <td>Verified</td>
                                </tr>
                                <tr>
                                    <td>
                                        Area
                                    </td>
                                    <td>: {this.state.profilArea}</td>
                                    <td>Verified</td>
                                </tr>
                                <tr>
                                    <td>
                                        Telepon
                                    </td>
                                    <td>: {this.state.profilTelepon}</td>
                                    <td>Verified</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="column nine wide">
                        <h3>Detail Order</h3>
                        <button className="ui button basic negative" onClick={this.keadaanBahayasi}>
                            Kondisi Bahaya
                        </button>
                        <table class="ui inverted teal table">
                            <thead>
                                <tr>
                                    <th>Nama Angkot</th>
                                    <th>Harga</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{this.state.angkot}</td>
                                    <td>{this.state.harga}</td>
                                    <td>{this.state.statuse}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}