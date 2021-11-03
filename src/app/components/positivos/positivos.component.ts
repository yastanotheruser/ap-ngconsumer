import { DataSource } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { noop, Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Positivo } from 'src/app/models/positivo.model';
import { DatosService, InfoPositivos } from 'src/app/services/datos.service';

@Component({
  selector: 'app-positivos',
  templateUrl: './positivos.component.html',
  styleUrls: ['./positivos.component.css']
})
export class PositivosComponent implements OnInit, OnDestroy {
  private positivosSubscription: Subscription;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  title = 'Casos positivos de COVID-19 en Colombia';
  loading = false;
  positivos!: InfoPositivos;
  dataSource: PositivosDataSource;
  displayedColumns = [
    'id_de_caso',
    'departamento_nom',
    'ciudad_municipio_nom',
    'edad',
    'sexo',
    'fecha_inicio_sintomas',
    'fecha_diagnostico'
  ];

  get countDisplay(): string {
    if (this.loading && this.positivos.count === null) {
      return 'Cargando datos';
    } else {
      return `${this.positivos.count || 0} casos positivos`;
    }
  }

  constructor(private datos: DatosService) {
    this.positivosSubscription = this.datos.positivos$.subscribe(
      ps => (this.positivos = ps)
    );
    this.dataSource = new PositivosDataSource(
      this.datos.positivos$.pipe(map(info => info.data))
    );
  }

  ngOnInit() {
    this.loadData(0);
  }

  ngOnDestroy() {
    this.positivosSubscription.unsubscribe();
  }

  loadData(offset: number, onError?: (err: HttpErrorResponse) => void) {
    this.loading = true;
    this.datos
      .loadPositivos(offset)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(noop, err => {
        if (err instanceof HttpErrorResponse && typeof onError === 'function') {
          onError(err);
          return;
        }

        throw err;
      });
  }

  onPage($event: PageEvent) {
    let prevPageSize: number | null = null;
    if (this.datos.pageSize !== $event.pageSize) {
      prevPageSize = this.datos.pageSize;
      this.datos.pageSize = $event.pageSize;
    }

    this.loadData($event.pageIndex, () => {
      if (typeof $event.previousPageIndex !== 'undefined') {
        this.paginator.pageIndex = $event.previousPageIndex;
      }

      if (prevPageSize !== null) {
        this.datos.pageSize = prevPageSize;
        this.paginator.pageSize = prevPageSize;
      }
    });
  }

  onSort($event: Sort) {
    const prevSort = this.datos.sort;
    this.datos.sort = $event;
    this.loadData(this.paginator.pageIndex, () => {
      this.datos.sort = prevSort;
    });
  }
}

export class PositivosDataSource extends DataSource<Positivo> {
  private _data: Observable<Positivo[]>;

  constructor(data: Observable<Positivo[]>) {
    super();
    this._data = data;
  }

  connect() {
    return this._data;
  }

  disconnect() {}
}
