/* Copyright 2021 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

// Create API key using your ArcGIS Developer account developers.arcgis.com
const apiKey = '';

const FIELD_COLS = ['BillingLatitude__c', 'BillingLongitude__c'];
const FIELDS = ['Account.' + FIELD_COLS[0], 'Account.' + FIELD_COLS[1]];

const DefaultLat = 35.7796;
const DefaultLong = -78.6382;

export default class LeafletMap extends LightningElement {
    leafletInitialzed = false;
    @track wireRecordReceived;
    @api recordId;
    @track billinglatitude;
    @track billinglongitude;
    @track record;
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (data) {
            this.record = data;
            this.error = undefined;
            this.billinglatitude = this.setLatitude(
                this.record.fields[FIELD_COLS[0]].value
            );
            this.billinglongitude = this.setLongitude(
                this.record.fields[FIELD_COLS[1]].value
            );
            this.wireRecordReceived = true;
            this.renderedCallback();
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    setLatitude(val) {
        return val ? val : DefaultLat;
    }

    setLongitude(val) {
        return val ? val : DefaultLong;
    }

    renderedCallback() {
        if (this.wireRecordReceived) {
            this.loadLeaflet();
        }
        this.leafletInitialzed = true;
    }

    loadLeaflet() {
        const promise1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(
                    loadScript(
                        this,
                        'https://unpkg.com/esri-leaflet@3.0.2/dist/esri-leaflet.js'
                    )
                );
            }, 100);
        });
        const promise2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(
                    loadScript(
                        this,
                        'https://unpkg.com/esri-leaflet-geocoder@3.1.1/dist/esri-leaflet-geocoder.js'
                    )
                );
            }, 200);
        });

        Promise.all([
            loadStyle(this, 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'),
            loadScript(this, 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'),
            promise1,
            promise2,
            loadStyle(
                this,
                'https://unpkg.com/esri-leaflet-geocoder@3.1.1/dist/esri-leaflet-geocoder.css'
            ),
        ])
            .then(() => {
                this.initializeMap();
            })
            .catch((error) => {
                console.log('Promise.all error:' + error);
            });
    }

    initializeMap() {
        var map = L.map(this.template.querySelector('.map-root')).setView(
            [this.billinglatitude, this.billinglongitude],
            10
        );

        L.esri.basemapLayer('Topographic').addTo(map);

        L.marker([this.billinglatitude, this.billinglongitude]).addTo(map);

        var searchControl = L.esri.Geocoding.geosearch({
            position: 'topright',
            placeholder: 'Enter an address or place e.g. 1 York St',
            useMapBounds: false,
            providers: [
                L.esri.Geocoding.arcgisOnlineProvider({
                    apikey: apiKey,
                    nearby: {
                        lat: -33.8688,
                        lng: 151.2093,
                    },
                }),
            ],
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
