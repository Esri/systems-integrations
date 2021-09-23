import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import {loadScript, loadStyle} from 'lightning/platformResourceLoader';

//Create API key using your ArcGIS Developer account developers.arcgis.com
const apiKey = "";  

const FIELDS = [
  'Account.Billing_Address_Latitude__c',
  'Account.BillingLongitude__c'];

const DefaultLat  = 35.7796;
const DefaultLong = -78.6382;

export default class LeafletMap extends LightningElement { 
    leafletInitialzed = false;
    @track wireRecordReceived;
    @api recordId;
    @track billinglatitude;
    @track billinglongitude;
    @track record;
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS})
    wiredRecord({ error, data}){
        if (data) {
            this.record = data;
            this.error = undefined;
            this.billinglatitude = this.setLatitude(this.record.fields.Billing_Address_Latitude__c.value);
            this.billinglongitude = this.setLongitude(this.record.fields.BillingLongitude__c.value);
            this.wireRecordReceived = true;
            this.renderedCallback();
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    };
  
    setLatitude(val){
        return val ? val : DefaultLat;
    }

    setLongitude(val) {
        return val ? val : DefaultLong;
    }

    renderedCallback(){
      if (this.wireRecordReceived) {
        console.log(this.wireRecordReceived);
          this.loadLeaflet();
      }
      this.leafletInitialzed = true;
  }

  loadLeaflet(){       
      const promise1 = new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(loadScript(this, 'https://unpkg.com/esri-leaflet@3.0.2/dist/esri-leaflet.js'));
          }, 100);
      });
      const promise2 = new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(loadScript(this, 'https://unpkg.com/esri-leaflet-geocoder@3.1.1/dist/esri-leaflet-geocoder.js'));
          }, 200);
      });

      Promise.all([ 
        loadStyle(this, 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'),
        loadScript(this, 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'),
          promise1,
          promise2,
          loadStyle(this, 'https://unpkg.com/esri-leaflet-geocoder@3.1.1/dist/esri-leaflet-geocoder.css'),
          ])   
      .then(() => {
          this.initializeMap();
      }).catch(error => {
          console.log('Promise.all error:' + error);
      });
  }    
    
    initializeMap(){
        var map = L.map(this.template.querySelector(".map-root")).setView([this.billinglatitude, this.billinglongitude], 10);
                 
         L.esri.basemapLayer('Topographic').addTo(map);

           L.marker([this.billinglatitude, this.billinglongitude]).addTo(map);

           var searchControl = L.esri.Geocoding.geosearch({
                position: 'topright',
                placeholder: 'Enter an address or place e.g. 1 York St',
                useMapBounds: false,
                providers: [L.esri.Geocoding.arcgisOnlineProvider({
                  apikey: apiKey,
                  nearby: {
                    lat: -33.8688,
                    lng: 151.2093
                  }
                })]
              }).addTo(map);
             
              var results = L.layerGroup().addTo(map);
              searchControl.on('results', function (data) {
                results.clearLayers();
                for (var i = data.results.length - 1; i >= 0; i--) {
                  results.addLayer(L.marker(data.results[i].latlng));
                }
              });
    }

}