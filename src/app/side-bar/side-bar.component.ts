import { Component, Input } from '@angular/core';
import { EventEmitter, OnInit, Output } from '@angular/core';
import axios from 'axios';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})

export class SideBarComponent implements OnInit {
  public addressForm: FormGroup;
  addresses: string[] = [];
  editIndex: number = -1;
  editMode: boolean = false;
  @Input() public totalDistance: number = 0;
  @Input() public totalDuration: number = 0;
  public isCalculationDone: boolean = false;
  @Output() addressSubmitted = new EventEmitter<{ address: string, isSource: boolean, coords: [number, number] }[]>();

  private readonly olaMapsApiKey: string = '';

  constructor(private fb: FormBuilder, 
    private http: HttpClient) {

    this.addressForm = this.fb.group({
      sourceAddress: ['', Validators.required],
      destinationAddress: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  addOrEditAddress(): void {
    const address = this.addressForm.value.destinationAddress;
    if(this.editMode && this.editIndex != -1) {
      this.addresses[this.editIndex] = address;
      this.editMode = false;
      this.editIndex = -1;
    } else {
      this.addresses.push(address);
    }
    this.addressForm.patchValue({destinationAddress: '' });
  }

  editAddress(index: number): void {
    this.editMode = true;
    this.editIndex = index;
    this.addressForm.patchValue({ destinationAddress: this.addresses[index] });
  }

  removeAddress(index: number): void {
    this.addresses.splice(index, 1);
    if(this.editMode && this.editIndex === index) {
      this.editMode = false;
      this.editIndex = -1;
      this.addressForm.patchValue({ destinationAddress: '' });
    }
  }

  submitAddresses(): void {
    const sourceAddress = this.addressForm.value.sourceAddress;
    this.addresses.push(sourceAddress);
    const destinations = this.addresses;
    // this.addressSubmitted.emit({
    //   source: sourceAddress,
    //   destinations: destinations
    // });

    this.calculations();
  }

  private async calculations(): Promise<void> {
    let isSource = false;
    const addressCoords: { address: string, isSource: boolean, coords: [number, number] }[] = [];
    const sourceAddress = this.addressForm.value.sourceAddress;
    for (const address of this.addresses) {
      const coords = await this.getCoordinates(address);
      if (coords) {
        if(address == sourceAddress) {
          isSource = true;
        }
        addressCoords.push({ address, isSource, coords });
      }
    }

    console.log(addressCoords);
    
    this.addressSubmitted.emit(addressCoords);
    


    this.isCalculationDone = true;
  }

  private async getCoordinates(address: string): Promise<[number, number] | null> {
    const url = `https://api.olamaps.io/places/v1/geocode?address=${address}&language=English&api_key=${this.olaMapsApiKey}`;
    try {
      const response: any = await this.http.get(url).toPromise();
      if (response && response.geocodingResults && response.geocodingResults.length > 0) {
        const result = response.geocodingResults[0];
        return [result.geometry.location.lat, result.geometry.location.lng];
      }
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }
    return null;
  }

}
