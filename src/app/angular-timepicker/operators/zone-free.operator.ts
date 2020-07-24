import { NgZone } from "@angular/core";
import {
  MonoTypeOperatorFunction,
  Operator,
  Observable,
  TeardownLogic,
  Observer
} from "rxjs";
import { map } from "rxjs/operators";



class ZonefreeOperator<T> implements Operator<T, T> {
  constructor(private readonly zone: NgZone) {}

  call(observer: Observer<T>, source: Observable<T>): TeardownLogic {
    return this.zone.runOutsideAngular(() => source.subscribe(observer));
  }
}

export function zonefull<T>(zone: NgZone): MonoTypeOperatorFunction<T> {
  return map(value => zone.run(() => value));
}


export function zonefree<T>(zone: NgZone): MonoTypeOperatorFunction<T> {
  return source => source.lift(new ZonefreeOperator(zone));
}
