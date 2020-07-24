import { Component, ElementRef } from "@angular/core";
import { FromEventTarget, fromEvent } from "rxjs/internal/observable/fromEvent";
import { Observable } from 'rxjs';

// Typing for Event with particular target
export type EventWith<
  E extends Event,
  T extends FromEventTarget<E>
> = E & {
  readonly target: T;
};

export function typedFromEvent<
  E extends keyof GlobalEventHandlersEventMap,
  T extends FromEventTarget<EventWith<GlobalEventHandlersEventMap[E], T>>
>(
  target: T,
  event: E,
  options: AddEventListenerOptions = {},
): Observable<EventWith<GlobalEventHandlersEventMap[E], T>> {
  return fromEvent(target, event, options);
}