import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, filter, map, takeUntil, tap } from 'rxjs/operators';
import { DestroyObservable } from '~/core/components/destroy-observable';
import { TerritoryApiService } from '~/modules/territory/services/territory-api.service';
import { GeoCodeTypeEnum } from '~/shared/territory/common/geo';
import { SingleResultInterface as GeoSearchResult } from '~/shared/territory/listGeo.contract';
import { JsonRPCResult } from '../../../../../core/entities/api/jsonRPCResult';

@Component({
  selector: 'app-territories-input-search',
  templateUrl: './territories-input-search.component.html',
  styleUrls: ['./territories-input-search.component.scss'],
})
export class TerritoriesInputSearchComponent extends DestroyObservable implements OnInit {
  public territoryInseeInputCtrl = new FormControl();

  public searchedTerritoryInsees: GeoSearchResult[] = [];
  @Input() parentForm: FormGroup;
  @Input() geoMesh: GeoCodeTypeEnum = GeoCodeTypeEnum.District;

  constructor(private territoryApiService: TerritoryApiService) {
    super();
  }

  ngOnInit(): void {
    this.territoryInseeInputCtrl.valueChanges
      .pipe(
        debounceTime(100),
        filter((literal) => !!literal && literal.length > 1),
        map((literal) => literal.trim()),
        tap((literal) => this.filterTerritoryInsee(literal)),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  public onTerritoryInseeSelect(event: MatAutocompleteSelectedEvent): void {
    this.territoryInseeInputCtrl.setValue(event.option.value.name);
    this.territoryInseeInputCtrl.markAsUntouched();
  }

  private filterTerritoryInsee(literal = ''): void {
    this.territoryApiService
      .geo({
        type: this.geoMesh,
        search: literal,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((foundTerritories: JsonRPCResult) => {
        this.searchedTerritoryInsees = foundTerritories.data;
      });
  }
}
