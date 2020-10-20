import { ToastController, LoadingController } from '@ionic/angular';
import { User } from './../../interface/user';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private users = new Array<User>();
  private userSubscription: Subscription;
  private loading: any;

  constructor(
    private userService: UserService,
    public afAuth: AngularFireAuth,
    public router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  )
   {
    this.userSubscription = this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  ngOnInit() {3
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe;
  }

  async logoutGoogle() {
    try {
      this.afAuth.signOut().then(() => {
        this.router.navigate(['login']);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUser(id: string) {
    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      this.presentToast('Erro ao tentar salvar.');
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Cadastrando...',
    });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 5000
    });
    toast.present();
  }


}
