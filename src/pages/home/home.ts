import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser';

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
    private iab: InAppBrowser
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
          const browser = this.iab.create(secure_link.toString());
          // browser = document.write('<iframe width="100%" height="100%" src="'+secure_link+'" frameborder="0" allowfullscreen></iframe>');
          browser.on("loadstop")
          .subscribe((ev: InAppBrowserEvent) => {
            console.log(ev);
            if(ev.url.indexOf('guarded-lake') != -1) browser.close();
          })
          // this.rave.render(secure_link);
        }).catch(error => {
          // Error or invalid paymentObject passed in
          console.log(error)
        })
    })
    }

}
