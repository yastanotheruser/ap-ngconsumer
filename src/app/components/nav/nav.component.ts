import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  @Output() toggleMenu = new EventEmitter<void>();
  @Input() menuButton = true;
}
