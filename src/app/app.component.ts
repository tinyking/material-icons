/* tslint:disable:no-string-literal */
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { CopierService } from './copier.service';
import { IconGroup } from './icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'material-icons';

  // SKIPS = [
  //   // '360',
  //   // '4k',
  //   // 'accessible_forward',
  //   // 'account_tree',
  //   // 'all_inbox',
  //   // 'amp_stories',
  //   // 'apartment',
  //   // 'arrow_left',
  //   // 'arrow_right',
  //   // 'arrow_right_alt',
  //   // 'atm',
  //   // 'ballot',
  //   // 'bar_chart',
  //   // 'bathtub',
  //   // 'calendar_today',
  //   // 'calendar_view_day',
  //   // 'cancel_schedule_send',
  //   // 'card_giftcard',
  //   // 'card_membership',
  //   // 'card_travel',
  //   // 'category',
  //   // 'change_history',
  //   // 'check_circle',
  //   // 'check_circle_outline',
  //   // 'chrome_reader_mode',
  //   // 'class',
  //   // 'code',
  //   // 'commute',
  //   // 'compare_arrows',
  //   // 'compass_calibration',
  //   // 'contact_support',
  //   // 'contactless',
  //   // 'control_camera',
  //   // 'deck',
  //   // 'departure_board',
  //   // 'desktop_access_disabled',
  //   // 'device_unknown',
  //   // 'donut_large',
  //   // 'double_arrow',
  //   // 'drag_indicator',
  //   // 'duo',
  //   // 'dynamic_feed',
  //   // 'eco',
  //   // 'emoji_emotions',
  //   // 'emoji_events',
  //   // 'emoji_flags',
  //   // 'emoji_food_beverage',
  //   // 'emoji_nature',
  //   // 'emoji_objects',
  //   // 'emoji_people',
  //   // 'emoji_symbols',
  //   // 'emoji_transportation',
  //   // 'euro',
  //   // 'fast_forward',
  //   // 'fast_rewind',
  //   // 'fastfood',
  //   // 'file_copy',
  //   // 'filter_list',
  //   // 'fireplace',
  //   // 'height',
  //   // 'horizontal_split',
  //   // 'house',
  //   // 'how_to_reg',
  //   // 'how_to_vote',
  //   // 'king_bed',
  //   // 'maximize',
  //   // 'meeting_room',
  //   // 'minimize',
  //   // 'missed_video_call',
  //   // 'mobile_friendly',
  //   // 'mobile_offmobile_off',
  //   // 'mobile_screen_share',
  //   // 'money',
  //   // 'museum',
  //   // 'music_off',
  //   // 'nights_stay',
  //   // 'no_meeting_room',
  //   // 'notification_important',
  //   // 'offline_bolt',
  //   // 'outdoor_grill',
  //   // 'outlined_flag',
  //   // 'policy',
  //   // 'score',
  //   // 'signal_cellular_alt',
  //   // 'single_bed',
  //   // 'speed',
  //   // 'sports',
  //   // 'sports_baseball',
  //   // 'sports_basketball',
  //   // 'sports_cricket',
  //   // 'sports_esports',
  //   // 'sports_football',
  //   // 'sports_golf',
  //   // 'sports_handball',
  //   // 'sports_hockey',
  //   // 'sports_kabaddi',
  //   // 'sports_mma',
  //   // 'sports_motorsports',
  //   // 'sports_rugby',
  //   // 'sports_soccer',
  //   // 'sports_tennis',
  //   // 'sports_volleyba',
  //   // 'sports_volleyball',
  //   // 'square_foot',
  //   // 'supervised_user_circle',
  //   // 'text_rotate_up',
  //   // 'text_rotate_vertical',
  //   // 'text_rotation_angledown',
  //   // 'text_rotation_angleup',
  //   // 'text_rotation_down',
  //   // 'text_rotation_none',
  //   // 'toggle_off',
  //   // 'toggle_on',
  //   // 'transit_enterexit',
  //   // 'trip_origin',
  //   // 'unsubscribe',
  //   // 'vertical_split',
  //   // 'voice_over_off',
  //   // 'waves',
  //   // 'where_to_vote',
  //   // 'work',
  //   // 'youtube_searched_for',
  //   // 'post_add',
  //   // 'mobile_off',
  //   // 'scatter_plot',
  //   // 'shutter_speed'
  // ];

  ICONS: IconGroup[] = [];
  iconGroups: IconGroup[] = [];
  searchCtrl: FormControl = new FormControl('');
  $destroy: Subject<void> = new Subject<void>();

  constructor(http: HttpClient,
              private copier: CopierService,
              private snackBar: MatSnackBar) {
    http.get('assets/icons.json').pipe(map(value => value['icons'])).subscribe(json => {
      const data = json as any[];
      const icons = {};
      data.forEach(item => {
        // if (this.SKIPS.includes(item.name)) {
        //   return;
        // }
        const categories = item['categories'][0];
        icons[categories] = [...icons[categories] || [], item.name];
      });

      Object.keys(icons).sort().forEach(item => {
        this.ICONS.push({name: item, icons: icons[item].sort()});
      });

      this.iconGroups = this.ICONS;
    });

    this.searchCtrl.valueChanges.pipe(debounceTime(200), takeUntil(this.$destroy)).subscribe(val => {
      const GROUP: IconGroup[] = [];
      if (val) {
        this.ICONS.forEach(item => {
            const icons = item.icons.filter(it => it.includes(val));
            if (icons.length === 0) {
              return;
            }
            GROUP.push({name: item.name, icons});
        });
      } else {
        GROUP.push(...this.ICONS);
      }
      this.iconGroups = GROUP;
    });
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  upperFirstChar(name: string) {
    const names = name.split('');
    return [names[0].toUpperCase(), ...names.slice(1)].join('');
  }

  doCopy(message: string) {
    this.copier.copyText(message);
    this.snackBar.open(`${message} copied`, '', {
      duration: 2000,
      panelClass: 'tk-bg-green'
    });
  }

  scrollTop() {
    document.documentElement.scrollTop = 0;
  }
}
