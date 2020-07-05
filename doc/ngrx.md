## Adding NgRx to your existing application

```
ng add @ngrx/schematics (answer yes to add as default collection)
ng add @ngrx/store@latest --minimal false (@9.2 is not working to get the 9.2 version)
```

The command `ng add @ngrx/store` will install the module and also will modify `app.module.ts` to import the module:

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app.routing.module';
import { ErrorsModule } from './errors/errors.module';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ErrorsModule,
    CoreModule,
    AppRoutingModule,
    HomeModule.forRoot(),
    StoreModule.forRoot(reducers, {
      metaReducers
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

We can say the store is a in memory database. We don't have any database and we will able to check by installing the module `ng add @ngrx/store-devtools`. The command will also modify the application root module:

```javascript
// modification
 StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
```

## STORE

Multiple modules of the application manage different parts of the state tree. We can create a store with the command `ng generate store auth/Auth --module auth.module.ts`.
The command will add into the auth.module.ts the import `   StoreModule.forFeature('auth', fromAuth.reducers, { metaReducers: fromAuth.metaReducers }),` and will also create inside the module folder the new folder `redux` with `index.ts` inside it. 

The meta reducer is something something that we can remove, that can be added later. 

index.ts

```javascript
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

export interface State {

}

export const reducers: ActionReducerMap<State> = {

};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

```

## Store Service API
When we want to interact with the store, we need to inject it.
The Store has a generic type. What value should we use? If we openm the `auth/reduces/index.ts` we can see an interface called State, that defines the global state of the store. We can change the name tp AppState to make it more clear (can avoid clash with State inside ngrx package)

private store: Store<AppState>

The only way to modify data inside the store is by calling the method `dispatch`. The method has only one argument that is of type `Action`. 

## ACTION 

IT's a plain Javascript object that we send to the store to trigger some modification in the store. 

```javascript
this.stote.dispatch({
  type: 'Login Action',
  payload: {
    userProfile: user
  }
});
```

We can think the Action like an event. We have a type to unit identify it and the payload. The payload is the value we want to update in the store. The payload is not mandatory.

This approach create a level of indirection when comparing to method like delete(), update(), create() that the store might had. When we fire the Action, we are not splicity telling the store how to modify data. We are communicating to the store an event or we are issuing a explicity command. It is the store that will decide what to do with the action and how it is going to modify its internal state.
The LoginComponent doesn;'t know how the Store will handle the action. The LoginComponent is not tied coupled to other parts of the application. The Login is awanner of other components in the application. 

What if we want to fire the same action in different places of the aplication? So, the action value should be some kind of constant.

Inside the auth folder we will add a new file that will have all authentication actions.

// auth/auth.action.ts

We will follow a convention. 
```javascript
export const login = createAction(
  '[Login Page] User login', // [Component] event
  props<{ user: User }>()
);

```
the `props` is a utilitity function that we use to define the type of the payload we are going to receive.
The logn constant is a ActionCreator. Using it:


```javascript
  login() {
    const val = this.form.value;
    this.auth.login(val.email, val.password)
      .pipe(tap(user => {
        console.log(user);
        this.store.dispatch(login({ user }));
        this.router.navigateByUrl('./courses');
      }))
      .subscribe(
        noop,
        () => alert('Login Failed')
      )
  }
```

We are able to check the action on the Redux. The State didn't change, because the Action is not responsible for that. So we need to change the store state. 

## Grouping multiple actions 
Don't reuse actions across components. Create a action for every component so it is easy to know what is happening. 

// auth/auth.actions.ts

```javascript
// importing the auth actions giving an alias
import * as AuthActions from './auth.actions';

export { AuthActions }; // exporting so it can be used anywhere. 
```


## Reducers

Is a javascript function that updates the state.

```javascript
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  createReducer,
  on
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { User } from '../model/user.model';
import { AuthActions } from '../action.types';

// interface that defines this piece of state from the store 
export interface AuthState {
  user: User
}

// the initial value from the store 
export const initialAuthState: AuthState = {
  user: undefined
}

// the reducer that will liten to the logn action and will update the state
export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state, action) => {
    return { user: action.user }
  })
);
/* we will use later that code that was generated
export const reducers: ActionReducerMap<AuthState> = {
export const metaReducers: MetaReducer<AuthState>[] = !environment.production ? [] : [];
};
*/
```
Looks and the redux tools, the `@ngrx/store/init` is used to intialize the store default value.

## Selectors

Let's see how we query the store:
```javascript
this.isLoggedIn$ = this.store
  .pipe(map(state => !!state['auth'].user));

this.isLoggedOut$ = this.store
  .pipe(map(state => !state['auth'].user));
```

We have a better way of query data using Selectors. 
Currently, whenever a value is update on the store, the 
subscription of isLoggedIn$ and isLoggedOut$ will be updated. We only want to updat them when the values really change, not because other thing on the state has changed. 

Whe could do 

```javascript
this.isLoggedIn$ = this.store
  .pipe(
    map(state => !!state['auth'].user),
    distinctUntilChanged()
  );
```
ngRX has the selector operator that is a shortcode for the previous code. 

```javascript
   this.isLoggedIn$ = this.store
        .pipe(select(state => !!state['auth'].user));
```
The code `state => !!state['auth'].user)` is a pure function. We want to avoid to compute the function if the input doesn't change. (memoization). This is what ngRx calls a Selector.

```javascript
auth/auth.selectors.ts

import { createSelector } from "@ngrx/store";

export const isLoggedIn  = createSelector(
  state => state['auth'], // slice the part of the store we want
  auth => !!auth.user // do some computation with the selected part
);
```

We can combine selectors too:
```javascript
export const isLoggedOut  = createSelector(
  isLoggedIn,
  loggedIn => !isLoggedIn
);


## Feature Selectors

The Feature selector will allow to have the type when access state['auth'].

```javascript
import { createSelector, createFeatureSelector } from "@ngrx/store";
import { AuthState } from "./reducers";

export const selectAuthState = createFeatureSelector<AuthState>('auth'); // auth is the part of the store we want to handle. We already have the AuthState, we are going to use this type

export const isLoggedIn  = createSelector(
  selectAuthState,
  auth => !!auth.user // now the property is type safe
);

```

Example of action without payload 

```javascript
import { createAction, props } from "@ngrx/store";

import { User } from "./model/user.model";

export const login = createAction(
  '[Login Page] User login',
  props<{ user: User }>()
);

export const logout = createAction(
  '[Top Menu] Logout'
);
```

## Guards

Authentication Guard will be a service that implements the CanActivate Angular interface. 

```javascript
import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AppState } from "../reducers";
import { Store, select } from "@ngrx/store";
import { isLoggedIn } from "./auth.selectors";
import { tap } from "rxjs/operators";
import { AuthState } from "./reducers";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<AuthState>,
    private router: Router
    ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store
      .pipe(
        select(isLoggedIn),
        tap(loggedIn => {
          if (!loggedIn) {
            this.router.navigateByUrl('/loigin');
          }
        })
      );
  }
}

```
// app.module.ts
const routes: Routes = [
  {
    path: 'courses',
    loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
```

## EFFECTS

We want the store to interact with a back-end database thought ajax request. We want to store the result in the Store. 

We want to change the title of a course, thus modifying the store. As a side effect we want to update the database on the back-end. This extra operation that we want to trigger is called as a side effect.

NgRx has a side effect library called Effects.

When we refresh the page, we loose the information about authentication, we want it to survice. We are going to save the state of the application in the browser, the local storage. 

We need to install the module effect in our root module:

```javascript
const routes: Routes = [
  {
    path: 'courses',
    loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    /...
    AuthModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([]) // adding the module 
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```
We also need to import the side effect on the AuthModule, but this time using the `forFeature` method.

```

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        RouterModule.forChild([{path: '', component: LoginComponent}]),
        StoreModule.forFeature('auth', fromAuth.authReducer),
        EffectsModule.forFeature([])

    ],
    declarations: [LoginComponent],
    exports: [LoginComponent]
})
export class AuthModule {
    static forRoot(): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [
              AuthService,
              AuthGuard
            ]
        }
    }
}
```
EffectsModule.forFeature([]) the array is the list of side effects for that particular module.

Let's create auth.effects.ts inside the auth folder. 
Bear in mind that this service should not be imported anywhere in your application because it is going to be used by ngRx effects only.

```javascript
// auth/auth.effects.ts
import { Injectable } from "@angular/core";

@Injectable()
export class AuthEffects {}
```

Importing 

```javascript
// auth module, we are pluging the AuthEffect into the EffectsModule
        EffectsModule.forFeature([AuthEffects])
```
An Effect it is something that is done in response to a given action. The action triggers it reducers and then the side effect is called. 

The Effect knows about actions using the Actions service from the ngrx/effects package:

```javascript
import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";

import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions) {
    actions$.subscribe(action => {
      if (action.type === '[Login Page] User login') { // don't worry, we are repating the string of the action
          localStorage.setItem('user', JSON.stringify(action['user'])); // don't worry.. not safe acces.
      }
    });
  }
}
```
The above example is not a good example, because it is not using the API's from the Effect library.

## Using Effects API's
With the following approach, we have new login observable that will listen to login actions only.

```javascript
import { Injectable } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";

import { AuthActions } from "./action.types";

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions) {

    const login$ = this.actions$
      .pipe(
        ofType(AuthActions.login), // ofType is a buildin filer for action types from ngRx
        tap(action => {
          // we want to do operations as side effect, so inside the tap operator.
          localStorage.setItem('user', JSON.stringify(action.user));
        })
      );

    login$.subscribe();
  }
}

```
Can we avoid to manually subscribe to the login$ stream? And if we got an error, how to handle error?

```javascript
import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { tap } from "rxjs/operators";

import { AuthActions } from "./action.types";

@Injectable()
export class AuthEffects {
// createEffect avoid us to subscribe to the login$.
// it also handle errors? Looks like it will recreate the observable again 
// it can be a property of the class.

  public login$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.login),
        tap(action => localStorage.setItem('user', JSON.stringify(action.user)))
      )
    );

  constructor(private actions$: Actions) {

  }
}
```

Many side effects results in dispatching new action, but it not the case with our side effect. So we have to do:

```javascript
import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { tap } from "rxjs/operators";

import { AuthActions } from "./action.types";

@Injectable()
export class AuthEffects {

  public login$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.login),
        tap(action => localStorage.setItem('user', JSON.stringify(action.user)))
      )
    , { dispatch: false }); // doesn't dispatch a new action

  constructor(private actions$: Actions) {

  }
}
```

## NgRX Development tools in depath
NgRx Router Store and the Time-Travelling Debugger 

To use the time travelling debugger, we have to integrade ngRx with Angular router, otherwise we won't able to update the screen when we use redux tools. @ngrx/router-store

```javascript 
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {HttpClientModule} from '@angular/common/http';

import {RouterModule, Routes} from '@angular/router';
import {AuthModule} from './auth/auth.module';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {RouterState, StoreRouterConnectingModule} from '@ngrx/router-store';

import {EffectsModule} from '@ngrx/effects';
import {EntityDataModule} from '@ngrx/data';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { reducers, metaReducers } from './reducers';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  {
    path: 'courses',
    loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

## NgRX Router and time travelling debugging

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatToolbarModule,
    AuthModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([]),
    // navigation will trigger actions. The stateKey is the identifier of the router state in our store. The routerState is what is going to be saved, we will use the RouterState.Minimal, a serialized version of it. It is not enough, we have to add for the stateKey the routerReducer that will update the state. NgRX has a property a build in function that does that called routerReducer (see index.ts reducer)
    StoreRouterConnectingModule.forRoot(
      {
        stateKey: 'router',
        routerState: RouterState.Minimal
      }
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```
```javascript
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { routerReducer } from '@ngrx/router-store';

export interface AppState {

}

export const reducers: ActionReducerMap<AppState> = {
    router: routerReducer // adding the reducer of the router state
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
```

## NgRx Runtime Checks. How do they work?

On dev mode, NgRX will add checks to our store to checking if we a following certain rules. 

Example:

```javascript
import {
  createReducer,
  on
} from '@ngrx/store';

import { User } from '../model/user.model';
import { AuthActions } from '../action.types';

export interface AuthState {
  user: User
}

export const initialAuthState: AuthState = {
  user: undefined
}

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state, action) => {
    return { user: action.user }
  }),
  on(AuthActions.logout, (state, action) => {
      return { user: undefined }; // the return is a new state
  })
);
```
We are not mutating the original state, we are creating a new copy. This is a rule to follow. Let's do the bad way:

```
  on(AuthActions.login, (state, action) => {
    state.user = action.user;
    return state;
  }),
```
The previous code will mutate our time travelling debug. Also, will break the OnPush Component strategy to check whenever the data has changed.

We can activate the runTimeChecks on in the root module:

```javascript
    StoreModule.forRoot(reducers, 
      { 
        metaReducers,
        runtimeChecks: {
          strictActionImmutability: true
        } 
      }),
```

There are many rules but the strictActionImmutability is very important. 

We see the error in the console log!

core.js:5845 ERROR TypeError: Cannot assign to read only property 'user' of object '[object Object]'

We can also check if the Actions are not mutated with `strictActionImmutability`.

strictActionSerializability this is important, because Date are not serializable in JavaScript. 

strictStateSerializability guarantee that the state in the store is always serializable

## META REDUCER

A metareducer is like a plan reducer function like the authReducer. The difference is that they are processed before the normal reducers are invoked. 
Whenever an action is dispatched by our application, NgStore will handle any meta reducers before dispatching the action.

When it is usefull? Old version of NgStore used to use the meta reduce to freeze the application state.
Think of a metareducer as a interceptor that we can manipulate data before it reaches the reducers. 

Let's create our first. In the end we will have to plugit into the metaReducers map created by default by NgRx.

```javascript
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
```


```javascript
export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.log('state before', state);
    console.log('action', action);
    // keep the reducer chain!
    return reducer(state, action);
  }
}
// we can have meta reducers for production and dev environment 
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger] : [];
```

## NgRX Entity

We want to load the course data when the application starts and keep it in the store.

Let's define the actions that we will need to handle the courses data. Because it is in the course domain, we will create a specific action for this feature module.

```
// courses/course.action.ts

import { createAction, props } from "@ngrx/store"

// command, because it is telling what needs to be done
export const loadAllCourses = createAction(
  '[Course Resolver] Load All Courses'
);

// event, because is telling about something that has hapenned
export const allCoursesLoaded = createAction(
  '[Load Courses Effect] All courses loaded'
);

/*
  The idea is that the resolver is going to trigger run the action loadAllCourses
  that in turn will call the allCoursesLoaded effect. This effect will save the
  courses in the store.
*/
```

Let's create the actions types file that will be linked to this action.


```javascript
// courses/course.actions.ts
import * as CourseActions from './course.actions';

export { CourseActions };

```
A resolve should complete, otherwise is going to hang. 

```javascript
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "../reducers";
import { tap, first } from "rxjs/operators";
import { loadAllCourses } from "./course.actions";

@Injectable()
export class CoursesResolver implements Resolve<any> {

  constructor(private store: Store<AppState>) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    return this.store
      .pipe(
        tap(() => {
          this.store.dispatch(loadAllCourses())
        }),
        first() // need to complete
      )
  }
}

```

```javascript
export const coursesRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      courses: CoursesResolver
    }
```

The loadAllCourses() will be fired twice. A explicacao do cara explicando o motivo nao foi boa.

```javascript
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "../reducers";
import { tap, first, finalize } from "rxjs/operators";
import { loadAllCourses } from "./course.actions";

@Injectable()
export class CoursesResolver implements Resolve<any> {

  private loading: boolean = false;

  constructor(private store: Store<AppState>) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    return this.store
      .pipe(
        tap(() => {
          if (!this.loading) {
            this.loading = true;
            this.store.dispatch(loadAllCourses());
          }
        }),
        first(),
        finalize(() => this.loading = false)
      )
  }
}
```

## Getting the data from the back-end and storing it in the store.

```javascript
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CourseActions } from "./action-types";
import { CoursesHttpService } from "./services/courses-http.service";
import { concatMap, map } from "rxjs/operators";
import { allCoursesLoaded } from "./course.actions";

@Injectable()
export class CoursesEffects {

  public loadCourses$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(CourseActions.loadAllCourses),
        // using concatMap otherwise it could do multiple calls, we have a single one. MergeMap would make many requests
        concatMap(action => this.coursesHttpService.findAllCourses()),
        // the map is returning a new action that will be dispatched to the store.
        map(courses => allCoursesLoaded({ courses })) 
      )
  );

  constructor(
    private actions$: Actions,
    private coursesHttpService: CoursesHttpService) {}
}
```

## Entity Format 
Let's create the course reducer 
```
// courses/reducers/course.reducers.ts

import { EntityState } from "@ngrx/entity";
import { Course } from "../model/course";

export interface CoursesState extends EntityState<Course>{
  
}

When our state extends the EntityState, our state will automaticaly have the property ids and entities, the natural order of the entities. 
ids, 
entities stored by their ids and an separate array with the natual order.

It contains a dictionario os entities 
```

## NgRx Entity Adapter
An adapter helps with crud operations

```
import { EntityState, createEntityAdapter } from "@ngrx/entity";
import { Course } from "../model/course";

export interface CoursesState extends EntityState<Course>{}

export const adapter = createEntityAdapter<Course>();

```javascript
import { EntityState, createEntityAdapter } from "@ngrx/entity";
import { Course } from "../model/course";

export interface CoursesState extends EntityState<Course>{}

export const adapter = createEntityAdapter<Course>();
``` 
```javascript
import { EntityState, createEntityAdapter } from "@ngrx/entity";
import { Course } from "../model/course";

export interface CoursesState extends EntityState<Course>{}

export const adapter = createEntityAdapter<Course>();

// empty ids and empty entities array 
export const initialCoursesState = adapter.getInitialState();
```
Now that we have our intialCoursesState we can start implementing the courses reducer.

```javascript
export const coursesReducers = createReducer(
  initialCoursesState, 
  on(CourseActions.allCoursesLoaded, (state, action) => {
    // return a new state with entities and ids filled 
    return adapter.addAll(action.courses, state);
  })
)
```
We still need to plug the reducer

```
courses.module.ts
    StoreModule.forFeature('courses', coursesReducer)
```

We are going to create a feature selector that selects everything from the course state.

```javascript
import { EntityState, createEntityAdapter } from "@ngrx/entity";
import { Course } from "../model/course";
import { createReducer, on } from "@ngrx/store";
import { CourseActions } from "../action-types";

export interface CoursesState extends EntityState<Course>{}

export const initialCoursesState = adapter.getInitialState();

export const coursesReducer = createReducer(
  initialCoursesState,
  on(CourseActions.allCoursesLoaded, (state, action) => {
    return adapter.addAll(action.courses, state);
  })
);

export const { selectAll } = adapter.getSelectors();

```
How to order the list?

```javascript
// courses.reducer.ts
export const adapter = createEntityAdapter<Course>(
  {
    sortComparer: compareCourses,
  }
);
```
We can pass the logic to sortComparecer to order the data. 
The Entity also expect that the selectId property will be the id field of the entity. If the entity doesn't have an id property, we can tell what to use like that:

```javascript
export const adapter = createEntityAdapter<Course>(
  {
    sortComparer: compareCourses,
    selectId: course => course.courseId
  }
);
```

## Load data only if needed 

Avoid the resolver to load the data again. We will need to add extra state to the store. 

// courses.selects.ts

```
export const areCoursesLoaded = createSelector(
  selecCourseState,
  state => state.allCoursesLoaded
)

```

resolver

```
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "../reducers";
import { tap, first, finalize, filter } from "rxjs/operators";
import { loadAllCourses } from "./course.actions";
import { exitCode } from "process";
import { areCoursesLoaded } from "./courses.selectors";

@Injectable()
export class CoursesResolver implements Resolve<any> {

  private loading: boolean = false;

  constructor(private store: Store<AppState>) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    return this.store
      .pipe(
        select(areCoursesLoaded),
        tap(coursesLoaded => {
          if (!this.loading && !coursesLoaded) {
            this.loading = true;
            this.store.dispatch(loadAllCourses());
          }
        }),
        filter(coursesLoaded => coursesLoaded), // will terminate only of the course is loaded
        first(),
        finalize(() => this.loading = false)
      )
  }
}
```
Won't work. We need to st tje al;lCoursesLoaded when our reducer allCoursesLoader is triggered. 

export const coursesReducer = createReducer(
  initialCoursesState,
  on(CourseActions.allCoursesLoaded, (state, action) => {
    return adapter.addAll(action.courses, { ...state, allCoursesLoaded: true });
  })
);

## Using NgRX to update course data 

How to modify data stored in Entity format?

1 - define the actions
2 - reducers
3 - effects

We don't want to call the service directly, we want to do though our store.

Let's create the action 

```
// The edit dialog will dispatch this action when we click save and this action will be
// imediatly handled by the store. That means that we will have reduce logic that will update
// the in store memory. The also be an effect that will detect that and will
// update the course in the server. The back-end call is not goint to result
// in a new action dispatch.
export const courseUpdated = createAction(
  "[Edit Course Dialog] Course Update",
  props<{ update: Update<Course>}>()
);
```
The Update<T> is a special type from NgRx Entity that will help us updating the data. The instance of that particular type will have the properties changes (type of Partial<T>) and id (unique identifies the entity). 

Let's dispatch the action:

```javascript
// edit-course-dialog.component.ts
  onSave() {

    const course: Course = {
      ...this.course,
      ...this.form.value
    };
    
    const update: Update<Course> = {
      id: this.course.id, 
      changes: course
    };

    this.store.dispatch(courseUpdated({ update }));
    this.dialogRef.close();


  }
```

## Reducer for save

Optimistic background save that doesn't block the UI.

```javascript
// courses reducers 
export const coursesReducer = createReducer(
  initialCoursesState,
  on(CourseActions.allCoursesLoaded, (state, action) => {
    return adapter.addAll(action.courses, { ...state, allCoursesLoaded: true });
  }),
  on(CourseActions.courseUpdated, (state, action) => {
    return adapter.updateOne(action.update, state);
  })
);
```

## Save effect
// courses.effects.ts

 public saveCourse$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(CourseActions.courseUpdated),
        concatMap(action => this.coursesHttpService.saveCourse(action.update.id, action.update.changes))
      )
  , { dispatch: false });

We had to implement a serie of actions, some reducer logic.

## Handle data without writing too much code (NgRx Data Package)

Adding state management with NgRX Data instead of using NgRx Entity.
Import in the root module the EntityDataModule.forRoot({}). The root module won't have any entity (feature) associated with it, what is going to have entity is the feature module courses. So, only submodules will have entities. 


```javascript
// courses.module.ts
// this map will contain one entry per entity in our application (for this module)

// just bellow the routing
const entityMetaData: EntityMetadataMap = {
  Course: { // the object of this key will have all the auxiliare methods and properties of the ngRx Entity, we don't have to use them now.
    
  }
};
```
Now we need to plug it into the courses module:

```javascript
// courses module
export class CoursesModule {

  constructor(private eds: EntityDefinitionService) {
    eds.registerMetadataMap(entityMetaData);
  }
}
```

We need now a Course Entity Service. We need to create it. This will allows, for example, query the database from the back-end and save in the store and interact with the store. 



```javascript
// courses/course-entity.service.ts

import { Injectable } from "@angular/core";
import { EntityCollectionServiceBase, EntityCollectionServiceElements, EntityCollectionServiceElementsFactory } from "@ngrx/data";

import { Course } from "../model/course";

@Injectable()
export class CourseEntityService extends EntityCollectionServiceBase<Course> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Course', serviceElementsFactory);
  }
}
```
If we create a new instance of the service, we will see operations as addAllToCache, 
getAll (trigger back-end API) we don't need to build that query (need to follow convention).  Its a facade service. We can also do save!

Need to add the CourseEntityService in the providers lis of the CoursesModule

## COURSE RESOLVE TO LOAD DATA FOR THE COMPONENT

```javascript
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { CourseEntityService } from "./course-enity.service";
import { map } from "rxjs/operators";

@Injectable()
export class CoursesResolver implements Resolve<boolean> {
  constructor(private coursesService: CourseEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      return this.coursesService
        .getAll()
        .pipe(map(courses => !!courses));
    }
}
```

The getAll will follow the convention /api/courses (GET) methods to return the data. NgRX has pluralized the name course to courses. Off course we can customize the /api/ part. 

NgRX is expection the backend to return in a specific format, that's why the app crases. For example, to content all the entities as a response inthe body of an array. How to fix?

## DATA SERVICE to Fix convention from NgRX (customize NgRX Data)
The data service is a service related to the course entity service.

```javascript
course/courses-data.service.ts

import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data"
import { Injectable } from "@angular/core";

import { Course } from "../model/course";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CoursesDataService extends DefaultDataService<Course> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Course', http, httpUrlGenerator);
  }
}
```
Add it into the provider list for the Courses Module. But this is not enough, we need to teach NgRX to use the data service. 
```javascript
export class CoursesModule {

  constructor(
      private eds: EntityDefinitionService,
      private entityDataService: EntityDataService, // use to register our data sercice
      private coursesDataService: CoursesDataService
  ) {
    eds.registerMetadataMap(entityMetaData);
    entityDataService.registerService('Course', coursesDataService);
  }
}
```
Now we have to update the courses data service to do the proper URLs. 

```javascript
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data"
import { Injectable } from "@angular/core";

import { Course } from "../model/course";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class CoursesDataService extends DefaultDataService<Course> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Course', http, httpUrlGenerator);
  }

  // ovewriting the method
  getAll(): Observable<Course[]> {
    return this.http.get('/api/courses')
      .pipe(map(res => res['payload']));
  }

```
No thing to consider is that ngRX will fire the actions 
[Course] @ngrx/data/query-all
[Course] @ngrx/data/query-all/success

So, behind the scenes he is handling the actions. 

## Caching the query
getAll never will get data from the store, will trigger a back-end call.

```javascript
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { CourseEntityService } from "./course-enity.service";
import { tap, filter, first } from "rxjs/operators";

@Injectable()
export class CoursesResolver implements Resolve<boolean> {
  constructor(private coursesService: CourseEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      // loaded$ indicates if all back-end data has been loaded from the back-end or not, default for the NgRX data
      return this.coursesService.loaded$ // no need to store that variable like before
        .pipe(
          tap(loaded => {
            if (!loaded) {
              this.coursesService.getAll();// will do side effects, handle the data, store in the store with a single line of code.  
            }
          }),
          filter(loaded => !!loaded), // when loaded, will complete the observable with true
          first()
        );
    }
}
```
##  Queryung Store Data with NgRx Data and the entities $Observable

We are not going to use anymore the  CoursesHttpService. That's a custom service that we have created. Now we are going to use Rxjs Data. 

```
import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {Observable} from "rxjs";
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {EditCourseDialogComponent} from '../edit-course-dialog/edit-course-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {map, shareReplay} from 'rxjs/operators';
import { CourseEntityService } from '../services/course-enity.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    loading$: Observable<boolean>;

    promoTotal$: Observable<number>;

    beginnerCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;


    constructor(
      private dialog: MatDialog,
      private coursesService: CourseEntityService) {

    }

    ngOnInit() {
      this.reload();
    }

  reload() {
    this.loading$ = this.coursesService.loading$;
    // entities$ will emit a new value when a new entity is added into the store
    this.beginnerCourses$ = this.coursesService.entities$
      .pipe(
        map(courses => courses.filter(course => course.category == 'BEGINNER'))
      );


    this.advancedCourses$ = this.coursesService.entities$
      .pipe(
        map(courses => courses.filter(course => course.category == 'ADVANCED'))
      );

    this.promoTotal$ = this.coursesService.entities$
        .pipe(
            map(courses => courses.filter(course => course.promo).length)
        );

  }

  onAddCourse() {

    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle:"Create Course",
      mode: 'create'
    };

    this.dialog.open(EditCourseDialogComponent, dialogConfig);
  }
}

```
The order of the courses are not corrent. How to override this>?
We need to add in the entityMetadata: the sorComparecer function. 

```javascript
// courses.module.ts
const entityMetaData: EntityMetadataMap = {
  Course: {
    sortComparer: compareCourses
  }
};
```
NgRx data uses NgRx Entity under the hood. 

## NgRx Data CRUD - Why use Optomistic Updates?
The perssimistic update is when you save the data in the back-end and 
you want to call the list method again to make sure nothing has been added during that period. 

The idea is to have a otimistic update. Update the store with the new value and save the data in the background to increase the user experience.

```javascript
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CoursesHttpService} from '../services/courses-http.service';
import { CourseEntityService } from '../services/course-enity.service';

@Component({
  selector: 'course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.css']
})
export class EditCourseDialogComponent {

  form: FormGroup;

  dialogTitle: string;

  course: Course;

  mode: 'create' | 'update';

  loading$:Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private coursesService: CourseEntityService) {

    this.dialogTitle = data.dialogTitle;
    this.course = data.course;
    this.mode = data.mode;

    const formControls = {
      description: ['', Validators.required],
      category: ['', Validators.required],
      longDescription: ['', Validators.required],
      promo: ['', []]
    };

    if (this.mode == 'update') {
      this.form = this.fb.group(formControls);
      this.form.patchValue({...data.course});
    }
    else if (this.mode == 'create') {
      this.form = this.fb.group({
        ...formControls,
        url: ['', Validators.required],
        iconUrl: ['', Validators.required]
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {

    const course: Course = {
      ...this.course,
      ...this.form.value
    };

    if (this.mode === 'update') {
      this.coursesService.update(course);
      this.dialogRef.close(); // we close without waiting for the data to be saved
    }
  }
}
```
By default, ngRX has a pessimist approach to data. It will wait for the data to be saved in the back-end before updating the store. Can we change that behaviour to do in a optimistic way? We can do that by simply changing some configuration.

```javascript
const entityMetaData: EntityMetadataMap = {
  Course: {
    sortComparer: compareCourses,
    entityDispatcherOptions: {
      optimisticUpdate: true
    }
  }
};
```

## CRUD Operations ADD and DELETE

During app, the add() NgRX will do the pessimistc approach, because it relies on the back-end to generate IDS and so on. 

## DELETE

 this.courseService.delete(course); will delete form back-end and update the store. We can check that easily, make the back-end taking too much time to delete and we will see that the element will be removed from the store map.

 ## Lesson inside course
```javascript
 // this map will contain one entry per entity in our application (for this module)
const entityMetaData: EntityMetadataMap = {
  Course: {
    sortComparer: compareCourses,
    entityDispatcherOptions: {
      optimisticUpdate: true
    },
  },
  Lesson: {
    sortComparer: compareLessons
  }
};
```
We also need a LessonEntityService

```javascript
import { Injectable } from "@angular/core";
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";

import { Lesson } from "../model/lesson";

@Injectable()
export class LessonEtityService extends EntityCollectionServiceBase<Lesson> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Lesson', serviceElementsFactory);
  }
}
```
We don't want to override the default behaviour, so no need for a lessonsDataService

For the courses, we are fetching the data from the store and not the back-end because it is already there. 

this.course$ = this.coursesService.entities$
      .pipe(map(courses => courses.find(course => course.url == courseUrl)));

## PAGINATION 

To get the lessons from a corse, we need the courseID that is an observable. So, how to combine both values? use the withLatestFrom

```javascript
    this.lessons$ = this.lessonService
      .entities$
      .pipe(
        withLatestFrom(this.course$),
        map(([lessons, course]) => lessons.filter(lesson => lesson.courseId === course.id))
      );
```
The problem is that the lesson array will be empty because we didn't fech the data yet. So we need to add a tap to get the paginated data and before the tap happens before acessing the lessons observable, the data will be there. 
```javascript
    this.lessons$ = this.lessonService
      .entities$
      .pipe(
        withLatestFrom(this.course$),
        tap(([lesson, course]) => this.loadLessonsPage(course)),
        map(([lessons, course]) => lessons.filter(lesson => lesson.courseId === course.id))
      );
```
The don't want the lesson.entities$ emits every time, we just want it to emit. Nos precisamos pegar os dados das lessons para preencher o array na primeira vez, mas depois nao precisamos mais. Precisamos resolver isso

```javascript
ngOnInit() {

    const courseUrl = this.route.snapshot.paramMap.get("courseUrl");

    this.course$ = this.coursesService.entities$
      .pipe(map(courses => courses.find(course => course.url == courseUrl)));

    this.lessons$ = this.lessonService
      .entities$
      .pipe(
        withLatestFrom(this.course$),
        tap(([lesson, course]) => {
          if (this.nextPage == 0) {
            this.loadLessonsPage(course);
          }
        }),
        map(([lessons, course]) => lessons.filter(lesson => lesson.courseId === course.id))
      )

      this.loading$ = this.lessonService.loading$;
  }
```

## On Push strategy

