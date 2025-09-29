import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {Navigationbar} from "./components/navigationbar/navigationbar"

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet,Navigationbar],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('BankFrontend');
}
