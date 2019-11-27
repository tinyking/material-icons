/* tslint:disable:no-string-literal */
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { IconGroup } from './icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'material-icons';

  SKIPS = [
    'accessible_forward',
    'arrow_right_alt',
    'all_inbox',
    'calendar_today',
    'calendar_view_day',
    'card_giftcard',
    'card_membership',
    'card_travel',
    'change_history',
    'check_circle',
    'check_circle_outline',
    'chrome_reader_mode',
    'class',
    'code',
    'compare_arrows',
    'contact_support',
    'contactless',
    'cancel_schedule_send',
    'commute',
    'drag_indicator',
    'eco',
    'horizontal_split',
    'maximize',
    'minimize',
    'offline_bolt',
    'supervised_user_circle',
    'text_rotate_up',
    'text_rotate_vertical'
  ];

  ICONS: IconGroup[] = [];
  iconGroups: IconGroup[] = [];

  constructor(http: HttpClient) {
    http.get('assets/icons.json').pipe(map(value => value['icons'])).subscribe(json => {
      console.log(json);
      const data = json as any[];
      const icons = {};
      data.forEach(item => {
        if (this.SKIPS.includes(item.name)) {
          return;
        }
        const categories = item['categories'][0];
        icons[categories] = [...icons[categories] || [], item.name];
      });

      Object.keys(icons).sort().forEach(item => {
        this.ICONS.push({name: item, icons: icons[item].sort()});
      });

      this.iconGroups = this.ICONS;
      console.log(icons);
    });
  }
}
