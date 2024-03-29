# Integrating Salesforce and ArcGIS

## The ArcGIS System

This repository contains sample apps, scripts, and guidance for integrating ArcGIS with Salesforce.

### ArcGIS Platform

For many of the samples there is an ArcGIS Platform API Key required. You can create a free ArcGIS Developer Account at developers.arcgis.com. You can create an API Key using the developer dashboard. The developer account includes a generous free tier for some of the services and there is a pricing tab for more information about the cost of the services

### ArcGIS Online and ArcGIS Enterprise

Some of the samples demonstrate integrating ArcGIS Online and ArcGIS Enterprise with a system. You will need your own license for ArcGIS Online and ArcGIS Enterprise to test these samples.

## Salesforce

These samples assume a moderate degree of familiarity with Salesforce. Salesforce offers an introduction to Salesforce development on their Trailhead in the [Developer Beginner Trail](https://trailhead.salesforce.com/en/content/learn/trails/force_com_dev_beginner), including a Trail specific to [getting started with VS Code](https://trailhead.salesforce.com/content/learn/projects/quickstart-vscode-salesforce). For the `esriMap` sample, we are creating a Lightening Web Component, so go through [this training](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/create-a-hello-world-lightning-web-component) first.

## Quick Start

For getting started with the `esriMap` folder (Lightening Web Component):

- Salesforce Settings:

  - Make sure you have a custom Latitude and Longitude field defined in your "Accounts"
  - Make sure you add "unpkg.com" and "\*.arcgis.com" to your "CSP Trusted Sites" ("allow for" - check all the checkboxes)

- First follow the steps in [getting started with VS Code](https://trailhead.salesforce.com/content/learn/projects/quickstart-vscode-salesforce) and [Quick Start Lightening Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/create-a-hello-world-lightning-web-component) to get your development environment going.
- VS Code Command palette: "SFDX: Create Lightning Web Component"
  Name: "leafletMap"
  Location: default (force-app/main/default/lwc)
- Copy contents from `salesforce\esriMap\esriMap.html` into your HTML file
- Copy content from `salesforce\esriMap\esriMap.js` into your JS file.
- In the JS file, update the API key.
- In the JS file, ensure your custom fields that you have configured in your Salesforce fields settings match what are in the `FIELD_COLS` variable.
- Create a new file: "leafletMap.css"
- Copy content from `salesforce\esriMap\esriMap.css` into the CSS file.
- Copy content from `salesforce\esriMap\esriMap.js-meta.xml` into the XML file.
- Follow the instructions you learned in the "Quick Start Lightening Web Components" training to deploy the code (right-click "default" > "deploy source to Org").
- Add the new LWC to an **Account** page.

### Using Esri Leaflet Vector

The above quick start shows how to use Leaflet, Esri Leaflet, and Esri Leaflet Geocoder within a Salesforce Lighting Web Component (LWC). The natural next step is to use vector basemaps, using the [Esri Leaflet Vector plugin](https://github.com/Esri/esri-leaflet-vector). As of April 2023, it is not possible to use Esri Leaflet Vector within a Lightening Web Component. Here's why:

It is our understanding web workers cannot be used within LWCs (search "worker" on [this page](https://developer.salesforce.com/docs/component-library/tools/locker-service-viewer)). The Esri Leaflet Vector plugin uses [Maplibre GL JS](https://github.com/maplibre/maplibre-gl-js) to load vector tiles. Maplibre GL JS uses web workers. So because of the web worker limitation from Salesforce, you cannot use Esri Leaflet Vector. We hope this restriction may change in the future.

If you've found a way to use vector basemaps in Salesforce Lightening Web Components, please reach out by creating an issue in this repo. Thank you!

## Feedback

Please let us know if you have feedback, find issues, or have ideas. The team will be active on this repository.
