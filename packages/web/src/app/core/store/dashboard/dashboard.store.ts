import { action, Store, StoreConfig } from '@datorama/akita';
import { DashboardState, NavigationTabs, Cell } from '@dashboard/models';

const INITIAL_STATE: DashboardState = {
  dateRange: 'today',
  activeTab: NavigationTabs.monitoring,
  isEnergyStorageActive: false,
  activeEthId: undefined,
  cell: undefined,
  notarization: undefined,
};


@StoreConfig({
  name: 'dashboard',
  resettable: true,
})
export class DashboardStore extends Store<DashboardState> {
  constructor() {
    super(INITIAL_STATE);
  }

  @action('Set active tab')
  setActiveTab(activeTab: string) {
    this.update({ activeTab });
  }

  @action('Set date range')
  setDateRange(dateRange: string) {
    this.update({ dateRange });
  }

  @action('Set energy storage active')
  setEnergyStorageActive(isEnergyStorageActive: boolean) {
    this.update({ isEnergyStorageActive });
  }

  @action('Set active ethereum id')
  setActiveEthId(activeEthId: string) {
    this.update({ activeEthId });
  }

  @action('Remove active ethereum id')
  removeActiveEthId() {
    this.update({ activeEthId: undefined });
  }

  @action('Set cell')
  setCell(cell: Cell) {
    this.update({ cell });
  }

  @action('Set notarization')
  setNotarization(notarization: any) {
    this.update({ notarization });
  }

}
