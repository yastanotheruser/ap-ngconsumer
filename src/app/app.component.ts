import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  private breakpointObserverSubscription: Subscription;
  showSidenav = false;
  small = false;

  constructor(breakpointObserver: BreakpointObserver) {
    this.breakpointObserverSubscription = breakpointObserver
      .observe([Breakpoints.Small])
      .subscribe(result => {
        this.small = result.breakpoints[Breakpoints.Small];
      });
  }

  ngOnDestroy() {
    this.breakpointObserverSubscription.unsubscribe();
  }
}
