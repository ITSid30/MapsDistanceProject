import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import axios from 'axios';
import { OlaMapsServiceService } from '../services/ola-maps-service.service';
import { RouteService } from '../services/route-service.service';
import polyline from '@mapbox/polyline';


@Component({
  selector: 'app-maps-bar',
  templateUrl: './maps-bar.component.html',
  styleUrl: './maps-bar.component.css'
})


export class MapsBarComponent implements OnInit {
  
  private readonly GEOCODE_API_KEY = '';
  private readonly ROUTE_API_KEY = '';

  @Input() markersData: any[] = [];
  public allmarkersData: { coords: [number, number], isSource: boolean }[] = [];
  public map: any;
  private markers: L.Marker[] = [];
  private routeLayer!: L.LayerGroup;
  public totalDist: number = 0;
  public totalDuration: number = 0;
  @Output() routeData = new EventEmitter<{ totalDist: number, totalDuration: number }>();

  constructor(private olaMapsService: OlaMapsServiceService,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.allmarkersData = this.markersData;
    console.log('Markers Data : ', this.allmarkersData);
    this.routeLayer.clearLayers();
    this.addMarkers();
  }

  initializeMap() {
    this.map = L.map('map').setView([18.5204, 73.8567], 13); 
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Siddhesh Maps!'
    }).addTo(this.map);

    this.routeLayer = L.layerGroup().addTo(this.map);

    // this.getUserLocation();
  }

  private addMarkers(): void {
    const coordinates: [number, number][] = [];

    // Remove existing markers
    this.markers.forEach(marker => {
      this.map?.removeLayer(marker);
    });
    this.markers = [];

    // Add new markers
    // this.allmarkersData.forEach(markerData => {
    //   const marker = L.marker(markerData.coords).bindPopup(markerData.isSource ? 'Source' : 'Destination');
    //   marker.addTo(this.map);
    //   this.markers.push(marker);
    // });
    this.allmarkersData.forEach((marker, index) => {
      // const color = marker.isSource ? 'green' : 'red';
      const markerInstance = L.marker(marker.coords).addTo(this.map);
      markerInstance.bindPopup(marker.isSource ? 'Source' : `Destination ${index}`).openPopup();
      this.markers.push(markerInstance)
      coordinates.push(marker.coords);
    });

    if (coordinates.length > 1) {
      // Closing the route by connecting last destination back to the source
      coordinates.push(coordinates[0]);

      this.plotRoute(coordinates);
    }

    // Adjust map view to fit all markers if needed
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map?.fitBounds(group.getBounds());
    }
  }

  private plotRoute(coords: [number, number][]): void {
    let locations = coords.length;

    this.routeService.getRoute(coords).subscribe(response => {
      this.totalDist = response.routes[0].summary.distance/1000;
      this.totalDuration = response.routes[0].summary.duration/60;
      this.routeData.emit({ totalDist: this.totalDist, totalDuration: this.totalDuration });

      const routeCoords = polyline.decode(response.routes[0].geometry);
      
      // Reverse the coordinates to match [lat, lng] format (Leaflet expects [lat, lng], but the decoded polyline is [lng, lat])
      const route = routeCoords.map((coord: [number, number]) => [coord[0], coord[1]] as [number, number]);

      // Create a polyline and add it to the routeLayer
      const routePolyline = L.polyline(route, { color: 'blue' }).addTo(this.routeLayer);

      // Fit the map bounds to the polyline
      this.map.fitBounds(routePolyline.getBounds());
    });
  }
  
}
