import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';

import { Rave, RavePayment, Misc } from 'rave-ionic3';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  browser: any;
  constructor(
    public navCtrl: NavController,
    private rave: Rave, 
    private ravePayment: RavePayment, 
    private misc:Misc, 
    private iab: InAppBrowser,
    private sf: SafariViewController
    ) {
  }

  payWithRave() {
    this.rave.init(false, "FLWPUBK-ba0a57153f497c03bf34a9e296aa9439-X")
      .then(_ => {
        var paymentObject = this.ravePayment.create({
          customer_email: "user@example.com",
          amount: 2000,
          customer_phone: "234099940409",
          currency: "NGN",
          txref: "rave-123456",
          redirect_url: 'https://guarded-lake-45444.herokuapp.com/rave/test',
          meta: [{
              metaname: "flightID",
              metavalue: "AP1234"
          }],
      })
      this.rave.preRender(paymentObject)
        .then(secure_link => {
          console.log(secure_link)
          secure_link = secure_link +" ";
          this.sf.isAvailable()
          .then((available: boolean) => {
              if (available) {
                console.log("available: ",available)
                this.sf.show({
                  url: secure_link.toString(),
                  hidden: false,
                  animated: false,
                  transition: 'curl',
                  enterReaderModeIfAvailable: true,
                  tintColor: '#ff0000'
                })
                .subscribe((result: any) => {
                    if(result.event === 'opened') console.log('Opened');
                    else if(result.event === 'loaded') {
                      console.log(result.event);
                      console.log("loaded");
                    }
                    else if(result.event === 'closed') console.log('Closed');
                  },
                  (error: any) => console.error(error)
                );

              } else {
                console.log("police")
                // use fallback browser, example InAppBrowser
                const browser = this.iab.create(secure_link.toString(),'_self');
                // browser["document"].write('<iframe width="100%" height="100%" src="'+secure_link+'" frameborder="0" allowfullscreen></iframe>');
                browser.on("loadstop")
                .subscribe((ev: InAppBrowserEvent) => {
                  console.log(ev);
                  if(ev.url.indexOf('guarded-lake') != -1) browser.close();
                })
              }
            }
          );
          
          // this.rave.render(secure_link);
        }).catch(error => {
          // Error or invalid paymentObject passed in
          console.log(error)
        })
    })
    }

}
