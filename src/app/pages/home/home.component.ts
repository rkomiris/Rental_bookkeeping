import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private homeservice: HomeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private componentLoaderService: ComponentLoaderService) { }

  ngOnInit() {
    this.login();
  }

  login(){
    this.homeservice.login().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
      })
  }
}
