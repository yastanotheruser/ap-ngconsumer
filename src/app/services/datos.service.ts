import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Positivo } from '../models/positivo.model';

export interface InfoPositivos {
  count: number | null;
  data: Positivo[];
}

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  static readonly POSITIVOS_URL =
    'https://www.datos.gov.co/resource/gt2j-8ykr.json';

  private _positivos: InfoPositivos;
  positivos$: BehaviorSubject<InfoPositivos>;
  pageSize = 5;
  sort: Sort = {
    active: 'id_de_caso',
    direction: 'asc'
  };

  private get _order() {
    return `${this.sort.active} ${this.sort.direction}`;
  }

  constructor(private http: HttpClient) {
    this._positivos = {
      count: null,
      data: []
    };
    this.positivos$ = new BehaviorSubject<InfoPositivos>(this._positivos);
  }

  loadPositivos(pageIndex: number): Observable<InfoPositivos> {
    const os = [];
    os.push(
      this.http.get<Positivo[]>(DatosService.POSITIVOS_URL, {
        params: {
          $where: "lower(recuperado) = 'activo'",
          $offset: this.pageSize * pageIndex,
          $limit: this.pageSize,
          $order: this._order
        }
      })
    );

    if (this._positivos.count === null) {
      os.push(
        this.http.get<{ count: string }[]>(DatosService.POSITIVOS_URL, {
          params: {
            $select: 'count(*)',
            $where: "lower(recuperado) = 'activo'"
          }
        })
      );
    }

    const o = forkJoin(os).pipe(
      map(([data, _countResponse]) => {
        this._positivos.data = <Positivo[]>data;
        if (typeof _countResponse !== 'undefined') {
          const countResponse = <{ count: string }[]>_countResponse;
          const count = Number(countResponse[0]?.count);

          if (!Number.isNaN(count)) {
            this._positivos.count = count;
          } else {
            this._positivos.count = null;
          }
        }

        return this._positivos;
      })
    );

    o.subscribe(ps => this.positivos$.next(ps));
    return o;
  }
}
