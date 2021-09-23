import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import Billing_Address_Latitude from '@salesforce/schema/Account.Billing_Address_Latitude__c';
import AccountLongitude from '@salesforce/schema/Account.BillingLongitude__c';

const fields = [Billing_Address_Latitude, AccountLongitude];

export default class arcgisiframe extends LightningElement {
   
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields })
    account;

    get lat2() { return getFieldValue(this.account.data, Billing_Address_Latitude)
    }

    get long2() {return getFieldValue(this.account.data, AccountLongitude)

    }

    showExperienceBuilder = false;
    showWebAppBuilder = false;
    showArcgisDashboard = false;
    experienceBuilderLabel = 'Show Experience Builder';
    webAppBuilderLabel = 'Show Web AppBuilder';
    arcgisDashboardLabel = 'Show ArcGIS Dashboard';
    url = '';


    gotoExperienceBuilder(event){
        this.showExperienceBuilder = true;
        this.webAppBuilderLabel = 'Show Web AppBuilder';
        this.arcgisDashboardLabel = 'Show ArcGIS Dashboard';       
        this.showWebAppBuilder = false;
        this.showArcgisDashboard = false;
        if(event.target.label =='Show Experience Builder')
        {
            this.experienceBuilderLabel = 'Hide Experience Builder';
            this.showExperienceBuilder = true;
        }
            
        if(event.target.label =='Hide Experience Builder')
        {
            this.experienceBuilderLabel = 'Show Experience Builder';
            this.showExperienceBuilder = false;
            this.showWebAppBuilder = false;
            this.showArcgisDashboard = false;
        }
            
    }
    gotoWebAppBuilder(event){
        this.url =  "https://inscomm.maps.arcgis.com/apps/webappviewer/index.html?id=5a138311efa641dfa739461c945b0b3c&marker=" + this.long2 + ";" + this.lat2 + "&level=10";
        this.experienceBuilderLabel = 'Show Experience Builder';
        this.arcgisDashboardLabel = 'Show ArcGIS Dashboard';
        this.showWebAppBuilder = true;
        this.showExperienceBuilder = false;
        this.showArcgisDashboard = false;
        if(event.target.label =='Show Web AppBuilder')
        {
            this.webAppBuilderLabel = 'Hide Web AppBuilder';
            this.showWebAppBuilder = true;
        }
            
        if(event.target.label =='Hide Web AppBuilder')
        {
            this.webAppBuilderLabel = 'Show Web AppBuilder';
            this.showExperienceBuilder = false;
            this.showWebAppBuilder = false;
            this.showArcgisDashboard = false;
        }
            
    }
    gotoArcgisDashboard(event){
        this.webAppBuilderLabel = 'Show Web AppBuilder';
        this.experienceBuilderLabel = 'Show Experience Builder';
        this.showArcgisDashboard = true;
        this.showWebAppBuilder = false;
        this.showExperienceBuilder = false;
        if(event.target.label =='Show ArcGIS Dashboard')
        {
            this.arcgisDashboardLabel = 'Hide ArcGIS Dashboard';
            this.showarcgisDashboard = true;
        }
            
        if(event.target.label =='Hide ArcGIS Dashboard')
        {
            this.arcgisDashboardLabel = 'Show ArcGIS Dashboard';
            this.showExperienceBuilder = false;
            this.showWebAppBuilder = false;
            this.showArcgisDashboard = false;
        }
            
    }    
}