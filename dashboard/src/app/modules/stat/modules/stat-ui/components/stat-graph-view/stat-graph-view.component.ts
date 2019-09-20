import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { statDataNameType } from '~/core/types/stat/statDataNameType';
import { DestroyObservable } from '~/core/components/destroy-observable';

import { StatService } from '../../../../services/stat.service';

@Component({
  selector: 'app-stat-graph-view',
  templateUrl: './stat-graph-view.component.html',
  styleUrls: ['./stat-graph-view.component.scss'],
})
export class StatGraphViewComponent extends DestroyObservable implements OnInit {
  @Input() graphName: statDataNameType;

  constructor(public statService: StatService) {
    super();
  }

  ngOnInit() {
    this.loadStat();
  }

  private loadStat(): void {
    if (this.statService.loading) {
      return;
    }
    this.statService
      .loadOne()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
