import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Turf, { distance, circle, point } from '@turf/turf';
import ConfigFirebase from '../ConfigFirebase';
import MapGL, { NavigationControl, Marker  } from 'react-map-gl';
import Firebase from 'firebase';
import Parse from 'html-react-parser';
import CityPin from '../MarkerComponent/city-pin';
import CityInfo from '../MarkerComponent/city-info';
import randToken from 'rand-token';
export default class Map extends Component {
    
    

    constructor(props) {
        super(props);        
        
        this.state = {
            viewport: {
                latitude: 0,
                longitude: 0,
                zoom: 15,
                bearing: 0,
                pitch: 0,
                width: '100%',
                height: 500,
            },
            terdekat: {
                jarak:0,
                idAngkot:'null'
            },
            angkotNotFound: '',
            redirect: false,
            angkotLain : []
        }
               
    }

    componentWillMount () {
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    console.log(position);
                    this.setState(({viewport}) => ({viewport: {
                        ...viewport,
                        latitude: position.coords.latitude,
                      }})
                    );
                    this.setState(({viewport}) => ({viewport: {
                        ...viewport,
                        longitude: position.coords.longitude,
                      }})
                    );
                });
            
        } else {
            this.setState({ angkotNotFound: '<div id="infoo"><div id="infoocontent1"><i className="close icon"></i><div className="header">Penggunaan GPS tidak diizinkan. Operasi tidak dapat dilanjutkan.</div></div></div>' });
        }   
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            let red = '/jemputsaya/'+this.state.terdekat.idAngkot+ '/' + randToken.generate(16);
          return red;
        }
    }

    _renderCityMarker = (city, index) => {
        return (
          <Marker key={`marker-${index}`} longitude={city.longitude} latitude={city.latitude}>
            <CityPin size={20} />
          </Marker>
        );
    };

    componentDidMount() {
        var db = Firebase.firestore();
        var from = point([this.state.viewport.latitude, this.state.viewport.longitude]);
        var to;
        var data = 0;
        var options = {units: 'meters'};
        db.collection("angkot").where("berbahaya", "==", false).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                to = point([Number(doc.data().lat), Number(doc.data().lon)]);                    
                var distance1 = distance(from, from, options);
                if(distance1 <= 1) {
                    this.setState(({terdekat}) => ({terdekat: {
                        ...terdekat,
                        idAngkot: doc.data().nama,
                      }})
                    );
                    data = distance1;
                    this.setState({ redirect: true });
                    this.state.angkotLain.push({
                        idAngkot: doc.data().nama,
                        latitude: Number(doc.data().lat),
                        longitude: Number(doc.data().lon)
                    })
                    console.log(this.state.redirect)
                } 
            })
            if (!this.state.redirect) {
                this.setState({ angkotNotFound: '<div  id="infoo"><div id="infoocontent"><i className="close icon"></i><div className="header">Mohon maaf, kami tidak dapat menemukan angkot yang beroperasi disekitar anda.</div></div></div>' });
            }
        })
    }

    render () {
        
        const { viewport } = this.state;
        const navStyle = {
            position: "absolute",    
            top: 0,        
            left: 0,        
            padding: "10px"        
        };
            
        return(
            <div id="kokoko">
                
                {Parse(this.state.angkotNotFound)}
                <MapGL 
                    {...viewport}
                    onViewportChange={(viewport) => this.setState({viewport})}
                    mapStyle="mapbox://styles/mapbox/streets-v10"
                    mapboxApiAccessToken={"pk.eyJ1IjoibWF1bGFuYTAyNiIsImEiOiJjanpyemxvMGwwMHMzM210NGVlcnd3Y28zIn0.6xHL2nTT3_rbNqHOfgiK8Q"}
                >      
                    <div id="maekre">              
                        <Marker latitude={this.state.viewport.latitude} longitude={this.state.viewport.longitude} >
                            <Link to={this.renderRedirect()}>
                                <div className="ui animated button blue" tabIndex="0">
                                    <div className="visible content">{this.state.viewport.latitude && this.state.viewport.latitude ? 'Jemput Saya' : 'Tunggu...'}</div>
                                    <div className="hidden content">
                                        <i className="right arrow icon"></i>
                                    </div>
                                </div>
                            </Link>
                        </Marker>
                    </div>
                    {this.state.angkotLain.map(this._renderCityMarker)}
                    <div className="nav" style={navStyle}>
                        <NavigationControl onViewportChange={(viewport) => this.setState({viewport})} />
                    </div>
                </MapGL>
            </div>
        )
        
    }
}