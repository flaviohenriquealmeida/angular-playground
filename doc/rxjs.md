const series1$ = of('a', 'b');
const series2$ = of('x', 'y');
const result$ = concat(series1$, series2$);
result$.subscribe(console.log);

concat will subscribe to series2$ after series1$ completes. series1$ will emit a, b them completes. 

The key point for concatenation is Observable completion!!!!!!!

with concatMap we don't need to have a nested concat call!
concatMap is not going to cancel the inner observable is a new value is fired. It will wait the inner observable to finish to pass the outer value to the inner.

Sometimes we want to run things in pararell (merge). For that we have the merge Observable strategy! Merge doesn't rely on completion!

const series1$ = interval(1000).pipe(map(val => val*10));

const series2$ = interval(1000).pipe(map(val => val*100));

const result$ = merge(series1$, series2$);

result$.subscribe(console.log);

As we can see, the values of the merged source Observables show up in the result Observable immediately as they are emitted. If one of the merged Observables completes, merge will continue to emit the values of the other Observables as they arrive over time.

Observable switching
We don't have to wait any observable to complete like merge. 
Se o outer emit antes to innter completar, cancela o inner. 


The Exhaust Strategy

The switchMap operator is ideal for the typeahead scenario, but there are other situations where what we want to do is to ignore new values in the source Observable until the previous value is completely processed.
Com Exhaust, o inner tem que terminar para que o outer possa receber novos valores.




